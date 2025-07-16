<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreListingRequest;
use App\Models\Favorite;
use App\Models\Listing;
use App\Models\Category;
use App\Http\Controllers\SavedSearchController;
use App\Enums\ListingStatus;
use App\Notifications\ListingFavoritedNotification;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Services\Signature\HelloSignService;

class ListingController extends Controller
{
    public function index(Request $request)
    {
        $query = Listing::query()
            ->with('category', 'user', 'gallery')
            ->active()
            ->filter($request->all())
            ->withFavoriteStatus(auth()->id());

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%");
            });
        }

        $sort = $request->input('sort', 'created_at');
        $dir = $request->input('dir', 'desc');
        if ($sort === 'score') {
            $query->withCount(['conversations', 'favoritedBy as favorites_count'])
                ->orderByRaw('(conversations_count * 2 + favorites_count) ' . $dir);
        } else {
            $query->orderBy($sort, $dir);
        }

        $perPage = (int) $request->input('per_page', 10);

        return $query->paginate($perPage);
    }

    public function create()
    {
        $categories = Category::select('id', 'name')->get();
        return Inertia::render('Listing/Create', [
            'categories' => $categories,
        ]);
    }

    public function edit(Listing $listing)
    {
        if ($listing->user_id !== Auth::id()) {
            abort(403);
        }

        $categories = Category::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Listing/Edit', [
            'listing' => $listing->load('gallery', 'documents'),
            'categories' => $categories,
        ]);
    }
    public function all(Request $request): \Illuminate\Http\JsonResponse
    {
        $listings = Listing::active()
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->filter($request->all())
            ->with('gallery')
            ->get(['id', 'title', 'latitude', 'longitude', 'address', 'price']);

        return response()->json([
            'data' => $listings ?? [],
        ]);
    }
    public function show(Listing $listing)
    {
        $listing = Listing::with('category', 'user', 'gallery', 'documents')
            ->withFavoriteStatus(auth()->id())
            ->findOrFail($listing->id);

        $listing->append('similar_listings');
        $similar = $listing->similar_listings;

        return response()->json([
            'listing' => $listing,
            'similar' => $similar
        ]);
    }

    public function store(StoreListingRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = Auth::id();
        $listing = Listing::create($data);

        $this->storeDocuments($request, $listing);
        $this->storeGallery($request, $listing);

        $listing->load('gallery', 'documents');

        SavedSearchController::notifyMatches($listing);

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Annonce créée avec succès', 'listing' => $listing]);
        }

        return redirect()->route('listings.show', $listing->id);
    }

    public function update(StoreListingRequest $request, Listing $listing)
    {
        if ($listing->user_id !== Auth::id()) {
            abort(403);
        }

        $data = $request->validated();

        $pendingFields = [
            'title', 'description', 'price', 'address',
            'city', 'postal_code', 'category_id'
        ];

        foreach ($pendingFields as $field) {
            if (array_key_exists($field, $data) && $data[$field] != $listing->$field) {
                $data['status'] = ListingStatus::Pending;
                break;
            }
        }

        $listing->update($data);

        $this->storeDocuments($request, $listing);
        $this->storeGallery($request, $listing);

        $listing->load('gallery', 'documents');

        $message = ($data['status'] ?? $listing->status?->value) === ListingStatus::Pending->value
            ? 'Annonce mise à jour et en attente de validation'
            : 'Annonce mise à jour';

        if ($request->wantsJson()) {
            return response()->json(['message' => $message, 'listing' => $listing]);
        }

        return redirect()->route('listings.show', $listing->id)
            ->with('success', $message);
    }

    public function destroy(Listing $listing)
    {
        if ($listing->user_id !== Auth::id()) {
            abort(403);
        }

        $listing->delete();

        return response()->json(['message' => 'Annonce supprimée']);
    }

    public function markAsSold(Listing $listing)
    {
        $this->authorize('update', $listing);
        $listing->update(['status' => ListingStatus::Sold]);

        return response()->json(['message' => 'Annonce marquée comme vendue']);
    }

    public function archive(Listing $listing)
    {
        $this->authorize('update', $listing);
        $listing->update(['status' => ListingStatus::Archived]);

        return response()->json(['message' => 'Annonce archivée']);
    }

    private function storeDocuments(Request $request, Listing $listing): void
    {
        $docs = $request->file('documents', []);
        foreach ($docs as $type => $file) {
            if (!$file) {
                continue;
            }
            $path = $file->store('listing_documents', 'public');
            $listing->documents()->create([
                'type' => $type,
                'name' => $file->getClientOriginalName(),
                'path' => $path,
                'is_required' => $type === 'dossier_diagnostic',
            ]);
        }
    }

    private function storeGallery(Request $request, Listing $listing): void
    {
        $files = $request->file('gallery', []);
        if (!is_array($files)) {
            $files = [$files];
        }

        $remaining = max(0, 6 - $listing->gallery()->count());
        foreach (array_slice($files, 0, $remaining) as $file) {
            if (!$file) {
                continue;
            }
            $path = $file->store('listing_images', 'public');
            $listing->gallery()->create(['path' => $path, 'type' => 'image']);
        }
    }

    public function signMandateForm(Listing $listing)
    {
        if ($listing->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Listing/SignMandate', [
            'listing' => $listing,
        ]);
    }

    public function signMandate(Request $request, Listing $listing)
    {
        if ($listing->user_id !== Auth::id()) {
            abort(403);
        }

        $hellosignKey = config('services.hellosign.key');

        if ($hellosignKey) {
            $pdfService = new \App\Services\Pdf\DocumentPdfService();
            $pdf = $pdfService->generate('mandat_exclusif', $listing);

            $tmpPath = storage_path('app/tmp/'.uniqid('mandate_').'.pdf');
            if (! is_dir(dirname($tmpPath))) {
                mkdir(dirname($tmpPath), 0755, true);
            }
            file_put_contents($tmpPath, $pdf->output());

            $service = new HelloSignService($hellosignKey);
            $requestId = $service->sendSignatureRequest(
                $tmpPath,
                [auth()->user()->email => auth()->user()->first_name.' '.auth()->user()->last_name],
                'Signature Mandat',
                'Veuillez signer le mandat exclusif en pièce jointe.'
            );

            $doc = $listing->documentsToSign()->firstOrCreate([
                'type' => 'mandat_exclusif',
            ]);

            $doc->signatures()->create([
                'user_id' => Auth::id(),
                'file_path' => 'hellosign:'.$requestId,
                'signed_at' => null,
            ]);

            return redirect()->route('listings.edit', $listing->id)
                ->with('message', 'Demande de signature envoyée.');
        }

        $data = $request->validate([
            'signature' => 'required',
        ]);

        $image = str_replace('data:image/png;base64,', '', $data['signature']);
        $image = base64_decode($image);
        $path = 'signatures/'.uniqid().'.png';
        Storage::disk('public')->put($path, $image);

        $doc = $listing->documentsToSign()->firstOrCreate([
            'type' => 'mandat_exclusif',
        ]);

        $doc->signatures()->create([
            'user_id' => Auth::id(),
            'file_path' => $path,
            'signed_at' => now(),
        ]);

        return redirect()->route('listings.edit', $listing->id)
            ->with('message', 'Mandat signé');
    }

    public function toggle(Request $request, Listing $listing)
    {
        $user = auth()->user();

        $existing = Favorite::where('user_id', $user->id)
            ->where('listing_id', $listing->id)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['status' => 'removed']);
        }

        Favorite::create([
            'user_id' => $user->id,
            'listing_id' => $listing->id
        ]);

        if ($user->id !== $listing->user_id) {
            $listing->user->notify(new ListingFavoritedNotification($listing, $user));
        }

        return response()->json(['status' => 'added']);
    }

    public function recommendations()
    {
        $user = auth()->user();
        $query = Listing::with('category', 'user', 'gallery')
            ->active()
            ->withFavoriteStatus($user?->id);

        $search = $user?->savedSearches()->latest()->first();
        if ($search) {
            $query->filter($search->params);
        } else {
            $favCats = $user?->favorites()->pluck('category_id');
            if ($favCats && $favCats->count()) {
                $query->whereIn('category_id', $favCats);
            }
        }

        $recommendations = $query->orderBy('created_at', 'desc')->take(10)->get();

        return response()->json(['data' => $recommendations]);
    }
}

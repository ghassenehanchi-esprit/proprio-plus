<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreListingRequest;
use App\Models\Favorite;
use App\Models\Listing;
use App\Models\Category;
use App\Enums\ListingStatus;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ListingController extends Controller
{
    public function index(Request $request)
    {
        $query = Listing::query()
            ->with('category', 'user')
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
        $query->orderBy($sort, $dir);

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
            ->select('id', 'title', 'latitude', 'longitude', 'photos', 'address', 'price')
            ->get();

        return response()->json([
            'data' => $listings ?? [],
        ]);
    }
    public function show(Listing $listing)
    {
        $listing = Listing::with('category', 'user', 'gallery', 'documents')
            ->withFavoriteStatus(auth()->id())
            ->findOrFail($listing->id);

        $similar = Listing::where('category_id', $listing->category_id)
            ->where('id', '!=', $listing->id)
            ->where('city', $listing->city)
            ->active()
            ->withFavoriteStatus(auth()->id())
            ->limit(4)->get();

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

        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $file) {
                $path = $file->store('listing_documents', 'public');
                $listing->documents()->create(['path' => $path, 'type' => 'document']);
            }
        }

        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $path = $file->store('listing_images', 'public');
                $listing->gallery()->create(['path' => $path, 'type' => 'image']);
            }
        }

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

        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $file) {
                $path = $file->store('listing_documents', 'public');
                $listing->documents()->create(['path' => $path, 'type' => 'document']);
            }
        }

        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $path = $file->store('listing_images', 'public');
                $listing->gallery()->create(['path' => $path, 'type' => 'image']);
            }
        }

        $message = ($data['status'] ?? $listing->status?->value) === ListingStatus::Pending->value
            ? 'Annonce mise à jour et en attente de validation'
            : 'Annonce mise à jour';

        return response()->json(['message' => $message, 'listing' => $listing->fresh()]);
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

        return response()->json(['status' => 'added']);
    }
}

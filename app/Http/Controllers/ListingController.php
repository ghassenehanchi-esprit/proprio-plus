<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreListingRequest;
use App\Models\Favorite;
use App\Models\Listing;
use App\Models\Category;
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
            ->where('status', 'active')
            ->filter($request->all());


        $listings = $query->paginate(10);
        $listings->getCollection()->transform(function ($listing) {
            $listing->is_favorited = auth()->check() && $listing->favoritedBy()->where('user_id', auth()->id())->exists();
            return $listing;
        });
        return response()->json($listings);
    }

    public function create()
    {
        $categories = Category::select('id', 'name')->get();
        return Inertia::render('Listing/Create', [
            'categories' => $categories,
        ]);
    }
    public function all(): \Illuminate\Http\JsonResponse
    {
        $listings = Listing::where('status', 'active')
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->select('id', 'title', 'latitude', 'longitude', 'photos', 'address', 'price') // ou rent_per_week si tu veux
            ->get();

        // Assure qu'on retourne bien un tableau vide si aucun résultat
        return response()->json([
            'data' => $listings ?? [],
        ]);
    }
    public function show(Listing $listing)
    {
        $listing->load('category', 'user', 'gallery', 'documents');
        $similar = Listing::where('category_id', $listing->category_id)
            ->where('id', '!=', $listing->id)
            ->where('city', $listing->city)
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
        $this->authorize('update', $listing);
        $listing->update($request->validated());

        return response()->json(['message' => 'Annonce mise à jour']);
    }

    public function destroy(Listing $listing)
    {
        $this->authorize('delete', $listing);
        $listing->delete();

        return response()->json(['message' => 'Annonce supprimée']);
    }

    public function markAsSold(Listing $listing)
    {
        $this->authorize('update', $listing);
        $listing->update(['status' => 'vendue']);

        return response()->json(['message' => 'Annonce marquée comme vendue']);
    }

    public function archive(Listing $listing)
    {
        $this->authorize('update', $listing);
        $listing->update(['status' => 'archivée']);

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

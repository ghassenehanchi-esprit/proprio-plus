<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreListingRequest;
use App\Models\Favorite;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ListingController extends Controller
{
    public function index(Request $request)
    {
        $query = Listing::query()->with('category', 'user')->where('status', 'active');

        if ($request->filled('city')) {
            $query->where('city', $request->city);
        }

        if ($request->filled('postal_code')) {
            $query->where('postal_code', $request->postal_code);
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->filled('min_surface')) {
            $query->where('surface', '>=', $request->min_surface);
        }

        if ($request->filled('max_surface')) {
            $query->where('surface', '<=', $request->max_surface);
        }

        if ($request->filled('rooms')) {
            $query->where('rooms', '>=', $request->rooms);
        }

        if ($request->filled('bedrooms')) {
            $query->where('bedrooms', '>=', $request->bedrooms);
        }

        if ($request->filled('has_terrace')) {
            $query->where('has_terrace', (bool) $request->has_terrace);
        }

        if ($request->filled('has_parking')) {
            $query->where('has_parking', (bool) $request->has_parking);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('lat') && $request->filled('lng')) {
            $lat = $request->lat;
            $lng = $request->lng;
            $radius = $request->radius ?? 10;

            $haversine = "(6371 * acos(cos(radians($lat)) * cos(radians(latitude)) * cos(radians(longitude) - radians($lng)) + sin(radians($lat)) * sin(radians(latitude))))";

            $query->selectRaw("*, $haversine AS distance")
                ->having("distance", "<=", $radius)
                ->orderBy("distance");
        }


        $listings = $query->paginate(10);
        $listings->getCollection()->transform(function ($listing) {
            $listing->is_favorited = auth()->check() && $listing->favoritedBy()->where('user_id', auth()->id())->exists();
            return $listing;
        });
        return response()->json($listings);
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

        return response()->json(['message' => 'Annonce créée avec succès', 'listing' => $listing]);
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

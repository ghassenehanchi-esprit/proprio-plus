<?php
namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Notifications\ListingFavoritedNotification;

class FavoriteController extends Controller
{
    public function store(Listing $listing)
    {
        $user = Auth::user();
        $exists = Favorite::where('user_id', $user->id)
            ->where('listing_id', $listing->id)
            ->exists();

        if (!$exists) {
            Favorite::create([
                'user_id' => $user->id,
                'listing_id' => $listing->id,
            ]);

            if ($user->id !== $listing->user_id) {
                $listing->user->notify(new ListingFavoritedNotification($listing, $user));
            }
        }

        return response()->json(['status' => 'added']);
    }

    public function destroy(Listing $listing)
    {
        $user = Auth::user();

        $favorite = Favorite::where('user_id', $user->id)
            ->where('listing_id', $listing->id)
            ->first();

        if ($favorite) {
            $favorite->delete();
        }

        return response()->json(['status' => 'removed']);
    }
}

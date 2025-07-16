<?php
namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\Offer;
use App\Models\TransactionRating;
use App\Enums\ListingStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RatingController extends Controller
{
    public function store(Request $request, Listing $listing)
    {
        if ($listing->status !== ListingStatus::Sold) {
            return response()->json(['message' => 'La transaction n\'est pas terminée'], 400);
        }

        $offer = Offer::where('listing_id', $listing->id)->where('status', 'accepted')->first();
        if (! $offer) {
            return response()->json(['message' => 'Aucune offre acceptée'], 404);
        }

        $data = $request->validate([
            'communication' => 'required|integer|min:1|max:5',
            'punctuality' => 'required|integer|min:1|max:5',
            'professionalism' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $user = Auth::user();
        if ($user->id === $listing->user_id) {
            $ratedId = $offer->user_id;
        } elseif ($user->id === $offer->user_id) {
            $ratedId = $listing->user_id;
        } else {
            abort(403);
        }

        $rating = TransactionRating::updateOrCreate(
            ['listing_id' => $listing->id, 'rater_id' => $user->id],
            $data + [
                'offer_id' => $offer->id,
                'rated_id' => $ratedId,
            ]
        );

        return response()->json($rating->fresh());
    }

    public function show(Listing $listing)
    {
        $offer = Offer::where('listing_id', $listing->id)->where('status', 'accepted')->first();
        if (! $offer) {
            return response()->json(['message' => 'Aucune offre acceptée'], 404);
        }

        $user = Auth::user();
        if (! in_array($user->id, [$listing->user_id, $offer->user_id])) {
            abort(403);
        }

        $my = TransactionRating::where('listing_id', $listing->id)->where('rater_id', $user->id)->first();
        $other = TransactionRating::where('listing_id', $listing->id)
            ->where('rater_id', $user->id === $listing->user_id ? $offer->user_id : $listing->user_id)
            ->first();

        return response()->json([
            'my_rating' => $my,
            'partner_rating' => $my && $other ? $other : null,
        ]);
    }
}

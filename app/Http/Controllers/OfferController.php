<?php
namespace App\Http\Controllers;

use App\Models\Offer;
use App\Models\Listing;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Notifications\NewMessageNotification;

class OfferController extends Controller
{
    public function store(Request $request, Listing $listing)
    {
        $data = $request->validate([
            'visit_id' => 'nullable|exists:visits,id',
            'price' => 'required|numeric|min:0',
            'message' => 'nullable|string',
            'buyer_notary' => 'nullable|string',
        ]);

        $offer = Offer::create([
            'listing_id' => $listing->id,
            'user_id' => Auth::id(),
            'visit_id' => $data['visit_id'] ?? null,
            'price' => $data['price'],
            'message' => $data['message'] ?? null,
            'buyer_notary' => $data['buyer_notary'] ?? null,
        ]);

        $conversation = Conversation::firstOrCreate([
            'listing_id' => $listing->id,
            'buyer_id' => Auth::id(),
            'seller_id' => $listing->user_id,
        ]);

        $msg = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => Auth::id(),
            'content' => 'Nouvelle offre de ' . number_format($offer->price, 2, ',', ' ') . ' €',
            'is_read' => false,
        ]);

        if ($recipient = User::find($listing->user_id)) {
            $recipient->notify(new NewMessageNotification($msg));
        }

        return response()->json($offer);
    }

    public function update(Request $request, Offer $offer)
    {
        if ($offer->listing->user_id !== Auth::id()) {
            abort(403);
        }

        $data = $request->validate([
            'status' => 'required|in:accepted,declined',
            'seller_notary' => 'nullable|string',
        ]);

        $offer->update([
            'status' => $data['status'],
            'seller_notary' => $data['seller_notary'] ?? $offer->seller_notary,
            'accepted_at' => $data['status'] === 'accepted' ? now() : null,
        ]);

        $conversation = Conversation::where('listing_id', $offer->listing_id)
            ->where('buyer_id', $offer->user_id)->first();

        if ($conversation) {
            $msg = Message::create([
                'conversation_id' => $conversation->id,
                'sender_id' => Auth::id(),
                'content' => $data['status'] === 'accepted' ? 'Offre acceptée' : 'Offre refusée',
                'is_read' => false,
            ]);

            if ($recipient = User::find($offer->user_id)) {
                $recipient->notify(new NewMessageNotification($msg));
            }
        }

        return response()->json($offer);
    }
}


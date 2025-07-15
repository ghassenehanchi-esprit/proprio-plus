<?php
namespace App\Http\Controllers;

use App\Models\Visit;
use Illuminate\Support\Facades\Auth;

class VisitController extends Controller
{
    public function index()
    {
        $buyerVisits = Visit::with('listing')
            ->where('user_id', Auth::id())
            ->whereIn('status', ['planifiee', 'accepted'])
            ->orderBy('visit_datetime')
            ->get();

        $sellerVisits = Visit::with('listing', 'user')
            ->whereHas('listing', function ($q) {
                $q->where('user_id', Auth::id());
            })
            ->whereIn('status', ['planifiee', 'accepted'])
            ->orderBy('visit_datetime')
            ->get();

        return response()->json([
            'as_buyer' => $buyerVisits,
            'as_seller' => $sellerVisits,
        ]);
    }

    public function markDone(Visit $visit)
    {
        if ($visit->user_id !== Auth::id()) {
            abort(403);
        }

        if ($visit->visit_datetime->isFuture()) {
            return response()->json(['message' => 'La visite n\'est pas encore passée'], 400);
        }

        $visit->update(['buyer_confirmed_at' => now()]);

        $conversation = \App\Models\Conversation::where('listing_id', $visit->listing_id)
            ->where('buyer_id', $visit->user_id)
            ->first();

        if ($conversation) {
            \App\Models\Message::create([
                'conversation_id' => $conversation->id,
                'sender_id' => Auth::id(),
                'content' => 'L\'acheteur a confirmé avoir effectué la visite.',
                'is_read' => false,
            ]);
        }

        return response()->json(['status' => 'done']);
    }

    public function sellerConfirm(Visit $visit)
    {
        if ($visit->listing->user_id !== Auth::id()) {
            abort(403);
        }

        request()->validate(['comment' => 'nullable|string']);

        $visit->update([
            'seller_confirmed_at' => now(),
            'seller_comment' => request('comment'),
            'status' => 'confirmee',
        ]);

        $conversation = \App\Models\Conversation::where('listing_id', $visit->listing_id)
            ->where('buyer_id', $visit->user_id)
            ->first();

        if ($conversation) {
            \App\Models\Message::create([
                'conversation_id' => $conversation->id,
                'sender_id' => Auth::id(),
                'content' => 'Le vendeur a confirmé la visite : '.(request('comment') ?? ''),
                'is_read' => false,
            ]);
        }

        return response()->json(['status' => 'confirmed']);
    }
}

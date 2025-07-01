<?php
namespace App\Http\Controllers;

use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ConversationController extends Controller
{
    public function index()
    {
        return response()->json(Conversation::where('buyer_id', Auth::id())
            ->orWhere('seller_id', Auth::id())
            ->with('listing', 'messages')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'listing_id' => 'required|exists:listings,id',
            'seller_id' => 'required|exists:users,id',
            'subject' => 'nullable|string',
        ]);

        $conversation = Conversation::firstOrCreate([
            'listing_id' => $request->listing_id,
            'seller_id' => $request->seller_id,
            'buyer_id' => Auth::id(),
        ], [
            'subject' => $request->subject
        ]);

        return response()->json($conversation);
    }

    public function block(Conversation $conversation)
    {
        $this->authorize('update', $conversation);
        $conversation->update(['is_blocked' => true]);

        return response()->json(['message' => 'Utilisateur bloqué.']);
    }

    public function show(Conversation $conversation)
    {
        $this->authorize('view', $conversation);
        return response()->json($conversation->load('messages'));
    }
}

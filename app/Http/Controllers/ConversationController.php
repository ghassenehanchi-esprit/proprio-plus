<?php
namespace App\Http\Controllers;

use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\DatabaseNotification;

class ConversationController extends Controller
{
    public function index(Request $request)
    {
        $conversations = Conversation::where('buyer_id', Auth::id())
            ->orWhere('seller_id', Auth::id())
            ->with('listing', 'seller', 'buyer')
            ->withCount(['messages as unread_count' => function ($q) {
                $q->where('sender_id', '!=', Auth::id())
                    ->where('is_read', false);
            }])
            ->latest()
            ->paginate($request->query('limit', 10));

        return response()->json($conversations);
    }

    public function store(Request $request)
    {
        $request->validate([
            'listing_id' => 'required|exists:listings,id',
            'seller_id' => 'required|exists:users,id',
            'subject' => 'nullable|string',
        ]);

        if ($request->seller_id == Auth::id()) {
            return response()->json(['message' => 'Action interdite'], 400);
        }

        $conversation = Conversation::firstOrCreate([
            'listing_id' => $request->listing_id,
            'seller_id' => $request->seller_id,
            'buyer_id' => Auth::id(),
        ], [
            'subject' => $request->subject
        ]);

        if ($conversation->is_closed) {
            return response()->json($conversation, 423);
        }

        return response()->json($conversation);
    }

    public function block(Conversation $conversation)
    {
        $this->authorize('update', $conversation);
        $conversation->update(['is_blocked' => true]);

        return response()->json(['message' => 'Utilisateur bloqué.']);
    }

    public function close(Conversation $conversation)
    {
        if ($conversation->seller_id !== Auth::id()) {
            abort(403);
        }

        $conversation->update(['is_closed' => true]);

        return response()->json(['message' => 'Conversation fermee']);
    }

    public function markAsRead(Conversation $conversation)
    {
        $this->authorize('view', $conversation);
        $conversation->messages()
            ->where('sender_id', '!=', Auth::id())
            ->update(['is_read' => true]);

        return response()->json(['unread_count' => 0]);
    }

    public function markAsUnread(Conversation $conversation)
    {
        $this->authorize('view', $conversation);
        $conversation->messages()
            ->where('sender_id', '!=', Auth::id())
            ->update(['is_read' => false]);

        $count = $conversation->messages()
            ->where('sender_id', '!=', Auth::id())
            ->count();

        return response()->json(['unread_count' => $count]);
    }

    public function show(Conversation $conversation)
    {
        $this->authorize('view', $conversation);
        DatabaseNotification::where('notifiable_id', Auth::id())
            ->whereNull('read_at')
            ->get()
            ->filter(function ($notification) use ($conversation) {
                return ($notification->data['conversation_id'] ?? null) === $conversation->id;
            })
            ->each->markAsRead();

        $conversation->messages()
            ->where('sender_id', '!=', Auth::id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $conversation = $conversation->fresh()->load(['messages.sender', 'seller', 'buyer', 'listing']);

        return response()->json($conversation);
    }
}

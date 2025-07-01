<?php
namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Notifications\NewMessageNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    public function store(Request $request, Conversation $conversation)
    {
        if ($conversation->is_closed) {
            abort(403, 'Cette conversation est fermée.');
        }

        $request->validate([
            'content' => 'required_without:file|string',
            'file' => 'nullable|file|max:4096'
        ]);

        $data = [
            'conversation_id' => $conversation->id,
            'sender_id' => Auth::id(),
            'content' => $request->input('content'),
            'is_read' => false
        ];

        if ($request->hasFile('file')) {
            $data['file'] = $request->file('file')->store('messages', 'public');
        }

        $message = Message::create($data);

        $recipientId = $conversation->seller_id == Auth::id()
            ? $conversation->buyer_id
            : $conversation->seller_id;
        if ($recipient = User::find($recipientId)) {
            $recipient->notify(new NewMessageNotification($message));
        }

        return response()->json($message);
    }

    public function markAsRead(Message $message)
    {
        if ($message->conversation->seller_id !== Auth::id() &&
            $message->conversation->buyer_id !== Auth::id()) {
            abort(403);
        }

        $message->update(['is_read' => true]);
        Auth::user()->unreadNotifications()
            ->where('data->message_id', $message->id)
            ->get()
            ->each->markAsRead();

        return response()->json(['message' => 'Message marqué comme lu']);
    }
}

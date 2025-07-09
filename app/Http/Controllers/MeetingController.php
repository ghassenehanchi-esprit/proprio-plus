<?php
namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Meeting;
use App\Models\Visit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Notifications\MeetingProposalNotification;
use App\Models\Message;
use App\Notifications\NewMessageNotification;
use App\Models\User;

class MeetingController extends Controller
{
    public function store(Request $request, Conversation $conversation)
    {
        $this->authorize('view', $conversation);
        if (Auth::id() !== $conversation->seller_id) {
            return response()->json(['message' => 'Seul le vendeur peut proposer un rendez-vous'], 403);
        }

        $data = $request->validate([
            'scheduled_at' => 'required|date',
            'type' => 'required|in:meeting,visit',
            'agenda' => 'nullable|string',
        ]);

        $meeting = $conversation->meetings()->create([
            'scheduled_at' => $data['scheduled_at'],
            'type' => $data['type'],
            'agenda' => $data['agenda'] ?? null,
            'status' => 'pending',
        ]);

        $content = 'Proposition de ' . ($data['type'] === 'visit' ? 'visite' : 'rendez-vous') .
            ' le ' . $meeting->scheduled_at->format('d/m/Y H:i');
        if ($meeting->agenda) {
            $content .= ' - ' . $meeting->agenda;
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => Auth::id(),
            'content' => $content,
            'is_read' => false,
        ]);

        if ($recipient = User::find($conversation->buyer_id)) {
            $recipient->notify(new MeetingProposalNotification($meeting));
            $recipient->notify(new NewMessageNotification($message));
        }

        return response()->json($meeting);
    }

    public function update(Request $request, Meeting $meeting)
    {
        $conversation = $meeting->conversation;
        $this->authorize('view', $conversation);
        if (Auth::id() !== $conversation->buyer_id) {
            return response()->json(['message' => 'Seul l\'acheteur peut répondre'], 403);
        }

        $data = $request->validate([
            'status' => 'required|in:accepted,declined',
        ]);

        $meeting->update(['status' => $data['status']]);

        if ($meeting->type === 'visit') {
            if ($data['status'] === 'accepted') {
                Visit::updateOrCreate([
                    'listing_id' => $conversation->listing_id,
                    'user_id' => $conversation->buyer_id,
                    'visit_datetime' => $meeting->scheduled_at,
                ], [
                    'status' => 'planifiee',
                    'mode' => 'physique',
                ]);
            } else {
                Visit::where('listing_id', $conversation->listing_id)
                    ->where('user_id', $conversation->buyer_id)
                    ->where('visit_datetime', $meeting->scheduled_at)
                    ->delete();
            }
        }

        return response()->json($meeting);
    }
}

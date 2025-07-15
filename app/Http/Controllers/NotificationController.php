<?php
namespace App\Http\Controllers;

use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Auth::user()->notifications()->latest()->get()->map(function ($notification) {
            $data = $notification->data;
            $sender = null;

            if (!str_contains($notification->type, 'ListingFavoritedNotification')) {
                $sender = User::withBasicInfo()->find($data['sender_id']);
            } else {
                unset($data['sender_id']);
            }

            return [
                'id' => $notification->id,
                'type' => $notification->type,
                'read_at' => $notification->read_at,
                'created_at' => $notification->created_at,
                'data' => $data,
                'sender' => $sender,
            ];
        });

        return response()->json($notifications);
    }

    public function markAsRead(DatabaseNotification $notification)
    {
        if ($notification->notifiable_id !== Auth::id()) {
            abort(403);
        }
        $notification->markAsRead();
        return response()->json(['message' => 'Notification lue']);
    }

    public function markAsUnread(DatabaseNotification $notification)
    {
        if ($notification->notifiable_id !== Auth::id()) {
            abort(403);
        }
        $notification->update(['read_at' => null]);
        return response()->json(['message' => 'Notification non lue']);
    }
}

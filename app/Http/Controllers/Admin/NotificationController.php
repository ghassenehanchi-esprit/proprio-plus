<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = Auth::user()->notifications()->latest()->get()->map(function ($notification) {
            $user = User::withBasicInfo()->find($notification->data['user_id'] ?? null);

            return [
                'id' => $notification->id,
                'type' => $notification->type,
                'read_at' => $notification->read_at,
                'created_at' => $notification->created_at,
                'data' => $notification->data,
                'user' => $user,
            ];
        });

        if ($request->wantsJson()) {
            return response()->json($notifications);
        }

        return Inertia::render('Admin/Notifications/Index', [
            'notifications' => $notifications,
        ]);
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

<?php
namespace App\Notifications;

use App\Models\Meeting;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class MeetingProposalNotification extends Notification
{
    use Queueable;

    public function __construct(public Meeting $meeting)
    {
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'meeting_id' => $this->meeting->id,
            'conversation_id' => $this->meeting->conversation_id,
            'scheduled_at' => $this->meeting->scheduled_at,
            'type' => $this->meeting->type,
            'agenda' => $this->meeting->agenda,
            'sender_id' => $this->meeting->conversation->seller_id,
        ];
    }
}

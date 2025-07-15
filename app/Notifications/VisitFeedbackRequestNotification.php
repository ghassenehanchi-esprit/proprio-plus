<?php
namespace App\Notifications;

use App\Models\Visit;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class VisitFeedbackRequestNotification extends Notification
{
    use Queueable;

    public function __construct(public Visit $visit)
    {
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'visit_id' => $this->visit->id,
            'listing_id' => $this->visit->listing_id,
            'sender_id' => $this->visit->listing->user_id,
        ];
    }
}


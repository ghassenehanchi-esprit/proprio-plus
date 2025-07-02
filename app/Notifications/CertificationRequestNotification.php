<?php
namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CertificationRequestNotification extends Notification
{
    use Queueable;

    public function __construct(public User $user)
    {
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'user_id' => $this->user->id,
            'name' => $this->user->first_name . ' ' . $this->user->last_name,
        ];
    }
}

<?php
namespace App\Notifications;

use App\Models\Listing;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ListingFavoritedNotification extends Notification
{
    use Queueable;

    public function __construct(public Listing $listing, public User $user)
    {
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'listing_id' => $this->listing->id,
            'sender_id' => $this->user->id,
        ];
    }
}

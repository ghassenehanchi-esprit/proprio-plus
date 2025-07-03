<?php
namespace App\Notifications;

use App\Models\Listing;
use App\Models\SavedSearch;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class SavedSearchMatchNotification extends Notification
{
    use Queueable;

    public function __construct(public SavedSearch $search, public Listing $listing)
    {
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject("Nouvelle annonce correspondant à votre recherche")
            ->line("Une annonce correspond à votre recherche enregistrée.")
            ->action('Voir l\'annonce', url("/listings/{$this->listing->id}"));
    }

    public function toArray($notifiable)
    {
        return [
            'listing_id' => $this->listing->id,
            'search_id' => $this->search->id,
        ];
    }
}

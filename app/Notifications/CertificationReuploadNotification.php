<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CertificationReuploadNotification extends Notification
{
    use Queueable;

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Nouvelle preuve d\'identit\u00e9 demand\u00e9e')
            ->line("La qualité de votre document n'a pas permis sa vérification.")
            ->line("Merci de téléverser un document plus lisible depuis votre espace utilisateur.");
    }
}

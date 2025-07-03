<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CertificationRefusedNotification extends Notification
{
    use Queueable;

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject("Vérification d'identité refusée")
            ->line("Votre demande de vérification a été refusée par l'administrateur.")
            ->line("Vous pouvez contacter le support pour plus d'informations.");
    }
}

<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CertificationApprovedNotification extends Notification
{
    use Queueable;

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject("Vérification d'identité approuvée")
            ->line("Votre document d'identité a été validé par l'administrateur.")
            ->line('Vous pouvez désormais utiliser toutes les fonctionnalités de la plateforme.');
    }
}

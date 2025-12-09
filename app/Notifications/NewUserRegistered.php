<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class NewUserRegistered extends Notification
{
    use Queueable;

    public function __construct(public string $userName, public string $userEmail, public string $userRole)
    {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'user',
            'title' => 'New User Registered',
            'message' => "{$this->userName} ({$this->userEmail}) has registered as a {$this->userRole}.",
            'icon' => 'user',
            'read_at' => null,
        ];
    }
}
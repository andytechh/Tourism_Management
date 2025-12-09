<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class BookingStatusUpdated extends Notification
{
    use Queueable;

    public function __construct(
        public string $bookingId,
        public string $status,
        public string $paymentStatus,
        public string $tourName,
        public string $bookingDate
    ) {}

    public function via($notifiable): array
    {
        return ['database']; // Store in notifications table; frontend will poll or use WebSocket later
    }

    public function toArray($notifiable): array
    {
        $message = match (true) {
            $this->status === 'confirmed' && $this->paymentStatus === 'paid' => 
                "Your booking for {$this->tourName} on {$this->bookingDate} has been confirmed and payment received!",
            $this->status === 'confirmed' => 
                "Your booking for {$this->tourName} has been confirmed!",
            $this->paymentStatus === 'paid' => 
                "Payment for your booking ({$this->tourName}) has been confirmed.",
            $this->status === 'cancelled' => 
                "Your booking for {$this->tourName} has been cancelled and payment refunded.",
            default => 
                "Your booking status has been updated: Status: {$this->status}, Payment: {$this->paymentStatus}"
        };

        return [
            'type' => $this->determineType(),
            'title' => $this->getTitle(),
            'message' => $message,
            'booking_id' => $this->bookingId,
            'read_at' => null,
        ];
    }

    private function determineType(): string
    {
        if ($this->status === 'cancelled') return 'alert';
        if ($this->paymentStatus === 'paid') return 'payment';
        if ($this->status === 'confirmed') return 'booking';
        return 'update';
    }

    private function getTitle(): string
    {
        if ($this->status === 'confirmed') return 'Booking Confirmed';
        if ($this->paymentStatus === 'paid') return 'Payment Confirmed';
        if ($this->status === 'cancelled') return 'Booking Cancelled';
        return 'Booking Updated';
    }
}
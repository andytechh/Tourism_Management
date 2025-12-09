<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewBookingCreated extends Notification implements ShouldQueue
{
    use Queueable;

    public $customerName;
    public $tourName;
    public $bookingDate;
    public $bookingId;

    /**
     * Create a new notification instance.
     */
    public function __construct($customerName, $tourName, $bookingDate, $bookingId)
    {
        $this->customerName = $customerName;
        $this->tourName = $tourName;
        $this->bookingDate = $bookingDate;
        $this->bookingId = $bookingId;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Booking Created')
            ->line('A new booking has been created.')
            ->line('Customer: ' . $this->customerName)
            ->line('Tour: ' . $this->tourName)
            ->line('Date: ' . $this->bookingDate)
            ->action('View Booking', url('/admin/bookings/' . $this->bookingId))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'customer_name' => $this->customerName,
            'tour_name' => $this->tourName,
            'booking_date' => $this->bookingDate,
            'booking_id' => $this->bookingId,
            'message' => 'New booking created by ' . $this->customerName,
        ];
    }
}
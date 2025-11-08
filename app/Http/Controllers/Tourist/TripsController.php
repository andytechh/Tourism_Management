<?php

namespace App\Http\Controllers\Tourist;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TripsController extends Controller
{
    public function index()
    {
        $bookings = Booking::with(['user', 'destination'])
            ->orderBy('created_at', 'asc')
            ->get()
            ->transform(function ($booking) {
                return [
                    'id' => $booking->id,
                    'guests' => ($booking->adults ?? 0) + ($booking->children ?? 0),
                    'booking_time' => $booking->booking_time ?? 'N/A',
                    'booking_date' => $booking->booking_date ?? 'N/A',
                    'status' => $booking->status ?? 'unknown',
                    'image' => $booking->destination->image 
                      ? asset('storage/' . $booking->destination->image)
                      : asset('images/default.jpg'),
                    'name' => $booking->user->name ?? 'N/A',
                    'destination' => $booking->destination->name ?? 'N/A',
                    'location' => $booking->destination->location ?? 'Unknown location',
                    'total_price' => $booking->total_price ?? 0,
                    'rating' => $booking->rating,
                    'feedback' => $booking->feedback,
                ];
            });

        return inertia('Tourist/Trips', [
            'bookings' => $bookings,
        ]);
    }
    public function rateBooking(Request $request, Booking $booking)
        {
            $request->validate([
                'rating' => 'required|integer|min:1|max:5',
                'feedback' => 'nullable|string|max:500',
            ]);

            $booking->update([
                'rating' => $request->rating,
                'feedback' => $request->feedback,
            ]);

            return back()->with('message', 'Thank you for your feedback!');
        }


}

<?php

namespace App\Http\Controllers\Tourist;

use App\Http\Controllers\Controller;
use App\Models\Destinations;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TouristDashboardController extends Controller
{
  
public function index()
{
    $destinations = Destinations::where('status', 'Active')
        ->withCount(['bookings as rating_count' => function ($query) {
            $query->whereNotNull('rating');
        }])
        ->withAvg('bookings as average_rating', 'rating') // alias relation to provide average_rating
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($dest) {
            $dest->image = $dest->image 
                ? asset('storage/' . $dest->image)
                : asset('images/default.jpg');

            $dest->formatted_price = '₱' . number_format($dest->price, 0);

            // Now $dest->average_rating exists!
            $dest->average_rating = $dest->average_rating 
                ? round($dest->average_rating, 1) 
                : null;

            return $dest;
        });

    return Inertia::render('Tourist/Home', compact('destinations'));
} 
public function tourDetails($destination)
{
    $destinationData = Destinations::withCount(['bookings as rating_count' => function ($query) {
            $query->whereNotNull('rating');
        }])
        ->withAvg('bookings as average_rating', 'rating')
        ->findOrFail($destination);

    $destinationData->image = $destinationData->image 
        ? asset('storage/' . $destinationData->image)
        : asset('images/default.jpg');

    $destinationData->formatted_price = '₱' . number_format($destinationData->price, 0);
    $destinationData->average_rating = $destinationData->average_rating 
        ? round($destinationData->average_rating, 1)
        : null;

    return inertia('Tourist/ToursDetails', [
        'destination' => $destinationData,
    ]);
}

      public function tourBookings(Destinations $destination)
    {
        $destination->image = $destination->image 
            ? asset('storage/' . $destination->image)
            : asset('images/default.jpg'); 
        $destination->formatted_price = '₱' . number_format($destination->price, 0);
        
        return Inertia::render('Tourist/TouristBooking', compact('destination'));

        } 
    
}

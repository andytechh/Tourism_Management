<?php

    namespace App\Http\Controllers\Tourist;

    use App\Http\Controllers\Controller;
    use App\Models\Destinations;
    use Illuminate\Http\Request;
    use Inertia\Inertia;
    use Illuminate\Support\Facades\Auth;

    class TouristDashboardController extends Controller
    {
    
    public function index()
{
    $destinations = Destinations::where('status', 'Active')
        ->withCount(['bookings as rating_count' => fn($q) => $q->whereNotNull('rating')])
        ->withAvg('bookings', 'rating')
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($dest) {
            $dest->image = $dest->image
                ? asset('storage/' . $dest->image)
                : asset('images/default.jpg');

            $dest->formatted_price = '₱' . number_format($dest->price, 0);
            $dest->average_rating = $dest->average_rating
                ? round($dest->average_rating, 1)
                : null;

            return $dest;
        });

    return Inertia::render('Tourist/Home', compact('destinations'));
}    

public function tourDetails($destinationId)
{
    $destination = Destinations::withCount([
        'bookings as rating_count' => fn($q) => $q->whereNotNull('rating')
    ])
    ->withAvg('bookings', 'rating')
    ->findOrFail($destinationId);
    
    $destination->in_wishlist = $destination->isInWishlist();
    $destination->image = $destination->image 
        ? asset('storage/' . $destination->image)
        : asset('images/default.jpg');
    $destination->formatted_price = '₱' . number_format($destination->price, 0);
    $destination->average_rating = $destination->average_rating 
        ? round($destination->average_rating, 1)
        : null;

    return inertia('Tourist/ToursDetails', [
        'destination' => $destination,
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
        public function touristWishlist(Destinations $destination) 
        {
            $destination->image = $destination->image 
                ? asset('storage/' . $destination->image)
                : asset('images/default.jpg'); 
            $destination->formatted_price = '₱' . number_format($destination->price, 0);
            
            return Inertia::render('Tourist/TouristWishlist', compact('destination'));

            }
        
    }

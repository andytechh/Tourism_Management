<?php

namespace App\Http\Controllers\Landing;

use App\Models\Destination;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Destinations;

class WelcomeController extends Controller
{
    public function index()
    {
        // Fetch ALL destinations for tours section
        $tours = Destinations::select([
            'id',
            'name',
            'description',
            'image',
            'price',
            'category',
            'rating'
        ])
        ->orderBy('created_at', 'desc')
        ->limit(6)
        ->get()
        ->map(function($dest) {
            return [
                'id' => $dest->id,
                'title' => $dest->name,
                'description' => $dest->description,
                'price' => '₱' . number_format($dest->price, 0),
                'image' => $dest->image,
                'category' => $dest->category,
                'rating' => $dest->rating,
            ];
        });

        // Fetch top 3 rated destinations for "Top-Rated" section
      $topDestinations = Destinations::withCount(['bookings as review_count' => function($query) {
            $query->whereNotNull('feedback');
        }])
            ->where('rating', '>', 0)
            ->orderBy('rating', 'desc')
            ->limit(3)
            ->get()
            ->map(function($dest) {
                return [
                    'id' => $dest->id,
                    'name' => $dest->name,
                    'description' => Str::limit($dest->description, 100),
                    'image' => $dest->image,
                    'rating' => $dest->rating,
                    'review_count' => $dest->review_count,
                    'price' => $dest->price,
                    'category' => $dest->category,
                ];
            });
        return Inertia::render('welcome', [
            'tours' => $tours,
            'topDestinations' => $topDestinations
        ]);
    }
}
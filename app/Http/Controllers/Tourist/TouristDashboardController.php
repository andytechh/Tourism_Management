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
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($dest) {
            $dest->image = $dest->image 
                ? asset('storage/' . $dest->image)
                : asset('images/default.jpg'); 
             $dest->formatted_price = '₱' . number_format($dest->price, 0);
            return $dest;
        });
        return Inertia::render('Tourist/Home', compact('destinations'));

    }
}

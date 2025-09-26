<?php

namespace App\Http\Controllers;

use App\Models\Destinations;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DestinationsController extends Controller
{
    public function index()
    {
        $destinations = Destinations::all();
        
         $active_tours = $destinations->filter(function ($dest) {
        return in_array(strtolower($dest->status), ['active', '1', 'true']);
    })->count();
         $stats = [
        'total_destinations' => $destinations->count(),
        'active_tours' => $active_tours,
        'total_bookings' => $destinations->sum('bookings'),
        'avg_rating' => $destinations->avg('rating') ?? 0,
    ];
        return Inertia::render('Admin/ManageDestinations', [
            'destinations' => $destinations,
            'stats' => $stats,
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'location' => 'required|string|max:255',
            'price' => 'required|numeric',
            'rating' => 'nullable|numeric',
            'bookings' => 'nullable|integer', 
            'status' => 'nullable|string',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $imagePath = $request->file('image')->store('destinations', 'public');

        Destinations::create([
            'name' => $request->name,
            'category' => $request->category,
            'location' => $request->location,
            'price' => $request->price,
            'rating' => $request->rating,
            'bookings' => $request->bookings ?? 0,
            'status' => $request->status ?? 'Active',
            'description' => $request->description,
            'image' => $imagePath,
        ]);

        return redirect()->route('admin.destinations')
            ->with('message', 'Destination created successfully!');
    }
}
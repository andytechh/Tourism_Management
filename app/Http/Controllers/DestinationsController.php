<?php

namespace App\Http\Controllers;

use App\Models\Destinations;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Models\Booking;
use Inertia\Inertia;

class DestinationsController extends Controller
{
public function index()
{

    $destinations = Destinations::withCount('bookings')->get();

    $totalBookings = $destinations->sum('bookings_count');

    $activeTours = $destinations->where('status', 'active')->count();

    $avgRating = $destinations->avg('rating') ?? 0;
    $destinationsWithPercentage = $destinations->map(function ($dest) use ($totalBookings) {
        $dest->booking_percentage = $totalBookings > 0 
            ? round(($dest->bookings_count / $totalBookings) * 100, 1) 
            : 0;
        return $dest;
    });

    $stats = [
        'total_destinations' => $destinations->count(),
        'active_tours' => $activeTours,
        'total_bookings' => $totalBookings,
        'avg_rating' => round($avgRating, 1),
    ];

    return Inertia::render('Admin/ManageDestinations', [
        'destinations' => $destinationsWithPercentage, 
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
            'package_options' => 'array',
            'package_options.*' => 'in:individual,group,family,private',
            'guests_min' => 'required|integer',
            'guests_max' => 'sometimes|nullable|integer',      
            'duration' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',

        ]);

        $imagePath = $request->file('image')->store('destinations', 'public');

        Destinations::create([
            'name' => $request->name,
            'category' => $request->category,
            'location' => $request->location,
            'price' => $request->price,
            'rating' => $request->rating,
            'guests_min' => $request->guests_min,
            'guests_max' => $request->guests_max,
            'duration' => $request->duration,
            'bookings' => $request->bookings ?? 0,
            'status' => $request->status ?? 'Active',
            'description' => $request->description,
            'package_options' => $request->package_options,
            'image' => $imagePath,
        ]);

        return redirect()->route('admin.destinations')
            ->with('message', 'Destination created Successfully!');
    }
    public function edit(Destinations $destination){
        return Inertia::render('Admin/ManageDestinations', compact('destination'));
    }
    public function destroy(Destinations $destination){
        $destination->delete();
        return redirect()->route('admin.destinations')->with('message', 'Destination Deleted Successfully!');
    }
    public function update(Request $request, Destinations $destination)
{
    $validated = $request->validate([
        'name' => 'sometimes|string|max:255',
        'category' => 'sometimes|string',
        'location' => 'sometimes|string|max:255',
        'price' => 'sometimes|numeric',
        'rating' => 'sometimes|nullable|numeric',
        'bookings' => 'sometimes|nullable|integer',
        'status' => 'sometimes|nullable|string',
        'package_options' => 'sometimes|array',
        'package_options.*' => 'in:individual,group,family,private',
        'guests_min' => 'required|integer',
        'guests_max' => 'sometimes|nullable|integer',      
        'duration' => 'required|string',
        'description' => 'sometimes|string',
        'image' => 'nullable|file|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    if ($request->hasFile('image')) {
        if (!empty($destination->image) && Storage::disk('public')->exists($destination->image)) {
            Storage::disk('public')->delete($destination->image);
        }

        // Store new image
        $imagePath = $request->file('image')->store('destinations', 'public');
        $validated['image'] = $imagePath;
    } else {
        unset($validated['image']);
    }
    
    if ($request->has('package_options')) {
        $validated['package_options'] = $request->package_options;
    }
    $destination->update($validated);

    return redirect()
        ->route('admin.destinations')
        ->with('message', 'Destination updated successfully!');
}

} 
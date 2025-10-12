<?php

namespace App\Http\Controllers;

use App\Models\Destinations;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

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
            ->with('message', 'Destination created Successfully!');
    }
    public function edit(Destinations $destination){
        return Inertia::render('Admin/ManageDestinations', compact('destination'));
    }
    public function destroy(Destinations $destination){
        $destination->delete();
        return redirect()->route('admin.destinations')->with('message', 'Destination Deleted Successfully!');
    }
    public function update(Request $request, Destinations $destination){
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'category' => 'sometimes|string',
            'location' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric',
            'rating' => 'sometimes|nullable|numeric',
            'bookings' => 'sometimes|nullable|integer', 
            'status' => 'sometimes|nullable|string',
            'description' => 'sometimes|string',
            'image' => 'sometimes|file|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if (!empty($destination->image) && Storage::disk('public')->exists($destination->image)) {
                Storage::disk('public')->delete($destination->image);
            }
            $imagePath = $request->file('image')->store('destinations', 'public');
            $validated['image'] = $imagePath;
        }

        // Update only the validated fields (partial updates allowed)
        $destination->update($validated);

        return redirect()->route('admin.destinations')
            ->with('message', 'Destination updated Successfully!');
    }
}
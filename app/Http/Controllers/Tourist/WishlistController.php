<?php

namespace App\Http\Controllers\Tourist;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Destinations;
use App\Models\Wishlist;

class WishlistController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'destination_id' => 'required|exists:Destinations,id'
        ]);

        $exists = Wishlist::where('user_id', Auth::id())
            ->where('destination_id', $request->destination_id)
            ->exists();

        if ($exists) {
            return back()->with('error', 'Already in wishlist');
        }

        Wishlist::create([
            'user_id' => Auth::id(),
            'destination_id' => $request->destination_id
        ]);

        return back()->with('success', 'Added to wishlist');
    }

    public function destroy(Destinations $destination)
    {
        $wishlist = Wishlist::where('user_id', Auth::id())
            ->where('destination_id', $destination->id)
            ->first();

        if ($wishlist) {
            $wishlist->delete();
            return back()->with('success', 'Removed from wishlist');
        }

        return back()->with('error', 'Not found in wishlist');
    }

    public function index()
    {
        $wishlistDestinationIds = Wishlist::where('user_id', Auth::id())->pluck('destination_id');
        $wishlistItems = Destinations::whereIn('id', $wishlistDestinationIds)->get();
        $wishlistItems->transform(function ($item) {
            $item->image = $item->image
                ? asset('storage/' . $item->image)
                : asset('images/default.jpg');
            $item->formatted_price = '₱' . number_format($item->price, 0);
            return $item;
        });
        $wishlistItems->transform(function ($item) {
            $item->average_rating = $item->bookings()->whereNotNull('rating')->avg('rating');
            if ($item->average_rating) {
                $item->average_rating = round($item->average_rating, 1);
            } else {
                $item->average_rating = null;
            }
            $item->rating_count = $item->bookings()->whereNotNull('rating')->count();
            return $item;
        });

        return inertia('Tourist/Wishlist', [
            'wishlist' => $wishlistItems
        ]);
    }
}
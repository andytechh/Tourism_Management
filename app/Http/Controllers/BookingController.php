<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'destination_id' => 'required|exists:destinations,id',
            'booking_date' => 'required|date',
            'booking_time' => 'required|string',
            'adults' => 'required|integer|min:1',
            'children' => 'nullable|integer|min:0',
            'total_price' => 'required|numeric',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'payment_method' => 'required|in:gcash,paymaya,bank',
        ]);

        $booking = Booking::create([
            'tourist_id' => Auth::id(),
            'destination_id' => $request->destination_id,
            'booking_date' => $request->booking_date,
            'booking_time' => $request->booking_time,
            'adults' => $request->adults,
            'children' => $request->children ?? 0,
            'total_price' => $request->total_price,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'nationality' => $request->nationality,
            'special_requests' => $request->special_requests,
            'status' => 'Pending',
            'payment_method' => $request->payment_method ?? 'gcash',
        ]);

        return redirect()->route('tourist.dashboard')->with('success', 'Booking successfully created!');
    }
}

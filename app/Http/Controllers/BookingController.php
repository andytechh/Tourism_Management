<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller

{   
    public function index()
    {
        $bookings = Booking::with(['user', 'destination'])->orderBy('created_at', 'asc')->get();

        $totalBookings = $bookings->count();
        $pendingBookings = $bookings->where('status', 'pending')->count();
        $confirmedBookings = $bookings->where('status', 'confirmed')->count();
        $cancelledBookings = $bookings->where('status', 'cancelled')->count();
        $totalRevenue = $bookings->where('status', 'confirmed')->sum('total_price');
        $bookings->transform(function ($booking) {
            $booking->tour_name = $booking->destination->name ?? 'N/A';
            return $booking;
        });
        $bookings->transform(function ($booking) {
            $booking->guests = $booking->adults + $booking->children;
            return $booking;
        });
        $stats = [
            'total_bookings' => $totalBookings,
            'pending_bookings' => $pendingBookings,
            'confirmed_bookings' => $confirmedBookings,
            'cancelled_bookings' => $cancelledBookings,
            'total_revenue' => $totalRevenue,
        ];      
        return inertia('Admin/Bookings', [
            'bookings' => $bookings,
            'stats' => $stats,

            
        ]);
    }
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
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'payment_method' => $request->payment_method ?? 'gcash',
        ]);

        return redirect()->route('tourist.dashboard')->with('success', 'Booking successfully created!');
    }

    public function update(Request $request, Booking $booking)
    {
     
        if ($booking->status === 'cancelled') {
            return back()->withErrors(['status' => 'Cannot modify a cancelled booking.']);
        }

        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled',
            'payment_status' => 'nullable|in:unpaid,paid,refunded',
        ]);

        $booking->status = $request->status;

        if ($request->filled('payment_status')) {
            $booking->payment_status = $request->payment_status;
        }

        $booking->save();

        return redirect()->route('admin.bookings')->with('message', 'Booking updated successfully!');
    }
    public function destroy(Booking $booking){
        $booking->delete();
        return redirect()->route('admin.bookings')->with('message', 'Booking Deleted Successfully');
    }
}

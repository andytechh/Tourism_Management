<?php

namespace App\Http\Controllers;

use App\Notifications\BookingStatusUpdated;
use App\Notifications\NewBookingCreated;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\User;
use App\Models\Destination;
use App\Models\Destinations;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{   
    public function index()
    {
        $bookings = Booking::with(['user', 'destination'])
            ->orderBy('created_at', 'desc')
            ->get();

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
            'booking_type' => 'required|in:package,individual',
            'payment_method' => 'required|in:gcash,paymaya,bank',
        ]);

        DB::beginTransaction();
        
        try {
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
                'booking_type' => $request->booking_type,
                'special_requests' => $request->special_requests,
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'payment_method' => $request->payment_method ?? 'gcash',
            ]);
            
            // Get the destination name for the notification
            $destination = Destinations::find($request->destination_id);
            $tourName = $destination ? $destination->name : 'Unknown Tour';
            
            // Notify admins
            $admins = User::where('role', 'admin')->get();
            foreach ($admins as $admin) {
                $admin->notify(new NewBookingCreated(
                    $request->first_name . ' ' . $request->last_name,
                    $tourName,
                    $booking->booking_date,
                    $booking->id
                ));
            }
            
            DB::commit();
            
            return redirect()->route('tourist.dashboard')->with('success', 'Booking successfully created!');
            
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to create booking: ' . $e->getMessage());
        }
    }

    public function update(Request $request, Booking $booking)
    {
        if ($booking->status === 'cancelled') {
            return back()->withErrors(['status' => 'Cannot modify a cancelled booking.']);
        }

        // Validate both fields together
        $validated = $request->validate([
            'status' => 'nullable|in:pending,confirmed,cancelled',
            'payment_status' => 'nullable|in:unpaid,paid,refunded',
        ]);

        // Only update fields that were provided
        if ($request->filled('status')) {
            $booking->status = $validated['status'];
        }

        if ($request->filled('payment_status')) {
            $booking->payment_status = $validated['payment_status'];
        }

        $booking->save();

        // Notify tourist
        $this->notifyTourist($booking, $validated);

        return redirect()->route('admin.bookings')->with('message', 'Booking updated successfully!');
    }
    
    public function destroy(Booking $booking)
    {
        $booking->delete();
        return redirect()->route('admin.bookings')->with('message', 'Booking Deleted Successfully');
    }
    
    protected function notifyTourist(Booking $booking, array $changes)
    {
        // Get the user FIRST
        $user = $booking->user;

        // Only notify if user exists
        if (!$user) {
            return;
        }

        // Get destination name for notification
        $tourName = $booking->destination ? $booking->destination->name : 'Unknown Tour';

        // Then send notification
        $user->notify(new BookingStatusUpdated(
            bookingId: (string) $booking->id,
            status: $booking->status,
            paymentStatus: $booking->payment_status,
            tourName: $tourName,
            bookingDate: \Carbon\Carbon::parse($booking->booking_date)->format('F j, Y')
        ));
    }
    
    public function cancelBooking(Request $request, Booking $booking)
    {
        // Ensure user owns the booking
        if ($booking->tourist_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        // Only allow cancellation if status is 'pending'
        if ($booking->status !== 'pending') {
            return response()->json(['error' => 'Only pending bookings can be cancelled'], 400);
        }

        $booking->update([
            'status' => 'cancelled',
            'payment_status' => 'refunded'
        ]);

        return back()->with('success', 'Booking cancelled successfully.');
    }
}
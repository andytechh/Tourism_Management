<?php

namespace App\Http\Controllers;

use App\Models\Destinations;
use App\Models\User;
use App\Models\Booking;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Tourist count (users with role = 'tourist')
        $touristCount = User::where('role', 'tourist')->count();

        // Destination count
        $destinationCount = Destinations::count();

        // Booking stats
        $totalBookings = Booking::count();
        $pendingBookings = Booking::where('status', 'pending')->count();
        $confirmedBookings = Booking::where('status', 'confirmed')->count();
        $cancelledBookings = Booking::where('status', 'cancelled')->count();

        $bookingsAll = $confirmedBookings + $pendingBookings + $cancelledBookings;

        // Revenue (sum of confirmed bookings only)
        $totalRevenue = Booking::where('status', 'confirmed')->sum('total_price');

        // Prepare all stats for Inertia
        $stats = [
            'bookingsAll' => $bookingsAll,
            'touristCount' => $touristCount,
            'destinationCount' => $destinationCount,
            'totalBookings' => $totalBookings,
            'pendingBookings' => $pendingBookings,
            'confirmedBookings' => $confirmedBookings,
            'cancelledBookings' => $cancelledBookings,
            'totalRevenue' => $totalRevenue,
        ];
        
        $monthlyVisitors = DB::table('bookings')
            ->select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as visitors'),
                DB::raw('SUM(total_price) as revenue')
            )
            ->whereYear('created_at', date('Y'))
            ->groupBy(DB::raw('MONTH(created_at)'))
            ->orderBy(DB::raw('MONTH(created_at)'))
            ->get();

       $tourTypes = DB::table('bookings')
            ->join('destinations', 'bookings.destination_id', '=', 'destinations.id')
            ->select('destinations.category', DB::raw('COUNT(bookings.id) as value'))
            ->groupBy('destinations.category')
            ->get();


        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'monthlyVisitors' => $monthlyVisitors,
            'tourTypes' => $tourTypes,
        ]);
    }
}
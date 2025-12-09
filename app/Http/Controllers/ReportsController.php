<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportsController extends Controller
{
    public function index()
{
    $monthlyRevenue = DB::table('bookings')
        ->select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as bookings'),
            DB::raw('SUM(total_price) as revenue')
        )
        ->whereYear('created_at', now()->year)
        ->groupBy('month')
        ->orderBy('month')
        ->get();

    $popularDestinations = DB::table('bookings')
        ->join('destinations', 'bookings.destination_id', '=', 'destinations.id')
        ->select(
            'destinations.id',
            'destinations.name',
            DB::raw('COUNT(bookings.id) as bookings'),
            DB::raw('SUM(bookings.total_price) as revenue')
        )
        ->groupBy('destinations.id', 'destinations.name')
        ->orderByDesc('bookings')
        ->get();

    $customerDemographics = [
        ['name' => 'Local', 'value' => 35],
        ['name' => 'Domestic', 'value' => 45],
        ['name' => 'International', 'value' => 20],
    ];

    $businessTypes = [
        ['type' => 'Hotels', 'count' => 45, 'percentage' => 36],
        ['type' => 'Restaurants', 'count' => 38, 'percentage' => 31],
        ['type' => 'Tour Guides', 'count' => 28, 'percentage' => 23],
        ['type' => 'Transport', 'count' => 13, 'percentage' => 10],
    ];

    return Inertia::render('Admin/Reports', [
        'monthlyRevenue' => $monthlyRevenue,
        'popularDestinations' => $popularDestinations,
        'customerDemographics' => $customerDemographics,
        'businessTypes' => $businessTypes,
        'totalRevenue' => Booking::where('status', 'confirmed')->sum('total_price'),
        'totalVisitors' => User::where('role', 'tourist')->count(),
        'averageRating' => 4.8,
        'repeatVisitors' => 23,
    ]);
}
}

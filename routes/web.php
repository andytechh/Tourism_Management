<?php

use App\Http\Controllers\DestinationsController;
use App\Http\Controllers\Tourist\TouristDashboardController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UsersManagmentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Default dashboard (fallback)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// =====================
// Role-specific dashboards
// =====================
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');
    Route::get('/admin/users', function () {
        return Inertia::render('Admin/UsersManagement');
    })->name('admin.users');
     Route::get('/admin/destinations', function () {
        return Inertia::render('Admin/ManageDestinations');
    })->name('admin.destinations');
      Route::get('/admin/bookings', function () {
        return Inertia::render('Admin/Bookings');
    })->name('admin.bookings');
      Route::get('/admin/business', function () {
        return Inertia::render('Admin/Business');
    })->name('admin.business');
      Route::get('/admin/reports', function () {
        return Inertia::render('Admin/Reports');
    })->name('admin.reports');
// Admin
    Route::get('/admin/destinations', [DestinationsController::class, 'index'])
        ->name('admin.destinations');
    Route::post('/admin/destinations', [DestinationsController::class, 'store'])
        ->name('admin.destinations.store');
    Route::get('/admin/destinations/{destination}/edit', [DestinationsController::class, 'edit'])
        ->name('admin.destinations.edit');
    Route::put('/admin/destinations/{destination}', [DestinationsController::class, 'update'])
        ->name('admin.destinations.update');
    Route::delete('/admin/destinations/{destination}', [DestinationsController::class, 'destroy'])
        ->name('admin.destinations.destroy');
    //
    Route::get('/admin/dashboard', [DashboardController::class, 'index']) ->name('admin.dashboard');
    // User Management
    Route::get('/admin/users', [UsersManagmentController::class, 'index']) ->name('admin.users');

    Route::delete('/admin/users/{user}', [UsersManagmentController::class, 'destroy'])
        ->name('admin.users.destroy');
    Route::put('/admin/users/{user}/toggle-status', [UsersManagmentController::class, 'toggleStatus'])
    ->name('admin.users.toggle-status');
    Route::put('/admin/users/{user}/reset-password', [UsersManagmentController::class, 'resetPassword'])
    ->name('admin.users.reset-password');


    
    

        

//Admin Bookings
    Route::get('/admin/bookings', [BookingController::class, 'index'])
        ->name('admin.bookings');
    Route::get('/admin/bookings/{booking}', [BookingController::class, 'show'])
        ->name('admin.bookings.show');
    Route::put('/admin/bookings/{booking}', [BookingController::class, 'update'])
        ->name('admin.bookings.update');
    Route::delete('/admin/bookings/{booking}', [BookingController::class, 'destroy'])
    ->name('admin.bookings.destroy');
//Staff
    Route::get('/staff/dashboard', function () {
        return Inertia::render('Staff/Dashboard');
    })->name('staff.dashboard');

//Tourist pages
   Route::get('/tourist/trips',  function() {
         return Inertia::render('Tourist/Trips');
   })->name('tourist.trips');

    
//Tourist
    Route::get('/tourist/dashboard', [TouristDashboardController::class, 'index'])
        ->name('tourist.dashboard');
    Route::get('/tourist/tours', [TouristDashboardController::class, 'tours'])
        ->name('tourist.tours');
    Route::get('/tourist/{destination}/tour', [TouristDashboardController::class, 'tourDetails'])
        ->name('tourist.tourDetails')
        ->where('destination', '[0-9]+');;

    Route::get('/tourist/{destination}', [TouristDashboardController::class, 'tourBookings'])
        ->name('tourist.tourBookings')
        ->where('destination', '[0-9]+');
    
// Booking
     Route::post('/bookings', [BookingController::class, 'store'])->name('Tourist.bookings.store');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';


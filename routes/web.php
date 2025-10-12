<?php

use App\Http\Controllers\DestinationsController;
use App\Http\Controllers\Tourist\TouristDashboardController;
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

//Staff
    Route::get('/staff/dashboard', function () {
        return Inertia::render('Staff/Dashboard');
    })->name('staff.dashboard');
    
//Tourist
  
Route::get('/tourist/dashboard', [TouristDashboardController::class, 'index'])
    ->name('tourist.dashboard');

});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';


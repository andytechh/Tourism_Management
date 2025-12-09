<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\User;
use App\Notifications\NewUserRegistered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class UsersManagmentController extends Controller
{
    public function index()
    {
        // Fetch total tourist count
        $tourist = User::where('role', 'tourist')->count();

        // Fetch users with bookings count
        $tourist_all = User::withCount('bookings')
            ->get(['id', 'name', 'email', 'role', 'status', 'last_login_at', 'created_at']);
  
        $bookings = Booking::with('destination:id,name') 
            ->select([
                'id',
                'tourist_id as user_id',    
                'destination_id',
                'status',
                'booking_date',
                'total_price'
            ])
            ->orderBy('created_at', 'asc')
            ->get();

        $totalBookings = $tourist_all->sum('bookings_count');

        $stats = [
            'total_tourist' => $tourist,
            'total_bookings' => $totalBookings,
        ];

        return Inertia::render('Admin/UsersManagement', [
            'tourist_all' => $tourist_all,
            'booking' => $bookings, 
            'stats' => $stats,
        ]);
    }
    public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'role' => 'required|in:admin,staff,tourist',
    ]);

    // role from request (NOT undefined $role)
    $role = $request->role;
    // Default password = user's name (lowercase, no spaces)
    $defaultPassword = strtolower(str_replace(' ', '', $request->name));

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'role' => $role, 
        'status' => 'active',
        'password' => Hash::make($defaultPassword),
    ]);
  
    // Notify all admins
    $admins = User::where('role', 'admin')->get();
    foreach ($admins as $admin) {
        $admin->notify(new NewUserRegistered(
            $user->name,
            $user->email,
            $user->role 
        ));
    }

    // Send email to user with their credentials
    Mail::raw("Your account has been created.\nEmail: {$request->email}\nPassword: {$defaultPassword}", function ($message) use ($request) {
        $message->to($request->email)->subject('Your New Account');
    });

    return redirect()->route('admin.users')->with('success', 'User created successfully and credentials sent via email.');
}

    public function resetPassword($id)
    {
        $user = User::findOrFail($id);
        $newPassword = Str::random(10);
        $user->password = Hash::make($newPassword);
        $user->save();

        Mail::raw("Your new password is: {$newPassword}", function ($message) use ($user) {
            $message->to($user->email)->subject('Your password has been reset');
        });

        return back()->with('success', "Password reset successfully for {$user->name}. A new password has been sent to their email.");
    }

    public function toggleStatus(Request $request, $id)
    {
        
        $user = User::findOrFail($id);
        $status = $request->input('status');

        if (!in_array($status, ['active', 'suspended'])) {
            return back()->with('error', 'Invalid status value.');
        }

        $user->status = $status;
        $user->save();

        return back()->with('success', "User has been {$status}.");
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('admin.users')->with('success', 'User deleted successfully.');
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|in:admin,staff,tourist',
        ]);

        $user->update($request->only(['name', 'email', 'role']));

        return redirect()->route('admin.users')->with('success', 'User updated successfully.');
    }
}
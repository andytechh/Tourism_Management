<?php

namespace App\Http\Controllers;
use App\Models\Booking;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;


class UsersManagmentController extends Controller
{
    public function index(){
        $tourist_all = User::withCount('bookings')->get(['id', 'name', 'email', 'role', 'status', 'last_login_at', 'created_at']);

        
        $tourist = User::where('role', 'toursit')->count();

        $bookings = Booking::with(['user', 'destination'])->orderBy('created_at', 'asc')->get();

        $bookings = Booking::with(['user', 'destination'])->orderBy('created_at', 'asc')->get();

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

    public function resetPassword($id)
{
    $user = User::findOrFail($id);

    // Generate a new random password
    $newPassword = Str::random(10);

    // Hash and update
    $user->password = Hash::make($newPassword);
    $user->save();

    Mail::raw("Your new password is: {$newPassword}", function ($message) use ($user) {
        $message->to($user->email)
                ->subject('Your password has been reset');
    });

    return back()->with('success', "Password reset successfully for {$user->name}. A new password has been sent to their email.");
}

    public function toggleStatus(Request $request, $id){
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

}

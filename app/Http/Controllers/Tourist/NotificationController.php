<?php

namespace App\Http\Controllers\Tourist;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{

    
   public function notifications()
{
  /** @var \App\Models\User $user */
$user = Auth::user();

$notifications = $user->notifications()->get();
    if (!$user) {
        return inertia('Tourist/Notifications', ['notifications' => []]);
    }

    $notifications = $user->notifications()
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(fn ($n) => [
            'id' => $n->id,
            'type' => $n->data['type'] ?? 'update',
            'title' => $n->data['title'] ?? 'No title',
            'message' => $n->data['message'] ?? 'No message',
            'timestamp' => $n->created_at->diffForHumans(),
            'read' => $n->read_at !== null,
        ])
        ->values();

    return inertia('Tourist/Notifications', [
        'notifications' => $notifications,
    ]);
}
    public function deleteNotification($notificationId)
    {
     /** @var \App\Models\User $user */
     $user = Auth::user();
    
     $notification = $user->notifications()->where('id', $notificationId)->first();
    
     if ($notification) {
          $notification->delete();
          return back()->with('success', 'Notification deleted');
     }
    
     return back()->with('success', 'Notification not found');
    }

    public function markAllAsRead()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $user->unreadNotifications->markAsRead();

        return back()->with('success', 'All notifications marked as read');
    }
    public function markAsRead($notificationId)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $notification = $user->notifications()->where('id', $notificationId)->first();

        if ($notification && is_null($notification->read_at)) {
            $notification->markAsRead();
            return back()->with('success', 'Notification marked as read');
        }

        return back()->with('success', 'Notification not found or already read');
    }
}
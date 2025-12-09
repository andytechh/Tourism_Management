<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth; 

class Destinations extends Model
{
    protected $fillable = ['name', 'category', 'location', 'price', 'rating', 'bookings', 'status', 'description', 'image', 'package_options', 'guests_min', 'guests_max', 'duration',];
    
    protected $casts = [
    'package_options' => 'array',
  ];
    
    public function bookings()
    {
        return $this->hasMany(Booking::class, 'destination_id');
    }
 public function isInWishlist()
    {
        if (!Auth::check()) {
            return false;
        }
        
        // Specify the correct foreign key in the relationship
        return $this->wishlists()->where('user_id', Auth::id())->exists();
    }

    public function wishlists()
    {
        // Specify the correct foreign key column name
        return $this->hasMany(\App\Models\Wishlist::class, 'destination_id');
    }
    public function reviews()
{
    return $this->hasMany(Review::class);
}
}

   
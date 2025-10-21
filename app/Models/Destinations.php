<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}

   
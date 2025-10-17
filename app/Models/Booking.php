<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'tourist_id',
        'destination_id',
        'booking_date',
        'booking_time',
        'adults',
        'children',
        'total_price',
        'status',
        'first_name',
        'last_name',
        'email',
        'phone',
        'nationality',
        'special_requests',
        'payment_method', 
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'tourist_id');
    }

    public function destination()
    {
        return $this->belongsTo(Destinations::class);
    }
}

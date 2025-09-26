<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Destinations extends Model
{
    protected $fillable = ['name', 'category', 'location', 'price', 'rating', 'bookings', 'status', 'description', 'image'];
}

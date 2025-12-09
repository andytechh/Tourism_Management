<?php

namespace App\Models;
use App\Models\Booking;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use App\Models\Destinations;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, TwoFactorAuthenticatable;
    use Notifiable;
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
        'last_login_at',
    ];
     protected $casts = [
        'last_login_at' => 'datetime',
    ];

    // Relationship to tourist

    // Relationship to bookings (through tourist)
    public function bookings()
{
    return $this->hasMany(Booking::class, 'tourist_id');
}
// Add this method to your User model
public function wishlistDestinations()
{
    return $this->belongsToMany(Destinations::class, 'wishlists');
}

    /** 
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}

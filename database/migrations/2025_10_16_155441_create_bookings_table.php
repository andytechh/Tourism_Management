<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up(): void
{
    Schema::create('bookings', function (Blueprint $table) {
        $table->id();
        $table->foreignId('tourist_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('destination_id')->constrained('destinations')->onDelete('cascade');
        $table->date('booking_date');
        $table->string('booking_time');
        $table->integer('adults');
        $table->integer('children')->default(0);
        $table->decimal('total_price', 10, 2);
        $table->string('status')->default('Pending');
        $table->string('first_name');
        $table->string('last_name');
        $table->string('email');
        $table->string('phone');
        $table->string('nationality')->nullable();
        $table->text('special_requests')->nullable();
        $table->string('payment_method')->default('gcash');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};

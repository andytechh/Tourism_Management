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
        Schema::create('destinations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('category', ['marine', 'nature', 'cultural', 'whaleshark', 'adventure'])->default(('whaleshark'));
            $table->string('location');
            $table->decimal('price', 10, 2); 
            $table->float('rating')->nullable();
            $table->integer('bookings')->default(0);;
            $table->enum('status', ['active', 'inactive', 'draft',])->default('active') ;
            $table->string('image');
            $table->set('package_options', ['individual ', 'group ', 'private ', 'family '])->default('individual');
            $table->string('guests_count')->default(   1);
            $table->string('duration')->default('3 hours');
            $table->time('booking_time');
            $table->string('description');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('destinations');
    }
};

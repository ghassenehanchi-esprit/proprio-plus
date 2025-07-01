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
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->decimal('price', 15, 2);
            $table->decimal('surface', 8, 2);
            $table->integer('rooms');
            $table->integer('bedrooms')->nullable();
            $table->integer('bathrooms')->nullable();
            $table->integer('floor')->nullable();
            $table->integer('total_floors')->nullable();
            $table->integer('year_built')->nullable();
            $table->string('heating')->nullable();
            $table->boolean('has_garden')->default(false);
            $table->boolean('has_terrace')->default(false);
            $table->boolean('has_parking')->default(false);
            $table->string('city');
            $table->string('postal_code');
            $table->string('address')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('status')->default('active');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};

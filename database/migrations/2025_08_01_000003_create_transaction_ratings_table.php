<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('transaction_ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained()->onDelete('cascade');
            $table->foreignId('offer_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('rater_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('rated_id')->constrained('users')->onDelete('cascade');
            $table->unsignedTinyInteger('communication');
            $table->unsignedTinyInteger('punctuality');
            $table->unsignedTinyInteger('professionalism');
            $table->text('comment')->nullable();
            $table->timestamps();
            $table->unique(['listing_id','rater_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaction_ratings');
    }
};

<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('visits', function (Blueprint $table) {
            $table->timestamp('buyer_confirmed_at')->nullable()->after('mode');
            $table->timestamp('seller_confirmed_at')->nullable()->after('buyer_confirmed_at');
            $table->text('seller_comment')->nullable()->after('seller_confirmed_at');
        });
    }

    public function down(): void
    {
        Schema::table('visits', function (Blueprint $table) {
            $table->dropColumn(['buyer_confirmed_at', 'seller_confirmed_at', 'seller_comment']);
        });
    }
};

<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->foreignId('conversation_id')->nullable()->after('reported_user_id')->constrained()->onDelete('cascade');
            $table->dropColumn('reported_listing_id');
            $table->dropColumn('type');
        });
    }

    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropForeign(['conversation_id']);
            $table->dropColumn('conversation_id');
            $table->foreignId('reported_listing_id')->nullable();
            $table->string('type');
        });
    }
};

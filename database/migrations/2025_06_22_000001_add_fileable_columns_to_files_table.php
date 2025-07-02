<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('files', function (Blueprint $table) {
            $table->unsignedBigInteger('fileable_id')->nullable()->after('id');
            $table->string('fileable_type')->nullable()->after('fileable_id');
            $table->index(['fileable_id', 'fileable_type']);
        });
    }

    public function down(): void
    {
        Schema::table('files', function (Blueprint $table) {
            $table->dropIndex(['fileable_id', 'fileable_type']);
            $table->dropColumn(['fileable_id', 'fileable_type']);
        });
    }
};

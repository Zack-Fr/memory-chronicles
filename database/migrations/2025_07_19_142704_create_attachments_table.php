<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attachments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('capsule_id')
                ->constrained()
                ->onDelete('cascade');

            // location | image | audio | other
            $table->enum('type', ['location','image','audio']);

            // path on disk where the Base64‐decoded file lives
            $table->string('path')->nullable();

            // only for type = location
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attachments');
    }
};

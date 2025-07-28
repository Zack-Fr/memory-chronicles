<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
    {
        Schema::create('attachments', function (Blueprint $table) {
            $table->id();

            // FK to capsules
            $table->foreignId('capsule_id')
                ->constrained()
                ->cascadeOnDelete();

            // location | image | audio
            $table->enum('type', ['location', 'image', 'audio']);

            // filesystem path (null for location-only attachments)
            $table->string('path')->nullable();

            // for location attachments
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('attachments');
    }
};
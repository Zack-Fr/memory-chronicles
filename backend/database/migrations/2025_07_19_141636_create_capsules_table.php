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
        Schema::create('capsules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                    ->constrained()
                    ->onDelete('cascade')->nullable();

            $table->string('title');
            $table->text('body');
            $table->timestamp('reveal_at');

            $table->enum('mood',['happy','sad','neutral']);

            $table->enum('privacy', ['private', 'public']);
            //draft flag
            $table->boolean('is_draft')->default(false);
            // Filled in by reverse-geocode
            $table->string('country_code', 2)->nullable();
            //record ip
            $table->ipAddress('ip_address');

            // Indexes for common filters
            $table->index('reveal_at');
            $table->index('privacy');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('capsules');
    }
};

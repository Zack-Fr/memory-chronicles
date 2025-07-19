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
                    ->onDelete('cascade');

            $table->string('title');
            $table->text('body');
            $table->timestamp('reveal_at');

            $table->enum('mood',['happy','sad','neutral'])
                ->default('neutral');

            $table->enum('privacy', ['private', 'public'])
                ->default('private');

            $table->text('tags')->nullable();
            $table->string('ip_address', 45);

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

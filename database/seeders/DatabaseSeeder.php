<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Attachment;
use App\Models\Capsule;
use Database\Factories\CapsuleFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        // in DatabaseSeeder or your CapsuleSeeder:
        User::factory(10)->has(
        Capsule::factory()
        ->count(5)
        ->has(Attachment::factory()->count(3))
    )
    ->create();
    }

}

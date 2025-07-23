<?php

namespace Database\Factories;

use App\Models\Capsule;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Carbon\Carbon;

class CapsuleFactory extends Factory
{
    protected $model = Capsule::class;

    public function definition(): array
    {
        // Pick a random reveal date between 30 days ago and 30 days from now
        $reveal = $this->faker->dateTimeBetween('-30 days', '+30 days');

        return [
            'user_id'      => User::factory(),
            'title'        => $this->faker->sentence(4),
            'body'         => $this->faker->realText(250),//change latin to english
            'reveal_at'    => Carbon::instance($reveal),
            'mood'         => $this->faker->randomElement(['happy', 'neutral', 'sad']),
            'privacy'      => $this->faker->randomElement(['private', 'public']),
            'is_draft'     => false,
            'country_code' => $this->faker->countryCode,
            'ip_address'   => $this->faker->ipv4,
        ];
    }

    /**
     * State for a draft capsule (no reveal date yet).
     */
    public function draft(): self
    {
        return $this->state(fn(array $attrs) => [
            'reveal_at' => null,
            'is_draft'  => true,
        ]);
    }
}


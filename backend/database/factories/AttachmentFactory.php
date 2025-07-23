<?php

namespace Database\Factories;

use App\Models\Attachment;
use App\Models\Capsule;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class AttachmentFactory extends Factory
{
    protected $model = Attachment::class;

    public function definition(): array
    {
        $type = $this->faker->randomElement(['location', 'image', 'audio']);

        return [
            // Associate with a random capsule
            'capsule_id' => Capsule::factory(),

            'type' => $type,

            // For location attachments, supply coords; else path to a dummy file
            'latitude'  => $type === 'location' ? $this->faker->latitude  : null,
            'longitude' => $type === 'location' ? $this->faker->longitude : null,

            'path' => $type === 'location'
                ? null
                : 'capsules/seed/' . Str::random(10)
                . ($type === 'image' ? '.jpg' : '.mp3'),
        ];
    }
}

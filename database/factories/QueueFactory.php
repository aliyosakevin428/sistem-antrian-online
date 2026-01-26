<?php

namespace Database\Factories;

use App\Models\Queue;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

class QueueFactory extends Factory
{
    protected $model = Queue::class;

    public function definition(): array
    {
        $service = Service::inRandomOrder()->first();

        return [
            'service_id' => $service->id ?? Service::factory(),
            'queue_number' => 'Q' . str_pad(fake()->numberBetween(1, 200), 3, '0', STR_PAD_LEFT),
            'status' => fake()->randomElement(['waiting', 'in_progress', 'finished', 'skipped']),
            'queue_date' => fake()->date(),
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\QueueCall;
use App\Models\Queue;
use App\Models\User;
use App\Models\Counter;
use Illuminate\Database\Eloquent\Factories\Factory;

class QueueCallFactory extends Factory
{
    protected $model = QueueCall::class;

    public function definition(): array
    {
        return [
            'queue_id' => Queue::inRandomOrder()->value('id'),
            'user_id' => User::inRandomOrder()->value('id'),
            'counter_id' => Counter::inRandomOrder()->value('id'),

            'called_at' => now(),
            'finished_at' => fake()->optional()->dateTimeBetween('-1 hour', 'now'),

            'notes' => fake()->optional()->sentence(),
            'call_number' => fake()->numberBetween(1, 3),
        ];
    }
}

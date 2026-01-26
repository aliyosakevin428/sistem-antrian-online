<?php

namespace Database\Factories;

use App\Models\Counter;

use Illuminate\Database\Eloquent\Factories\Factory;

class CounterFactory extends Factory
{
    protected $model = Counter::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement(['Loket A', 'Loket B', 'Loket C', 'Loket D']),
            'is_active' => $this->faker->boolean(90),
        ];
    }
}

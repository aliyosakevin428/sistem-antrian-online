<?php

namespace Database\Factories;

use App\Models\QueueSetting;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

class QueueSettingFactory extends Factory
{
    protected $model = QueueSetting::class;

    public function definition(): array
    {
        return [
            'service_id' => Service::query()->pluck('id')->random(),
            'prefix' => strtoupper($this->faker->lexify('??')),
            'start_number' => 1,
            'max_queue' => $this->faker->numberBetween(50, 200),
            'reset_daily' => $this->faker->boolean(),
        ];
    }
}

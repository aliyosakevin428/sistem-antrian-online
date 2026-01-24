<?php

namespace Database\Factories;

use App\Models\Service;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ServiceFactory extends Factory
{
    protected $model = Service::class;

    public function definition(): array
    {
        $name = $this->faker->randomElement([
                'Customer Service',
                'Teller',
                'Pembukaan Rekening',
                'Konsultasi',
                'Administrasi'
            ]);

        return [
            'name' => $name,
            'code' => Str::upper(Str::substr($name, 0, 3)) . $this->faker->unique()->numberBetween(1, 99),
            'is_active' => true,
        ];
    }
}

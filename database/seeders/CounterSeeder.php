<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Counter;

class CounterSeeder extends Seeder
{
    public function run(): void
    {
        Counter::factory()->count(4)->create();
    }
}

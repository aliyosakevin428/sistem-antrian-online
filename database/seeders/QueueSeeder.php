<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Queue;

class QueueSeeder extends Seeder
{
    public function run(): void
    {
        Queue::factory()->count(40)->create();
    }
}

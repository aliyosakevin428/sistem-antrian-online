<?php

namespace Database\Seeders;

use App\Models\QueueCall;
use Illuminate\Database\Seeder;

class QueueCallsSeeder extends Seeder
{
    public function run(): void
    {
        QueueCall::factory()->count(10)->create();
    }
}

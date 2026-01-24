<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;
use App\Models\QueueSetting;

class QueueSettingSeeder extends Seeder
{
    public function run(): void
    {
        $services = Service::all();

        foreach ($services as $service) {
            QueueSetting::factory()->create([
                'service_id' => $service->id,
            ]);
        }
    }
}

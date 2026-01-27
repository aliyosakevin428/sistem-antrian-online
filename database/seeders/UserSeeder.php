<?php

namespace Database\Seeders;

use App\Models\Counter;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superadmin = User::updateOrCreate([
            'name' => 'Super administrator',
            'email' => 'admin@gmail.com',
        ],[
            'password' => 'password',
            'counter_id' => null,
        ]);
        $superadmin->assignRole('superadmin');

        $counters = Counter::get();

        User::factory(5)->create()->each(function ($user) use ($counters) {
            $user->update([
                'counter_id' => $counters->random()->id ?? null,
            ]);

            $user->assignRole('user');
        });
    }
}

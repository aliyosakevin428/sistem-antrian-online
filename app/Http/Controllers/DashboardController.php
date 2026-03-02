<?php

namespace App\Http\Controllers;

use App\Models\Counter;
use App\Models\Queue;
use App\Models\QueueCall;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $counterData = null;
        $currentCall = null;
        $waitingCount = 0;

        if ($user->counter_id) {
            $counter = Counter::with('services')->find($user->counter_id);

            if ($counter) {
                $currentCall = QueueCall::with('queue')
                    ->where('counter_id', $counter->id)
                    ->whereNull('finished_at')
                    ->latest()
                    ->first();

                $waitingCount = Queue::whereIn(
                        'service_id',
                        $counter->services->pluck('id')
                    )
                    ->where('status', 'waiting')
                    ->count();
                }

                $todayServed = QueueCall::where('counter_id', $counter->id)
                    ->whereDate('created_at', today())
                    ->count();

                $counterData = [
                    'id' => $counter->id,
                    'name' => $counter->name,
                    'is_active' => $counter->is_active,
                    'waiting' => $waitingCount,
                    'today_served' => $todayServed,
                    'operational_started_at' => $counter->operational_started_at,
                    'break_started_at' => $counter->break_started_at,
                ];
        }

        return Inertia::render('dashboard/index', [
            'counter' => $counterData,
            'currentCall' => $currentCall,
            'waitingCount' => $waitingCount,
        ]);
    }

    public function documentation()
    {
        return Inertia::render('dashboard/documentation', [
            'title' => 'App documentation',
            'content' => file_get_contents(base_path('README.md')),
        ]);
    }


}

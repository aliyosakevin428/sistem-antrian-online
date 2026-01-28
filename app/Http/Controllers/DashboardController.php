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

        $counter = null;
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
        }

        return Inertia::render('dashboard/index', [
            'counter' => $counter,
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

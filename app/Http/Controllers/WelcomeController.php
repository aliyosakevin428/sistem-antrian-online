<?php

namespace App\Http\Controllers;

use App\Http\Middleware\WithLandingPageMiddleware;
use App\Models\Queue;
use App\Models\QueueCall;
use App\Models\QueueSetting;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Illuminate\Routing\Controller as BaseController;

class WelcomeController extends BaseController
{
    public function __construct()
    {
        $this->middleware(WithLandingPageMiddleware::class);
    }

    public function index()
    {
        $activeCalls = QueueCall::with(['queue', 'counter'])
            ->whereNull('finished_at')
            ->orderByDesc('updated_at')
            ->get();

        $recentCalls = QueueCall::with(['queue', 'counter'])
            ->whereNotNull('finished_at')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('welcome/index', [
            'activeCalls' => $activeCalls,
            'recentCalls' => $recentCalls,
        ]);
    }

    public function about()
    {
        return Inertia::render('welcome/about', [
            'content' => file_get_contents(base_path('README.md')),
        ]);
    }

    public function takeQueue()
    {
        return Inertia::render('welcome/take-queue', [
            'services' =>Service::get(),
        ]);
    }

    public function storeQueue(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
        ]);

        $serviceId = $request->service_id;
        $today = Carbon::today();

        $setting = QueueSetting::where('service_id', $serviceId)->firstOrFail();

        $countToday = Queue::where('service_id', $serviceId)
            ->whereDate('queue_date', $today)
            ->count();

        $number = $setting->start_number + $countToday;

        $queueNumber = $setting->prefix . str_pad($number, 3, '0', STR_PAD_LEFT);

        $queue = Queue::create([
            'service_id' => $serviceId,
            'queue_number' => $queueNumber,
            'queue_date' => $today,
            'status' => 'waiting',
        ]);

        return back()->with('success_queue', [
            'queue_number' => $queue->queue_number,
            'service_name' => $queue->service->name,
            'taken_at' => now()->format('d M Y H:i'),
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQueueRequest;
use App\Http\Requests\UpdateQueueRequest;
use App\Http\Requests\BulkUpdateQueueRequest;
use App\Http\Requests\BulkDeleteQueueRequest;
use App\Models\Queue;
use App\Models\QueueSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;


class QueueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->pass("index queue");

        $data = Queue::query()
            ->with(['service'])
            ->when($request->queue_number, function($q, $v){
                $q->where('queue_number', $v);
            });

        return Inertia::render('queue/index', [
            'queues' => $data->get(),
            'query' => $request->input(),
            'permissions' => [
                'canAdd' => $this->user->can("create queue"),
                'canShow' => $this->user->can("show queue"),
                'canUpdate' => $this->user->can("update queue"),
                'canDelete' => $this->user->can("delete queue"),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreQueueRequest $request)
    {
        $this->pass("create queue");

        return DB::transaction(function () use ($request) {
            $serviceId = $request->service_id;

            $setting = QueueSetting::where('service_id', $serviceId)
                ->lockForUpdate()
                ->first();

            if (!$setting) {
                return back()->withErrors([
                    'service_id' => 'Queue setting not found for the selected service.'
                ]);
            }

            $today = Carbon::today();

            $lastQueueQuery = Queue::where('service_id', $serviceId)
                ->lockForUpdate()
                ->orderByDesc('id');

            if ($setting->reset_daily) {
                $lastQueueQuery->whereDate('queue_date', $today);
            }

            $lastQueue = $lastQueueQuery->first();

            if ($lastQueue) {
                $lastNumber = (int) filter_var($lastQueue->queue_number, FILTER_SANITIZE_NUMBER_INT);
                $nextNumber = $lastNumber + 1;
            } else {
                $nextNumber = $setting->start_number;
            }

            if ($setting->max_per_day && $nextNumber > $setting->max_per_day) {
                return back()->withErrors([
                    'limit' => 'Maximum number of queues reached for today.'
                ]);
            }

            $formattedNumber = str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

            $queueNumber = $setting->prefix . $formattedNumber;

            return Queue::create([
                'service_id'=> $serviceId,
                'queue_number' => $queueNumber,
                'queue_date' => $today,
                'status' => 'waiting',
            ]);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(Queue $queue)
    {
        $this->pass("show queue");

        return Inertia::render('queue/show', [
            'queue' => $queue,
            'permissions' => [
                'canUpdate' => $this->user->can("update queue"),
                'canDelete' => $this->user->can("delete queue"),
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateQueueRequest $request, Queue $queue)
    {
        $this->pass("update queue");

        $data = $request->validated();
        $queue->update($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Queue $queue)
    {
        $this->pass("delete queue");

        $queue->delete();
    }

    /**
     * BulkUpdate the specified resource from storage.
     */
    public function bulkUpdate(BulkUpdateQueueRequest $request)
    {
        $this->pass("update queue");

        $data = $request->validated();
        $ids = $data['queue_ids'];
        unset($data['queue_ids']);

        Queue::whereIn('id', $ids)->update($data);
    }

    /**
     * BulkDelete the specified resource from storage.
     */
    public function bulkDelete(BulkDeleteQueueRequest $request)
    {
        $this->pass("delete queue");

        $data = $request->validated();
        Queue::whereIn('id', $data['queue_ids'])->delete();
    }




}

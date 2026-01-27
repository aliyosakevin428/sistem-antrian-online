<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQueueCallsRequest;
use App\Http\Requests\UpdateQueueCallsRequest;
use App\Http\Requests\BulkUpdateQueueCallsRequest;
use App\Http\Requests\BulkDeleteQueueCallsRequest;
use App\Models\Counter;
use App\Models\Queue;
use App\Models\QueueCall;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;


class QueueCallsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->pass("index queueCalls");

        $data = QueueCall::query()
            ->with(['queue.service', 'user', 'counter'])
            ->when($request->counter_id, function ($q, $v) {
                $q->where('counter_id', $v);
            })
            ->when($request->date, function ($q, $v) {
                $q->whereDate('created_at', $v);
            });


        return Inertia::render('queue_calls/index', [
            'queue_calls' => $data->get(),
            'counters' => Counter::select( 'id','name')->get(),
            'users' => User::select( 'id','name')->get(),
            'query' => $request->input(),
            'permissions' => [
                'canAdd' => $this->user->can("create queueCalls"),
                'canShow' => $this->user->can("show queueCalls"),
                'canUpdate' => $this->user->can("update queueCalls"),
                'canDelete' => $this->user->can("delete queueCalls"),
            ]
        ]);
    }

    /**
     * Call the next queue number for a counter.
     */
    public function callNext(Request $request)
    {
        return DB::transaction(function () use ($request) {

        $user = auth()->user();
        $counter = Counter::with('services')->findOrFail($request->counter_id);

        $serviceIds = $counter->services->pluck('id');

        $queue = Queue::whereIn('service_id', $serviceIds)
            ->where('status', 'waiting')
            ->lockForUpdate()
            ->orderBy('created_at')
            ->first();

        if (!$queue) {
            return back()->withErrors(['message' => 'Tidak ada antrian']);
        }

        $queue->update([
            'status' => 'in_progress'
        ]);

        QueueCall::create([
            'queue_id' => $queue->id,
            'user_id' => $user->id,
            'counter_id' => $counter->id,
            'called_at' => now(),
            'call_number' => 1,
        ]);

        return back()->with('success', 'Antrian dipanggil');;
        });
    }

    /**
     * Mark the specified queue call as finished.
     */
    public function finish(QueueCall $queueCall)
    {
        $queueCall->update([
            'finished_at' => now()
        ]);

        $queueCall->queue->update([
            'status' => 'done'
        ]);

        if ($queueCall->finished_at) {
            return back()->withErrors(['message' => 'Antrian sudah selesai']);
        }

        return back()->with('success', 'Antrian selesai');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(QueueCall $queueCalls)
    {
        $this->pass("delete queueCalls");

        $queueCalls->delete();
    }

    /**
     * BulkUpdate the specified resource from storage.
     */
    public function bulkUpdate(BulkUpdateQueueCallsRequest $request)
    {
        $this->pass("update queueCalls");

        $data = $request->validated();
        $ids = $data['queue_calls_ids'];
        unset($data['queueCalls_ids']);

        QueueCall::whereIn('id', $ids)->update($data);
    }

    /**
     * BulkDelete the specified resource from storage.
     */
    public function bulkDelete(BulkDeleteQueueCallsRequest $request)
    {
        $this->pass("delete queueCalls");

        $data = $request->validated();
        QueueCall::whereIn('id', $data['queue_calls_ids'])->delete();
    }




}

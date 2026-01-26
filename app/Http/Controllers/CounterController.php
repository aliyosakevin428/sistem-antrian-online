<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCounterRequest;
use App\Http\Requests\UpdateCounterRequest;
use App\Http\Requests\BulkUpdateCounterRequest;
use App\Http\Requests\BulkDeleteCounterRequest;
use App\Models\Counter;
use Illuminate\Http\Request;
use Inertia\Inertia;


class CounterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->pass("index counter");

        $data = Counter::query()
            // ->with(['services'])
            ->when($request->name, function($q, $v){
                $q->where('name', $v);
            });

        return Inertia::render('counter/index', [
            'counters' => $data->get(),
            'query' => $request->input(),
            'permissions' => [
                'canAdd' => $this->user->can("create counter"),
                'canShow' => $this->user->can("show counter"),
                'canUpdate' => $this->user->can("update counter"),
                'canDelete' => $this->user->can("delete counter"),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCounterRequest $request)
    {
        $this->pass("create counter");

        $data = $request->validated();
        Counter::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(Counter $counter)
    {
        $this->pass("show counter");

        return Inertia::render('counter/show', [
            'counter' => $counter,
            'permissions' => [
                'canUpdate' => $this->user->can("update counter"),
                'canDelete' => $this->user->can("delete counter"),
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCounterRequest $request, Counter $counter)
    {
        $this->pass("update counter");

        $data = $request->validated();
        $counter->update($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Counter $counter)
    {
        $this->pass("delete counter");

        $counter->delete();
    }

    /**
     * BulkUpdate the specified resource from storage.
     */
    public function bulkUpdate(BulkUpdateCounterRequest $request)
    {
        $this->pass("update counter");

        $data = $request->validated();
        $ids = $data['counter_ids'];
        unset($data['counter_ids']);

        Counter::whereIn('id', $ids)->update($data);
    }

    /**
     * BulkDelete the specified resource from storage.
     */
    public function bulkDelete(BulkDeleteCounterRequest $request)
    {
        $this->pass("delete counter");

        $data = $request->validated();
        Counter::whereIn('id', $data['counter_ids'])->delete();
    }

    /**
     * View archived resource from storage.
     */
    public function archived()
    {
        $this->pass("archived counter");

        return Inertia::render('counter/archived', [
            'counters' => Counter::onlyTrashed()->get(),
        ]);
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore($id)
    {
        $this->pass("restore counter");

        $model = Counter::onlyTrashed()->findOrFail($id);
        $model->restore();
    }

    /**
     * Force delete the specified resource from storage.
     */
    public function forceDelete($id)
    {
        $this->pass("force delete counter");

        $model = Counter::onlyTrashed()->findOrFail($id);
        $model->forceDelete();
    }


}

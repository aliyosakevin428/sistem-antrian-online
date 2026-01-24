<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQueueSettingRequest;
use App\Http\Requests\UpdateQueueSettingRequest;
use App\Http\Requests\BulkUpdateQueueSettingRequest;
use App\Http\Requests\BulkDeleteQueueSettingRequest;
use App\Models\QueueSetting;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;


class QueueSettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->pass("index queueSetting");

        $data = QueueSetting::query()
            ->with(['service'])
            ->when($request->name, function($q, $v){
                $q->where('name', $v);
            });

        return Inertia::render('queue_setting/index', [
            'queue_settings' => $data->get(),
            'services' => Service::select( 'id','name')->get(),
            'query' => $request->input(),
            'permissions' => [
                'canAdd' => $this->user->can("create queueSetting"),
                'canShow' => $this->user->can("show queueSetting"),
                'canUpdate' => $this->user->can("update queueSetting"),
                'canDelete' => $this->user->can("delete queueSetting"),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreQueueSettingRequest $request)
    {
        $this->pass("create queueSetting");

        $data = $request->validated();
        QueueSetting::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(QueueSetting $queueSetting)
    {
        $this->pass("show queueSetting");

        return Inertia::render('queueSetting/show', [
            'queueSetting' => $queueSetting,
            'permissions' => [
                'canUpdate' => $this->user->can("update queueSetting"),
                'canDelete' => $this->user->can("delete queueSetting"),
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateQueueSettingRequest $request, QueueSetting $queueSetting)
    {
        $this->pass("update queueSetting");

        $data = $request->validated();
        $queueSetting->update($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(QueueSetting $queueSetting)
    {
        $this->pass("delete queueSetting");

        $queueSetting->delete();
    }

    /**
     * BulkUpdate the specified resource from storage.
     */
    public function bulkUpdate(BulkUpdateQueueSettingRequest $request)
    {
        $this->pass("update queueSetting");

        $data = $request->validated();
        $ids = $data['queueSetting_ids'];
        unset($data['queueSetting_ids']);

        QueueSetting::whereIn('id', $ids)->update($data);
    }

    /**
     * BulkDelete the specified resource from storage.
     */
    public function bulkDelete(BulkDeleteQueueSettingRequest $request)
    {
        $this->pass("delete queueSetting");

        $data = $request->validated();
        QueueSetting::whereIn('id', $data['queueSetting_ids'])->delete();
    }




}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Http\Requests\BulkUpdateServiceRequest;
use App\Http\Requests\BulkDeleteServiceRequest;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;


class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->pass("index service");
        
        $data = Service::query()
            //->with(['media'])
            ->when($request->name, function($q, $v){
                $q->where('name', $v);
            });

        return Inertia::render('service/index', [
            'services' => $data->get(),
            'query' => $request->input(),
            'permissions' => [
                'canAdd' => $this->user->can("create service"),
                'canShow' => $this->user->can("show service"),
                'canUpdate' => $this->user->can("update service"),
                'canDelete' => $this->user->can("delete service"),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreServiceRequest $request)
    {
        $this->pass("create service");

        $data = $request->validated();
        Service::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(Service $service)
    {
        $this->pass("show service");

        return Inertia::render('service/show', [
            'service' => $service,
            'permissions' => [
                'canUpdate' => $this->user->can("update service"),
                'canDelete' => $this->user->can("delete service"),
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateServiceRequest $request, Service $service)
    {
        $this->pass("update service");

        $data = $request->validated();
        $service->update($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service)
    {
        $this->pass("delete service");

        $service->delete();
    }

    /**
     * BulkUpdate the specified resource from storage.
     */
    public function bulkUpdate(BulkUpdateServiceRequest $request)
    {
        $this->pass("update service");

        $data = $request->validated();
        $ids = $data['service_ids'];
        unset($data['service_ids']);

        Service::whereIn('id', $ids)->update($data);
    }

    /**
     * BulkDelete the specified resource from storage.
     */
    public function bulkDelete(BulkDeleteServiceRequest $request)
    {
        $this->pass("delete service");

        $data = $request->validated();
        Service::whereIn('id', $data['service_ids'])->delete();
    }

    /**
     * View archived resource from storage.
     */
    public function archived()
    {
        $this->pass("archived service");

        return Inertia::render('service/archived', [
            'services' => Service::onlyTrashed()->get(),
        ]);
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore($id)
    {
        $this->pass("restore service");

        $model = Service::onlyTrashed()->findOrFail($id);
        $model->restore();
    }

    /**
     * Force delete the specified resource from storage.
     */
    public function forceDelete($id)
    {
        $this->pass("force delete service");

        $model = Service::onlyTrashed()->findOrFail($id);
        $model->forceDelete();
    }
    
    
}

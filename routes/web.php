<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\QueueSettingController;
use App\Http\Controllers\QueueController;
use App\Http\Controllers\CounterController;
use App\Http\Controllers\QueueCallsController;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [WelcomeController::class, 'index'])->name('home');
Route::get('/about', [WelcomeController::class, 'about'])->name('about');

Route::get('/ambil-antrian', [WelcomeController::class, 'takeQueue'])->name('queue.take.page');
Route::post('/ambil-antrian', [WelcomeController::class, 'storeQueue'])->name('queue.take');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('documentation', [DashboardController::class, 'documentation'])->name('documentation');

    Route::post('user/{user}/upload-media', [UserController::class, 'uploadMedia'])->name('user.upload-media');
    Route::put('user/bulk', [UserController::class, 'bulkUpdate'])->name('user.bulk.update');
    Route::delete('user/bulk', [UserController::class, 'bulkDelete'])->name('user.bulk.destroy');
    Route::get('user/archived', [UserController::class, 'archived'])->name('user.archived');
    Route::put('user/{user}/restore', [UserController::class, 'restore'])->name('user.restore');
    Route::delete('user/{user}/force-delete', [UserController::class, 'forceDelete'])->name('user.force-delete');
    Route::apiResource('user', UserController::class);

    Route::apiResource('role', RoleController::class);
    Route::post('permission/resync', [PermissionController::class, 'resync'])->name('permission.resync');
    Route::apiResource('permission', PermissionController::class);
    Route::apiResource('doc', MediaController::class);

    Route::put('service/bulk', [ServiceController::class, 'bulkUpdate'])->name('service.bulk.update');
    Route::delete('service/bulk', [ServiceController::class, 'bulkDelete'])->name('service.bulk.destroy');
    Route::get('service/archived', [ServiceController::class, 'archived'])->name('service.archived');
    Route::put('service/{service}/restore', [ServiceController::class, 'restore'])->name('service.restore');
    Route::delete('service/{service}/force-delete', [ServiceController::class, 'forceDelete'])->name('service.force-delete');
    Route::apiResource('service', ServiceController::class);

    Route::put('queueSetting/bulk', [QueueSettingController::class, 'bulkUpdate'])->name('queueSetting.bulk.update');
    Route::delete('queueSetting/bulk', [QueueSettingController::class, 'bulkDelete'])->name('queueSetting.bulk.destroy');
    Route::apiResource('queue-setting', QueueSettingController::class);
    Route::put('queue/bulk', [QueueController::class, 'bulkUpdate'])->name('queue.bulk.update');
    Route::delete('queue/bulk', [QueueController::class, 'bulkDelete'])->name('queue.bulk.destroy');
    Route::apiResource('queue', QueueController::class);

    Route::put('counter/bulk', [CounterController::class, 'bulkUpdate'])->name('counter.bulk.update');
    Route::delete('counter/bulk', [CounterController::class, 'bulkDelete'])->name('counter.bulk.destroy');
    Route::get('counter/archived', [CounterController::class, 'archived'])->name('counter.archived');
    Route::put('counter/{counter}/restore', [CounterController::class, 'restore'])->name('counter.restore');
    Route::delete('counter/{counter}/force-delete', [CounterController::class, 'forceDelete'])->name('counter.force-delete');
    Route::apiResource('counter', CounterController::class);

    Route::put('queue_calls/bulk', [QueueCallsController::class, 'bulkUpdate'])->name('queue_calls.bulk.update');
    Route::delete('queue_calls/bulk', [QueueCallsController::class, 'bulkDelete'])->name('queue_calls.bulk.destroy');
    Route::post('queue_calls/call-next', [QueueCallsController::class, 'callNext'])
    ->name('queue_calls.call_next');
    Route::put('queue_calls/{queueCall}/finish', [QueueCallsController::class, 'finish'])
    ->name('queue_calls.finish');

    Route::apiResource('queue_calls', QueueCallsController::class)->only(['index', 'destroy']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

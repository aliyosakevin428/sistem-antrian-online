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


Route::get('/', [WelcomeController::class, 'index'])->name('home');
Route::get('/about', [WelcomeController::class, 'about'])->name('about');

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
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

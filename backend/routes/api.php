<?php

use App\Http\Controllers\Admin\PlaceController as AdminPlaceController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ItineraryController;
use App\Http\Controllers\PlaceController;
use Illuminate\Support\Facades\Route;

Route::post('register', [AuthController::class, 'register'])->middleware('throttle:10,1');
Route::post('login', [AuthController::class, 'login'])->middleware('throttle:10,1');

Route::get('places', [PlaceController::class, 'index']);
Route::get('places/{place}', [PlaceController::class, 'show'])->whereNumber('place');
Route::get('categories', [CategoryController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('user', [AuthController::class, 'me']);

    Route::apiResource('itineraries', ItineraryController::class);

    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::apiResource('places', AdminPlaceController::class);
        Route::apiResource('users', AdminUserController::class)->only(['index', 'show', 'update', 'destroy']);
    });
});

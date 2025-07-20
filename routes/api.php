<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CapsuleController;

Route::prefix('v1')->group(function () {
    // auth routes...
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/login',    [AuthController::class, 'login']);
    
    Route::middleware('auth:api')->group(function () {
        Route::post('auth/logout',  [AuthController::class, 'logout']);
        Route::post('auth/refresh', [AuthController::class, 'refresh']);
        Route::get ('auth/me',      [AuthController::class, 'me']);

        // Capsule endpoints
        Route::post('create_capsules',        [CapsuleController::class, 'store']);
        Route::get ('capsules/draft',  [CapsuleController::class, 'getDraft']);
        Route::post('capsules/draft',  [CapsuleController::class, 'upsertDraft']);
    });
});



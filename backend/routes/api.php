<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CapsuleController;
use App\Http\Controllers\Api\AttachmentController;
use App\Http\Controllers\Api\CapsuleAttachmentController;

Route::prefix('v1')->group(function () {
    // auth routes...
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/login',    [AuthController::class, 'login']);
    Route::get('capsules/public', [CapsuleController::class, 'publicIndex']);
    
    Route::middleware('auth:api')->group(function () {
        Route::post('auth/logout',  [AuthController::class, 'logout']);
        Route::post('auth/refresh', [AuthController::class, 'refresh']);
        Route::get ('auth/me',      [AuthController::class, 'me']);

        // Capsule endpoints
        Route::get('capsules/{id}/attachments/zip', 
            [CapsuleAttachmentController::class,'downloadZip']);

        Route::get('capsules', [CapsuleController::class, 'index']);
        Route::post('create_capsules',        [CapsuleController::class, 'store']);
        Route::get ('capsules/draft',  [CapsuleController::class, 'getDraft']);
        Route::post('capsules/draft',  [CapsuleController::class, 'upsertDraft']);

        Route::get   ('capsules/{id}',  [CapsuleController::class, 'show']);
        Route::get('attachments/{id}/download', [AttachmentController::class,'download'])->name('attachments.download');
    });
});




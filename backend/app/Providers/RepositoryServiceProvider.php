<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\AuthService;
use App\Services\CapsuleService;
use App\Services\AttachmentService;
use App\Services\AttachmentZipService;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(AuthService::class, function ($app) {
            return new AuthService();
        });
        $this->app->singleton(CapsuleService::class, fn($app) => new CapsuleService());

        $this->app->singleton(AttachmentService::class, fn() => new AttachmentService());

        $this->app->singleton(AttachmentZipService::class, fn()=>new AttachmentZipService());


    }

    public function boot() {}
}

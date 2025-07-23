<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\AuthService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    use ApiResponseTrait;

    public function __construct(protected AuthService $authService)
    {
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register($request->validated());
        return $this->success($result, 'Registration successful', 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->login($request->validated());
            return $this->success($result, 'Login successful');
        } catch (JWTException $e) {
            return $this->error('Could not create token', 500);
        }
    }

    public function logout(): JsonResponse
    {
        $this->authService->logout();
        return $this->success(null, 'Logged out successfully');
    }

    public function refresh(): JsonResponse
    {
        $token = $this->authService->refresh();
        return $this->success(['token' => $token], 'Token refreshed');
    }
    public function me(): JsonResponse
    {
        try {
            $user = $this->authService->me();
            return $this->success(['user' => $user], 'User retrieved');
        } catch (JWTException $e) {
            return $this->error('Token invalid or expired', 401);
        }
    }
}

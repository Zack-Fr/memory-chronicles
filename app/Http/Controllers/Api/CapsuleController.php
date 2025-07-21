<?php

namespace App\Http\Controllers\Api;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Exceptions\CapsuleLockedException;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCapsuleRequest;
use App\Http\Requests\DraftCapsuleRequest;
use App\Services\CapsuleService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class CapsuleController extends Controller
{
    use ApiResponseTrait;

    public function __construct(protected CapsuleService $capsuleService)
    {
        // ensure all methods require auth
        // $this->middleware('auth:api');
    }

    /**
     * Create a new capsule (final submit).
     */
    public function store(StoreCapsuleRequest $request): JsonResponse
    {
        $capsule = $this->capsuleService->create($request->validated());
        return $this->success(['capsule' => $capsule], 'Capsule created', 201);
    }

    /**
     * Fetch the user's current draft (or null).
     */
    public function getDraft(): JsonResponse
    {
        $draft = $this->capsuleService->getDraft();
        return $this->success(['draft' => $draft]);
    }

    /**
     * Create or update the draft capsule.
     */
    public function upsertDraft(DraftCapsuleRequest $request): JsonResponse
    {
        $draft = $this->capsuleService->upsertDraft($request->validated());
        return $this->success(['draft' => $draft], 'Draft saved');
    }
    public function index(): JsonResponse
    {
        $capsules = $this->capsuleService->listForUser();
        return $this->success(['capsules' => $capsules], 'Capsules retrieved');
    }
    public function show($id): JsonResponse
    {
        try {
            $capsule = $this->capsuleService->show((int) $id);
            return $this->success(['capsule' => $capsule], 'Capsule retrieved');
        } catch (ModelNotFoundException) {
            return $this->error('Capsule not found.', 404);
        } catch (CapsuleLockedException $e) {
            return $this->error($e->getMessage(), 403);
        }
    }
}


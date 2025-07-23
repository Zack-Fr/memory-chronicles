<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AttachmentZipService;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CapsuleAttachmentController extends Controller
{
    use ApiResponseTrait;

    public function __construct(protected AttachmentZipService $zipService)
    {
        // $this->middleware('auth:api');
    }

    /**
     * GET /api/v1/capsules/{id}/attachments/zip
     */
    public function downloadZip(int $id)
    {
        try {
            $zipPath = $this->zipService->createZip($id);
            return response()->download($zipPath, basename($zipPath))
                            ->deleteFileAfterSend(true);
        } catch (ModelNotFoundException) {
            return $this->error('Capsule not found.', 404);
        } catch (AccessDeniedHttpException $e) {
            return $this->error($e->getMessage(), 403);
        } catch (NotFoundHttpException $e) {
            return $this->error($e->getMessage(), 404);
        } catch (\Exception $e) {
            return $this->error('Failed to create ZIP.', 500);
        }
    }
}

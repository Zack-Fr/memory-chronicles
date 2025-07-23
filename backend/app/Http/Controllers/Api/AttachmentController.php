<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AttachmentService;
use App\Traits\ApiResponseTrait;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use App\Exceptions\LocationAttachmentException;

use Illuminate\Support\Facades\Storage;


class AttachmentController extends Controller
{
    use ApiResponseTrait;

    public function __construct(protected AttachmentService $attachmentService)
    {
        // $this->middleware('auth:api');
    }

    /**
     * Stream the attachment inline (for <img> / <audio> tags).
     *
     * @param  int  $id
     */
public function download(int $id)
{
    try {
        // Get the attachment
        $attachment = \App\Models\Attachment::findOrFail($id);

        // Throw custom location exception if needed
        if ($attachment->type === 'location') {
            throw new LocationAttachmentException(
                $attachment->latitude,
                $attachment->longitude
            );
        }

        // Return the file using Laravel's Storage facade
        return Storage::disk('local')->download($attachment->path);

    } catch (ModelNotFoundException) {
        return $this->error('Attachment not found.', 404);
    } catch (AccessDeniedHttpException $e) {
        return $this->error($e->getMessage(), 403);
    } catch (NotFoundHttpException $e) {
        return $this->error($e->getMessage(), 404);
    } catch (LocationAttachmentException $e) {
        return response()->json([
            'status'  => 'success',
            'message' => 'Location data',
            'data'    => [
                'type'      => 'location',
                'latitude'  => $e->getLatitude(),
                'longitude' => $e->getLongitude(),
            ],
        ], 200);
    }
}
}

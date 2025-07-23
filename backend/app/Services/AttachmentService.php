<?php

namespace App\Services;

use App\Models\Attachment;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use App\Exceptions\LocationAttachmentException;

class AttachmentService
{
    /**
     * Validate ownership and file existence, then return file info.
     *
     * @param  int  $id
     * @return array{fullPath:string, filename:string, mime:string}
     *
     * @throws ModelNotFoundException       if no such Attachment
     * @throws AccessDeniedHttpException    if user doesn’t own it
     * @throws NotFoundHttpException        if path is null or file missing
     */
    public function getAttachmentPath(int $id): array
    {
            $attachment = Attachment::findOrFail($id);
            \Log::debug('AttachmentService:getAttachmentPath', [
            'id'         => $attachment->id,
            'path_field' => $attachment->path,
    ]);

        
        if ($attachment->type === 'location') {
            throw new LocationAttachmentException(
                $attachment->latitude,
                $attachment->longitude
            );
        }
        
        if (is_null($attachment->path)) {
            \Log::error("Attachment {$id} has null path");
            throw new NotFoundHttpException('No file for this attachment.');
        }
        
        // if (auth()->id() !== $attachment->user_id) {
        //     throw new AccessDeniedHttpException('Unauthorized access to attachment.');
        // }

        // 4) Resolve full disk path
        $fullPath = Storage::disk('local')->path($attachment->path);

        \Log::debug('Resolved fullPath', ['fullPath' => $fullPath]);

        if (! file_exists($fullPath)) {
            \Log::error("File not found on disk at {$fullPath}");
            throw new NotFoundHttpException('File not found on disk.');
        }

        // 5) Determine MIME type
        $mime     = mime_content_type($fullPath) ?: 'application/octet-stream';
        $filename = basename($fullPath);

        return compact('fullPath', 'filename', 'mime');
    }
}

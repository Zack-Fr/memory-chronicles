<?php

namespace App\Services;

use App\Models\Capsule;
use ZipArchive;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\Log;
use Exception;

class AttachmentZipService
{
    /**
     * Build a ZIP of all file‐based attachments for a capsule.
     *
     * @throws AccessDeniedHttpException, NotFoundHttpException, Exception
     */
    public function createZip(int $capsuleId): string
    {
        // 1) Fetch capsule and authorize
        $capsule = Capsule::with('attachments')->findOrFail($capsuleId);
        if (auth()->id() !== $capsule->user_id) {
            throw new AccessDeniedHttpException('Unauthorized');
        }

        // 2) Collect only attachments with actual files
        $paths = $capsule->attachments
            ->pluck('path')
            ->filter()    // drop nulls
            ->toArray();

        if (empty($paths)) {
            throw new NotFoundHttpException('No attachments to zip.');
        }

        // 3) Prepare temp directory
        $tempDir = storage_path('app/temp');
        if (! is_dir($tempDir) && ! mkdir($tempDir, 0755, true) && ! is_dir($tempDir)) {
            throw new Exception("Could not create temp directory at {$tempDir}");
        }

        $zipName = "capsule-{$capsuleId}-attachments.zip";
        $zipPath = "{$tempDir}/{$zipName}";

        // 4) Open the ZIP
        $zip = new ZipArchive();
        $res = $zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE);
        if ($res !== true) {
            Log::error("ZipArchive::open failed", ['code' => $res, 'path' => $zipPath]);
            throw new Exception("ZipArchive::open returned error code {$res} for path {$zipPath}");
        }

        // 5) Add each file
        foreach ($paths as $relPath) {
            $full = Storage::disk('local')->path($relPath);
            if (file_exists($full)) {
                $zip->addFile($full, basename($full));
            } else {
                Log::warning("Skipping missing attachment file", ['path'=>$full]);
            }
        }

        $zip->close();

        // 6) Verify it exists
        if (! file_exists($zipPath)) {
            throw new Exception("ZIP not created at {$zipPath}");
        }

        return $zipPath;
    }
}

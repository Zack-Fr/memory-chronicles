<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use App\Models\Attachment;

class AttachmentController extends Controller
{
    public function download($id): StreamedResponse
    {
        $att = Attachment::findOrFail($id);
        $capsule = $att->capsule;
        // auth check
        if (auth()->id() !== $capsule->user_id) {
            abort(403);
        }
        // stream the file
        $path = storage_path("app/{$att->path}");
        return response()->download($path, $att->filename ?? basename($att->path));
    }
}

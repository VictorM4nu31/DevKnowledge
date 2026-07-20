<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use App\Models\Lesson;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AttachmentController extends Controller
{
    public function store(Request $request, Lesson $lesson): RedirectResponse
    {
        $request->validate([
            'file' => 'required|file|max:10240',
        ]);

        $file = $request->file('file');
        $path = $file->store('attachments', 'local');

        $type = match (true) {
            str_starts_with($file->getMimeType(), 'image/') => 'image',
            $file->getMimeType() === 'application/pdf' => 'pdf',
            str_starts_with($file->getMimeType(), 'audio/') => 'audio',
            str_starts_with($file->getMimeType(), 'video/') => 'video',
            default => 'other',
        };

        $lesson->attachments()->create([
            'filename' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'type' => $type,
        ]);

        return redirect()->back();
    }

    public function destroy(Attachment $attachment): RedirectResponse
    {
        Storage::disk('local')->delete($attachment->path);
        $attachment->delete();

        return redirect()->back();
    }
}

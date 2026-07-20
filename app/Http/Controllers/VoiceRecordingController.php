<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\VoiceRecording;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VoiceRecordingController extends Controller
{
    public function store(Request $request, Lesson $lesson): RedirectResponse
    {
        $request->validate([
            'recording' => 'required|file|mimetypes:audio/webm,audio/ogg,audio/wav,audio/mpeg|max:20480',
            'title' => 'required|string|max:255',
            'duration' => 'required|integer|min:1',
            'description' => 'nullable|string',
        ]);

        $file = $request->file('recording');
        $path = $file->store('voice_recordings', 'local');

        $lesson->voiceRecordings()->create([
            'title' => $request->title,
            'path' => $path,
            'duration' => $request->duration,
            'size' => $file->getSize(),
            'description' => $request->description,
        ]);

        return redirect()->back();
    }

    public function destroy(VoiceRecording $voiceRecording): RedirectResponse
    {
        $this->authorize('delete', $voiceRecording);

        Storage::disk('local')->delete($voiceRecording->path);
        $voiceRecording->delete();

        return redirect()->back();
    }
}

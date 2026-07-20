<?php

namespace App\Http\Controllers;

use App\Models\StudySession;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class StudySessionController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'duration_minutes' => 'required|integer|min:1',
            'date' => 'required|date',
            'lesson_id' => 'nullable|exists:lessons,id',
            'notes' => 'nullable|string',
        ]);

        $request->user()->studySessions()->create($request->validated());

        return redirect()->back();
    }

    public function destroy(StudySession $studySession): RedirectResponse
    {
        $this->authorize('delete', $studySession);

        $studySession->delete();

        return redirect()->back();
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNoteRequest;
use App\Models\Lesson;
use App\Models\Note;
use Illuminate\Http\RedirectResponse;

class NoteController extends Controller
{
    public function store(StoreNoteRequest $request, Lesson $lesson): RedirectResponse
    {
        Note::updateOrCreate(
            ['lesson_id' => $lesson->id],
            ['content' => $request->validated()['content']]
        );

        return redirect()->back();
    }

    public function update(StoreNoteRequest $request, Note $note): RedirectResponse
    {
        $note->update($request->validated());

        return redirect()->back();
    }
}

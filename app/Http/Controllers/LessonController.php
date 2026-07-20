<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLessonRequest;
use App\Http\Requests\UpdateLessonRequest;
use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LessonController extends Controller
{
    public function store(StoreLessonRequest $request, Module $module): RedirectResponse
    {
        $module->lessons()->create($request->validated());

        return redirect()->route('courses.modules.show', [$module->course, $module]);
    }

    public function show(Lesson $lesson): Response
    {
        $lesson->load(['module.course', 'note', 'codeSnippets', 'attachments']);

        return Inertia::render('lessons/show', [
            'lesson' => $lesson,
        ]);
    }

    public function update(UpdateLessonRequest $request, Lesson $lesson): RedirectResponse
    {
        $lesson->update($request->validated());

        return redirect()->route('lessons.show', $lesson);
    }

    public function destroy(Lesson $lesson): RedirectResponse
    {
        $module = $lesson->module;
        $lesson->delete();

        return redirect()->route('courses.modules.show', [$module->course, $module]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreModuleRequest;
use App\Http\Requests\UpdateModuleRequest;
use App\Models\Course;
use App\Models\Module;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ModuleController extends Controller
{
    public function store(StoreModuleRequest $request, Course $course): RedirectResponse
    {
        $course->modules()->create($request->validated());

        return redirect()->route('courses.show', $course);
    }

    public function show(Module $module): Response
    {
        $module->load(['course', 'lessons.note', 'lessons.codeSnippets', 'lessons.attachments']);

        return Inertia::render('modules/show', [
            'module' => $module,
        ]);
    }

    public function update(UpdateModuleRequest $request, Module $module): RedirectResponse
    {
        $module->update($request->validated());

        return redirect()->route('courses.show', $module->course);
    }

    public function destroy(Module $module): RedirectResponse
    {
        $course = $module->course;
        $module->delete();

        return redirect()->route('courses.show', $course);
    }
}

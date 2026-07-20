<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use App\Models\Course;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(Request $request): Response
    {
        $courses = $request->user()
            ->courses()
            ->withCount('modules')
            ->with('tags')
            ->latest()
            ->paginate(12);

        return Inertia::render('courses/index', [
            'courses' => $courses,
        ]);
    }

    public function create(): Response
    {
        $tags = auth()->user()->tags()->get();

        return Inertia::render('courses/create', [
            'tags' => $tags,
        ]);
    }

    public function store(StoreCourseRequest $request): RedirectResponse
    {
        $course = $request->user()->courses()->create($request->validated());

        if ($request->has('tags')) {
            $course->tags()->sync($request->tags);
        }

        return redirect()->route('courses.show', $course);
    }

    public function show(Request $request, Course $course): Response
    {
        $this->authorize('view', $course);

        $course->load(['modules.lessons', 'tags']);

        return Inertia::render('courses/show', [
            'course' => $course,
        ]);
    }

    public function edit(Request $request, Course $course): Response
    {
        $this->authorize('update', $course);

        $course->load('tags');
        $tags = $request->user()->tags()->get();

        return Inertia::render('courses/edit', [
            'course' => $course,
            'tags' => $tags,
        ]);
    }

    public function update(UpdateCourseRequest $request, Course $course): RedirectResponse
    {
        $this->authorize('update', $course);

        $course->update($request->validated());

        if ($request->has('tags')) {
            $course->tags()->sync($request->tags);
        }

        return redirect()->route('courses.show', $course);
    }

    public function destroy(Course $course): RedirectResponse
    {
        $this->authorize('delete', $course);

        $course->delete();

        return redirect()->route('courses.index');
    }
}

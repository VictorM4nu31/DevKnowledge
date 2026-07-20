<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreErrorRequest;
use App\Http\Requests\UpdateErrorRequest;
use App\Models\Error;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ErrorController extends Controller
{
    public function index(Request $request): Response
    {
        $errors = $request->user()
            ->errors()
            ->with('tags')
            ->latest()
            ->paginate(12);

        return Inertia::render('errors/index', [
            'errors' => $errors,
        ]);
    }

    public function create(): Response
    {
        $tags = auth()->user()->tags()->get();

        return Inertia::render('errors/create', [
            'tags' => $tags,
        ]);
    }

    public function store(StoreErrorRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('screenshot')) {
            $data['screenshot_path'] = $request->file('screenshot')->store('error_screenshots', 'local');
        }

        $error = $request->user()->errors()->create($data);

        if ($request->has('tags')) {
            $error->tags()->sync($request->tags);
        }

        return redirect()->route('errors.show', $error);
    }

    public function show(Error $error): Response
    {
        $this->authorize('view', $error);

        $error->load('tags');

        return Inertia::render('errors/show', [
            'error' => $error,
        ]);
    }

    public function edit(Error $error): Response
    {
        $this->authorize('update', $error);

        $error->load('tags');
        $tags = auth()->user()->tags()->get();

        return Inertia::render('errors/edit', [
            'error' => $error,
            'tags' => $tags,
        ]);
    }

    public function update(UpdateErrorRequest $request, Error $error): RedirectResponse
    {
        $this->authorize('update', $error);

        $data = $request->validated();

        if ($request->hasFile('screenshot')) {
            if ($error->screenshot_path) {
                Storage::disk('local')->delete($error->screenshot_path);
            }
            $data['screenshot_path'] = $request->file('screenshot')->store('error_screenshots', 'local');
        }

        $error->update($data);

        if ($request->has('tags')) {
            $error->tags()->sync($request->tags);
        }

        return redirect()->route('errors.show', $error);
    }

    public function destroy(Error $error): RedirectResponse
    {
        $this->authorize('delete', $error);

        if ($error->screenshot_path) {
            Storage::disk('local')->delete($error->screenshot_path);
        }

        $error->delete();

        return redirect()->route('errors.index');
    }
}

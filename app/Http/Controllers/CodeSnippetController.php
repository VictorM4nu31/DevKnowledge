<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCodeSnippetRequest;
use App\Http\Requests\UpdateCodeSnippetRequest;
use App\Models\CodeSnippet;
use App\Models\Lesson;
use Illuminate\Http\RedirectResponse;

class CodeSnippetController extends Controller
{
    public function store(StoreCodeSnippetRequest $request, Lesson $lesson): RedirectResponse
    {
        $lesson->codeSnippets()->create($request->validated());

        return redirect()->back();
    }

    public function update(UpdateCodeSnippetRequest $request, CodeSnippet $codeSnippet): RedirectResponse
    {
        $codeSnippet->update($request->validated());

        return redirect()->back();
    }

    public function destroy(CodeSnippet $codeSnippet): RedirectResponse
    {
        $codeSnippet->delete();

        return redirect()->back();
    }
}

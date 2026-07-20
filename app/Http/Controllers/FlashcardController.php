<?php

namespace App\Http\Controllers;

use App\Models\Flashcard;
use App\Models\FlashcardDeck;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class FlashcardController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, FlashcardDeck $deck): RedirectResponse
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
        ]);

        $deck->flashcards()->create($validated);

        return redirect()->back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Flashcard $flashcard): RedirectResponse
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
        ]);

        $flashcard->update($validated);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Flashcard $flashcard): RedirectResponse
    {
        $flashcard->delete();

        return redirect()->back();
    }
}

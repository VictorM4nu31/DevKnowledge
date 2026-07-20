<?php

namespace App\Http\Controllers;

use App\Models\FlashcardDeck;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FlashcardDeckController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $decks = $request->user()
            ->flashcardDecks()
            ->withCount('flashcards')
            ->latest()
            ->paginate(12);

        return Inertia::render('flashcards/index', [
            'decks' => $decks,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('flashcards/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $request->user()->flashcardDecks()->create($validated);

        return redirect()->route('flashcards.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(FlashcardDeck $deck): Response
    {
        $this->authorize('view', $deck);

        $deck->load('flashcards');

        return Inertia::render('flashcards/show', [
            'deck' => $deck,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FlashcardDeck $deck): Response
    {
        $this->authorize('update', $deck);

        return Inertia::render('flashcards/edit', [
            'deck' => $deck,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FlashcardDeck $deck): RedirectResponse
    {
        $this->authorize('update', $deck);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $deck->update($validated);

        return redirect()->route('flashcards.show', $deck);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FlashcardDeck $deck): RedirectResponse
    {
        $this->authorize('delete', $deck);

        $deck->delete();

        return redirect()->route('flashcards.index');
    }
}

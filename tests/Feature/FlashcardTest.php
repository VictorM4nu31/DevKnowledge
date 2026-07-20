<?php

use App\Models\Course;
use App\Models\Flashcard;
use App\Models\FlashcardDeck;
use App\Models\ReviewSchedule;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('authenticated user can view flashcard decks index', function () {
    $this->actingAs($this->user)
        ->get('/flashcards')
        ->assertOk();
});

test('unauthenticated user cannot view flashcard decks', function () {
    $this->get('/flashcards')
        ->assertRedirect('/login');
});

test('authenticated user can create a flashcard deck', function () {
    $this->actingAs($this->user)
        ->post('/flashcards', [
            'title' => 'Test Deck',
            'description' => 'Test Description',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('flashcard_decks', [
        'title' => 'Test Deck',
        'user_id' => $this->user->id,
    ]);
});

test('flashcard deck title is required', function () {
    $this->actingAs($this->user)
        ->post('/flashcards', [
            'description' => 'Test Description',
        ])
        ->assertSessionHasErrors('title');
});

test('user can view their flashcard deck', function () {
    $deck = FlashcardDeck::factory()->create([
        'user_id' => $this->user->id,
        'title' => 'Test Deck Title',
    ]);

    $this->actingAs($this->user)
        ->get("/flashcards/{$deck->id}")
        ->assertOk()
        ->assertSee('Test Deck Title');
});

test('user cannot view another users flashcard deck', function () {
    $otherUser = User::factory()->create();
    $deck = FlashcardDeck::factory()->create(['user_id' => $otherUser->id]);

    $this->actingAs($this->user)
        ->get("/flashcards/{$deck->id}")
        ->assertForbidden();
});

test('user can update their flashcard deck', function () {
    $deck = FlashcardDeck::factory()->create(['user_id' => $this->user->id]);

    $this->actingAs($this->user)
        ->put("/flashcards/{$deck->id}", [
            'title' => 'Updated Title',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('flashcard_decks', [
        'id' => $deck->id,
        'title' => 'Updated Title',
    ]);
});

test('user can delete their flashcard deck', function () {
    $deck = FlashcardDeck::factory()->create(['user_id' => $this->user->id]);

    $this->actingAs($this->user)
        ->delete("/flashcards/{$deck->id}")
        ->assertRedirect('/flashcards');

    $this->assertDatabaseMissing('flashcard_decks', ['id' => $deck->id]);
});

test('user can add flashcard to their deck', function () {
    $deck = FlashcardDeck::factory()->create(['user_id' => $this->user->id]);

    $this->actingAs($this->user)
        ->post("/flashcards/{$deck->id}/cards", [
            'question' => 'What is Laravel?',
            'answer' => 'A PHP framework',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('flashcards', [
        'flashcard_deck_id' => $deck->id,
        'question' => 'What is Laravel?',
        'answer' => 'A PHP framework',
    ]);
});

test('flashcard question and answer are required', function () {
    $deck = FlashcardDeck::factory()->create(['user_id' => $this->user->id]);

    $this->actingAs($this->user)
        ->post("/flashcards/{$deck->id}/cards", [
            'question' => '',
            'answer' => '',
        ])
        ->assertSessionHasErrors(['question', 'answer']);
});

test('user can delete a flashcard', function () {
    $deck = FlashcardDeck::factory()->create(['user_id' => $this->user->id]);
    $card = Flashcard::factory()->create(['flashcard_deck_id' => $deck->id]);

    $this->actingAs($this->user)
        ->delete("/flashcards/{$card->id}")
        ->assertRedirect();

    $this->assertDatabaseMissing('flashcards', ['id' => $card->id]);
});

test('SM-2 algorithm updates flashcard correctly on good review', function () {
    $deck = FlashcardDeck::factory()->create(['user_id' => $this->user->id]);
    $card = Flashcard::factory()->create([
        'flashcard_deck_id' => $deck->id,
        'repetition' => 0,
        'interval' => 0,
        'ease_factor' => 2.5,
    ]);

    $this->actingAs($this->user)
        ->post("/reviews/flashcard/{$card->id}", [
            'quality' => 4,
        ]);

    $card->refresh();
    expect($card->repetition)->toBe(1)
        ->and($card->interval)->toBe(1);
});

test('SM-2 algorithm resets on poor review', function () {
    $deck = FlashcardDeck::factory()->create(['user_id' => $this->user->id]);
    $card = Flashcard::factory()->create([
        'flashcard_deck_id' => $deck->id,
        'repetition' => 3,
        'interval' => 10,
        'ease_factor' => 2.5,
    ]);

    $this->actingAs($this->user)
        ->post("/reviews/flashcard/{$card->id}", [
            'quality' => 2,
        ]);

    $card->refresh();
    expect($card->repetition)->toBe(0)
        ->and($card->interval)->toBe(1);
});

test('user can view review queue', function () {
    $this->actingAs($this->user)
        ->get('/reviews')
        ->assertOk();
});

test('user can schedule a review', function () {
    $deck = FlashcardDeck::factory()->create(['user_id' => $this->user->id]);

    $this->actingAs($this->user)
        ->post('/reviews/schedule', [
            'reviewable_type' => 'App\\Models\\FlashcardDeck',
            'reviewable_id' => $deck->id,
            'interval_type' => 'tomorrow',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('review_schedules', [
        'user_id' => $this->user->id,
        'reviewable_type' => 'App\\Models\\FlashcardDeck',
        'reviewable_id' => $deck->id,
        'interval_type' => 'tomorrow',
    ]);
});

test('user can complete a review', function () {
    $deck = FlashcardDeck::factory()->create(['user_id' => $this->user->id]);
    $review = ReviewSchedule::factory()->create([
        'user_id' => $this->user->id,
        'reviewable_type' => 'App\\Models\\FlashcardDeck',
        'reviewable_id' => $deck->id,
        'completed' => false,
    ]);

    $this->actingAs($this->user)
        ->post("/reviews/{$review->id}/complete")
        ->assertRedirect();

    $review->refresh();
    expect($review->completed)->toBeTrue()
        ->and($review->completed_at)->not->toBeNull();
});

test('user can view calendar', function () {
    $this->actingAs($this->user)
        ->get('/calendar')
        ->assertOk();
});

test('user can export course to markdown', function () {
    $course = Course::factory()->create(['user_id' => $this->user->id]);

    $this->actingAs($this->user)
        ->get("/export/{$course->id}/markdown")
        ->assertOk()
        ->assertHeader('content-type', 'text/markdown; charset=UTF-8');
});

test('user can export course to html', function () {
    $course = Course::factory()->create(['user_id' => $this->user->id]);

    $this->actingAs($this->user)
        ->get("/export/{$course->id}/html")
        ->assertOk()
        ->assertHeader('content-type', 'text/html; charset=UTF-8');
});

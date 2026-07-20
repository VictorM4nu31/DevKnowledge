<?php

use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\CodeSnippetController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ErrorController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\FlashcardController;
use App\Http\Controllers\FlashcardDeckController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\StudySessionController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\VoiceRecordingController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('courses', CourseController::class);

    Route::resource('courses.modules', ModuleController::class)->except(['index', 'create']);

    Route::resource('lessons', LessonController::class)->except(['index', 'create']);

    Route::post('lessons/{lesson}/note', [NoteController::class, 'store'])->name('lessons.note.store');
    Route::put('notes/{note}', [NoteController::class, 'update'])->name('notes.update');

    Route::post('lessons/{lesson}/attachments', [AttachmentController::class, 'store'])->name('lessons.attachments.store');
    Route::delete('attachments/{attachment}', [AttachmentController::class, 'destroy'])->name('attachments.destroy');

    Route::post('lessons/{lesson}/code-snippets', [CodeSnippetController::class, 'store'])->name('lessons.code-snippets.store');
    Route::put('code-snippets/{codeSnippet}', [CodeSnippetController::class, 'update'])->name('code-snippets.update');
    Route::delete('code-snippets/{codeSnippet}', [CodeSnippetController::class, 'destroy'])->name('code-snippets.destroy');

    Route::post('lessons/{lesson}/voice-recordings', [VoiceRecordingController::class, 'store'])->name('lessons.voice-recordings.store');
    Route::delete('voice-recordings/{voiceRecording}', [VoiceRecordingController::class, 'destroy'])->name('voice-recordings.destroy');

    Route::resource('tags', TagController::class)->except(['create', 'show', 'edit']);

    Route::resource('errors', ErrorController::class);

    Route::post('study-sessions', [StudySessionController::class, 'store'])->name('study-sessions.store');
    Route::delete('study-sessions/{studySession}', [StudySessionController::class, 'destroy'])->name('study-sessions.destroy');

    Route::resource('flashcards', FlashcardDeckController::class)->parameters([
        'flashcards' => 'deck',
    ]);

    Route::post('flashcards/{deck}/cards', [FlashcardController::class, 'store'])->name('flashcards.cards.store');
    Route::put('flashcard/{flashcard}', [FlashcardController::class, 'update'])->name('flashcard.update');
    Route::delete('flashcard/{flashcard}', [FlashcardController::class, 'destroy'])->name('flashcard.destroy');

    Route::get('/reviews', [ReviewController::class, 'index'])->name('reviews.index');
    Route::post('/reviews/flashcard/{flashcard}', [ReviewController::class, 'reviewFlashcard'])->name('reviews.flashcard');
    Route::post('/reviews/{review}/complete', [ReviewController::class, 'completeReview'])->name('reviews.complete');
    Route::post('/reviews/schedule', [ReviewController::class, 'schedule'])->name('reviews.schedule');

    Route::get('/calendar', [CalendarController::class, 'index'])->name('calendar.index');

    Route::get('/export/{course}/markdown', [ExportController::class, 'markdown'])->name('export.markdown');
    Route::get('/export/{course}/html', [ExportController::class, 'html'])->name('export.html');

    Route::get('/search', [SearchController::class, 'index'])->name('search');
});

require __DIR__.'/settings.php';

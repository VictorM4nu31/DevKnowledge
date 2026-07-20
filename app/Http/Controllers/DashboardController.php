<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $today = Carbon::today();

        $stats = [
            'total_courses' => $user->courses()->count(),
            'completed_courses' => $user->courses()->where('is_completed', true)->count(),
            'total_modules' => $user->courses()->withCount('modules')->get()->sum('modules_count'),
            'total_lessons' => $user->courses()->with(['modules.lessons'])->get()->pluck('modules.*.lessons')->flatten()->count(),
            'total_notes' => $user->courses()->with(['modules.lessons.note'])->get()->pluck('modules.*.lessons.*.note')->flatten()->filter()->count(),
            'total_attachments' => $user->courses()->with(['modules.lessons.attachments'])->get()->pluck('modules.*.lessons.*.attachments')->flatten()->count(),
            'total_code_snippets' => $user->courses()->with(['modules.lessons.codeSnippets'])->get()->pluck('modules.*.lessons.*.codeSnippets')->flatten()->count(),
            'total_voice_recordings' => $user->courses()->with(['modules.lessons.voiceRecordings'])->get()->pluck('modules.*.lessons.*.voiceRecordings')->flatten()->count(),
            'total_tags' => $user->tags()->count(),
            'total_errors' => $user->errors()->count(),
            'total_study_time' => $user->studySessions()->sum('duration_minutes'),
            'total_flashcard_decks' => $user->flashcardDecks()->count(),
            'total_flashcards' => $user->flashcardDecks()->withCount('flashcards')->get()->sum('flashcards_count'),
            'due_reviews' => $user->reviewSchedules()->where('completed', false)->where('review_date', '<=', $today)->count(),
            'average_progress' => $user->courses()->avg('progress_percentage') ?? 0,
        ];

        $recentCourses = $user->courses()
            ->withCount('modules')
            ->latest()
            ->take(5)
            ->get();

        $recentErrors = $user->errors()
            ->latest()
            ->take(5)
            ->get();

        $recentStudySessions = $user->studySessions()
            ->with('lesson')
            ->latest('date')
            ->take(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentCourses' => $recentCourses,
            'recentErrors' => $recentErrors,
            'recentStudySessions' => $recentStudySessions,
        ]);
    }
}

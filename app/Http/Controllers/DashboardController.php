<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $stats = [
            'total_courses' => $user->courses()->count(),
            'completed_courses' => $user->courses()->where('is_completed', true)->count(),
            'total_modules' => $user->courses()->withCount('modules')->get()->sum('modules_count'),
            'total_lessons' => $user->courses()->with(['modules.lessons'])->get()->pluck('modules.*.lessons')->flatten()->count(),
            'total_notes' => $user->courses()->with(['modules.lessons.note'])->get()->pluck('modules.*.lessons.*.note')->flatten()->filter()->count(),
            'total_attachments' => $user->courses()->with(['modules.lessons.attachments'])->get()->pluck('modules.*.lessons.*.attachments')->flatten()->count(),
            'total_code_snippets' => $user->courses()->with(['modules.lessons.codeSnippets'])->get()->pluck('modules.*.lessons.*.codeSnippets')->flatten()->count(),
            'total_tags' => $user->tags()->count(),
            'average_progress' => $user->courses()->avg('progress_percentage') ?? 0,
        ];

        $recentCourses = $user->courses()
            ->withCount('modules')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentCourses' => $recentCourses,
        ]);
    }
}

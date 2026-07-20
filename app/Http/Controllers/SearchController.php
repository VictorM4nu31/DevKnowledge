<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Module;
use App\Models\Note;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    public function index(Request $request): Response
    {
        $query = $request->get('q', '');
        $user = $request->user();

        $courses = collect();
        $modules = collect();
        $lessons = collect();
        $notes = collect();
        $tags = collect();

        if (strlen($query) >= 2) {
            $courses = $user->courses()
                ->where('title', 'ilike', "%{$query}%")
                ->orWhere('description', 'ilike', "%{$query}%")
                ->limit(10)
                ->get();

            $modules = Module::whereHas('course', fn ($q) => $q->where('user_id', $user->id))
                ->where('title', 'ilike', "%{$query}%")
                ->orWhere('description', 'ilike', "%{$query}%")
                ->limit(10)
                ->get();

            $lessons = Lesson::whereHas('module.course', fn ($q) => $q->where('user_id', $user->id))
                ->where('title', 'ilike', "%{$query}%")
                ->orWhere('description', 'ilike', "%{$query}%")
                ->limit(10)
                ->get();

            $notes = Note::whereHas('lesson.module.course', fn ($q) => $q->where('user_id', $user->id))
                ->where('content', 'ilike', "%{$query}%")
                ->limit(10)
                ->get();

            $tags = $user->tags()
                ->where('name', 'ilike', "%{$query}%")
                ->limit(10)
                ->get();
        }

        return Inertia::render('search/index', [
            'query' => $query,
            'results' => [
                'courses' => $courses,
                'modules' => $modules,
                'lessons' => $lessons,
                'notes' => $notes,
                'tags' => $tags,
            ],
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CalendarController extends Controller
{
    /**
     * Display the study calendar.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $month = $request->get('month', Carbon::now()->format('Y-m'));
        $startDate = Carbon::parse($month)->startOfMonth();
        $endDate = Carbon::parse($month)->endOfMonth();

        $reviews = $user->reviewSchedules()
            ->whereBetween('review_date', [$startDate, $endDate])
            ->with('reviewable')
            ->get()
            ->groupBy(fn ($review) => $review->review_date->format('Y-m-d'));

        $studySessions = $user->studySessions()
            ->whereBetween('date', [$startDate, $endDate])
            ->with('lesson')
            ->get()
            ->groupBy(fn ($session) => $session->date->format('Y-m-d'));

        return Inertia::render('calendar/index', [
            'currentMonth' => $month,
            'reviews' => $reviews,
            'studySessions' => $studySessions,
        ]);
    }
}

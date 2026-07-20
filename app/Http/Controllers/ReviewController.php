<?php

namespace App\Http\Controllers;

use App\Models\Flashcard;
use App\Models\ReviewSchedule;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    /**
     * Display the review queue.
     */
    public function index(Request $request): Response
    {
        $today = Carbon::today();

        $dueFlashcards = Flashcard::whereHas('deck', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })
            ->where(function ($query) use ($today) {
                $query->whereNull('next_review')
                    ->orWhere('next_review', '<=', $today);
            })
            ->with('deck')
            ->inRandomOrder()
            ->limit(20)
            ->get();

        $dueReviews = ReviewSchedule::where('user_id', $request->user()->id)
            ->where('completed', false)
            ->where('review_date', '<=', $today)
            ->with('reviewable')
            ->orderBy('review_date')
            ->limit(20)
            ->get();

        return Inertia::render('reviews/index', [
            'dueFlashcards' => $dueFlashcards,
            'dueReviews' => $dueReviews,
        ]);
    }

    /**
     * Process flashcard review (SM-2 algorithm).
     */
    public function reviewFlashcard(Request $request, Flashcard $flashcard): RedirectResponse
    {
        $validated = $request->validate([
            'quality' => 'required|integer|min:0|max:5',
        ]);

        $quality = $validated['quality'];

        // SM-2 algorithm
        if ($quality >= 3) {
            if ($flashcard->repetition === 0) {
                $flashcard->interval = 1;
            } elseif ($flashcard->repetition === 1) {
                $flashcard->interval = 6;
            } else {
                $flashcard->interval = (int) round($flashcard->interval * $flashcard->ease_factor);
            }
            $flashcard->repetition++;
        } else {
            $flashcard->repetition = 0;
            $flashcard->interval = 1;
        }

        // Update ease factor
        $flashcard->ease_factor = $flashcard->ease_factor + (0.1 - (5 - $quality) * (0.08 + (5 - $quality) * 0.02));
        if ($flashcard->ease_factor < 1.3) {
            $flashcard->ease_factor = 1.3;
        }

        // Set next review date
        $flashcard->next_review = Carbon::today()->addDays($flashcard->interval);
        $flashcard->save();

        return redirect()->back();
    }

    /**
     * Mark a review schedule item as completed.
     */
    public function completeReview(ReviewSchedule $review): RedirectResponse
    {
        $review->update([
            'completed' => true,
            'completed_at' => Carbon::now(),
        ]);

        return redirect()->back();
    }

    /**
     * Schedule a review for a reviewable item.
     */
    public function schedule(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'reviewable_type' => 'required|string',
            'reviewable_id' => 'required|integer',
            'interval_type' => 'required|in:tomorrow,week,month',
        ]);

        $reviewDate = match ($validated['interval_type']) {
            'tomorrow' => Carbon::tomorrow(),
            'week' => Carbon::today()->addWeek(),
            'month' => Carbon::today()->addMonth(),
        };

        ReviewSchedule::create([
            'user_id' => $request->user()->id,
            'reviewable_type' => $validated['reviewable_type'],
            'reviewable_id' => $validated['reviewable_id'],
            'review_date' => $reviewDate,
            'interval_type' => $validated['interval_type'],
            'completed' => false,
        ]);

        return redirect()->back();
    }
}

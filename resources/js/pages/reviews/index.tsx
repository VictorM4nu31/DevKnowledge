import { Head, useForm } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reviews',
        href: '/reviews',
    },
];

type Flashcard = {
    id: number;
    question: string;
    answer: string;
    deck: {
        id: number;
        title: string;
    };
};

type ReviewSchedule = {
    id: number;
    review_date: string;
    interval_type: string;
    reviewable: {
        id: number;
        title: string;
        type: string;
    };
};

type Props = {
    dueFlashcards: Flashcard[];
    dueReviews: ReviewSchedule[];
};

export default function ReviewsIndex({ dueFlashcards, dueReviews }: Props) {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const { post, processing } = useForm();

    const reviewFlashcard = (quality: number) => {
        if (currentCardIndex >= dueFlashcards.length) {
return;
}

        const card = dueFlashcards[currentCardIndex];
        post(`/reviews/flashcard/${card.id}`, {
            quality,
            preserveScroll: true,
            onSuccess: () => {
                setShowAnswer(false);

                if (currentCardIndex < dueFlashcards.length - 1) {
                    setCurrentCardIndex(currentCardIndex + 1);
                }
            },
        });
    };

    const completeReview = (id: number) => {
        post(`/reviews/${id}/complete`);
    };

    const currentCard = dueFlashcards[currentCardIndex];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Review Queue" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <h1 className="text-2xl font-bold">Review Queue</h1>

                {dueFlashcards.length > 0 && (
                    <div className="rounded-lg border bg-card p-6">
                        <h2 className="mb-4 text-lg font-semibold">
                            Flashcards Due ({dueFlashcards.length})
                        </h2>

                        {currentCard && (
                            <div className="space-y-4">
                                <div className="rounded-lg border bg-background p-6">
                                    <p className="mb-2 text-sm text-muted-foreground">
                                        {currentCard.deck.title}
                                    </p>
                                    <p className="text-lg font-medium">{currentCard.question}</p>

                                    {showAnswer && (
                                        <div className="mt-4 border-t pt-4">
                                            <p className="text-sm text-muted-foreground">Answer:</p>
                                            <p className="mt-2">{currentCard.answer}</p>
                                        </div>
                                    )}
                                </div>

                                {!showAnswer ? (
                                    <button
                                        onClick={() => setShowAnswer(true)}
                                        className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                                    >
                                        Show Answer
                                    </button>
                                ) : (
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            onClick={() => reviewFlashcard(1)}
                                            disabled={processing}
                                            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                                        >
                                            Hard
                                        </button>
                                        <button
                                            onClick={() => reviewFlashcard(3)}
                                            disabled={processing}
                                            className="rounded-md bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700 disabled:opacity-50"
                                        >
                                            Good
                                        </button>
                                        <button
                                            onClick={() => reviewFlashcard(5)}
                                            disabled={processing}
                                            className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                                        >
                                            Easy
                                        </button>
                                    </div>
                                )}

                                <p className="text-center text-sm text-muted-foreground">
                                    Card {currentCardIndex + 1} of {dueFlashcards.length}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {dueReviews.length > 0 && (
                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-lg font-semibold">
                            Items to Review ({dueReviews.length})
                        </h2>

                        <div className="space-y-2">
                            {dueReviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="flex items-center justify-between rounded-md border p-3"
                                >
                                    <div>
                                        <p className="font-medium">{review.reviewable.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Scheduled for {new Date(review.review_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => completeReview(review.id)}
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                        Complete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {dueFlashcards.length === 0 && dueReviews.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
                        <p className="text-muted-foreground">No items due for review</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Check back later or schedule reviews for your lessons
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

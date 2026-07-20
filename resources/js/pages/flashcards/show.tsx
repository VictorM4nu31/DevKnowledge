import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Flashcard = {
    id: number;
    question: string;
    answer: string;
};

type FlashcardDeck = {
    id: number;
    title: string;
    description: string | null;
    flashcards: Flashcard[];
};

type Props = {
    deck: FlashcardDeck;
};

export default function FlashcardsShow({ deck }: Props) {
    const { delete: destroy, processing } = useForm();
    const { data, setData, post, processing: creating, reset, errors } = useForm({
        question: '',
        answer: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Flashcards',
            href: '/flashcards',
        },
        {
            title: deck.title,
            href: `/flashcards/${deck.id}`,
        },
    ];

    const addCard = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/flashcards/${deck.id}/cards`, {
            onSuccess: () => reset(),
        });
    };

    const deleteCard = (id: number) => {
        if (confirm('Are you sure you want to delete this card?')) {
            destroy(`/flashcard/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={deck.title} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/flashcards" className="text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">{deck.title}</h1>
                            {deck.description && (
                                <p className="text-sm text-muted-foreground">{deck.description}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-lg font-semibold">Flashcards</h2>

                        {deck.flashcards && deck.flashcards.length > 0 ? (
                            <div className="space-y-2">
                                {deck.flashcards.map((card) => (
                                    <div
                                        key={card.id}
                                        className="flex items-start justify-between rounded-md border p-3"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium">{card.question}</p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {card.answer}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => deleteCard(card.id)}
                                            disabled={processing}
                                            className="ml-2 text-destructive hover:text-destructive/80 disabled:opacity-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No flashcards yet</p>
                        )}

                        <form onSubmit={addCard} className="mt-4 space-y-3 border-t pt-4">
                            <h3 className="text-sm font-medium">Add Flashcard</h3>
                            <input
                                type="text"
                                value={data.question}
                                onChange={(e) => setData('question', e.target.value)}
                                placeholder="Question"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            {errors.question && (
                                <p className="text-sm text-destructive">{errors.question}</p>
                            )}
                            <textarea
                                value={data.answer}
                                onChange={(e) => setData('answer', e.target.value)}
                                placeholder="Answer"
                                rows={2}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            {errors.answer && (
                                <p className="text-sm text-destructive">{errors.answer}</p>
                            )}
                            <button
                                type="submit"
                                disabled={creating}
                                className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                            >
                                <Plus className="h-4 w-4" />
                                Add Card
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

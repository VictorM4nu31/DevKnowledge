import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Flashcards',
        href: '/flashcards',
    },
];

type FlashcardDeck = {
    id: number;
    title: string;
    description: string | null;
    flashcards_count: number;
    created_at: string;
};

type Props = {
    decks: {
        data: FlashcardDeck[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export default function FlashcardsIndex({ decks }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Flashcards" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Flashcard Decks</h1>
                    <Link
                        href="/flashcards/create"
                        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" />
                        New Deck
                    </Link>
                </div>

                {decks.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
                        <p className="text-muted-foreground">No flashcard decks yet</p>
                        <Link
                            href="/flashcards/create"
                            className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                        >
                            <Plus className="h-4 w-4" />
                            Create your first deck
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {decks.data.map((deck) => (
                            <Link
                                key={deck.id}
                                href={`/flashcards/${deck.id}`}
                                className="group rounded-lg border bg-card p-4 transition-colors hover:border-primary/50"
                            >
                                <h3 className="font-semibold group-hover:text-primary">
                                    {deck.title}
                                </h3>
                                {deck.description && (
                                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                        {deck.description}
                                    </p>
                                )}
                                <p className="mt-3 text-sm text-muted-foreground">
                                    {deck.flashcards_count} cards
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

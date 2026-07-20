import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Error } from '@/types';

type Props = {
    error: Error;
};

export default function ErrorsShow({ error }: Props) {
    const { delete: destroy, processing } = useForm();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Errors',
            href: '/errors',
        },
        {
            title: error.title,
            href: `/errors/${error.id}`,
        },
    ];

    const deleteError = () => {
        if (confirm('Are you sure you want to delete this error?')) {
            destroy(`/errors/${error.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={error.title} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/errors" className="text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold">{error.title}</h1>
                                {error.error_code && (
                                    <span className="rounded bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                                        {error.error_code}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/errors/${error.id}/edit`}
                            className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-accent"
                        >
                            <Edit className="h-4 w-4" />
                            Edit
                        </Link>
                        <button
                            onClick={deleteError}
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-md border border-destructive bg-background px-3 py-1.5 text-sm text-destructive hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-3 text-lg font-semibold">Error Message</h2>
                        <pre className="overflow-x-auto rounded-md bg-destructive/5 p-4 text-sm">
                            <code>{error.error_message}</code>
                        </pre>
                    </div>

                    {error.cause && (
                        <div className="rounded-lg border bg-card p-4">
                            <h2 className="mb-3 text-lg font-semibold">Cause</h2>
                            <p className="text-sm">{error.cause}</p>
                        </div>
                    )}

                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-3 text-lg font-semibold">Solution</h2>
                        <pre className="overflow-x-auto rounded-md bg-green-50 p-4 text-sm dark:bg-green-950/20">
                            <code>{error.solution}</code>
                        </pre>
                    </div>

                    {error.explanation && (
                        <div className="rounded-lg border bg-card p-4">
                            <h2 className="mb-3 text-lg font-semibold">Explanation</h2>
                            <p className="text-sm">{error.explanation}</p>
                        </div>
                    )}

                    {error.time_spent_minutes && (
                        <div className="rounded-lg border bg-card p-4">
                            <h2 className="mb-3 text-lg font-semibold">Time Spent</h2>
                            <p className="text-sm">{error.time_spent_minutes} minutes</p>
                        </div>
                    )}

                    {error.tags && error.tags.length > 0 && (
                        <div className="rounded-lg border bg-card p-4">
                            <h2 className="mb-3 text-lg font-semibold">Tags</h2>
                            <div className="flex flex-wrap gap-2">
                                {error.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="rounded-full px-3 py-1 text-sm text-white"
                                        style={{ backgroundColor: tag.color }}
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

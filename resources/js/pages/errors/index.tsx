import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Error } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Errors',
        href: '/errors',
    },
];

type Props = {
    errors: {
        data: Error[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export default function ErrorsIndex({ errors }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Errors" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Error History</h1>
                    <Link
                        href="/errors/create"
                        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" />
                        Log Error
                    </Link>
                </div>

                {errors.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
                        <p className="text-muted-foreground">No errors logged yet</p>
                        <Link
                            href="/errors/create"
                            className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                        >
                            <Plus className="h-4 w-4" />
                            Log your first error
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {errors.data.map((error) => (
                            <Link
                                key={error.id}
                                href={`/errors/${error.id}`}
                                className="group rounded-lg border bg-card p-4 transition-colors hover:border-primary/50"
                            >
                                <div className="mb-2 flex items-start justify-between">
                                    <h3 className="font-semibold group-hover:text-primary">
                                        {error.title}
                                    </h3>
                                    {error.error_code && (
                                        <span className="rounded bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                                            {error.error_code}
                                        </span>
                                    )}
                                </div>
                                <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                                    {error.error_message}
                                </p>
                                {error.tags && error.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {error.tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag.id}
                                                className="rounded-full px-2 py-0.5 text-xs text-white"
                                                style={{ backgroundColor: tag.color }}
                                            >
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {error.time_spent_minutes && (
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Time: {error.time_spent_minutes} min
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

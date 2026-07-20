import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Tag } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Errors',
        href: '/errors',
    },
    {
        title: 'Create',
        href: '/errors/create',
    },
];

type Props = {
    tags: Tag[];
};

export default function ErrorsCreate({ tags }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        error_message: '',
        cause: '',
        solution: '',
        explanation: '',
        error_code: '',
        screenshot: null as File | null,
        time_spent_minutes: '',
        tags: [] as number[],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/errors');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Log Error" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="flex items-center gap-4">
                    <a href="/errors" className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-5 w-5" />
                    </a>
                    <h1 className="text-2xl font-bold">Log Error</h1>
                </div>

                <form onSubmit={submit} className="mx-auto w-full max-w-2xl space-y-6">
                    <div>
                        <label htmlFor="title" className="mb-2 block text-sm font-medium">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            placeholder="e.g., SQLSTATE[42S02]"
                        />
                        {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title}</p>}
                    </div>

                    <div>
                        <label htmlFor="error_code" className="mb-2 block text-sm font-medium">
                            Error Code
                        </label>
                        <input
                            id="error_code"
                            type="text"
                            value={data.error_code}
                            onChange={(e) => setData('error_code', e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            placeholder="e.g., SQLSTATE[42S02]"
                        />
                        {errors.error_code && (
                            <p className="mt-1 text-sm text-destructive">{errors.error_code}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="error_message" className="mb-2 block text-sm font-medium">
                            Error Message
                        </label>
                        <textarea
                            id="error_message"
                            value={data.error_message}
                            onChange={(e) => setData('error_message', e.target.value)}
                            rows={4}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                            placeholder="Full error message..."
                        />
                        {errors.error_message && (
                            <p className="mt-1 text-sm text-destructive">{errors.error_message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="cause" className="mb-2 block text-sm font-medium">
                            Cause
                        </label>
                        <textarea
                            id="cause"
                            value={data.cause}
                            onChange={(e) => setData('cause', e.target.value)}
                            rows={3}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            placeholder="What caused this error?"
                        />
                        {errors.cause && <p className="mt-1 text-sm text-destructive">{errors.cause}</p>}
                    </div>

                    <div>
                        <label htmlFor="solution" className="mb-2 block text-sm font-medium">
                            Solution
                        </label>
                        <textarea
                            id="solution"
                            value={data.solution}
                            onChange={(e) => setData('solution', e.target.value)}
                            rows={4}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                            placeholder="How did you solve it?"
                        />
                        {errors.solution && (
                            <p className="mt-1 text-sm text-destructive">{errors.solution}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="explanation" className="mb-2 block text-sm font-medium">
                            Explanation
                        </label>
                        <textarea
                            id="explanation"
                            value={data.explanation}
                            onChange={(e) => setData('explanation', e.target.value)}
                            rows={3}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            placeholder="Detailed explanation..."
                        />
                        {errors.explanation && (
                            <p className="mt-1 text-sm text-destructive">{errors.explanation}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="time_spent_minutes" className="mb-2 block text-sm font-medium">
                            Time Spent (minutes)
                        </label>
                        <input
                            id="time_spent_minutes"
                            type="number"
                            value={data.time_spent_minutes}
                            onChange={(e) => setData('time_spent_minutes', e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            placeholder="120"
                        />
                        {errors.time_spent_minutes && (
                            <p className="mt-1 text-sm text-destructive">{errors.time_spent_minutes}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="screenshot" className="mb-2 block text-sm font-medium">
                            Screenshot
                        </label>
                        <input
                            id="screenshot"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('screenshot', e.target.files?.[0] || null)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                        {errors.screenshot && (
                            <p className="mt-1 text-sm text-destructive">{errors.screenshot}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => {
                                        const isSelected = data.tags.includes(tag.id);
                                        setData(
                                            'tags',
                                            isSelected
                                                ? data.tags.filter((id) => id !== tag.id)
                                                : [...data.tags, tag.id]
                                        );
                                    }}
                                    className={`rounded-full px-3 py-1 text-sm transition-colors ${
                                        data.tags.includes(tag.id)
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                    }`}
                                    style={
                                        data.tags.includes(tag.id)
                                            ? { backgroundColor: tag.color }
                                            : undefined
                                    }
                                >
                                    {tag.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        >
                            Log Error
                        </button>
                        <a
                            href="/errors"
                            className="rounded-md border border-input bg-background px-4 py-2 text-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            Cancel
                        </a>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

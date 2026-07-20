import { Head, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Tag } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tags',
        href: '/tags',
    },
];

type Props = {
    tags: Tag[];
};

export default function TagsIndex({ tags }: Props) {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        color: '#6B7280',
    });

    const { delete: destroy } = useForm();

    const addTag = (e: React.FormEvent) => {
        e.preventDefault();
        post('/tags', {
            onSuccess: () => reset(),
        });
    };

    const deleteTag = (id: number) => {
        if (confirm('Are you sure you want to delete this tag?')) {
            destroy(`/tags/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tags" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <h1 className="text-2xl font-bold">Tags</h1>

                <div className="space-y-6">
                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-lg font-semibold">Add Tag</h2>
                        <form onSubmit={addTag} className="flex gap-3">
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Tag name"
                                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            <input
                                type="color"
                                value={data.color}
                                onChange={(e) => setData('color', e.target.value)}
                                className="h-10 w-20 cursor-pointer rounded-md border border-input"
                            />
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                            >
                                <Plus className="h-4 w-4" />
                                Add
                            </button>
                        </form>
                        {errors.name && <p className="mt-2 text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-lg font-semibold">All Tags</h2>
                        {tags.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No tags yet</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <div
                                        key={tag.id}
                                        className="group flex items-center gap-2 rounded-full px-3 py-1 text-sm text-white"
                                        style={{ backgroundColor: tag.color }}
                                    >
                                        <span>{tag.name}</span>
                                        <button
                                            onClick={() => deleteTag(tag.id)}
                                            className="opacity-0 transition-opacity group-hover:opacity-100"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

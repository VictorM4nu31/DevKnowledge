import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Course, Tag } from '@/types';

type Props = {
    course: Course;
    tags: Tag[];
};

export default function CoursesEdit({ course, tags }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: course.title,
        description: course.description || '',
        color: course.color,
        icon: course.icon || '',
        tags: course.tags?.map((tag) => tag.id) || [],
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Courses',
            href: '/courses',
        },
        {
            title: course.title,
            href: `/courses/${course.id}`,
        },
        {
            title: 'Edit',
            href: `/courses/${course.id}/edit`,
        },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/courses/${course.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${course.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="flex items-center gap-4">
                    <a
                        href={`/courses/${course.id}`}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </a>
                    <h1 className="text-2xl font-bold">Edit Course</h1>
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
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title}</p>}
                    </div>

                    <div>
                        <label htmlFor="description" className="mb-2 block text-sm font-medium">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-destructive">{errors.description}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="color" className="mb-2 block text-sm font-medium">
                            Color
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                id="color"
                                type="color"
                                value={data.color}
                                onChange={(e) => setData('color', e.target.value)}
                                className="h-10 w-20 cursor-pointer rounded-md border border-input"
                            />
                            <span className="text-sm text-muted-foreground">{data.color}</span>
                        </div>
                        {errors.color && <p className="mt-1 text-sm text-destructive">{errors.color}</p>}
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
                            Update Course
                        </button>
                        <a
                            href={`/courses/${course.id}`}
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

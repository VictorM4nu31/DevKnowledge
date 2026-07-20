import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Module } from '@/types';

type Props = {
    module: Module;
};

export default function ModulesShow({ module }: Props) {
    const { delete: destroy, processing: deleting } = useForm();
    const { data, setData, post, processing: creating, reset, errors } = useForm({
        title: '',
        description: '',
        order: 0,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Courses',
            href: '/courses',
        },
        {
            title: module.course?.title || '',
            href: `/courses/${module.course_id}`,
        },
        {
            title: module.title,
            href: `/courses/modules/${module.id}`,
        },
    ];

    const addLesson = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/lessons`, {
            onSuccess: () => reset(),
        });
    };

    const deleteModule = () => {
        if (confirm('Are you sure you want to delete this module?')) {
            destroy(`/courses/modules/${module.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={module.title} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/courses/${module.course_id}`}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">{module.title}</h1>
                            {module.description && (
                                <p className="text-sm text-muted-foreground">{module.description}</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={deleteModule}
                        disabled={deleting}
                        className="inline-flex items-center gap-2 rounded-md border border-destructive bg-background px-3 py-1.5 text-sm text-destructive hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Module
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-lg font-semibold">Lessons</h2>

                        {module.lessons && module.lessons.length > 0 ? (
                            <div className="space-y-2">
                                {module.lessons
                                    .sort((a, b) => a.order - b.order)
                                    .map((lesson) => (
                                        <Link
                                            key={lesson.id}
                                            href={`/lessons/${lesson.id}`}
                                            className="flex items-center justify-between rounded-md border p-3 transition-colors hover:border-primary/50"
                                        >
                                            <div>
                                                <h3 className="font-medium">{lesson.title}</h3>
                                                {lesson.description && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {lesson.description}
                                                    </p>
                                                )}
                                            </div>
                                            {lesson.is_completed && (
                                                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                                                    Completed
                                                </span>
                                            )}
                                        </Link>
                                    ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No lessons yet</p>
                        )}

                        <form onSubmit={addLesson} className="mt-4 space-y-3 border-t pt-4">
                            <h3 className="text-sm font-medium">Add Lesson</h3>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Lesson title"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">{errors.title}</p>
                            )}
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Lesson description (optional)"
                                rows={2}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            <button
                                type="submit"
                                disabled={creating}
                                className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                            >
                                <Plus className="h-4 w-4" />
                                Add Lesson
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

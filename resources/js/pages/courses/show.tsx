import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Download, Edit, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Course } from '@/types';

type Props = {
    course: Course;
};

export default function CoursesShow({ course }: Props) {
    const { delete: destroy, processing } = useForm();
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
            title: course.title,
            href: `/courses/${course.id}`,
        },
    ];

    const addModule = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/courses/${course.id}/modules`, {
            onSuccess: () => reset(),
        });
    };

    const deleteCourse = () => {
        if (confirm('Are you sure you want to delete this course?')) {
            destroy(`/courses/${course.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={course.title} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/courses" className="text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold">{course.title}</h1>
                                <span
                                    className="h-4 w-4 rounded-full"
                                    style={{ backgroundColor: course.color }}
                                />
                            </div>
                            {course.description && (
                                <p className="text-sm text-muted-foreground">{course.description}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <a
                                href={`/export/${course.id}/markdown`}
                                className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-accent"
                            >
                                <Download className="h-4 w-4" />
                                MD
                            </a>
                            <a
                                href={`/export/${course.id}/html`}
                                className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-accent"
                            >
                                <Download className="h-4 w-4" />
                                HTML
                            </a>
                        </div>
                        <Link
                            href={`/courses/${course.id}/edit`}
                            className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-accent"
                        >
                            <Edit className="h-4 w-4" />
                            Edit
                        </Link>
                        <button
                            onClick={deleteCourse}
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
                        <h2 className="mb-4 text-lg font-semibold">Modules</h2>

                        {course.modules && course.modules.length > 0 ? (
                            <div className="space-y-2">
                                {course.modules
                                    .sort((a, b) => a.order - b.order)
                                    .map((module) => (
                                        <Link
                                            key={module.id}
                                            href={`/lessons/${module.lessons?.[0]?.id || module.id}`}
                                            className="flex items-center justify-between rounded-md border p-3 transition-colors hover:border-primary/50"
                                        >
                                            <div>
                                                <h3 className="font-medium">{module.title}</h3>
                                                {module.description && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {module.description}
                                                    </p>
                                                )}
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {module.lessons?.length || 0} lessons
                                                </p>
                                            </div>
                                            {module.is_completed && (
                                                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                                                    Completed
                                                </span>
                                            )}
                                        </Link>
                                    ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No modules yet</p>
                        )}

                        <form onSubmit={addModule} className="mt-4 space-y-3 border-t pt-4">
                            <h3 className="text-sm font-medium">Add Module</h3>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Module title"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">{errors.title}</p>
                            )}
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Module description (optional)"
                                rows={2}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            <button
                                type="submit"
                                disabled={creating}
                                className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                            >
                                <Plus className="h-4 w-4" />
                                Add Module
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

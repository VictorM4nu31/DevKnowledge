import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Course } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Courses',
        href: '/courses',
    },
];

type CourseWithCount = Course & { modules_count: number };

type Props = {
    courses: {
        data: CourseWithCount[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export default function CoursesIndex({ courses }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Courses" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">My Courses</h1>
                    <Link
                        href="/courses/create"
                        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" />
                        New Course
                    </Link>
                </div>

                {courses.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
                        <p className="text-muted-foreground">No courses yet</p>
                        <Link
                            href="/courses/create"
                            className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                        >
                            <Plus className="h-4 w-4" />
                            Create your first course
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {courses.data.map((course) => (
                            <Link
                                key={course.id}
                                href={`/courses/${course.id}`}
                                className="group rounded-lg border bg-card p-4 transition-colors hover:border-primary/50"
                            >
                                <div className="mb-2 flex items-start justify-between">
                                    <h3 className="font-semibold group-hover:text-primary">
                                        {course.title}
                                    </h3>
                                    <span
                                        className="h-3 w-3 rounded-full"
                                        style={{ backgroundColor: course.color }}
                                    />
                                </div>
                                {course.description && (
                                    <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                                        {course.description}
                                    </p>
                                )}
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>{course.modules_count} modules</span>
                                    <span>{course.progress_percentage}%</span>
                                </div>
                                {course.progress_percentage > 0 && (
                                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary">
                                        <div
                                            className="h-full bg-primary transition-all"
                                            style={{ width: `${course.progress_percentage}%` }}
                                        />
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

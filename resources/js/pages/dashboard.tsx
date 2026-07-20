import { Head, Link } from '@inertiajs/react';
import { AlertCircle, BookOpen, Clock, Code2, FileText, Folder, Mic, Tag, CheckCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, Course, Error } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

type Stats = {
    total_courses: number;
    completed_courses: number;
    total_modules: number;
    total_lessons: number;
    total_notes: number;
    total_attachments: number;
    total_code_snippets: number;
    total_voice_recordings: number;
    total_tags: number;
    total_errors: number;
    total_study_time: number;
    average_progress: number;
};

type StudySession = {
    id: number;
    duration_minutes: number;
    date: string;
    notes: string | null;
    lesson?: {
        id: number;
        title: string;
    };
};

type Props = {
    stats: Stats;
    recentCourses: (Course & { modules_count: number })[];
    recentErrors: Error[];
    recentStudySessions: StudySession[];
};

export default function Dashboard({ stats, recentCourses, recentErrors, recentStudySessions }: Props) {
    const statCards = [
        {
            title: 'Total Courses',
            value: stats.total_courses,
            icon: BookOpen,
            color: 'text-blue-600',
        },
        {
            title: 'Completed',
            value: stats.completed_courses,
            icon: CheckCircle,
            color: 'text-green-600',
        },
        {
            title: 'Modules',
            value: stats.total_modules,
            icon: Folder,
            color: 'text-purple-600',
        },
        {
            title: 'Lessons',
            value: stats.total_lessons,
            icon: FileText,
            color: 'text-orange-600',
        },
        {
            title: 'Notes',
            value: stats.total_notes,
            icon: FileText,
            color: 'text-indigo-600',
        },
        {
            title: 'Code Snippets',
            value: stats.total_code_snippets,
            icon: Code2,
            color: 'text-pink-600',
        },
        {
            title: 'Voice Recordings',
            value: stats.total_voice_recordings,
            icon: Mic,
            color: 'text-cyan-600',
        },
        {
            title: 'Attachments',
            value: stats.total_attachments,
            icon: FileText,
            color: 'text-teal-600',
        },
        {
            title: 'Errors Logged',
            value: stats.total_errors,
            icon: AlertCircle,
            color: 'text-red-600',
        },
        {
            title: 'Study Time',
            value: `${Math.round(stats.total_study_time / 60)}h`,
            icon: Clock,
            color: 'text-amber-600',
        },
        {
            title: 'Tags',
            value: stats.total_tags,
            icon: Tag,
            color: 'text-yellow-600',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <h1 className="text-2xl font-bold">Dashboard</h1>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => (
                        <div
                            key={stat.title}
                            className="rounded-lg border bg-card p-4 transition-colors hover:border-primary/50"
                        >
                            <div className="flex items-center justify-between">
                                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                                <span className="text-3xl font-bold">{stat.value}</span>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">{stat.title}</p>
                        </div>
                    ))}
                </div>

                <div className="rounded-lg border bg-card p-4">
                    <h2 className="mb-4 text-lg font-semibold">Average Progress</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <div className="h-4 w-full overflow-hidden rounded-full bg-secondary">
                                <div
                                    className="h-full bg-primary transition-all"
                                    style={{ width: `${stats.average_progress}%` }}
                                />
                            </div>
                        </div>
                        <span className="text-2xl font-bold">{Math.round(stats.average_progress)}%</span>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-lg font-semibold">Recent Courses</h2>
                        {recentCourses.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No courses yet</p>
                        ) : (
                            <div className="space-y-2">
                                {recentCourses.map((course) => (
                                    <Link
                                        key={course.id}
                                        href={`/courses/${course.id}`}
                                        className="flex items-center justify-between rounded-md border p-3 transition-colors hover:border-primary/50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="h-4 w-4 rounded-full"
                                                style={{ backgroundColor: course.color }}
                                            />
                                            <div>
                                                <h3 className="font-medium">{course.title}</h3>
                                                <p className="text-xs text-muted-foreground">
                                                    {course.modules_count} modules
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium">
                                            {course.progress_percentage}%
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-lg font-semibold">Recent Errors</h2>
                        {recentErrors.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No errors logged yet</p>
                        ) : (
                            <div className="space-y-2">
                                {recentErrors.map((error) => (
                                    <Link
                                        key={error.id}
                                        href={`/errors/${error.id}`}
                                        className="flex items-center justify-between rounded-md border p-3 transition-colors hover:border-primary/50"
                                    >
                                        <div>
                                            <h3 className="font-medium">{error.title}</h3>
                                            {error.error_code && (
                                                <p className="text-xs text-muted-foreground">
                                                    {error.error_code}
                                                </p>
                                            )}
                                        </div>
                                        {error.time_spent_minutes && (
                                            <span className="text-xs text-muted-foreground">
                                                {error.time_spent_minutes} min
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-4">
                    <h2 className="mb-4 text-lg font-semibold">Recent Study Sessions</h2>
                    {recentStudySessions.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No study sessions yet</p>
                    ) : (
                        <div className="space-y-2">
                            {recentStudySessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="flex items-center justify-between rounded-md border p-3"
                                >
                                    <div>
                                        <h3 className="font-medium">
                                            {session.lesson?.title || 'General Study'}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">{session.date}</p>
                                    </div>
                                    <span className="text-sm font-medium">
                                        {session.duration_minutes} min
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

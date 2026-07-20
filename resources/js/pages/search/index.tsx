import { Head, Link } from '@inertiajs/react';
import { Search as SearchIcon } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Course, Module, Lesson, Tag } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Search',
        href: '/search',
    },
];

type Props = {
    query: string;
    results: {
        courses: Course[];
        modules: Module[];
        lessons: Lesson[];
        notes: any[];
        tags: Tag[];
    };
};

export default function SearchIndex({ query, results }: Props) {
    const totalResults =
        results.courses.length +
        results.modules.length +
        results.lessons.length +
        results.notes.length +
        results.tags.length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Search" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <h1 className="text-2xl font-bold">Search</h1>

                <form action="/search" method="GET" className="flex gap-2">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            name="q"
                            defaultValue={query}
                            placeholder="Search courses, modules, lessons, notes, tags..."
                            className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                    <button
                        type="submit"
                        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                    >
                        Search
                    </button>
                </form>

                {query && (
                    <p className="text-sm text-muted-foreground">
                        {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
                    </p>
                )}

                <div className="space-y-6">
                    {results.courses.length > 0 && (
                        <div>
                            <h2 className="mb-3 text-lg font-semibold">Courses</h2>
                            <div className="space-y-2">
                                {results.courses.map((course) => (
                                    <Link
                                        key={course.id}
                                        href={`/courses/${course.id}`}
                                        className="block rounded-md border p-3 transition-colors hover:border-primary/50"
                                    >
                                        <h3 className="font-medium">{course.title}</h3>
                                        {course.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                {course.description}
                                            </p>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {results.modules.length > 0 && (
                        <div>
                            <h2 className="mb-3 text-lg font-semibold">Modules</h2>
                            <div className="space-y-2">
                                {results.modules.map((module) => (
                                    <Link
                                        key={module.id}
                                        href={`/courses/modules/${module.id}`}
                                        className="block rounded-md border p-3 transition-colors hover:border-primary/50"
                                    >
                                        <h3 className="font-medium">{module.title}</h3>
                                        {module.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                {module.description}
                                            </p>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {results.lessons.length > 0 && (
                        <div>
                            <h2 className="mb-3 text-lg font-semibold">Lessons</h2>
                            <div className="space-y-2">
                                {results.lessons.map((lesson) => (
                                    <Link
                                        key={lesson.id}
                                        href={`/lessons/${lesson.id}`}
                                        className="block rounded-md border p-3 transition-colors hover:border-primary/50"
                                    >
                                        <h3 className="font-medium">{lesson.title}</h3>
                                        {lesson.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                {lesson.description}
                                            </p>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {results.tags.length > 0 && (
                        <div>
                            <h2 className="mb-3 text-lg font-semibold">Tags</h2>
                            <div className="flex flex-wrap gap-2">
                                {results.tags.map((tag) => (
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

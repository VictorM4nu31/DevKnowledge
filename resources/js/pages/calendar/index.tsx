import { Head } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Calendar',
        href: '/calendar',
    },
];

type Review = {
    id: number;
    review_date: string;
    interval_type: string;
    completed: boolean;
    reviewable: {
        id: number;
        title: string;
    };
};

type StudySession = {
    id: number;
    date: string;
    duration_minutes: number;
    lesson?: {
        id: number;
        title: string;
    };
};

type Props = {
    currentMonth: string;
    reviews: Record<string, Review[]>;
    studySessions: Record<string, StudySession[]>;
};

export default function CalendarIndex({ currentMonth, reviews, studySessions }: Props) {
    const [month, setMonth] = useState(currentMonth);

    const changeMonth = (delta: number) => {
        const date = new Date(month + '-01');
        date.setMonth(date.getMonth() + delta);
        const newMonth = date.toISOString().slice(0, 7);
        setMonth(newMonth);
        window.location.href = `/calendar?month=${newMonth}`;
    };

    const date = new Date(month + '-01');
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    const firstDay = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const days = [];

    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const formatDate = (day: number) => {
        return `${month}-${day.toString().padStart(2, '0')}`;
    };

    const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Study Calendar" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Study Calendar</h1>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => changeMonth(-1)}
                            className="rounded-md border border-input bg-background p-2 hover:bg-accent"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="min-w-[150px] text-center font-medium">{monthName}</span>
                        <button
                            onClick={() => changeMonth(1)}
                            className="rounded-md border border-input bg-background p-2 hover:bg-accent"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-4">
                    <div className="grid grid-cols-7 gap-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <div key={day} className="text-center text-sm font-medium text-muted-foreground">
                                {day}
                            </div>
                        ))}

                        {days.map((day, index) => {
                            if (day === null) {
                                return <div key={index} className="aspect-square" />;
                            }

                            const dateStr = formatDate(day);
                            const dayReviews = reviews[dateStr] || [];
                            const daySessions = studySessions[dateStr] || [];
                            const hasItems = dayReviews.length > 0 || daySessions.length > 0;

                            return (
                                <div
                                    key={index}
                                    className={`aspect-square rounded-md border p-2 ${
                                        hasItems ? 'border-primary/50 bg-primary/5' : 'border-border'
                                    }`}
                                >
                                    <div className="text-sm font-medium">{day}</div>
                                    {dayReviews.length > 0 && (
                                        <div className="mt-1 space-y-1">
                                            {dayReviews.slice(0, 2).map((review) => (
                                                <div
                                                    key={review.id}
                                                    className="truncate text-xs text-muted-foreground"
                                                >
                                                    {review.reviewable.title}
                                                </div>
                                            ))}
                                            {dayReviews.length > 2 && (
                                                <div className="text-xs text-muted-foreground">
                                                    +{dayReviews.length - 2} more
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {daySessions.length > 0 && (
                                        <div className="mt-1 text-xs text-muted-foreground">
                                            {daySessions.reduce((sum, s) => sum + s.duration_minutes, 0)} min
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

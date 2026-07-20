export type Course = {
    id: number;
    user_id: number;
    title: string;
    description: string | null;
    color: string;
    icon: string | null;
    is_completed: boolean;
    completed_at: string | null;
    progress_percentage: number;
    created_at: string;
    updated_at: string;
    modules?: Module[];
    tags?: Tag[];
};

export type Module = {
    id: number;
    course_id: number;
    title: string;
    description: string | null;
    order: number;
    is_completed: boolean;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
    course?: Course;
    lessons?: Lesson[];
};

export type Lesson = {
    id: number;
    module_id: number;
    title: string;
    description: string | null;
    order: number;
    is_completed: boolean;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
    module?: Module;
    note?: Note;
    attachments?: Attachment[];
    code_snippets?: CodeSnippet[];
};

export type Note = {
    id: number;
    lesson_id: number;
    content: string | null;
    created_at: string;
    updated_at: string;
};

export type Attachment = {
    id: number;
    lesson_id: number;
    filename: string;
    path: string;
    mime_type: string;
    size: number;
    type: 'image' | 'pdf' | 'audio' | 'video' | 'other';
    created_at: string;
    updated_at: string;
};

export type Tag = {
    id: number;
    user_id: number;
    name: string;
    slug: string;
    color: string;
    created_at: string;
    updated_at: string;
};

export type CodeSnippet = {
    id: number;
    lesson_id: number;
    title: string;
    language: string;
    code: string;
    description: string | null;
    created_at: string;
    updated_at: string;
};

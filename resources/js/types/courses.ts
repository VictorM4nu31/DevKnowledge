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
    voice_recordings?: VoiceRecording[];
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

export type VoiceRecording = {
    id: number;
    lesson_id: number;
    title: string;
    path: string;
    duration: number;
    size: number;
    description: string | null;
    created_at: string;
    updated_at: string;
};

export type Error = {
    id: number;
    user_id: number;
    title: string;
    error_message: string;
    cause: string | null;
    solution: string;
    explanation: string | null;
    error_code: string | null;
    screenshot_path: string | null;
    time_spent_minutes: number | null;
    created_at: string;
    updated_at: string;
    tags?: Tag[];
};

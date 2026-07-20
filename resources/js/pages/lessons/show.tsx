import { Head, Link, useForm } from '@inertiajs/react';
import MDEditor from '@uiw/react-md-editor';
import { ArrowLeft, Mic, Trash2 } from 'lucide-react';
import { useState, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Lesson } from '@/types';

type Props = {
    lesson: Lesson;
};

export default function LessonsShow({ lesson }: Props) {
    const { delete: destroy, processing: deleting } = useForm();
    const { data: noteData, setData: setNoteData, post, processing: savingNote } = useForm({
        content: lesson.note?.content || '',
    });

    const { data: fileData, setData: setFileData, processing: uploadingFile, reset: resetFile } = useForm({
        file: null as File | null,
    });

    const { data: snippetData, setData: setSnippetData, processing: savingSnippet, reset: resetSnippet } = useForm({
        title: '',
        language: 'php',
        code: '',
        description: '',
    });

    const { data: recordingData, setData: setRecordingData, processing: uploadingRecording, reset: resetRecording } = useForm({
        recording: null as File | null,
        title: '',
        duration: 0,
        description: '',
    });

    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Courses',
            href: '/courses',
        },
        {
            title: lesson.module?.course?.title || '',
            href: `/courses/${lesson.module?.course_id}`,
        },
        {
            title: lesson.module?.title || '',
            href: `/courses/modules/${lesson.module_id}`,
        },
        {
            title: lesson.title,
            href: `/lessons/${lesson.id}`,
        },
    ];

    const saveNote = () => {
        post(`/lessons/${lesson.id}/note`);
    };

    const uploadFile = (e: React.FormEvent) => {
        e.preventDefault();

        if (!fileData.file) {
            return;
        }

        post(`/lessons/${lesson.id}/attachments`, {
            onSuccess: () => resetFile(),
        });
    };

    const addSnippet = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/lessons/${lesson.id}/code-snippets`, {
            onSuccess: () => resetSnippet(),
        });
    };

    const deleteLesson = () => {
        if (confirm('Are you sure you want to delete this lesson?')) {
            destroy(`/lessons/${lesson.id}`);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
                setRecordingData('recording', file);
                setRecordingData('duration', recordingTime);
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } catch (err) {
            console.error('Error accessing microphone:', err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    };

    const uploadRecording = (e: React.FormEvent) => {
        e.preventDefault();

        if (!recordingData.recording || !recordingData.title) {
            return;
        }

        post(`/lessons/${lesson.id}/voice-recordings`, {
            onSuccess: () => {
                resetRecording();
                setRecordingTime(0);
            },
        });
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={lesson.title} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/courses/modules/${lesson.module_id}`}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">{lesson.title}</h1>
                            {lesson.description && (
                                <p className="text-sm text-muted-foreground">{lesson.description}</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={deleteLesson}
                        disabled={deleting}
                        className="inline-flex items-center gap-2 rounded-md border border-destructive bg-background px-3 py-1.5 text-sm text-destructive hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-lg font-semibold">Notes</h2>
                        <div data-color-mode="light">
                            <MDEditor
                                value={noteData.content}
                                onChange={(val) => setNoteData('content', val || '')}
                                height={400}
                            />
                        </div>
                        <button
                            onClick={saveNote}
                            disabled={savingNote}
                            className="mt-3 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        >
                            {savingNote ? 'Saving...' : 'Save Notes'}
                        </button>
                    </div>

                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-lg font-semibold">Code Snippets</h2>
                        {lesson.code_snippets && lesson.code_snippets.length > 0 && (
                            <div className="mb-4 space-y-3">
                                {lesson.code_snippets.map((snippet) => (
                                    <div key={snippet.id} className="rounded-md border p-3">
                                        <h3 className="mb-2 font-medium">{snippet.title}</h3>
                                        <pre className="overflow-x-auto rounded-md bg-muted p-3">
                                            <code className={`language-${snippet.language}`}>
                                                {snippet.code}
                                            </code>
                                        </pre>
                                        {snippet.description && (
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                {snippet.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        <form onSubmit={addSnippet} className="space-y-3 border-t pt-4">
                            <h3 className="text-sm font-medium">Add Code Snippet</h3>
                            <input
                                type="text"
                                value={snippetData.title}
                                onChange={(e) => setSnippetData('title', e.target.value)}
                                placeholder="Snippet title"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            <select
                                value={snippetData.language}
                                onChange={(e) => setSnippetData('language', e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="php">PHP</option>
                                <option value="javascript">JavaScript</option>
                                <option value="typescript">TypeScript</option>
                                <option value="python">Python</option>
                                <option value="ruby">Ruby</option>
                                <option value="java">Java</option>
                                <option value="go">Go</option>
                                <option value="rust">Rust</option>
                            </select>
                            <textarea
                                value={snippetData.code}
                                onChange={(e) => setSnippetData('code', e.target.value)}
                                placeholder="Code"
                                rows={6}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
                            />
                            <input
                                type="text"
                                value={snippetData.description}
                                onChange={(e) => setSnippetData('description', e.target.value)}
                                placeholder="Description (optional)"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            <button
                                type="submit"
                                disabled={savingSnippet}
                                className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                            >
                                Add Snippet
                            </button>
                        </form>
                    </div>

                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-lg font-semibold">Attachments</h2>
                        {lesson.attachments && lesson.attachments.length > 0 && (
                            <div className="mb-4 space-y-2">
                                {lesson.attachments.map((attachment) => (
                                    <div
                                        key={attachment.id}
                                        className="flex items-center justify-between rounded-md border p-3"
                                    >
                                        <div>
                                            <p className="font-medium">{attachment.filename}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {attachment.type} • {(attachment.size / 1024).toFixed(1)} KB
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <form onSubmit={uploadFile} className="space-y-3 border-t pt-4">
                            <h3 className="text-sm font-medium">Upload File</h3>
                            <input
                                type="file"
                                onChange={(e) => setFileData('file', e.target.files?.[0] || null)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            <button
                                type="submit"
                                disabled={uploadingFile || !fileData.file}
                                className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                            >
                                Upload
                            </button>
                        </form>
                    </div>

                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-lg font-semibold">Voice Recordings</h2>
                        {lesson.voice_recordings && lesson.voice_recordings.length > 0 && (
                            <div className="mb-4 space-y-2">
                                {lesson.voice_recordings.map((recording) => (
                                    <div
                                        key={recording.id}
                                        className="flex items-center justify-between rounded-md border p-3"
                                    >
                                        <div>
                                            <p className="font-medium">{recording.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatTime(recording.duration)} • {(recording.size / 1024).toFixed(1)} KB
                                            </p>
                                            {recording.description && (
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {recording.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="space-y-3 border-t pt-4">
                            <h3 className="text-sm font-medium">Record Voice</h3>
                            <div className="flex items-center gap-2">
                                {!isRecording ? (
                                    <button
                                        type="button"
                                        onClick={startRecording}
                                        className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
                                    >
                                        <Mic className="h-4 w-4" />
                                        Start Recording
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={stopRecording}
                                        className="inline-flex items-center gap-2 rounded-md bg-gray-600 px-3 py-1.5 text-sm text-white hover:bg-gray-700"
                                    >
                                        Stop Recording
                                    </button>
                                )}
                                {isRecording && (
                                    <span className="text-sm text-red-600">
                                        Recording... {formatTime(recordingTime)}
                                    </span>
                                )}
                            </div>
                            {recordingData.recording && !isRecording && (
                                <form onSubmit={uploadRecording} className="space-y-2">
                                    <input
                                        type="text"
                                        value={recordingData.title}
                                        onChange={(e) => setRecordingData('title', e.target.value)}
                                        placeholder="Recording title"
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    />
                                    <input
                                        type="text"
                                        value={recordingData.description}
                                        onChange={(e) => setRecordingData('description', e.target.value)}
                                        placeholder="Description (optional)"
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={uploadingRecording || !recordingData.title}
                                        className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                                    >
                                        Save Recording
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

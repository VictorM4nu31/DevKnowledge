<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    /**
     * Export course to Markdown.
     */
    public function markdown(Course $course): StreamedResponse
    {
        $course->load(['modules.lessons.note', 'modules.lessons.codeSnippets', 'modules.lessons.attachments']);

        $markdown = "# {$course->title}\n\n";

        if ($course->description) {
            $markdown .= "{$course->description}\n\n";
        }

        foreach ($course->modules as $module) {
            $markdown .= "## {$module->title}\n\n";

            if ($module->description) {
                $markdown .= "{$module->description}\n\n";
            }

            foreach ($module->lessons as $lesson) {
                $markdown .= "### {$lesson->title}\n\n";

                if ($lesson->description) {
                    $markdown .= "{$lesson->description}\n\n";
                }

                if ($lesson->note && $lesson->note->content) {
                    $markdown .= "{$lesson->note->content}\n\n";
                }

                if ($lesson->codeSnippets->isNotEmpty()) {
                    foreach ($lesson->codeSnippets as $snippet) {
                        $markdown .= "#### {$snippet->title}\n\n";
                        $markdown .= "```{$snippet->language}\n{$snippet->code}\n```\n\n";
                        if ($snippet->description) {
                            $markdown .= "{$snippet->description}\n\n";
                        }
                    }
                }
            }
        }

        $filename = str_replace(' ', '_', $course->title).'.md';

        return response()->streamDownload(function () use ($markdown) {
            echo $markdown;
        }, $filename, [
            'Content-Type' => 'text/markdown',
        ]);
    }

    /**
     * Export course to HTML (for PDF conversion).
     */
    public function html(Course $course): StreamedResponse
    {
        $course->load(['modules.lessons.note', 'modules.lessons.codeSnippets']);

        $html = '<!DOCTYPE html><html><head>';
        $html .= '<meta charset="UTF-8">';
        $html .= '<title>'.e($course->title).'</title>';
        $html .= '<style>body{font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:20px;}';
        $html .= 'h1{color:#333;border-bottom:2px solid #333;padding-bottom:10px;}';
        $html .= 'h2{color:#555;margin-top:30px;border-bottom:1px solid #ddd;padding-bottom:5px;}';
        $html .= 'h3{color:#666;margin-top:20px;}';
        $html .= 'pre{background:#f5f5f5;padding:15px;border-radius:5px;overflow-x:auto;}';
        $html .= 'code{font-family:monospace;}</style></head><body>';

        $html .= '<h1>'.e($course->title).'</h1>';

        if ($course->description) {
            $html .= '<p>'.e($course->description).'</p>';
        }

        foreach ($course->modules as $module) {
            $html .= '<h2>'.e($module->title).'</h2>';

            if ($module->description) {
                $html .= '<p>'.e($module->description).'</p>';
            }

            foreach ($module->lessons as $lesson) {
                $html .= '<h3>'.e($lesson->title).'</h3>';

                if ($lesson->description) {
                    $html .= '<p>'.e($lesson->description).'</p>';
                }

                if ($lesson->note && $lesson->note->content) {
                    $html .= '<div>'.nl2br(e($lesson->note->content)).'</div>';
                }

                if ($lesson->codeSnippets->isNotEmpty()) {
                    foreach ($lesson->codeSnippets as $snippet) {
                        $html .= '<h4>'.e($snippet->title).'</h4>';
                        $html .= '<pre><code>'.e($snippet->code).'</code></pre>';
                        if ($snippet->description) {
                            $html .= '<p>'.e($snippet->description).'</p>';
                        }
                    }
                }
            }
        }

        $html .= '</body></html>';

        $filename = str_replace(' ', '_', $course->title).'.html';

        return response()->streamDownload(function () use ($html) {
            echo $html;
        }, $filename, [
            'Content-Type' => 'text/html',
        ]);
    }
}

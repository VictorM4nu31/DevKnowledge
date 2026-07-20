<?php

namespace App\Policies;

use App\Models\CodeSnippet;
use App\Models\User;

class CodeSnippetPolicy
{
    public function update(User $user, CodeSnippet $codeSnippet): bool
    {
        return $codeSnippet->lesson->module->course->user_id === $user->id;
    }

    public function delete(User $user, CodeSnippet $codeSnippet): bool
    {
        return $codeSnippet->lesson->module->course->user_id === $user->id;
    }
}

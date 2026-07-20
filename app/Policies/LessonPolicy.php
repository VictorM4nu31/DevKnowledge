<?php

namespace App\Policies;

use App\Models\Lesson;
use App\Models\User;

class LessonPolicy
{
    public function view(User $user, Lesson $lesson): bool
    {
        return $lesson->module->course->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Lesson $lesson): bool
    {
        return $lesson->module->course->user_id === $user->id;
    }

    public function delete(User $user, Lesson $lesson): bool
    {
        return $lesson->module->course->user_id === $user->id;
    }
}

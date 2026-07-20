<?php

namespace App\Policies;

use App\Models\StudySession;
use App\Models\User;

class StudySessionPolicy
{
    public function delete(User $user, StudySession $studySession): bool
    {
        return $studySession->user_id === $user->id;
    }
}

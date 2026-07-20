<?php

namespace App\Policies;

use App\Models\User;
use App\Models\VoiceRecording;

class VoiceRecordingPolicy
{
    public function delete(User $user, VoiceRecording $voiceRecording): bool
    {
        return $voiceRecording->lesson->module->course->user_id === $user->id;
    }
}

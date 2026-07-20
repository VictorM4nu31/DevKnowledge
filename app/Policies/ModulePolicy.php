<?php

namespace App\Policies;

use App\Models\Module;
use App\Models\User;

class ModulePolicy
{
    public function view(User $user, Module $module): bool
    {
        return $module->course->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Module $module): bool
    {
        return $module->course->user_id === $user->id;
    }

    public function delete(User $user, Module $module): bool
    {
        return $module->course->user_id === $user->id;
    }
}

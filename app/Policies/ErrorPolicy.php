<?php

namespace App\Policies;

use App\Models\Error;
use App\Models\User;

class ErrorPolicy
{
    public function view(User $user, Error $error): bool
    {
        return $error->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Error $error): bool
    {
        return $error->user_id === $user->id;
    }

    public function delete(User $user, Error $error): bool
    {
        return $error->user_id === $user->id;
    }
}

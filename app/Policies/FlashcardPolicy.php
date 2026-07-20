<?php

namespace App\Policies;

use App\Models\Flashcard;
use App\Models\User;

class FlashcardPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Flashcard $flashcard): bool
    {
        return $flashcard->deck->user_id === $user->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Flashcard $flashcard): bool
    {
        return $flashcard->deck->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Flashcard $flashcard): bool
    {
        return $flashcard->deck->user_id === $user->id;
    }
}

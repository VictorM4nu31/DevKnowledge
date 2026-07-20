<?php

namespace App\Models;

use Database\Factories\ErrorFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string $error_message
 * @property string|null $cause
 * @property string $solution
 * @property string|null $explanation
 * @property string|null $error_code
 * @property string|null $screenshot_path
 * @property int|null $time_spent_minutes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['user_id', 'title', 'error_message', 'cause', 'solution', 'explanation', 'error_code', 'screenshot_path', 'time_spent_minutes'])]
class Error extends Model
{
    /** @use HasFactory<ErrorFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return MorphToMany<Tag, $this>
     */
    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'time_spent_minutes' => 'integer',
        ];
    }
}

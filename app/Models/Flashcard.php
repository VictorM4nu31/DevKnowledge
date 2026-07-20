<?php

namespace App\Models;

use Database\Factories\FlashcardFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $flashcard_deck_id
 * @property string $question
 * @property string $answer
 * @property int $interval
 * @property int $repetition
 * @property float $ease_factor
 * @property Carbon|null $next_review
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['flashcard_deck_id', 'question', 'answer', 'interval', 'repetition', 'ease_factor', 'next_review'])]
class Flashcard extends Model
{
    /** @use HasFactory<FlashcardFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<FlashcardDeck, $this>
     */
    public function deck(): BelongsTo
    {
        return $this->belongsTo(FlashcardDeck::class, 'flashcard_deck_id');
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'interval' => 'integer',
            'repetition' => 'integer',
            'ease_factor' => 'float',
            'next_review' => 'date',
        ];
    }
}

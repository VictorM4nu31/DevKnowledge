<?php

namespace Database\Factories;

use App\Models\Flashcard;
use App\Models\FlashcardDeck;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Flashcard>
 */
class FlashcardFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'flashcard_deck_id' => FlashcardDeck::factory(),
            'question' => $this->faker->sentence(),
            'answer' => $this->faker->paragraph(),
            'interval' => 0,
            'repetition' => 0,
            'ease_factor' => 2.5,
            'next_review' => null,
        ];
    }
}

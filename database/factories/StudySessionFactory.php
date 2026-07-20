<?php

namespace Database\Factories;

use App\Models\Lesson;
use App\Models\StudySession;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StudySession>
 */
class StudySessionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'lesson_id' => Lesson::factory(),
            'duration_minutes' => $this->faker->numberBetween(15, 120),
            'date' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'notes' => $this->faker->paragraph(),
        ];
    }
}

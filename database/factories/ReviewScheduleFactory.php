<?php

namespace Database\Factories;

use App\Models\Lesson;
use App\Models\ReviewSchedule;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ReviewSchedule>
 */
class ReviewScheduleFactory extends Factory
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
            'reviewable_type' => Lesson::class,
            'reviewable_id' => Lesson::factory(),
            'review_date' => $this->faker->dateTimeBetween('now', '+1 month'),
            'interval_type' => $this->faker->randomElement(['tomorrow', 'week', 'month']),
            'completed' => false,
        ];
    }
}

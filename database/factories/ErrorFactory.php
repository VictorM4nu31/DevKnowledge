<?php

namespace Database\Factories;

use App\Models\Error;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Error>
 */
class ErrorFactory extends Factory
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
            'title' => $this->faker->sentence(4),
            'error_message' => 'SQLSTATE[42S02]: Base table or view not found',
            'cause' => $this->faker->paragraph(),
            'solution' => 'php artisan migrate',
            'explanation' => $this->faker->paragraph(),
            'error_code' => 'SQLSTATE[42S02]',
            'time_spent_minutes' => $this->faker->numberBetween(10, 180),
        ];
    }
}

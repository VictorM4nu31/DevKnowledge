<?php

namespace Database\Factories;

use App\Models\Lesson;
use App\Models\VoiceRecording;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<VoiceRecording>
 */
class VoiceRecordingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'lesson_id' => Lesson::factory(),
            'title' => $this->faker->sentence(3),
            'path' => 'voice_recordings/'.$this->faker->uuid().'.webm',
            'duration' => $this->faker->numberBetween(30, 600),
            'size' => $this->faker->numberBetween(102400, 5242880),
            'description' => $this->faker->paragraph(),
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\Attachment;
use App\Models\Lesson;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Attachment>
 */
class AttachmentFactory extends Factory
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
            'filename' => $this->faker->word().'.'.$this->faker->fileExtension(),
            'path' => 'attachments/'.$this->faker->uuid().'.'.$this->faker->fileExtension(),
            'mime_type' => $this->faker->mimeType(),
            'size' => $this->faker->numberBetween(1024, 10485760),
            'type' => $this->faker->randomElement(['image', 'pdf', 'audio', 'video', 'other']),
        ];
    }
}

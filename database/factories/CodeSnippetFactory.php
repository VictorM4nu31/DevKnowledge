<?php

namespace Database\Factories;

use App\Models\CodeSnippet;
use App\Models\Lesson;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CodeSnippet>
 */
class CodeSnippetFactory extends Factory
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
            'title' => $this->faker->sentence(2),
            'language' => $this->faker->randomElement(['php', 'javascript', 'python', 'ruby', 'java', 'go', 'rust']),
            'code' => '<?php echo "Hello World"; ?>',
            'description' => $this->faker->paragraph(),
        ];
    }
}

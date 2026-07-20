<?php

namespace Database\Seeders;

use App\Models\CodeSnippet;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\Note;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();

        if (! $user) {
            $user = User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        }

        $tags = [
            ['name' => 'Laravel', 'color' => '#FF2D20'],
            ['name' => 'PHP', 'color' => '#777BB4'],
            ['name' => 'JavaScript', 'color' => '#F7DF1E'],
            ['name' => 'React', 'color' => '#61DAFB'],
            ['name' => 'Database', 'color' => '#4479A1'],
        ];

        foreach ($tags as $tagData) {
            Tag::firstOrCreate(
                ['slug' => Str::slug($tagData['name'])],
                [
                    'user_id' => $user->id,
                    'name' => $tagData['name'],
                    'color' => $tagData['color'],
                ]
            );
        }

        $course = Course::create([
            'user_id' => $user->id,
            'title' => 'Laravel Fundamentals',
            'description' => 'Learn the basics of Laravel framework',
            'color' => '#FF2D20',
            'icon' => 'book',
            'is_completed' => false,
            'progress_percentage' => 30,
        ]);

        $course->tags()->attach([1, 2]);

        $module1 = Module::create([
            'course_id' => $course->id,
            'title' => 'Routing',
            'description' => 'Learn how routing works in Laravel',
            'order' => 1,
            'is_completed' => true,
        ]);

        $module2 = Module::create([
            'course_id' => $course->id,
            'title' => 'Middleware',
            'description' => 'Understanding middleware in Laravel',
            'order' => 2,
            'is_completed' => false,
        ]);

        $lesson1 = Lesson::create([
            'module_id' => $module1->id,
            'title' => 'Basic Routes',
            'description' => 'How to define basic routes',
            'order' => 1,
            'is_completed' => true,
        ]);

        $lesson2 = Lesson::create([
            'module_id' => $module1->id,
            'title' => 'Route Parameters',
            'description' => 'Working with route parameters',
            'order' => 2,
            'is_completed' => true,
        ]);

        $lesson3 = Lesson::create([
            'module_id' => $module2->id,
            'title' => 'Creating Middleware',
            'description' => 'How to create custom middleware',
            'order' => 1,
            'is_completed' => false,
        ]);

        Note::create([
            'lesson_id' => $lesson1->id,
            'content' => "# Basic Routes\n\nLaravel routes are defined in `routes/web.php`.\n\n```php\nRoute::get('/', function () {\n    return view('welcome');\n});\n```\n\n## Route Methods\n\n- GET\n- POST\n- PUT\n- DELETE\n- PATCH",
        ]);

        Note::create([
            'lesson_id' => $lesson2->id,
            'content' => "# Route Parameters\n\n## Required Parameters\n\n```php\nRoute::get('/user/{id}', function (\$id) {\n    return 'User '.\$id;\n});\n```\n\n## Optional Parameters\n\n```php\nRoute::get('/user/{name?}', function (\$name = null) {\n    return \$name;\n});\n```",
        ]);

        CodeSnippet::create([
            'lesson_id' => $lesson1->id,
            'title' => 'Basic Route Example',
            'language' => 'php',
            'code' => "Route::get('/hello', function () {\n    return 'Hello World!';\n});",
            'description' => 'A simple GET route',
        ]);

        CodeSnippet::create([
            'lesson_id' => $lesson3->id,
            'title' => 'Middleware Example',
            'language' => 'php',
            'code' => "class CheckAge\n{\n    public function handle(\$request, Closure \$next)\n    {\n        if (\$request->age < 18) {\n            return redirect('/');\n        }\n        return \$next(\$request);\n    }\n}",
            'description' => 'Custom middleware example',
        ]);

        $course2 = Course::create([
            'user_id' => $user->id,
            'title' => 'React Essentials',
            'description' => 'Master React fundamentals',
            'color' => '#61DAFB',
            'icon' => 'code',
            'is_completed' => false,
            'progress_percentage' => 15,
        ]);

        $course2->tags()->attach([3, 4]);

        Module::create([
            'course_id' => $course2->id,
            'title' => 'Components',
            'description' => 'React components and props',
            'order' => 1,
            'is_completed' => false,
        ]);
    }
}

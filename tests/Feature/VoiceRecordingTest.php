<?php

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\User;
use App\Models\VoiceRecording;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->course = Course::factory()->create(['user_id' => $this->user->id]);
    $this->module = Module::factory()->create(['course_id' => $this->course->id]);
    $this->lesson = Lesson::factory()->create(['module_id' => $this->module->id]);
});

test('authenticated user can upload voice recording to lesson', function () {
    Storage::fake('local');

    $file = UploadedFile::fake()->create('recording.webm', 100, 'audio/webm');

    $this->actingAs($this->user)
        ->post("/lessons/{$this->lesson->id}/voice-recordings", [
            'recording' => $file,
            'title' => 'Test Recording',
            'duration' => 60,
            'description' => 'Test description',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('voice_recordings', [
        'lesson_id' => $this->lesson->id,
        'title' => 'Test Recording',
        'duration' => 60,
    ]);
});

test('recording file is required', function () {
    $this->actingAs($this->user)
        ->post("/lessons/{$this->lesson->id}/voice-recordings", [
            'title' => 'Test Recording',
            'duration' => 60,
        ])
        ->assertSessionHasErrors('recording');
});

test('recording title is required', function () {
    Storage::fake('local');
    $file = UploadedFile::fake()->create('recording.webm', 100, 'audio/webm');

    $this->actingAs($this->user)
        ->post("/lessons/{$this->lesson->id}/voice-recordings", [
            'recording' => $file,
            'duration' => 60,
        ])
        ->assertSessionHasErrors('title');
});

test('user can delete their voice recording', function () {
    Storage::fake('local');

    $recording = VoiceRecording::factory()->create([
        'lesson_id' => $this->lesson->id,
        'path' => 'voice_recordings/test.webm',
    ]);

    Storage::disk('local')->put('voice_recordings/test.webm', 'test content');

    $this->actingAs($this->user)
        ->delete("/voice-recordings/{$recording->id}")
        ->assertRedirect();

    $this->assertDatabaseMissing('voice_recordings', ['id' => $recording->id]);
});

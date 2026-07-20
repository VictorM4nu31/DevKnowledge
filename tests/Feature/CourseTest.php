<?php

use App\Models\Course;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('authenticated user can view courses index', function () {
    $this->actingAs($this->user)
        ->get('/courses')
        ->assertOk();
});

test('unauthenticated user cannot view courses', function () {
    $this->get('/courses')
        ->assertRedirect('/login');
});

test('authenticated user can create a course', function () {
    $this->actingAs($this->user)
        ->post('/courses', [
            'title' => 'Test Course',
            'description' => 'Test Description',
            'color' => '#FF0000',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('courses', [
        'title' => 'Test Course',
        'user_id' => $this->user->id,
    ]);
});

test('course title is required', function () {
    $this->actingAs($this->user)
        ->post('/courses', [
            'description' => 'Test Description',
        ])
        ->assertSessionHasErrors('title');
});

test('user can view a course', function () {
    $course = Course::factory()->create(['user_id' => $this->user->id]);

    $this->actingAs($this->user)
        ->get("/courses/{$course->id}")
        ->assertOk()
        ->assertSee($course->title);
});

test('user cannot view another users course', function () {
    $otherUser = User::factory()->create();
    $course = Course::factory()->create(['user_id' => $otherUser->id]);

    $this->actingAs($this->user)
        ->get("/courses/{$course->id}")
        ->assertForbidden();
});

test('user can update their course', function () {
    $course = Course::factory()->create(['user_id' => $this->user->id]);

    $this->actingAs($this->user)
        ->put("/courses/{$course->id}", [
            'title' => 'Updated Title',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('courses', [
        'id' => $course->id,
        'title' => 'Updated Title',
    ]);
});

test('user can delete their course', function () {
    $course = Course::factory()->create(['user_id' => $this->user->id]);

    $this->actingAs($this->user)
        ->delete("/courses/{$course->id}")
        ->assertRedirect('/courses');

    $this->assertDatabaseMissing('courses', ['id' => $course->id]);
});

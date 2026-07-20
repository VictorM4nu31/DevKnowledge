<?php

use App\Models\Error;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('authenticated user can view errors index', function () {
    $this->actingAs($this->user)
        ->get('/errors')
        ->assertOk();
});

test('unauthenticated user cannot view errors', function () {
    $this->get('/errors')
        ->assertRedirect('/login');
});

test('authenticated user can create an error', function () {
    $this->actingAs($this->user)
        ->post('/errors', [
            'title' => 'Test Error',
            'error_message' => 'SQLSTATE[42S02]',
            'solution' => 'php artisan migrate',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('errors', [
        'title' => 'Test Error',
        'user_id' => $this->user->id,
    ]);
});

test('error title is required', function () {
    $this->actingAs($this->user)
        ->post('/errors', [
            'error_message' => 'Test error',
            'solution' => 'Test solution',
        ])
        ->assertSessionHasErrors('title');
});

test('error message is required', function () {
    $this->actingAs($this->user)
        ->post('/errors', [
            'title' => 'Test Error',
            'solution' => 'Test solution',
        ])
        ->assertSessionHasErrors('error_message');
});

test('solution is required', function () {
    $this->actingAs($this->user)
        ->post('/errors', [
            'title' => 'Test Error',
            'error_message' => 'Test error',
        ])
        ->assertSessionHasErrors('solution');
});

test('user can view their error', function () {
    $error = Error::factory()->create(['user_id' => $this->user->id]);

    $this->actingAs($this->user)
        ->get("/errors/{$error->id}")
        ->assertOk()
        ->assertSee($error->title);
});

test('user cannot view another users error', function () {
    $otherUser = User::factory()->create();
    $error = Error::factory()->create(['user_id' => $otherUser->id]);

    $this->actingAs($this->user)
        ->get("/errors/{$error->id}")
        ->assertForbidden();
});

test('user can update their error', function () {
    $error = Error::factory()->create(['user_id' => $this->user->id]);

    $this->actingAs($this->user)
        ->put("/errors/{$error->id}", [
            'title' => 'Updated Title',
            'error_message' => 'Updated message',
            'solution' => 'Updated solution',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('errors', [
        'id' => $error->id,
        'title' => 'Updated Title',
    ]);
});

test('user can delete their error', function () {
    $error = Error::factory()->create(['user_id' => $this->user->id]);

    $this->actingAs($this->user)
        ->delete("/errors/{$error->id}")
        ->assertRedirect('/errors');

    $this->assertDatabaseMissing('errors', ['id' => $error->id]);
});

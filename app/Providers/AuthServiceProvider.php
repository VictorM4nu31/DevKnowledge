<?php

namespace App\Providers;

use App\Models\Flashcard;
use App\Models\FlashcardDeck;
use App\Models\ReviewSchedule;
use App\Policies\FlashcardDeckPolicy;
use App\Policies\FlashcardPolicy;
use App\Policies\ReviewSchedulePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        FlashcardDeck::class => FlashcardDeckPolicy::class,
        Flashcard::class => FlashcardPolicy::class,
        ReviewSchedule::class => ReviewSchedulePolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}

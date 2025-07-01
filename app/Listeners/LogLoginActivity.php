<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Request;
use App\Models\ActivityLog;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Events\Attribute\AsEventListener;

#[AsEventListener]
class LogLoginActivity
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Login $event)
    {
        $user = $event->user;

        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'login',
            'target_type' => 'auth',
            'target_id' => $user->id,
            'meta' => [
                'ip' => Request::ip(),
                'agent' => Request::header('User-Agent'),
            ]
        ]);
    }
}

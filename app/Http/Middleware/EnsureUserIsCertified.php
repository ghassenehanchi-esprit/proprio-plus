<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsCertified
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    // app/Http/Middleware/EnsureUserIsCertified.php
    public function handle($request, Closure $next)
    {
        if ($request->user() && $request->user()->certification_status !== 'certifié') {
            abort(403, 'Votre compte n\'est pas encore certifié.');
        }
        return $next($request);
    }

}

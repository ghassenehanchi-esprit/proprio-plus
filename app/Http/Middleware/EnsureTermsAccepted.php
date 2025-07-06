<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureTermsAccepted
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        if ($user && !$user->terms_accepted_at && !$request->is('terms-acceptance')) {
            return redirect()->route('terms.show');
        }
        return $next($request);
    }
}

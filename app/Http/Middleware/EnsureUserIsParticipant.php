<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsParticipant
{
    public function handle(Request $request, Closure $next)
    {
        $conversation = $request->route('conversation');

        if (!in_array(auth()->id(), [$conversation->buyer_id, $conversation->seller_id])) {
            abort(Response::HTTP_FORBIDDEN, 'Vous ne participez pas à cette conversation.');
        }

        return $next($request);
    }
}

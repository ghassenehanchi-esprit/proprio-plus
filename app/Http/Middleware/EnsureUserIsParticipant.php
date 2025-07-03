<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Conversation;

class EnsureUserIsParticipant
{
    public function handle(Request $request, Closure $next)
    {
        $conversation = $request->route('conversation');

        if (!$conversation instanceof Conversation) {
            $conversation = Conversation::findOrFail($conversation);
            $request->route()->setParameter('conversation', $conversation);
        }

        if (!in_array(auth()->id(), [$conversation->buyer_id, $conversation->seller_id])) {
            abort(Response::HTTP_FORBIDDEN, 'Vous ne participez pas à cette conversation.');
        }

        return $next($request);
    }
}

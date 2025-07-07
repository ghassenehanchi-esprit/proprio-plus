<?php
namespace App\Http\Middleware;

use App\Models\Conversation;
use App\Models\Meeting;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureConversationIsOpen
{
    public function handle(Request $request, Closure $next): Response
    {
        $conversation = $request->route('conversation');

        if (!$conversation && $request->route('meeting')) {
            $meeting = $request->route('meeting');
            if (!$meeting instanceof Meeting) {
                $meeting = Meeting::findOrFail($meeting);
                $request->route()->setParameter('meeting', $meeting);
            }
            $conversation = $meeting->conversation;
        }

        if (!$conversation instanceof Conversation) {
            $conversation = Conversation::findOrFail($conversation);
            $request->route()->setParameter('conversation', $conversation);
        }

        if ($conversation->is_blocked || $conversation->is_closed) {
            abort(Response::HTTP_FORBIDDEN, 'Cette conversation est bloquée.');
        }

        return $next($request);
    }
}

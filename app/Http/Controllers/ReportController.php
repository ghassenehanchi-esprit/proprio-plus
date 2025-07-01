<?php
namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function index()
    {
        return response()->json(
            Report::where('reporter_id', Auth::id())->with('reported', 'conversation')->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'reported_user_id' => 'required|exists:users,id',
            'reason' => 'required|string',
            'conversation_id' => 'nullable|exists:conversations,id'
        ]);

        $existing = Report::where('reporter_id', Auth::id())
                          ->where('reported_user_id', $request->reported_user_id)
                          ->where('conversation_id', $request->conversation_id)
                          ->first();

        if ($existing) {
            return response()->json(['message' => 'Vous avez déjà signalé cet utilisateur.'], 409);
        }

        $report = Report::create([
            'reporter_id' => Auth::id(),
            'reported_user_id' => $request->reported_user_id,
            'conversation_id' => $request->conversation_id,
            'reason' => $request->reason,
            'status' => 'pending'
        ]);

        return response()->json(['message' => 'Signalement envoyé', 'report' => $report]);
    }
}

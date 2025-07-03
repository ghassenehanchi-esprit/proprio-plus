<?php
namespace App\Http\Controllers;

use App\Models\Clocking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClockingController extends Controller
{
    public function index()
    {
        $clockings = Clocking::where('user_id', Auth::id())->latest()->get();
        return response()->json($clockings);
    }

    public function clockIn(Request $request)
    {
        $request->validate(['note' => 'nullable|string']);

        $active = Clocking::where('user_id', Auth::id())
            ->whereNull('clock_out_at')
            ->first();
        if ($active) {
            return response()->json(['message' => 'Déjà pointé'], 409);
        }

        $clocking = Clocking::create([
            'user_id' => Auth::id(),
            'clock_in_at' => now(),
            'note' => $request->note,
        ]);

        return response()->json($clocking);
    }

    public function clockOut(Clocking $clocking)
    {
        if ($clocking->user_id !== Auth::id()) {
            abort(403);
        }
        if ($clocking->clock_out_at) {
            return response()->json(['message' => 'Déjà sorti'], 409);
        }

        $clocking->update(['clock_out_at' => now()]);

        return response()->json($clocking);
    }
}

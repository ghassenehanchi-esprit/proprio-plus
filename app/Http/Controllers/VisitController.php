<?php
namespace App\Http\Controllers;

use App\Models\Visit;
use Illuminate\Support\Facades\Auth;

class VisitController extends Controller
{
    public function index()
    {
        $buyerVisits = Visit::with('listing')
            ->where('user_id', Auth::id())
            ->whereIn('status', ['planifiee', 'accepted'])
            ->orderBy('visit_datetime')
            ->get();

        $sellerVisits = Visit::with('listing', 'user')
            ->whereHas('listing', function ($q) {
                $q->where('user_id', Auth::id());
            })
            ->whereIn('status', ['planifiee', 'accepted'])
            ->orderBy('visit_datetime')
            ->get();

        return response()->json([
            'as_buyer' => $buyerVisits,
            'as_seller' => $sellerVisits,
        ]);
    }
}

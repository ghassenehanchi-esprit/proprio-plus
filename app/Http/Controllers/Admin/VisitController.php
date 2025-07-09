<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Visit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VisitController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Visits/Index');
    }

    public function data(Request $request)
    {
        $visits = Visit::with(['listing', 'user', 'listing.user'])
            ->orderBy('visit_datetime', 'desc')
            ->paginate(10);

        return response()->json($visits);
    }
}

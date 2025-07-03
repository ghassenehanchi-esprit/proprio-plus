<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Clocking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClockingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Clockings/Index');
    }

    public function data(Request $request)
    {
        $query = Clocking::with('user');
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        $query->orderByDesc('clock_in_at');
        return $query->paginate(20);
    }
}

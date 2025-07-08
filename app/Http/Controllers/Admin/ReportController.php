<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Admin/Reports/Index', [
            'filters' => $request->only('status'),
        ]);
    }

    public function data(Request $request)
    {
        $query = Report::with(['reporter', 'reported', 'conversation.listing'])
            ->orderByDesc('created_at');

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $reports = $query->paginate(20);
        return $reports;
    }

    public function updateStatus(Report $report, Request $request)
    {
        $request->validate(['status' => 'required|in:pending,reviewed,blocked']);
        $report->update(['status' => $request->status]);
        return response()->json(['message' => 'Statut mis à jour']);
    }
}

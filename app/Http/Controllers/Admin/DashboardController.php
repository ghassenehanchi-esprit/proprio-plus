<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Listing;
use App\Models\Report;
use App\Models\Page;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'users' => User::count(),
            'listings' => Listing::count(),
            'active_listings' => Listing::active()->count(),
            'reports' => Report::count(),
            'pending_reports' => Report::where('status', 'pending')->count(),
            'pages' => Page::count(),
        ];

        $listingStatus = Listing::selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        return Inertia::render('Admin/Home/Index', [
            'stats' => $stats,
            'listingStatus' => $listingStatus,
        ]);
    }
}

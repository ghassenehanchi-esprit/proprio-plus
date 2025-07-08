<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Listing;
use Illuminate\Support\Facades\DB;
use App\Models\Report;
use App\Models\Page;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'users' => User::count(),
            'pending_users' => User::where('certification_status', 'en_attente')->count(),
            'verified_users' => User::where('certification_status', 'certifié')->count(),
            'online_users' => DB::table('sessions')
                ->where('last_activity', '>=', now()->subMinutes(5)->timestamp)
                ->distinct('user_id')->count('user_id'),
            'listings' => Listing::count(),
            'pending_listings' => Listing::where('status', 'pending')->count(),
            'sold_listings' => Listing::sold()->count(),
            'active_listings' => Listing::active()->count(),
            'reports' => Report::count(),
            'pending_reports' => Report::where('status', 'pending')->count(),
            'pages' => Page::count(),
        ];

        // Use the query builder directly to avoid the default withCount
        // defined on the Listing model which would otherwise add extra
        // columns and break the GROUP BY query.
        $listingStatus = DB::table('listings')
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        return Inertia::render('Admin/Home/Index', [
            'stats' => $stats,
            'listingStatus' => $listingStatus,
            'categories' => Category::pluck('name', 'id'),
        ]);
    }

    public function data(Request $request)
    {
        $query = Listing::query();

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->integer('category_id'));
        }

        if ($request->filled('city')) {
            $query->where('city', $request->string('city'));
        }

        $listingStatus = (clone $query)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        $listingCategories = (clone $query)
            ->select('category_id', DB::raw('count(*) as count'))
            ->groupBy('category_id')
            ->pluck('count', 'category_id');

        $stats = [
            'users' => User::count(),
            'pending_users' => User::where('certification_status', 'en_attente')->count(),
            'verified_users' => User::where('certification_status', 'certifié')->count(),
            'online_users' => DB::table('sessions')
                ->where('last_activity', '>=', now()->subMinutes(5)->timestamp)
                ->distinct('user_id')->count('user_id'),
            'listings' => $query->count(),
            'pending_listings' => (clone $query)->where('status', 'pending')->count(),
            'sold_listings' => (clone $query)->sold()->count(),
            'active_listings' => (clone $query)->where('status', 'active')->count(),
            'reports' => Report::count(),
            'pending_reports' => Report::where('status', 'pending')->count(),
            'pages' => Page::count(),
        ];

        return response()->json([
            'stats' => $stats,
            'listingStatus' => $listingStatus,
            'listingCategories' => $listingCategories,
            'categories' => Category::pluck('name', 'id'),
        ]);
    }
}

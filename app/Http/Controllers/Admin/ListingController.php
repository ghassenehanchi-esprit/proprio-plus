<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Enums\ListingStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ListingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Listings/Index');
    }

    public function data(Request $request)
    {
        $query = Listing::with('user:id,first_name,last_name', 'category:id,name');

        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        $sort = $request->input('sort', 'created_at');
        $dir = $request->input('dir', 'desc');
        $query->orderBy($sort, $dir);

        $perPage = (int) $request->input('per_page', 10);

        return $query->paginate($perPage);
    }

    public function setStatus(Request $request, Listing $listing)
    {
        $request->validate([
            'status' => 'required|in:' . implode(',', ListingStatus::values()),
        ]);

        $listing->update(['status' => $request->status]);

        return response()->json(['message' => 'Status mis à jour']);
    }
}

<?php
namespace App\Http\Controllers;

use App\Models\SavedSearch;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Notifications\SavedSearchMatchNotification;

class SavedSearchController extends Controller
{
    public function index()
    {
        return Auth::user()->savedSearches()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'nullable|string',
            'params' => 'required|array',
            'notify' => 'boolean',
        ]);
        $data['notify'] = $data['notify'] ?? true;
        $search = Auth::user()->savedSearches()->create($data);
        return $search;
    }

    public function update(Request $request, SavedSearch $search)
    {
        if ($search->user_id !== Auth::id()) {
            abort(403);
        }

        $data = $request->validate([
            'name' => 'nullable|string',
            'notify' => 'boolean',
        ]);

        $search->update($data);
        return $search;
    }

    public function destroy(SavedSearch $search)
    {
        if ($search->user_id !== Auth::id()) {
            abort(403);
        }
        $search->delete();
        return response()->json(['message' => 'Recherche supprimée']);
    }

    public static function notifyMatches(Listing $listing)
    {
        $searches = SavedSearch::where('notify', true)->get();
        foreach ($searches as $search) {
            if ($listing->matchesParams($search->params)) {
                $search->user->notify(new SavedSearchMatchNotification($search, $listing));
            }
        }
    }
}

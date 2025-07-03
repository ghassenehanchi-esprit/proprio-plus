<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $bestMatches = Listing::with('gallery')
            ->active()
            ->withCount(['conversations', 'favoritedBy as favorites_count'])
            ->orderByRaw('(conversations_count * 2 + favorites_count) desc')
            ->take(6)
            ->get();

        return Inertia::render('Home/Index', [
            'bestMatches' => $bestMatches
        ]);
    }
}

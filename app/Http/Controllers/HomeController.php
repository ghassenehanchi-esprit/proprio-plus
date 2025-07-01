<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $featured = Listing::with('gallery')
            ->where('status', 'active')
            ->latest()
            ->take(6)
            ->get();

        return Inertia::render('Home/Index', [
            'featured' => $featured
        ]);
    }
}

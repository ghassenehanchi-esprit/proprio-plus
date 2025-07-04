<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Listing;
use App\Models\User;
use App\Models\Conversation;
use App\Models\Page as StaticPage;

class PageController extends Controller
{
    public function home()
    {
        $bestMatches = Listing::with('gallery')
            ->active()
            ->withCount(['conversations', 'favoritedBy as favorites_count'])
            ->orderByRaw('(conversations_count * 2 + favorites_count) desc')
            ->take(6)
            ->get();

        return Inertia::render('Home/Index', [
            'bestMatches' => $bestMatches,
        ]);
    }

    public function search(Request $request)
    {
        return Inertia::render('Listing/Search', [
            'filters' => $request->all(),
        ]);
    }

    public function login()
    {
        return Inertia::render('Auth/Login');
    }

    public function register()
    {
        return Inertia::render('Auth/Register');
    }

    public function forgotPassword()
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    public function resetPassword(Request $request, string $token)
    {
        return Inertia::render('Auth/ResetPassword', [
            'token' => $token,
            'email' => $request->email,
        ]);
    }

    public function verifyEmailNotice()
    {
        return Inertia::render('Auth/VerifyEmail');
    }

    public function smsCode()
    {
        return Inertia::render('Verification/SMSCode');
    }

    public function uploadIdentity()
    {
        return Inertia::render('Verification/UploadIdentity');
    }

    public function listingShow(Listing $listing)
    {
        $listing = Listing::with('category', 'gallery')
            ->with(['user' => function ($q) {
                $q->select('id', 'first_name', 'last_name', 'created_at')
                    ->withCount(['listings as sold_count' => function ($q) {
                        $q->sold();
                    }]);
            }])
            ->withFavoriteStatus(auth()->id())
            ->findOrFail($listing->id);

        $similar = Listing::where('category_id', $listing->category_id)
            ->where('id', '!=', $listing->id)
            ->where('city', $listing->city)
            ->active()
            ->withFavoriteStatus(auth()->id())
            ->limit(4)
            ->get();

        return Inertia::render('Home/Show', [
            'listing' => $listing,
            'similar' => $similar,
        ]);
    }

    public function favorites()
    {
        $favorites = auth()->user()->favorites()->with('category', 'user')->get();

        return Inertia::render('Listing/Favorites', [
            'favorites' => $favorites,
        ]);
    }

    public function accountSettings()
    {
        $user = auth()->id() ? User::withBasicInfo()->find(auth()->id()) : null;

        return Inertia::render('Account/Settings', [
            'user' => $user,
        ]);
    }

    public function clockings()
    {
        return Inertia::render('Account/Clockings');
    }

    public function myListings()
    {
        $listings = Listing::where('user_id', auth()->id())
            ->with('category')
            ->withCount('conversations')
            ->latest()
            ->get();

        return Inertia::render('Listing/MyListings', [
            'listings' => $listings,
        ]);
    }

    public function messages(Request $request)
    {
        $conversations = Conversation::where('buyer_id', auth()->id())
            ->orWhere('seller_id', auth()->id())
            ->with('listing', 'seller', 'buyer')
            ->withCount(['messages as unread_count' => function ($q) {
                $q->where('sender_id', '!=', auth()->id())
                    ->where('is_read', false);
            }])
            ->latest()
            ->paginate(10);

        return Inertia::render('Messages/Index', [
            'conversations' => $conversations,
            'current' => $request->conversation,
        ]);
    }

    public function page(string $slug)
    {
        $page = StaticPage::where('slug', $slug)->with('images')->firstOrFail();
        return Inertia::render('Page/Show', [
            'page' => $page,
        ]);
    }
}


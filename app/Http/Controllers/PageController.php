<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Listing;
use App\Models\User;

class PageController extends Controller
{
    public function home()
    {
        return Inertia::render('Home/Index');
    }

    public function search(Request $request)
    {
        $query = Listing::query()
            ->with('category', 'user')
            ->where('status', 'active')
            ->filter($request->all());

        $listings = $query->get()->map(function ($listing) {
            $listing->is_favorited = auth()->check() && $listing->favoritedBy()->where('user_id', auth()->id())->exists();
            return $listing;
        });

        return Inertia::render('Listing/Search', [
            'listings' => $listings,
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
        $listing->load('category', 'user', 'gallery');
        return Inertia::render('Home/Show', [
            'listing' => $listing,
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
}


<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function home()
    {
        return Inertia::render('Home/Index');
    }

    public function search()
    {
        return Inertia::render('Listing/Search');
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
}

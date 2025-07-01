<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

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

    public function smsCode()
    {
        return Inertia::render('Verification/SMSCode');
    }

    public function uploadIdentity()
    {
        return Inertia::render('Verification/UploadIdentity');
    }
}

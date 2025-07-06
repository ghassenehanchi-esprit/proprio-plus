<?php
namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TermsController extends Controller
{
    public function show()
    {
        return Inertia::render('Auth/AcceptTerms');
    }

    public function accept(Request $request)
    {
        $user = $request->user();
        $user->terms_accepted_at = now();
        $user->save();
        return redirect()->intended('/');
    }
}

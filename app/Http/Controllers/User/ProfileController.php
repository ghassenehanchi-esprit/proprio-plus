<?php
namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function edit()
    {
        $user = Auth::user()->only(['first_name', 'last_name', 'email', 'phone', 'created_at']);

        return \Inertia\Inertia::render('Account/Profile', [
            'user' => $user,
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'phone'      => 'nullable|string|max:20',
        ]);

        $user->update($validated);

        return response()->json(['message' => 'Profil mis à jour avec succès.']);
    }
}

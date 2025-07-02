<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::withBasicInfo()->select('certification_status')->get();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }
    public function certify(User $user)
    {
        $user->update([
            'certification_status' => 'certifié',
            'certification_date' => now(),
        ]);

        return response()->json(['message' => 'Utilisateur certifié avec succès']);
    }

    public function refuse(User $user)
    {
        $user->update(['certification_status' => 'refusé']);

        return response()->json(['message' => "Certification refusée"]);
    }
}

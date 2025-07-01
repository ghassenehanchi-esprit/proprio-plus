<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function certify(User $user)
    {
        $user->update(['certification_status' => 'certifié']);

        return response()->json(['message' => 'Utilisateur certifié avec succès']);
    }
}

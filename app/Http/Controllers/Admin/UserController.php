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
        return Inertia::render('Admin/Users/Index');
    }

    public function data(Request $request)
    {
        $query = User::withBasicInfo()->select('certification_status');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $sort = $request->input('sort', 'id');
        $dir = $request->input('dir', 'asc');
        $query->orderBy($sort, $dir);

        $perPage = (int) $request->input('per_page', 10);

        return $query->paginate($perPage);
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

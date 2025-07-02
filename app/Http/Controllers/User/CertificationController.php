<?php
namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Notifications\CertificationRequestNotification;

class CertificationController extends Controller
{
    public function showForm()
    {
        return response()->json(['status' => Auth::user()->certification_status]);
    }

    public function submitDocument(Request $request)
    {
        $request->validate([
            'identity_document' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        $user = Auth::user();
        $path = $request->file('identity_document')->store('identity_documents', 'public');

        $user->update([
            'identity_document' => $path,
            'certification_status' => 'en_attente',
        ]);

        $admins = User::whereHas('roles', function ($q) {
            $q->where('name', 'admin');
        })->get();

        foreach ($admins as $admin) {
            $admin->notify(new CertificationRequestNotification($user));
        }

        return response()->json(['message' => 'Document soumis pour vérification.']);
    }
}

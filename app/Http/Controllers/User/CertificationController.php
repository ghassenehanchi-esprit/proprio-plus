<?php
namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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

        return response()->json(['message' => 'Document soumis pour vérification.']);
    }
}

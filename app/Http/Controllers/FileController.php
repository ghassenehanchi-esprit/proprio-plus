<?php
namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function destroy(File $file)
    {
        $ownerId = $file->fileable?->user_id;
        if ($ownerId && $ownerId !== Auth::id()) {
            abort(403);
        }
        Storage::disk('public')->delete($file->path);
        $file->delete();
        return response()->json(['message' => 'Fichier supprimé']);
    }
}

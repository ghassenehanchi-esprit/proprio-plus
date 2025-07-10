<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DocumentToSign;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Admin/Documents/Index');
    }

    public function data(Request $request)
    {
        $query = DocumentToSign::with('listing:id,title', 'approvedBy:id,first_name,last_name');

        if ($type = $request->input('type')) {
            $query->where('type', $type);
        }

        $sort = $request->input('sort', 'created_at');
        $dir = $request->input('dir', 'desc');
        $query->orderBy($sort, $dir);

        $perPage = (int) $request->input('per_page', 10);

        return $query->paginate($perPage);
    }

    public function approve(DocumentToSign $document)
    {
        $document->update([
            'approved_by' => Auth::id(),
            'approved_at' => now(),
            'status' => 'approuve'
        ]);

        return response()->json(['message' => 'Document approuvé']);
    }
}

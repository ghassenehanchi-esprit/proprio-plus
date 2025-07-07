<?php
namespace App\Http\Controllers;

use App\Models\Listing;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class PdfController extends Controller
{
    public function attestation(Listing $listing)
    {
        $signature = $listing->documentsToSign()
            ->where('type', 'mandat_exclusif')
            ->first()?->signatures()
            ->where('user_id', auth()->id())
            ->first();

        $pdf = Pdf::loadView('pdf.attestation', [
            'listing' => $listing,
            'user' => auth()->user(),
            'signaturePath' => $signature ? Storage::disk('public')->path($signature->file_path) : null,
        ]);

        return $pdf->download('attestation-'.$listing->id.'.pdf');
    }
}

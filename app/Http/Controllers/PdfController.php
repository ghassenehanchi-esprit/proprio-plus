<?php
namespace App\Http\Controllers;

use App\Models\Listing;
use Illuminate\Support\Facades\Storage;
use App\Services\Pdf\DocumentPdfService;

class PdfController extends Controller
{
    protected DocumentPdfService $pdf;

    public function __construct(DocumentPdfService $pdf)
    {
        $this->pdf = $pdf;
    }

    public function attestation(Listing $listing)
    {
        [$signaturePath] = $this->signaturePaths($listing, 'mandat_exclusif');
        $pdf = $this->pdf->generate('attestation', $listing, $signaturePath);

        return $pdf->download('attestation-'.$listing->id.'.pdf');
    }

    public function mandat(Listing $listing)
    {
        [$sig1, $sig2] = $this->signaturePaths($listing, 'mandat_exclusif');
        $pdf = $this->pdf->generate('mandat_exclusif', $listing, $sig1, $sig2);

        return $pdf->download('mandat-'.$listing->id.'.pdf');
    }

    public function bonDeVisite(Listing $listing)
    {
        [$sig1, $sig2] = $this->signaturePaths($listing, 'bon_de_visite');
        $pdf = $this->pdf->generate('bon_de_visite', $listing, $sig1, $sig2);

        return $pdf->download('bon-de-visite-'.$listing->id.'.pdf');
    }

    public function offreAchat(Listing $listing)
    {
        [$sig1, $sig2] = $this->signaturePaths($listing, 'offre_achat');
        $pdf = $this->pdf->generate('offre_achat', $listing, $sig1, $sig2);

        return $pdf->download('offre-achat-'.$listing->id.'.pdf');
    }

    public function compromis(Listing $listing)
    {
        [$sig1, $sig2] = $this->signaturePaths($listing, 'compromis_de_vente');
        $pdf = $this->pdf->generate('compromis_de_vente', $listing, $sig1, $sig2);

        return $pdf->download('compromis-'.$listing->id.'.pdf');
    }

    private function signaturePaths(Listing $listing, string $type): array
    {
        $doc = $listing->documentsToSign()->where('type', $type)->first();
        $sig1 = $doc?->signatures()->first();
        $sig2 = $doc?->signatures()->skip(1)->first();

        $path1 = $sig1 && $sig1->file_path ? Storage::disk('public')->path($sig1->file_path) : null;
        $path2 = $sig2 && $sig2->file_path ? Storage::disk('public')->path($sig2->file_path) : null;

        return [$path1, $path2];
    }
}

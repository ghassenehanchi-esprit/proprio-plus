<?php
namespace App\Services\Pdf;

use App\Models\Listing;
use Barryvdh\Snappy\Facades\SnappyPdf;

class DocumentPdfService
{
    public function generate(string $type, Listing $listing, ?string $signaturePath = null, ?string $otherSignaturePath = null)
    {
        $view = 'pdf.' . $type;
        return SnappyPdf::loadView($view, [
            'listing' => $listing,
            'user' => $listing->user,
            'signaturePath' => $signaturePath,
            'otherSignaturePath' => $otherSignaturePath,
        ]);
    }
}

<?php
namespace App\Services\Pdf;

use App\Models\Listing;
use Barryvdh\DomPDF\Facade\Pdf;

class DocumentPdfService
{
    public function generate(string $type, Listing $listing, ?string $signaturePath = null, ?string $otherSignaturePath = null)
    {
        $view = 'pdf.' . $type;
        return Pdf::loadView($view, [
            'listing' => $listing,
            'user' => $listing->user,
            'signaturePath' => $signaturePath,
            'otherSignaturePath' => $otherSignaturePath,
        ]);
    }
}

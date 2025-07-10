<?php
namespace App\Services\Signature;

use App\Models\Listing;
use App\Services\Pdf\DocumentPdfService;

class DocumentSignatureService
{
    protected ?HelloSignService $service;
    protected DocumentPdfService $pdfService;

    public function __construct(DocumentPdfService $pdfService)
    {
        $key = config('services.hellosign.key');
        $this->service = $key ? new HelloSignService($key) : null;
        $this->pdfService = $pdfService;
    }

    public function sendForSignature(string $type, Listing $listing, array $signers, string $subject)
    {
        if (! $this->service) {
            return null;
        }

        $pdf = $this->pdfService->generate($type, $listing);
        $tmpPath = storage_path('app/tmp/'.uniqid($type.'_').'.pdf');
        if (! is_dir(dirname($tmpPath))) {
            mkdir(dirname($tmpPath), 0755, true);
        }
        file_put_contents($tmpPath, $pdf->output());

        $requestId = $this->service->sendSignatureRequest($tmpPath, $signers, $subject, '');
        return $requestId;
    }
}

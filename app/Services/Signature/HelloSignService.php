<?php
namespace App\Services\Signature;

use Dropbox\Sign\Client;
use Dropbox\Sign\Model\SignatureRequestSendRequest;
use Dropbox\Sign\Model\SubSignatureRequestSigner;

class HelloSignService
{
    protected Client $client;

    public function __construct(string $apiKey)
    {
        $this->client = new Client($apiKey);
    }

    /**
     * Send a PDF for signing using HelloSign.
     *
     * @param string $filePath Path to the PDF that should be signed.
     * @param string $signerEmail Email address of the signer.
     * @param string $signerName Name of the signer.
     * @param string $subject Subject of the email sent to the signer.
     * @param string $message Optional message to include in the email.
     * @return string The signature request ID.
     */
    public function sendSignatureRequest(
        string $filePath,
        string $signerEmail,
        string $signerName,
        string $subject = 'Please sign the attached document',
        string $message = ''
    ): string {
        $signer = new SubSignatureRequestSigner([
            'email_address' => $signerEmail,
            'name' => $signerName,
        ]);

        $request = new SignatureRequestSendRequest([
            'title' => $subject,
            'subject' => $subject,
            'message' => $message,
            'signers' => [$signer],
            'file_path' => [$filePath],
        ]);

        $response = $this->client->signatureRequest()->send($request);

        return $response->getSignatureRequest()->getSignatureRequestId();
    }
}

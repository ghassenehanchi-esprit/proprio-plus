<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Listing;

class GenerateDocuments extends Command
{
    protected $signature = 'documents:generate';
    protected $description = 'Create required documents to sign for all listings';

    public function handle(): int
    {
        $types = [
            'mandat_exclusif',
            'bon_de_visite',
            'offre_achat',
            'compromis_de_vente',
        ];

        $count = 0;
        foreach (Listing::all() as $listing) {
            foreach ($types as $type) {
                $listing->documentsToSign()->firstOrCreate(['type' => $type]);
            }
            $count++;
        }

        $this->info("Documents generated for {$count} listings.");
        return Command::SUCCESS;
    }
}

<?php

namespace Tests\Unit;

use App\Models\Listing;
use PHPUnit\Framework\TestCase;

class ListingSimilarityTest extends TestCase
{
    public function test_similarity_with_more_attributes_gives_higher_score(): void
    {
        $a = new Listing([
            'category_id' => 1,
            'city' => 'Paris',
            'price' => 100000,
            'rooms' => 3,
            'bedrooms' => 2,
            'bathrooms' => 1,
            'has_terrace' => true,
        ]);

        $b = new Listing([
            'category_id' => 1,
            'city' => 'Paris',
            'price' => 105000,
            'rooms' => 3,
            'bedrooms' => 2,
            'bathrooms' => 1,
            'has_terrace' => true,
        ]);

        $c = new Listing([
            'category_id' => 2,
            'city' => 'Lyon',
            'price' => 300000,
            'rooms' => 1,
            'bedrooms' => 1,
            'bathrooms' => 1,
            'has_terrace' => false,
        ]);

        $scoreSimilar = $a->similarityWith($b);
        $scoreDifferent = $a->similarityWith($c);

        $this->assertTrue($scoreSimilar > $scoreDifferent);
    }
}

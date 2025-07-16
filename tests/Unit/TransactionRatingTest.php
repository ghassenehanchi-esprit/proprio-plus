<?php
namespace Tests\Unit;

use App\Models\TransactionRating;
use PHPUnit\Framework\TestCase;

class TransactionRatingTest extends TestCase
{
    public function test_average_attribute_is_calculated(): void
    {
        $rating = new TransactionRating([
            'communication' => 4,
            'punctuality' => 5,
            'professionalism' => 3,
        ]);

        $this->assertSame(4.0, $rating->average);
    }
}

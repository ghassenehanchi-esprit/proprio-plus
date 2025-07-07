<?php
namespace Database\Factories;

use App\Models\Conversation;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ConversationFactory extends Factory
{
    protected $model = Conversation::class;

    public function definition(): array
    {
        return [
            'listing_id' => Listing::factory(),
            'seller_id' => User::factory(),
            'buyer_id' => User::factory(),
            'is_blocked' => false,
            'is_closed' => false,
            'subject' => $this->faker->sentence(),
        ];
    }
}

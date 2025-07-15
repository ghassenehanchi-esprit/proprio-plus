<?php
namespace Tests\Feature;

use App\Models\Conversation;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VisitRequestLimitTest extends TestCase
{
    use RefreshDatabase;

    private function makeConversation(): Conversation
    {
        $seller = User::factory()->create([
            'certification_status' => 'certifié',
            'terms_accepted_at' => now(),
        ]);
        $buyer = User::factory()->create([
            'certification_status' => 'certifié',
            'terms_accepted_at' => now(),
        ]);
        $listing = Listing::factory()->create(['user_id' => $seller->id]);

        return Conversation::factory()->create([
            'listing_id' => $listing->id,
            'seller_id' => $seller->id,
            'buyer_id' => $buyer->id,
        ]);
    }

    public function test_seller_cannot_propose_multiple_pending_visits(): void
    {
        $conversation = $this->makeConversation();
        $seller = User::find($conversation->seller_id);

        $response1 = $this->actingAs($seller)->post("/conversations/{$conversation->id}/meetings", [
            'scheduled_at' => now()->addDay(),
            'type' => 'visit',
        ]);
        $response1->assertStatus(200);

        $response2 = $this->actingAs($seller)->post("/conversations/{$conversation->id}/meetings", [
            'scheduled_at' => now()->addDays(2),
            'type' => 'visit',
        ]);
        $response2->assertStatus(422);
    }
}

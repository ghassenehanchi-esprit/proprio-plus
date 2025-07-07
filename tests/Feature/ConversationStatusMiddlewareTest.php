<?php
namespace Tests\Feature;

use App\Models\Conversation;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConversationStatusMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    private function makeConversation(array $attributes = []): Conversation
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

        return Conversation::factory()->create(array_merge([
            'listing_id' => $listing->id,
            'seller_id' => $seller->id,
            'buyer_id' => $buyer->id,
        ], $attributes));
    }

    public function test_blocked_conversation_rejects_new_messages(): void
    {
        $conversation = $this->makeConversation(['is_blocked' => true]);
        $buyer = User::find($conversation->buyer_id);

        $response = $this->actingAs($buyer)->post("/conversations/{$conversation->id}/messages", [
            'content' => 'Bonjour',
        ]);

        $response->assertStatus(403);
    }

    public function test_closed_conversation_rejects_meeting_creation(): void
    {
        $conversation = $this->makeConversation(['is_closed' => true]);
        $seller = User::find($conversation->seller_id);

        $response = $this->actingAs($seller)->post("/conversations/{$conversation->id}/meetings", [
            'scheduled_at' => now()->addDay(),
            'type' => 'meeting',
        ]);

        $response->assertStatus(403);
    }
}

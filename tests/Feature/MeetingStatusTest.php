<?php
namespace Tests\Feature;

use App\Models\Conversation;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MeetingStatusTest extends TestCase
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

    public function test_buyer_can_accept_meeting_via_post_route(): void
    {
        $conversation = $this->makeConversation();
        $meeting = $conversation->meetings()->create([
            'scheduled_at' => now()->addDay(),
            'type' => 'visit',
            'status' => 'pending',
        ]);
        $buyer = User::find($conversation->buyer_id);

        $response = $this->actingAs($buyer)->post("/meetings/{$meeting->id}/status", [
            'status' => 'accepted',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('meetings', [
            'id' => $meeting->id,
            'status' => 'accepted',
        ]);
        $this->assertDatabaseHas('messages', [
            'conversation_id' => $conversation->id,
            'sender_id' => $buyer->id,
            'content' => 'Visite acceptée',
        ]);
    }

    public function test_buyer_can_decline_meeting_via_post_route(): void
    {
        $conversation = $this->makeConversation();
        $meeting = $conversation->meetings()->create([
            'scheduled_at' => now()->addDay(),
            'type' => 'visit',
            'status' => 'pending',
        ]);
        $buyer = User::find($conversation->buyer_id);

        $response = $this->actingAs($buyer)->post("/meetings/{$meeting->id}/status", [
            'status' => 'declined',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('meetings', [
            'id' => $meeting->id,
            'status' => 'declined',
        ]);
        $this->assertDatabaseHas('messages', [
            'conversation_id' => $conversation->id,
            'sender_id' => $buyer->id,
            'content' => 'Visite refusée',
        ]);
    }
}

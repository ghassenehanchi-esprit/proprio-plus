<?php
namespace Tests\Feature;

use App\Models\Conversation;
use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    private function makeConversation(): Conversation
    {
        return Conversation::factory()->create([
            'seller_id' => User::factory()->create(['terms_accepted_at' => now()])->id,
            'buyer_id' => User::factory()->create(['terms_accepted_at' => now()])->id,
        ]);
    }

    public function test_user_can_create_report(): void
    {
        $conversation = $this->makeConversation();
        $reporter = User::find($conversation->buyer_id);
        $reported = User::find($conversation->seller_id);

        $response = $this->actingAs($reporter)->post('/reports', [
            'reported_user_id' => $reported->id,
            'conversation_id' => $conversation->id,
            'reason' => 'Spam',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('reports', [
            'reporter_id' => $reporter->id,
            'reported_user_id' => $reported->id,
            'conversation_id' => $conversation->id,
            'reason' => 'Spam',
        ]);
    }

    public function test_duplicate_report_is_rejected(): void
    {
        $conversation = $this->makeConversation();
        $reporter = User::find($conversation->buyer_id);
        $reported = User::find($conversation->seller_id);

        Report::factory()->create([
            'reporter_id' => $reporter->id,
            'reported_user_id' => $reported->id,
            'conversation_id' => $conversation->id,
        ]);

        $response = $this->actingAs($reporter)->post('/reports', [
            'reported_user_id' => $reported->id,
            'conversation_id' => $conversation->id,
            'reason' => 'Spam',
        ]);

        $response->assertStatus(409);
    }
}

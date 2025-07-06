<?php
namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TermsMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_without_terms_cannot_access_protected_route(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/favorites');

        $response->assertRedirect('/terms-acceptance');
    }

    public function test_user_with_terms_can_access_protected_route(): void
    {
        $user = User::factory()->create(['terms_accepted_at' => now()]);

        $response = $this->actingAs($user)->get('/favorites');

        $response->assertStatus(200);
    }
}

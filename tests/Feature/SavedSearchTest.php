<?php
namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SavedSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_and_delete_saved_search(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/saved-searches', [
            'params' => ['city' => 'Paris'],
        ]);
        $response->assertStatus(200);
        $id = $response->json('id');
        $this->assertDatabaseHas('saved_searches', ['id' => $id, 'user_id' => $user->id]);

        $del = $this->actingAs($user)->delete("/saved-searches/$id");
        $del->assertStatus(200);
        $this->assertDatabaseMissing('saved_searches', ['id' => $id]);
    }

    public function test_user_can_toggle_notification(): void
    {
        $user = User::factory()->create();
        $search = $user->savedSearches()->create(['params' => ['city' => 'Lyon']]);

        $res = $this->actingAs($user)->patch("/saved-searches/{$search->id}", [
            'notify' => false,
        ]);
        $res->assertStatus(200);
        $this->assertFalse($search->fresh()->notify);
    }
}

<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CertificationMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_certified_user_cannot_create_listing(): void
    {
        $user = User::factory()->create(['certification_status' => 'en_attente']);

        $response = $this->actingAs($user)->get('/listings/create');

        $response->assertStatus(403);
    }

    public function test_certified_user_can_create_listing(): void
    {
        $user = User::factory()->create(['certification_status' => 'certifié']);

        $response = $this->actingAs($user)->get('/listings/create');

        $response->assertStatus(200);
    }
}

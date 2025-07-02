<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_cannot_access_admin_routes(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/admin/users');

        $response->assertStatus(403);
    }

    public function test_admin_can_access_user_index(): void
    {
        $admin = User::factory()->create();
        $role = Role::create(['name' => 'admin']);
        $admin->roles()->attach($role);

        $response = $this->actingAs($admin)->get('/admin/users');

        $response->assertStatus(200);
    }
}

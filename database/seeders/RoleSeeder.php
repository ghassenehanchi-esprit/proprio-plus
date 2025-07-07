<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = ['admin', 'vendeur', 'acheteur'];

        foreach ($roles as $name) {
            Role::updateOrCreate(['name' => $name]);
        }
    }
}

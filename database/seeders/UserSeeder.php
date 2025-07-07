<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('name', 'admin')->first();
        $sellerRole = Role::where('name', 'vendeur')->first();
        $buyerRole = Role::where('name', 'acheteur')->first();

        $admin = User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'first_name' => 'Alice',
                'last_name' => 'Admin',
                'phone' => '0102030405',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->roles()->syncWithoutDetaching([$adminRole->id]);

        $seller = User::updateOrCreate(
            ['email' => 'seller@example.com'],
            [
                'first_name' => 'Bob',
                'last_name' => 'Seller',
                'phone' => '0607080910',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $seller->roles()->syncWithoutDetaching([$sellerRole->id]);

        $buyer = User::updateOrCreate(
            ['email' => 'buyer@example.com'],
            [
                'first_name' => 'Charlie',
                'last_name' => 'Buyer',
                'phone' => '0504030201',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $buyer->roles()->syncWithoutDetaching([$buyerRole->id]);
    }
}

<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Listing;
use App\Models\Category;
use App\Models\User;

class ListingSeeder extends Seeder
{
    public function run(): void
    {
        $seller = User::where('email', 'seller@example.com')->first();
        $categories = Category::pluck('id');

        Listing::factory()->count(10)->create()->each(function ($listing) use ($seller, $categories) {
            $listing->update([
                'user_id' => $seller->id,
                'category_id' => $categories->random(),
            ]);
        });
    }
}

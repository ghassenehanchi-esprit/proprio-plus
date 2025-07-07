<?php
namespace Database\Factories;

use App\Enums\ListingStatus;
use App\Models\Category;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ListingFactory extends Factory
{
    protected $model = Listing::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(),
            'price' => $this->faker->numberBetween(50000, 300000),
            'surface' => $this->faker->numberBetween(20, 200),
            'rooms' => $this->faker->numberBetween(1, 5),
            'bedrooms' => $this->faker->numberBetween(1, 5),
            'bathrooms' => $this->faker->numberBetween(1, 2),
            'city' => $this->faker->city(),
            'postal_code' => $this->faker->postcode(),
            'address' => $this->faker->address(),
            'status' => ListingStatus::Active,
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
        ];
    }
}

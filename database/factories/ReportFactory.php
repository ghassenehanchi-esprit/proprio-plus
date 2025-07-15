<?php
namespace Database\Factories;

use App\Models\Report;
use App\Models\User;
use App\Models\Conversation;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReportFactory extends Factory
{
    protected $model = Report::class;

    public function definition(): array
    {
        return [
            'reporter_id' => User::factory(),
            'reported_user_id' => User::factory(),
            'conversation_id' => Conversation::factory(),
            'reason' => $this->faker->sentence(),
            'status' => 'pending',
        ];
    }
}

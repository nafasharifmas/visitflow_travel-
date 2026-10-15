<?php

namespace Database\Factories;

use App\Models\Itinerary;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ItineraryFactory extends Factory
{
    protected $model = Itinerary::class;

    public function definition(): array
    {
        return ['user_id' => User::factory(), 'title' => fake()->words(3, true), 'start_time' => '09:00:00'];
    }
}

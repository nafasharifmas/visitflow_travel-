<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Place;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PlaceFactory extends Factory
{
    protected $model = Place::class;

    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'category_id' => Category::factory(),
            'name' => ucfirst($name),
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(1, 99999),
            'description' => fake()->sentence(12),
            'image_url' => null,
            'opening_hours' => '09:00 - 17:00',
            'distance_km' => fake()->randomFloat(2, 1, 25),
            'latitude' => fake()->randomFloat(6, 6.7, 7.0),
            'longitude' => fake()->randomFloat(6, 79.8, 79.95),
            'estimated_visit_minutes' => 60,
            'is_verified' => false,
        ];
    }
}

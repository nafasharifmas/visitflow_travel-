<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Place;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlaceTest extends TestCase
{
    use RefreshDatabase;

    public function test_seed_provides_at_least_ten_places_with_required_fields(): void
    {
        $this->seed(DatabaseSeeder::class);

        $res = $this->getJson('/api/places')->assertOk();
        $this->assertGreaterThanOrEqual(10, count($res->json('data')));
        $res->assertJsonStructure(['data' => [['id', 'name', 'category' => ['name'], 'description', 'opening_hours', 'distance_km', 'latitude', 'longitude']]]);
    }

    public function test_search_and_category_filter(): void
    {
        $parks = Category::factory()->create(['name' => 'Parks', 'slug' => 'parks']);
        $museums = Category::factory()->create(['name' => 'Museums', 'slug' => 'museums']);
        Place::factory()->create(['name' => 'Green Park', 'category_id' => $parks->id]);
        Place::factory()->create(['name' => 'Old Museum', 'category_id' => $museums->id]);

        $this->getJson('/api/places?search=museum')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.name', 'Old Museum');
        $this->getJson('/api/places?category=parks')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.name', 'Green Park');
        $this->getJson('/api/places?search=zzz')->assertOk()->assertJsonCount(0, 'data');
        $this->getJson('/api/places?search=%25')->assertOk()->assertJsonCount(0, 'data'); // wildcard is escaped
    }

    public function test_show_and_not_found(): void
    {
        $place = Place::factory()->create();
        $this->getJson("/api/places/{$place->id}")->assertOk()->assertJsonPath('data.id', $place->id);
        $this->getJson('/api/places/99999')->assertStatus(404)->assertJsonPath('message', 'Resource not found.');
    }

    public function test_categories_listing(): void
    {
        Category::factory()->count(3)->create();
        $this->getJson('/api/categories')->assertOk()->assertJsonCount(3, 'data');
    }
}

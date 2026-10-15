<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Itinerary;
use App\Models\Place;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    private function payload(array $over = []): array
    {
        return array_merge([
            'category_id' => Category::factory()->create()->id, 'name' => 'Test Place', 'description' => 'Desc',
            'opening_hours' => '09:00 - 17:00', 'distance_km' => 5.5, 'latitude' => 6.9, 'longitude' => 79.85,
        ], $over);
    }

    public function test_guest_gets_401_and_user_gets_403_on_admin_api(): void
    {
        $this->getJson('/api/admin/places')->assertStatus(401);
        $this->getJson('/api/admin/users')->assertStatus(401);

        Sanctum::actingAs(User::factory()->create());
        $this->getJson('/api/admin/places')->assertStatus(403);
        $this->postJson('/api/admin/places', $this->payload())->assertStatus(403);
        $this->getJson('/api/admin/users')->assertStatus(403);
    }

    public function test_admin_place_crud_and_public_visibility(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $id = $this->postJson('/api/admin/places', $this->payload())->assertCreated()->json('data.id');
        $this->getJson("/api/places/{$id}")->assertOk()->assertJsonPath('data.name', 'Test Place');

        $this->putJson("/api/admin/places/{$id}", $this->payload(['name' => 'Renamed']))->assertOk()->assertJsonPath('data.name', 'Renamed');
        $this->deleteJson("/api/admin/places/{$id}")->assertOk();
        $this->getJson("/api/places/{$id}")->assertStatus(404);
    }

    public function test_place_validation(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create());
        $this->postJson('/api/admin/places', ['name' => 'x'])->assertStatus(422)
            ->assertJsonValidationErrors(['category_id', 'description', 'latitude', 'longitude']);
        $this->postJson('/api/admin/places', $this->payload(['latitude' => 200]))->assertStatus(422);
    }

    public function test_place_referenced_by_itinerary_cannot_be_deleted(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create());
        $place = Place::factory()->create();
        $it = Itinerary::factory()->create();
        $it->stops()->create(['place_id' => $place->id, 'position' => 1]);

        $this->deleteJson("/api/admin/places/{$place->id}")->assertStatus(409);
        $this->assertDatabaseHas('places', ['id' => $place->id]);
    }

    public function test_admin_user_management_never_exposes_secrets(): void
    {
        $admin = User::factory()->admin()->create();
        $other = User::factory()->create();
        Sanctum::actingAs($admin);

        $res = $this->getJson('/api/admin/users')->assertOk();
        $this->assertStringNotContainsString('password', json_encode($res->json()));
        $this->assertStringNotContainsString('remember_token', json_encode($res->json()));

        $this->putJson("/api/admin/users/{$other->id}", ['name' => 'Changed', 'role' => 'admin'])->assertOk()->assertJsonPath('data.role', 'admin');
        $this->putJson("/api/admin/users/{$admin->id}", ['role' => 'user'])->assertStatus(422);
        $this->deleteJson("/api/admin/users/{$admin->id}")->assertStatus(422);
        $this->deleteJson("/api/admin/users/{$other->id}")->assertOk();
        $this->assertDatabaseMissing('users', ['id' => $other->id]);
    }
}

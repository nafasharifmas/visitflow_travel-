<?php

namespace Tests\Feature;

use App\Models\Itinerary;
use App\Models\Place;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ItineraryTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_persist_or_read_itineraries(): void
    {
        $p = Place::factory()->create();
        $this->postJson('/api/itineraries', ['title' => 'T', 'place_ids' => [$p->id]])->assertStatus(401);
        $this->getJson('/api/itineraries')->assertStatus(401);
        $this->assertDatabaseCount('itineraries', 0);
    }

    public function test_user_can_save_retrieve_update_delete(): void
    {
        $user = User::factory()->create();
        [$a, $b] = [Place::factory()->create(['estimated_visit_minutes' => 60]), Place::factory()->create(['estimated_visit_minutes' => 30])];
        Sanctum::actingAs($user);

        $res = $this->postJson('/api/itineraries', ['title' => 'My day', 'start_time' => '09:00', 'place_ids' => [$b->id, $a->id]])->assertCreated();
        $id = $res->json('data.id');
        $res->assertJsonPath('data.stops.0.place.id', $b->id)
            ->assertJsonPath('data.stops.0.suggested_start', '09:00')
            ->assertJsonPath('data.stops.0.suggested_end', '09:30')
            ->assertJsonPath('data.stops.1.suggested_start', '09:30');

        $this->getJson('/api/itineraries')->assertOk()->assertJsonCount(1, 'data');
        $this->getJson("/api/itineraries/{$id}")->assertOk()->assertJsonPath('data.title', 'My day');

        $this->putJson("/api/itineraries/{$id}", ['title' => 'Edited', 'place_ids' => [$a->id]])->assertOk()->assertJsonCount(1, 'data.stops');
        $this->assertDatabaseCount('itinerary_stops', 1);

        $this->deleteJson("/api/itineraries/{$id}")->assertOk();
        $this->assertDatabaseCount('itineraries', 0);
    }

    public function test_windows_are_not_fabricated_when_estimate_missing(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $p = Place::factory()->create(['estimated_visit_minutes' => null]);
        $this->postJson('/api/itineraries', ['title' => 'T', 'place_ids' => [$p->id]])->assertCreated()
            ->assertJsonPath('data.stops.0.suggested_start', null);
    }

    public function test_ownership_isolation(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $it = Itinerary::factory()->create(['user_id' => $owner->id]);
        $it->stops()->create(['place_id' => Place::factory()->create()->id, 'position' => 1]);

        Sanctum::actingAs($intruder);
        $this->getJson("/api/itineraries/{$it->id}")->assertStatus(404);
        $this->putJson("/api/itineraries/{$it->id}", ['title' => 'x', 'place_ids' => [1]])->assertStatus(404);
        $this->deleteJson("/api/itineraries/{$it->id}")->assertStatus(404);
        $this->getJson('/api/itineraries')->assertOk()->assertJsonCount(0, 'data');
        $this->assertDatabaseHas('itineraries', ['id' => $it->id]);
    }

    public function test_invalid_references_are_rejected_and_nothing_is_persisted(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $p = Place::factory()->create();

        $this->postJson('/api/itineraries', ['title' => 'T', 'place_ids' => [$p->id, 99999]])->assertStatus(422);
        $this->postJson('/api/itineraries', ['title' => 'T', 'place_ids' => [$p->id, $p->id]])->assertStatus(422);
        $this->postJson('/api/itineraries', ['title' => 'T', 'place_ids' => []])->assertStatus(422);
        $this->assertDatabaseCount('itineraries', 0);
    }
}

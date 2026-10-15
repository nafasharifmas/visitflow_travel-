<?php

namespace App\Http\Controllers;

use App\Http\Requests\ItineraryRequest;
use App\Http\Resources\ItineraryResource;
use App\Models\Itinerary;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * All queries are scoped to the authenticated user. Another user's itinerary is
 * indistinguishable from a missing one (404) - no existence leak (BR-012, FR-026).
 */
class ItineraryController extends Controller
{
    public function index(Request $request)
    {
        $items = $request->user()->itineraries()->with('stops.place.category')->latest()->get();

        return ItineraryResource::collection($items);
    }

    public function store(ItineraryRequest $request): JsonResponse
    {
        $itinerary = DB::transaction(function () use ($request) {
            $it = $request->user()->itineraries()->create($this->attributes($request));
            $this->syncStops($it, $request->validated('place_ids'));

            return $it;
        });

        return $this->respond($itinerary, 'Itinerary saved.', 201);
    }

    public function show(Request $request, int $id)
    {
        return new ItineraryResource($this->owned($request, $id)->load('stops.place.category'));
    }

    public function update(ItineraryRequest $request, int $id): JsonResponse
    {
        $itinerary = $this->owned($request, $id);
        DB::transaction(function () use ($request, $itinerary) {
            $itinerary->update($this->attributes($request));
            $itinerary->stops()->delete();
            $this->syncStops($itinerary, $request->validated('place_ids'));
        });

        return $this->respond($itinerary, 'Itinerary updated.');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->owned($request, $id)->delete();

        return response()->json(['message' => 'Itinerary deleted.']);
    }

    private function owned(Request $request, int $id): Itinerary
    {
        return $request->user()->itineraries()->findOrFail($id);
    }

    private function attributes(ItineraryRequest $request): array
    {
        $v = $request->validated();

        return [
            'title' => $v['title'],
            'itinerary_date' => $v['itinerary_date'] ?? null,
            'start_time' => ($v['start_time'] ?? '09:00').':00',
        ];
    }

    private function syncStops(Itinerary $itinerary, array $placeIds): void
    {
        foreach (array_values($placeIds) as $i => $placeId) {
            $itinerary->stops()->create(['place_id' => $placeId, 'position' => $i + 1]);
        }
    }

    private function respond(Itinerary $itinerary, string $message, int $status = 200): JsonResponse
    {
        $itinerary->load('stops.place.category');

        return response()->json(['data' => new ItineraryResource($itinerary), 'message' => $message], $status);
    }
}

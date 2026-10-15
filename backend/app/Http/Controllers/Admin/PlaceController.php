<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PlaceRequest;
use App\Http\Resources\PlaceResource;
use App\Models\Place;
use Illuminate\Http\JsonResponse;

class PlaceController extends Controller
{
    public function index()
    {
        return PlaceResource::collection(Place::with('category')->orderBy('name')->get());
    }

    public function show(Place $place)
    {
        return new PlaceResource($place->load('category'));
    }

    public function store(PlaceRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = Place::uniqueSlug($data['name']);
        $place = Place::create($data)->load('category');

        return response()->json(['data' => new PlaceResource($place), 'message' => 'Place created.'], 201);
    }

    public function update(PlaceRequest $request, Place $place): JsonResponse
    {
        $data = $request->validated();
        if (isset($data['name'])) {
            $data['slug'] = Place::uniqueSlug($data['name'], $place->id);
        }
        $place->update($data);

        return response()->json(['data' => new PlaceResource($place->load('category')), 'message' => 'Place updated.']);
    }

    public function destroy(Place $place): JsonResponse
    {
        // TBD-017 decision: RESTRICT. A place used by a saved itinerary cannot be deleted.
        if ($place->stops()->exists()) {
            return response()->json(['message' => 'This place is used in saved itineraries and cannot be deleted.'], 409);
        }
        $place->delete();

        return response()->json(['message' => 'Place deleted.']);
    }
}

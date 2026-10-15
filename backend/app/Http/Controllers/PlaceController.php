<?php

namespace App\Http\Controllers;

use App\Http\Resources\PlaceResource;
use App\Models\Place;
use Illuminate\Http\Request;

class PlaceController extends Controller
{
    public function index(Request $request)
    {
        $request->validate(['search' => ['nullable', 'string', 'max:100'], 'category' => ['nullable', 'string', 'max:100']]);

        $places = Place::with('category')
            ->search($request->query('search'))
            ->inCategory($request->query('category'))
            ->orderBy('distance_km')->orderBy('name')
            ->get();

        return PlaceResource::collection($places);
    }

    public function show(Place $place)
    {
        return new PlaceResource($place->load('category'));
    }
}

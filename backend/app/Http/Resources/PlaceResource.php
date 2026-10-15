<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlaceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id, 'name' => $this->name, 'slug' => $this->slug,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'description' => $this->description, 'image_url' => $this->image_url,
            'opening_hours' => $this->opening_hours, 'distance_km' => $this->distance_km,
            'latitude' => $this->latitude, 'longitude' => $this->longitude,
            'estimated_visit_minutes' => $this->estimated_visit_minutes,
            'is_verified' => $this->is_verified,
        ];
    }
}

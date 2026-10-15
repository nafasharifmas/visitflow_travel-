<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItineraryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Suggested windows: sequential visit durations from start_time, only while every
        // stop so far has an estimate (never fabricates missing data; travel time excluded).
        $clock = Carbon::createFromFormat('H:i:s', $this->start_time ?? '09:00:00');
        $known = true;
        $stops = [];
        foreach ($this->stops as $stop) {
            $mins = $stop->place->estimated_visit_minutes;
            $start = $end = null;
            if ($known && $mins) {
                $start = $clock->format('H:i');
                $clock = $clock->copy()->addMinutes($mins);
                $end = $clock->format('H:i');
            } else {
                $known = false;
            }
            $stops[] = [
                'position' => $stop->position,
                'place' => new PlaceResource($stop->place),
                'suggested_start' => $start, 'suggested_end' => $end,
            ];
        }

        return [
            'id' => $this->id, 'title' => $this->title,
            'itinerary_date' => $this->itinerary_date?->format('Y-m-d'),
            'start_time' => substr((string) $this->start_time, 0, 5),
            'stops' => $stops,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

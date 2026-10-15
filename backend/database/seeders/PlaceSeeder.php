<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Place;
use Illuminate\Database\Seeder;

/**
 * DEMO DATA. TBD-019: the real locality has not been supplied, so these are well-known
 * Colombo-area sites with APPROXIMATE coordinates, opening hours and visit estimates.
 * They are flagged is_verified=false and MUST be reviewed by the administrator
 * (BR-001 / BR-005) before being presented as verified. No image URLs are invented.
 */
class PlaceSeeder extends Seeder
{
    public function run(): void
    {
        $ref = config('visitflow.reference');
        $cat = Category::pluck('id', 'slug');

        $rows = [
            ['Galle Face Green', 'sightseeing', 6.9271, 79.8438, 'Open daily (demo value - verify)', 60, 'Oceanfront urban promenade, popular at sunset.'],
            ['Gangaramaya Temple', 'monuments', 6.9166, 79.8564, '06:00 - 22:00 (demo value - verify)', 60, 'Well-known Buddhist temple and cultural complex near Beira Lake.'],
            ['Colombo National Museum', 'museums', 6.9106, 79.8606, '09:00 - 17:00 (demo value - verify)', 90, 'The national museum, housing historical and cultural collections.'],
            ['Viharamahadevi Park', 'parks', 6.9147, 79.8612, 'Open daily (demo value - verify)', 45, 'Large public park in central Colombo.'],
            ['Independence Memorial Hall', 'monuments', 6.9007, 79.8677, 'Open daily (demo value - verify)', 30, 'Memorial hall commemorating independence, set in Independence Square.'],
            ['Seema Malaka', 'sightseeing', 6.9167, 79.8561, '09:00 - 17:00 (demo value - verify)', 30, 'Lakeside meditation pavilion on Beira Lake.'],
            ['Beira Lake', 'nature', 6.9195, 79.8530, 'Open daily (demo value - verify)', 30, 'Urban lake in the heart of the city.'],
            ['Mount Lavinia Beach', 'beaches', 6.8300, 79.8630, 'Open daily (demo value - verify)', 90, 'Popular sandy beach south of Colombo.'],
            ['National Zoological Gardens, Dehiwala', 'nature', 6.8564, 79.8787, '08:30 - 18:00 (demo value - verify)', 150, 'Zoological gardens in Dehiwala.'],
            ['Bellanwila Raja Maha Vihara', 'monuments', 6.8252, 79.8877, '05:00 - 21:00 (demo value - verify)', 45, 'Buddhist temple in Bellanwila.'],
            ['Pettah Market District', 'sightseeing', 6.9340, 79.8500, 'Open daily (demo value - verify)', 45, 'Busy market district in Pettah; check current conditions locally.'],
        ];

        foreach ($rows as [$name, $slug, $lat, $lng, $hours, $mins, $desc]) {
            Place::updateOrCreate(['slug' => \Illuminate\Support\Str::slug($name)], [
                'category_id' => $cat[$slug], 'name' => $name, 'description' => $desc,
                'opening_hours' => $hours, 'latitude' => $lat, 'longitude' => $lng,
                'distance_km' => round($this->haversine($ref['latitude'], $ref['longitude'], $lat, $lng), 2),
                'estimated_visit_minutes' => $mins, 'is_verified' => false,
            ]);
        }
    }

    private function haversine(float $la1, float $lo1, float $la2, float $lo2): float
    {
        $r = 6371;
        $dLa = deg2rad($la2 - $la1);
        $dLo = deg2rad($lo2 - $lo1);
        $a = sin($dLa / 2) ** 2 + cos(deg2rad($la1)) * cos(deg2rad($la2)) * sin($dLo / 2) ** 2;

        return 2 * $r * asin(sqrt($a));
    }
}

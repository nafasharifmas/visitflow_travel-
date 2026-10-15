<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Place extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', 'name', 'slug', 'description', 'image_url', 'opening_hours',
        'distance_km', 'latitude', 'longitude', 'estimated_visit_minutes', 'is_verified',
    ];

    protected function casts(): array
    {
        return [
            'distance_km' => 'float', 'latitude' => 'float', 'longitude' => 'float',
            'estimated_visit_minutes' => 'integer', 'is_verified' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function stops(): HasMany
    {
        return $this->hasMany(ItineraryStop::class);
    }

    public function scopeSearch(Builder $q, ?string $term): Builder
    {
        if ($term === null || trim($term) === '') {
            return $q;
        }
        $like = '%'.addcslashes(trim($term), '%_\\').'%';

        return $q->where(fn (Builder $w) => $w->where('name', 'like', $like)->orWhere('description', 'like', $like));
    }

    public function scopeInCategory(Builder $q, ?string $category): Builder
    {
        if ($category === null || $category === '') {
            return $q;
        }

        return $q->whereHas('category', fn (Builder $c) => $c->where('slug', $category)->orWhere('id', ctype_digit($category) ? (int) $category : 0));
    }

    public static function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name) ?: 'place';
        $slug = $base;
        $i = 2;
        while (static::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }
}

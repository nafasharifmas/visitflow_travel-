<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PlaceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization is enforced by the `admin` route middleware.
    }

    public function rules(): array
    {
        $partial = $this->isMethod('PATCH') ? 'sometimes' : 'required';

        return [
            'category_id' => [$partial, 'integer', 'exists:categories,id'],
            'name' => [$partial, 'string', 'max:150'],
            'description' => [$partial, 'string', 'max:5000'],
            'opening_hours' => [$partial, 'string', 'max:255'],
            'distance_km' => [$partial, 'numeric', 'between:0,999'],
            'latitude' => [$partial, 'numeric', 'between:-90,90'],
            'longitude' => [$partial, 'numeric', 'between:-180,180'],
            'image_url' => ['nullable', 'url:http,https', 'max:2048'],
            'estimated_visit_minutes' => ['nullable', 'integer', 'between:5,720'],
            'is_verified' => ['sometimes', 'boolean'],
        ];
    }
}

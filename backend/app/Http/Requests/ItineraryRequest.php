<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ItineraryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Ownership is enforced by scoping queries to the authenticated user.
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:120'],
            'itinerary_date' => ['nullable', 'date'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'place_ids' => ['required', 'array', 'min:1', 'max:20'],
            'place_ids.*' => ['integer', 'distinct', 'exists:places,id'],
        ];
    }
}

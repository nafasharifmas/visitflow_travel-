<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Explicit allow-list: never includes password, hashes or tokens.
        return [
            'id' => $this->id, 'username' => $this->username, 'name' => $this->name,
            'email' => $this->email, 'role' => $this->role, 'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

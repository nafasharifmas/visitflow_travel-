<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'username' => fake()->unique()->userName(),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => 'Password123',
            'remember_token' => null,
        ];
    }

    public function admin(): static
    {
        return $this->afterCreating(fn (User $u) => $u->forceFill(['role' => User::ROLE_ADMIN])->save());
    }
}

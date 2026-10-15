<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeded_accounts_are_hashed_and_idempotent(): void
    {
        $this->seed(DatabaseSeeder::class);
        $this->seed(DatabaseSeeder::class);

        $this->assertSame(1, User::where('email', 'admin@visitflow.local')->count());
        $this->assertSame(2, User::count());
        $admin = User::where('username', 'admin')->first();
        $this->assertNotSame('Admin@12345', $admin->password);
        $this->assertTrue(Hash::check('Admin@12345', $admin->password));
        $this->assertSame('admin', $admin->role);
    }

    public function test_login_by_email_and_by_username(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->postJson('/api/login', ['login' => 'admin@visitflow.local', 'password' => 'Admin@12345'])
            ->assertOk()->assertJsonStructure(['data' => ['token', 'user' => ['id', 'username', 'role']], 'message']);
        $this->postJson('/api/login', ['login' => 'user', 'password' => 'User@12345'])
            ->assertOk()->assertJsonPath('data.user.role', 'user');
    }

    public function test_invalid_login_is_rejected_without_leaking_details(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->postJson('/api/login', ['login' => 'admin', 'password' => 'wrong'])->assertStatus(401);
        $this->postJson('/api/login', ['login' => 'nobody', 'password' => 'wrong'])->assertStatus(401)
            ->assertJsonPath('message', 'Invalid credentials.');
    }

    public function test_register_creates_plain_user_even_if_role_is_submitted(): void
    {
        $res = $this->postJson('/api/register', [
            'username' => 'newbie', 'name' => 'New', 'email' => 'new@example.com',
            'password' => 'Secret123', 'password_confirmation' => 'Secret123', 'role' => 'admin',
        ])->assertCreated();

        $this->assertSame('user', User::where('username', 'newbie')->first()->role);
        $this->assertArrayNotHasKey('password', $res->json('data.user'));
    }

    public function test_register_validation(): void
    {
        $this->postJson('/api/register', ['username' => 'a'])->assertStatus(422)->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_protected_endpoint_requires_token_and_logout_revokes_it(): void
    {
        $this->getJson('/api/user')->assertStatus(401);

        $this->seed(DatabaseSeeder::class);
        $token = $this->postJson('/api/login', ['login' => 'user', 'password' => 'User@12345'])->json('data.token');

        $this->withToken($token)->getJson('/api/user')->assertOk()->assertJsonPath('data.username', 'user');
        $this->withToken($token)->postJson('/api/logout')->assertOk();
        $this->app['auth']->forgetGuards();
        $this->withToken($token)->getJson('/api/user')->assertStatus(401);
    }
}

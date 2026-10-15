<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * DEVELOPMENT / TESTING credentials only. In production no known-password account is
     * created: an admin is created only if VF_ADMIN_EMAIL and VF_ADMIN_PASSWORD are supplied.
     */
    public function run(): void
    {
        if (app()->environment('production')) {
            $email = config('visitflow.admin_email');
            $password = config('visitflow.admin_password');
            if ($email && $password) {
                $this->upsert(config('visitflow.admin_username'), 'Administrator', $email, $password, User::ROLE_ADMIN);
            }

            return;
        }

        $this->upsert('admin', 'Visit Flow Administrator', 'admin@visitflow.local', 'Admin@12345', User::ROLE_ADMIN);
        $this->upsert('user', 'Visit Flow User', 'user@visitflow.local', 'User@12345', User::ROLE_USER);
    }

    private function upsert(string $username, string $name, string $email, string $password, string $role): void
    {
        $user = User::firstOrNew(['email' => $email]);
        $user->fill(['username' => $username, 'name' => $name, 'password' => $password]); // 'hashed' cast => bcrypt
        $user->role = $role;
        $user->save();
    }
}

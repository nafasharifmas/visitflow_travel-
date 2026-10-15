<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

// Safe ALTER of the framework users table (does not replace the default migration).
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username', 50)->nullable()->after('id');
            $table->string('role', 20)->default('user')->after('password');
        });

        // Backfill any pre-existing rows so the unique index can be added.
        foreach (DB::table('users')->whereNull('username')->get() as $u) {
            DB::table('users')->where('id', $u->id)->update(['username' => 'user'.$u->id]);
        }

        Schema::table('users', function (Blueprint $table) {
            $table->unique('username');
            $table->index('role');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['username']);
            $table->dropIndex(['role']);
            $table->dropColumn(['username', 'role']);
        });
    }
};

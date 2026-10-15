<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminUserUpdateRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** TBD-007 decision: list, view, edit (name/username/email/role), delete. No password handling. */
class UserController extends Controller
{
    public function index()
    {
        return UserResource::collection(User::orderBy('id')->get());
    }

    public function show(User $user)
    {
        return new UserResource($user);
    }

    public function update(AdminUserUpdateRequest $request, User $user): JsonResponse
    {
        $data = $request->validated();

        if ($request->user()->is($user) && isset($data['role']) && $data['role'] !== $user->role) {
            return response()->json(['message' => 'You cannot change your own role.'], 422);
        }

        $role = $data['role'] ?? null;
        unset($data['role']);
        $user->fill($data);
        if ($role !== null) {
            $user->role = $role; // role is not mass-assignable
        }
        $user->save();

        return response()->json(['data' => new UserResource($user), 'message' => 'User updated.']);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($request->user()->is($user)) {
            return response()->json(['message' => 'You cannot delete your own account.'], 422);
        }
        $user->tokens()->delete();
        $user->delete(); // itineraries cascade via FK

        return response()->json(['message' => 'User deleted.']);
    }
}

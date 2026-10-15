# Security
- **Auth contract:** `POST /api/login {login, password}` — `login` is username or email. Returns `{data:{user,token}}`. Send `Authorization: Bearer <token>`. Generic 401 for any failure. Throttled 10/min on login/register.
- **Passwords:** bcrypt via the `hashed` cast; never returned (`UserResource` allow-list; `$hidden`).
- **Roles:** `role` is not mass-assignable; registration always creates `user`. `admin` middleware → 401/403 server-side; React guards are cosmetic.
- **IDOR:** itineraries queried via `$request->user()->itineraries()`; foreign IDs → 404.
- **Injection/XSS:** Eloquent bindings; LIKE wildcards escaped; React escaping; map popups use `textContent`.
- **Errors:** JSON handler maps 401/404; production `APP_DEBUG=false` hides internals.
- **Seeds:** known-password accounts only when `APP_ENV != production`.
- **Open:** HTTPS/hosting (TBD-003), token lifecycle policy (TBD-005), CSRF not applicable to Bearer-token mode (NFR-017 in token mode).

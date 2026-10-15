# REST API (`/api`, JSON)
Success: `{ "data": …, "message": "…" }` · Validation 422 `{message, errors}` · 401 unauthenticated · 403 forbidden · 404 `{message:"Resource not found."}` · 409 conflict. Auth: `Authorization: Bearer <token>`.

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/register` | none | `username,name,email,password,password_confirmation` → 201 `{user,token}`; always role `user` |
| POST | `/login` | none | `login` (username **or** email), `password` → 200 `{user,token}`; bad creds 401 |
| POST | `/logout` | token | revokes current token |
| GET | `/user` | token | current user (no secrets) |
| GET | `/places` | none | `?search=` (name/description), `?category=` (slug or id); sorted by distance; unpaginated |
| GET | `/places/{id}` | none | 404 if unknown |
| GET | `/categories` | none | |
| GET | `/itineraries` | token | own only |
| POST | `/itineraries` | token | `title, place_ids[1..20 distinct, existing], start_time? HH:MM, itinerary_date?` → 201 |
| GET/PUT/DELETE | `/itineraries/{id}` | token | owner only; others → 404 |
| GET/POST | `/admin/places` | token + admin | POST fields: `category_id,name,description,opening_hours,distance_km,latitude,longitude` (+ optional `image_url,estimated_visit_minutes,is_verified`) |
| GET/PUT/PATCH/DELETE | `/admin/places/{id}` | token + admin | DELETE → 409 if used in an itinerary |
| GET | `/admin/users`, `/admin/users/{id}` | token + admin | |
| PUT/PATCH | `/admin/users/{id}` | token + admin | `name,username,email,role`; own role change → 422 |
| DELETE | `/admin/users/{id}` | token + admin | not self → 422 |

Itinerary stop shape: `{position, place{…}, suggested_start|null, suggested_end|null}`. Non-admin on `/admin/*` → **403**; guest → **401**. Postman: `postman/`.

# Decisions (resolving SRS TBDs without expanding scope)
| ID | Decision |
|---|---|
| TBD-001 | Reference point is config (`VF_REFERENCE_*`), default Colombo Fort (demo). `distance_km` is stored per place. No live GPS (TBD-002). |
| TBD-005 | Sanctum personal access tokens (Bearer). 7-day expiry (`VF_TOKEN_TTL_DAYS`). Logout revokes the current token. Stored in `localStorage` by the SPA. |
| TBD-006 | Registration: username (alpha-dash, unique), name, email (unique), password ≥8 with letters+numbers, confirmed. No recovery flow. |
| TBD-007 | Admin user actions: list, view, edit name/username/email/role, delete. Cannot change own role or delete self. No password reset/view. |
| TBD-008 | `itinerary_stops(itinerary_id, place_id, position)`; unique per (itinerary, place) and (itinerary, position). Duplicate places in one plan are rejected. |
| TBD-009 | `places.estimated_visit_minutes` (nullable). Windows are computed sequentially from `start_time`, only while estimates exist; travel time is not modelled. |
| TBD-010 | “Route guidance” = ordered polyline between stops + straight-line km. No routing engine; labelled as planning aid (NFR-008, BR-007). |
| TBD-017 | Deleting a place referenced by an itinerary is **blocked** (DB `RESTRICT`, API 409). |
| — | Another user's itinerary returns **404** (indistinguishable from missing) rather than 403. |
| — | Bad credentials return generic **401**. Admin routes: unauthenticated 401, non-admin 403. |
| — | Users table is altered (not replaced); `username` is nullable at DB level (backfilled) but required by validation. |

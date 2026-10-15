# Requirements Traceability

“PARTIAL” on backend rows means *code written but tests not executed here*. Statuses reflect evidence, not intent. NFR-006 (capacity) and TBD-014/015/016 are unresolved: **TBD**.

| ID | Implementation | API | DB | Test(s) | Status |
|---|---|---|---|---|---|
| FR-001 | PlaceSeeder (11 demo) | GET /places | places | PlaceTest::seed | PARTIAL (demo, unverified) |
| FR-002 | pages/Explore, PlaceRow | — | — | ui.test Explore | PARTIAL (not browser-checked) |
| FR-003 | PlaceController | GET /places | places | PlaceTest | PARTIAL (backend unexecuted) |
| FR-004 | PlaceDetail | GET /places/{id} | places | PlaceTest::show | PARTIAL |
| FR-005 | Place::scopeSearch, geo.filterPlaces | ?search= | places | PlaceTest, geo.test | PARTIAL |
| FR-006 | scopeInCategory, Explore chips | ?category= | categories | PlaceTest, ui.test | PARTIAL |
| FR-007 | same as 005/006 | — | — | PlaceTest, ui.test | PARTIAL |
| FR-008 | category chips on Explore (1 click) | — | — | ui.test | IMPLEMENTED (frontend) |
| FR-009 | Explore Clear button | — | — | ui.test (partial) | IMPLEMENTED (frontend) |
| FR-010 | PlaceDetail | GET /places/{id} | places | PlaceTest | PARTIAL |
| FR-011 | PlaceResource | GET /places/{id} | places | PlaceTest | PARTIAL |
| FR-012 | PlaceDetail links | — | — | — | IMPLEMENTED (untested) |
| FR-013 | MapView (Leaflet+OSM) | — | — | build only | IMPLEMENTED (untested) |
| FR-014 | MapView markers | — | — | — | IMPLEMENTED (untested) |
| FR-015 | MapView popup | — | — | — | IMPLEMENTED (untested) |
| FR-016 | MapView polyline | — | — | — | IMPLEMENTED (untested) |
| FR-017 | Plan context, Planner | — | — | — | IMPLEMENTED (untested) |
| FR-018 | Planner | — | — | — | IMPLEMENTED (untested) |
| FR-019 | Planner km + polyline | — | — | geo.test pathKm | PARTIAL (straight-line; TBD-010) |
| FR-020 | visitWindows / ItineraryResource | POST /itineraries | places.estimated_visit_minutes | geo.test, ItineraryTest | PARTIAL (TBD-009) |
| FR-021 | api guard on /itineraries; Planner gating | POST /itineraries | — | ItineraryTest::guest | PARTIAL |
| FR-022 | ItineraryController@store | POST /itineraries | itineraries | ItineraryTest | PARTIAL |
| FR-023 | store via user relation | — | itineraries.user_id | ItineraryTest | PARTIAL |
| FR-024 | ItineraryController@index/show | GET /itineraries | itineraries | ItineraryTest | PARTIAL |
| FR-025 | ItineraryController | CRUD /itineraries | itineraries | ItineraryTest | PARTIAL (no edit UI) |
| FR-026 | scoped query -> 404 | /itineraries/{id} | — | ItineraryTest::ownership | PARTIAL |
| FR-027 | auth:sanctum | — | — | AuthTest | PARTIAL |
| FR-028 | Sanctum tokens | /login | personal_access_tokens | AuthTest | PARTIAL |
| FR-029 | EnsureUserIsAdmin | /admin/* | users.role | AdminTest | PARTIAL |
| FR-030 | same | /admin/* | — | AdminTest::401/403 | PARTIAL |
| FR-031 | roles+guards | — | — | AdminTest | PARTIAL |
| FR-032 | Admin\PlaceController, AdminPlaces/Form | /admin/places | places | AdminTest | PARTIAL |
| FR-033 | admin middleware | /admin/places | — | AdminTest | PARTIAL |
| FR-034 | PlaceRequest | — | — | AdminTest::validation | PARTIAL |
| FR-035 | image_url field | — | places.image_url | — | PARTIAL (URL only) |
| FR-036 | shared table | GET /places | places | AdminTest | PARTIAL |
| FR-037 | AdminUsers | /admin/users | users | AdminTest | PARTIAL (TBD-007) |
| FR-038 | admin middleware | /admin/users | — | AdminTest | PARTIAL |
| FR-039 | UserResource allow-list | /admin/users | — | AdminTest::secrets | PARTIAL |
| FR-040 | AdminUserUpdateRequest | PUT /admin/users/{id} | — | AdminTest | PARTIAL |
| NFR-001 | eager load, small set | /places | — | not measured | PARTIAL |
| NFR-002 | client-side filter | — | — | geo.test (no timing) | PARTIAL |
| NFR-003 | Tailwind responsive | — | — | not browser-checked | PARTIAL |
| NFR-004 | indexes/FKs | — | migrations | — | PARTIAL |
| NFR-005 | normalised schema | — | — | — | IMPLEMENTED |
| NFR-007 | DB::transaction, error-only UI paths | — | — | no fault injection | PARTIAL |
| NFR-008 | Planner/landing copy | — | — | — | IMPLEMENTED |
| NFR-009 | admin middleware | /admin/* | — | AdminTest | PARTIAL |
| NFR-010 | auth:sanctum | — | — | AuthTest | PARTIAL |
| NFR-011 | server-side admin | — | — | AdminTest | PARTIAL |
| NFR-012 | hashed cast | — | users.password | AuthTest::hash | PARTIAL |
| NFR-013 | deployment docs | — | — | — | TBD (hosting) |
| NFR-014 | Form Requests | — | — | tests | PARTIAL |
| NFR-015 | Eloquent | — | — | — | PARTIAL |
| NFR-016 | React escaping, textContent popups | — | — | — | IMPLEMENTED (untested) |
| NFR-017 | Bearer mode: CSRF n/a | — | — | — | NOT APPLICABLE (token mode) |
| NFR-018 | no token logging; hidden | — | — | — | PARTIAL |
| NFR-019 | JSON 401/403/404 | — | — | tests | PARTIAL |
| NFR-020 | 7-day expiry decision | — | — | — | PARTIAL (TBD-005) |
| BR-001 | demo seed | — | — | — | PARTIAL (not verified data) |
| BR-002 | PlaceRequest | — | places | — | PARTIAL (photo optional) |
| BR-003 | reference config | — | — | — | TBD (TBD-001/019) |
| BR-004 | filter logic | — | — | ui.test | IMPLEMENTED (frontend) |
| BR-005 | admin CRUD, is_verified | — | — | — | PARTIAL |
| BR-006 | MapView | — | — | — | IMPLEMENTED |
| BR-007 | copy + no routing engine | — | — | — | IMPLEMENTED |
| BR-008 | one itinerary = one day | — | — | — | IMPLEMENTED |
| BR-009 | FR-021 | — | — | ItineraryTest | PARTIAL |
| BR-010 | auth on itineraries | — | — | ItineraryTest | PARTIAL |
| BR-011 | user_id FK | — | itineraries | ItineraryTest | PARTIAL |
| BR-012 | scoped queries | — | — | ItineraryTest | PARTIAL |
| BR-013 | auth:sanctum | — | — | tests | PARTIAL |
| BR-014 | admin middleware | — | — | AdminTest | PARTIAL |
| BR-015 | admin CRUD | — | — | AdminTest | PARTIAL |
| BR-016 | PlaceRequest | — | — | AdminTest | PARTIAL |
| BR-017 | admin users (TBD-007) | — | — | AdminTest | PARTIAL |
| BR-018 | nothing built | — | — | — | IMPLEMENTED (excluded) |
| BR-019 | nothing built | — | — | — | IMPLEMENTED (excluded) |

# Testing
| Suite | Command | Result at authoring |
|---|---|---|
| Frontend typecheck | `npm run typecheck` | **passed** |
| Frontend lint | `npm run lint` | **passed** |
| Frontend unit/UI (vitest) | `npm test` | **8/8 passed** |
| Frontend build | `npm run build` | **passed** |
| Backend PHP syntax | `php -l` on all PHP files | **passed** |
| Backend feature tests (20) | `php artisan test` | **NOT RUN** (no Composer access) |
| `php artisan migrate:fresh --seed` | — | **NOT RUN** |
| E2E flows 1–5 | — | not implemented |

Backend tests (sqlite in-memory via `RefreshDatabase`): `AuthTest` (6), `PlaceTest` (4), `ItineraryTest` (5), `AdminTest` (5) — seeding idempotency/hashing, login by email/username, invalid login, role escalation blocked, 401/403, place CRUD+validation, 409 delete, user-list secrecy, itinerary CRUD, ownership isolation, invalid references.

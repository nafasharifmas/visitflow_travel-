# Visit Flow — Local Tourist Planning Application

Responsive web app for discovering local places and planning a **one-day itinerary**. React 18 + TypeScript + Tailwind + Leaflet/OpenStreetMap frontend; Laravel 12 + Sanctum REST API; MySQL.

> **Verification status (read first):** the React frontend was typechecked, linted, unit-tested and production-built. The Laravel backend was **written and PHP-syntax-linted but NOT executed** (no Composer/Packagist access in the authoring environment). Run `php artisan migrate:fresh --seed` and `php artisan test` yourself before relying on it — see `FINAL_IMPLEMENTATION_REPORT.md`.

## Features
Catalogue, search (name/keyword), category filter, place details, Leaflet map with markers/popups, one-day planner (reorder, visit windows, straight-line suggested path), guest temporary plan, registered-user saved itineraries (full CRUD API), Sanctum bearer-token auth, admin place CRUD and user management, six-section editorial landing page with a lazy-loaded Three.js scroll scene (static SVG fallback for mobile / reduced motion / no WebGL).

## Prerequisites
PHP ≥ 8.2 (extensions: pdo_mysql, mbstring, xml, curl, sqlite3 for tests), Composer 2, MySQL 8, Node ≥ 20.

## Backend setup
```bash
cd backend
./setup.sh                      # fetches the Laravel 12 skeleton (never overwrites our files), composer install, key:generate, publishes Sanctum
mysql -u root -p -e "CREATE DATABASE visitflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
# edit .env: DB_USERNAME / DB_PASSWORD
php artisan migrate:fresh --seed
php artisan serve               # http://127.0.0.1:8000
```
## Frontend setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev                     # http://localhost:5173 (proxies /api to :8000)
```
## Development credentials — **local testing only, never use in production**
| Role | Username | Email | Password |
|---|---|---|---|
| Admin | `admin` | `admin@visitflow.local` | `Admin@12345` |
| User | `user` | `user@visitflow.local` | `User@12345` |

Login accepts **username OR email** in the `login` field. In `APP_ENV=production` these accounts are *not* created; set `VF_ADMIN_EMAIL` + `VF_ADMIN_PASSWORD` instead.

## Tests & build
```bash
cd backend  && php artisan test
cd frontend && npm run typecheck && npm run lint && npm test && npm run build
```
## Demo data
The 11 seeded places are **DEMO data** (approximate coordinates/hours, `is_verified=false`, no images) because the SRS leaves the locality open (TBD-019). Replace them via the admin UI before presenting data as verified.

## Troubleshooting
- *CORS / 401 in browser:* use the Vite proxy (`VITE_API_BASE_URL=/api`) or serve both on one origin.
- *Map shows grey:* OSM tiles unreachable; the app shows a controlled message and everything else still works.
- *`migrate` fails on `personal_access_tokens`:* re-run `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"`.

Docs: see `docs/`.

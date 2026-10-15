#!/usr/bin/env bash
# Builds a runnable Laravel 12 app from the Visit Flow source files in this folder.
# Requires: PHP >= 8.2 (+ pdo_mysql, mbstring, xml, curl), Composer, MySQL.
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -f artisan ]; then
  echo "==> Fetching Laravel 12 skeleton (fills in artisan, config/, public/, etc.; never overwrites Visit Flow files)"
  TMP="$(mktemp -d)"
  composer create-project laravel/laravel:^12.0 "$TMP/skel" --no-install --no-interaction
  cp -rn "$TMP/skel/." .
  rm -rf "$TMP"
fi

composer install --no-interaction
[ -f .env ] || cp .env.example .env
php artisan key:generate --ansi
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider" --no-interaction || true
echo "==> Done. Now create the MySQL database, edit .env, then run: php artisan migrate:fresh --seed"

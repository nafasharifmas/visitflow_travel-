<?php

return [
    // TBD-001: reference point is a project decision. Defaults are DEMO values.
    'reference' => [
        'name' => env('VF_REFERENCE_NAME', 'Colombo Fort (demo reference point)'),
        'latitude' => (float) env('VF_REFERENCE_LAT', 6.9344),
        'longitude' => (float) env('VF_REFERENCE_LNG', 79.8428),
    ],
    'token_ttl_days' => (int) env('VF_TOKEN_TTL_DAYS', 7), // TBD-005 decision, see docs/DECISIONS.md
    // Production admin bootstrap: only used when both are set AND APP_ENV=production.
    'admin_email' => env('VF_ADMIN_EMAIL'),
    'admin_password' => env('VF_ADMIN_PASSWORD'),
    'admin_username' => env('VF_ADMIN_USERNAME', 'admin'),
];

<?php
return [

    // Apply CORS only to your API routes:
    'paths' => ['api/*'],

    // Allow your React dev origin:
    'allowed_origins' => ['http://localhost:5173','http://127.0.0.1:5173'],

    // Allow all HTTP methods (GET, POST, OPTIONS, etc.):
    'allowed_methods' => ['*'],

    // Allow all headers (so Content-Type & Authorization pass through):
    'allowed_headers' => ['*'],

    // Don’t support cookies/credentials for JWT in headers:
    'supports_credentials' => false,

    // How long browsers can cache the preflight (in seconds):
    'max_age' => 3600,
];

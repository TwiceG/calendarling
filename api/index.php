<?php

// Autoload dependencies
require __DIR__ . '/../vendor/autoload.php';

// Bootstrap the application
$app = require_once __DIR__ . '/../bootstrap/app.php';

// Run the application
$request = Illuminate\Http\Request::capture();
$response = $app->handle($request);

$response->send();

$app->terminate($request, $response);

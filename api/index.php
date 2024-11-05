<?php

// Require the Composer autoloader
require __DIR__ . '/../backend/vendor/autoload.php';

// Bootstrap the Laravel application
$app = require_once __DIR__ . '/../backend/bootstrap/app.php';

// Handle the incoming request
$request = Illuminate\Http\Request::capture();
$response = $app->handle($request);

// Send the response back to the client
$response->send();

// Terminate the application
$app->terminate($request, $response);

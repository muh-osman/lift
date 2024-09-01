<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VisitController;
use App\Http\Controllers\CustomerController;



// Group for protected routes
Route::middleware('auth:sanctum')->group(function () {

    // Return the authenticated user and his token (http://localhost:8000/api/user)
    Route::get('user', function (Request $request) {
        return [
            'user' => $request->user(),
            'currentToken' => $request->bearerToken()
        ];
    });

    Route::get('/users/role/technician', [UserController::class, 'getUsersWithRole13']);
    Route::post('/reset/technician/password', [UserController::class, 'resetTechnicianPassword']);

    // Logout Route (http://localhost:8000/api/logout)
    Route::post('/logout', [UserController::class, 'logout']);

    // Resend verification email (http://localhost:8000/api/resend-verify-email)
    Route::post('/resend-verify-email', [UserController::class, 'resendVerifyEmail']);


    // Customers
    Route::get('/customers', [CustomerController::class, 'index']);
    Route::post('/customers', [CustomerController::class, 'store']);
    Route::get('/customers/{id}', [CustomerController::class, 'show']);
    Route::post('/customers/{id}', [CustomerController::class, 'update']);
    Route::delete('/customers/{id}', [CustomerController::class, 'destroy']);
    Route::get('/customers/visit/today', [CustomerController::class, 'getCustomersToVisitToday']);
    Route::get('/customers/ids/names', [CustomerController::class, 'getCustomerIdsAndNames']);
    Route::get('/customers/visit/today/and/visited/today', [CustomerController::class, 'getCustomersToVisitAndVisitedToday']);
    Route::get('/last/visit/for/customer/{customerId}/today', [CustomerController::class, 'getLastVisitTodayForCustomer']);


    // Route::match(['patch'], '/customers/{id}', [CustomerController::class, 'update']);
    // Route::get('/tables-associated-with-user', [SheetController::class, 'index']);
    // Route::post('/tables/search', [SheetController::class, 'searchTableByName']);


    Route::post('/visits', [VisitController::class, 'store']);
});





// Group for guest routes
Route::middleware('guest')->group(function () {
    // Register Route (http://localhost:8000/api/register)
    Route::post('/register', [UserController::class, 'register']);

    // Login Route (http://localhost:8000/api/login)
    Route::post('/login', [UserController::class, 'login']);

    // Email verification endpoint (http://localhost:8000/api/verify-email)
    Route::post('/verify-email', [UserController::class, 'verifyEmail'])->name('verification.verify');

    // Password Reset Route (http://localhost:8000/api/forgot-password)
    Route::post('/forgot-password', [UserController::class, 'forgotPassword'])->name('password.email');

    // API route for resetting the password (http://localhost:8000/api/reset-password)
    Route::post('/reset-password', [UserController::class, 'resetPassword'])->name('password.reset');
});

<?php
namespace App\Http\Controllers\Kasir;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Kasir\CategoryController;
use App\Http\Controllers\Kasir\ProductController;
use App\Http\Controllers\Kasir\TransactionController;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Cukup gunakan Route::resource karena sudah otomatis membuat semua endpoint CRUD
    Route::prefix('kasir')->name('kasir.')->group(function () {
        Route::resource('categories', CategoryController::class);
        Route::resource('products', ProductController::class);
        Route::resource('transactions', TransactionController::class);
        
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

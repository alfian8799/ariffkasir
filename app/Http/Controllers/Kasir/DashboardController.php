<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Transaction;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = now()->toDateString();

        $todayTransactions = Transaction::whereDate('created_at', $today);

        $todayOmzet = $todayTransactions->sum('total');
        $totalTransactionsCount = $todayTransactions->count();
        $totalProductsCount = Product::count();

        $lowStockProducts = Product::where('stock', '<=', 5)->get();

        return Inertia::render('dashboard', [
            'todayOmzet' => $todayOmzet,
            'totalTransactionsCount' => $totalTransactionsCount,
            'totalProductsCount' => $totalProductsCount,
            'lowStockProducts' => $lowStockProducts,
        ]);
    }
}
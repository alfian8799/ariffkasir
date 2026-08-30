<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', now()->endOfMonth()->toDateString());

        $transactions = Transaction::with('user')
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->latest()
            ->get();

        $totalOmzet = $transactions->sum('total');
        $totalTransactions = $transactions->count();
        $paymentMethods = $transactions->groupBy('payment_method')->map->count();

        return Inertia::render('Kasir/Report/ReportIndex', [
            'transactions' => $transactions,
            'totalOmzet' => $totalOmzet,
            'totalTransactions' => $totalTransactions,
            'paymentMethods' => $paymentMethods,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]
        ]);
    }
}
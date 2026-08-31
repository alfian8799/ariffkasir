<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Category;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with('user')->latest()->get();

        return Inertia::render('Kasir/Transaction/TransactionIndex', [
            'transactions' => $transactions
        ]);
    }

    public function create()
{
    $categories = Category::where('is_active', true)->get();
    $products = Product::where('is_active', true)->with('category')->get();

    return Inertia::render('Kasir/Transaction/TransactionCreate', [
        'categories' => $categories,
        'products' => $products,
    ]);
}
    public function store(Request $request)
    {
        $request->validate([
            'items'             => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1',
            'subtotal'          => 'required|numeric',
            'discount'          => 'nullable|numeric',
            'total'             => 'required|numeric',
            'paid_amount'       => 'required|numeric',
            'change_amount'     => 'required|numeric',
            'payment_method'    => 'required|string',
            'notes'             => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $dateCode = date('Ymd');
            $lastTransaction = Transaction::whereDate('created_at', today())->latest()->first();
            $lastNumber = 0;

            if ($lastTransaction && preg_match('/(\d{4})$/', $lastTransaction->invoice_number, $matches)) {
                $lastNumber = (int) $matches[1];
            }

            $invoiceNumber = 'INV-' . $dateCode . '-' . str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
            $paymentMethod = strtolower(trim((string) $request->payment_method));

            $transaction = Transaction::create([
                'invoice_number' => $invoiceNumber,
                'user_id'        => Auth::user()?->id,
                'subtotal'       => $request->subtotal,
                'discount'       => $request->discount ?? 0,
                'total'          => $request->total,
                'paid_amount'    => $request->paid_amount,
                'change_amount'  => $request->change_amount,
                'payment_method' => $paymentMethod,
                'status'         => 'completed',
                'notes'          => $request->notes,
            ]);

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);

                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'product_id'     => $product->id,
                    'product_name'   => $product->name,
                    'price'          => $product->price,
                    'quantity'       => $item['quantity'],
                    'subtotal'       => $product->price * $item['quantity'],
                ]);

                $product->decrement('stock', $item['quantity']);
            }

            DB::commit();

            return redirect()->route('kasir.transactions.index');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['error' => 'Gagal menyimpan transaksi: ' . $e->getMessage()])->withInput();
        }
    }

    public function show(Transaction $transaction)
    {
        $transaction->load('user', 'items.product');

        return Inertia::render('Kasir/Transaction/TransactionShow', [
            'transaction' => $transaction
        ]);
    }

    public function destroy(Transaction $transaction)
    {
        try {
            DB::beginTransaction();

            foreach ($transaction->items as $item) {
                Product::where('id', $item->product_id)->increment('stock', $item->quantity);
            }

            $transaction->update(['status' => 'cancelled']);

            DB::commit();

            return redirect()->route('kasir.transactions.index');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
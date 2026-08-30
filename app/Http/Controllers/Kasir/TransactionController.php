<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with('user')->latest()->get();

        // Path disesuaikan dengan folder di VS Code (Case-Sensitive)
        return Inertia::render('Kasir/Transaction/TransactionIndex', [
            'transactions' => $transactions
        ]);
    }

    public function create()
    {
        $products = Product::with('category')->where('stock', '>', 0)->get();

        // Path disesuaikan dengan folder di VS Code (Case-Sensitive)
        return Inertia::render('Kasir/Transaction/TransactionCreate', [
            'products' => $products
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'items'              => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1',
            'subtotal'           => 'required|numeric',
            'discount'           => 'nullable|numeric',
            'total'              => 'required|numeric',
            'paid_amount'        => 'required|numeric',
            'change_amount'      => 'required|numeric',
            'payment_method'     => 'required|string',
            'notes'              => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            // Generate nomor nota unik, contoh: INV-20260830-0001
            $dateCode = date('Ymd');
            $lastTransaction = Transaction::whereDate('created_at', today())->latest()->first();
            $lastNumber = $lastTransaction ? (int) substr($lastTransaction->invoice_number, -4) : 0;
            $invoiceNumber = 'INV-' . $dateCode . '-' . str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);

            // Simpan header transaksi
            $transaction = Transaction::create([
                'invoice_number' => $invoiceNumber,
               
                'subtotal'       => $request->subtotal,
                'discount'       => $request->discount ?? 0,
                'total'          => $request->total,
                'paid_amount'    => $request->paid_amount,
                'change_amount'  => $request->change_amount,
                'payment_method' => $request->payment_method,
                'status'         => 'Selesai',
                'notes'          => $request->notes,
            ]);

            // Simpan item transaksi & kurangi stok produk
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

                // Kurangi stok produk
                $product->decrement('stock', $item['quantity']);
            }

            DB::commit();

            return redirect()->route('kasir.transactions.index');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function show(Transaction $transaction)
    {
        $transaction->load('user', 'items.product');

        // Path disesuaikan dengan folder di VS Code (Case-Sensitive)
        return Inertia::render('Kasir/Transaction/TransactionShow', [
            'transaction' => $transaction
        ]);
    }

    public function destroy(Transaction $transaction)
    {
        try {
            DB::beginTransaction();

            // Kembalikan stok produk jika transaksi dibatalkan
            foreach ($transaction->items as $item) {
                Product::where('id', $item->product_id)->increment('stock', $item->quantity);
            }

            $transaction->update(['status' => 'Dibatalkan']);

            DB::commit();

            return redirect()->route('kasir.transactions.index');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
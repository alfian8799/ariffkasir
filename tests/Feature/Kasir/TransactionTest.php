<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;

it('can create a transaction and redirect to transaction list', function () {
    /** @var \Tests\TestCase $this */
    $user = User::factory()->create();
    $category = Category::create([
        'name' => 'Minuman',
        'description' => 'Minuman',
        'is_active' => true,
    ]);

    $product = Product::create([
        'category_id' => $category->id,
        'name' => 'Es Teh',
        'description' => 'Es Teh Manis',
        'price' => 5000,
        'stock' => 10,
        'unit' => 'pcs',
        'is_active' => true,
    ]);

    $response = $this->actingAs($user)->post('/kasir/transactions', [
        'items' => [
            [
                'product_id' => $product->id,
                'quantity' => 2,
            ],
        ],
        'subtotal' => 10000,
        'discount' => 0,
        'total' => 10000,
        'paid_amount' => 15000,
        'change_amount' => 5000,
        'payment_method' => 'cash',
        'notes' => 'Test transaksi',
    ]);

    $response->assertRedirect('/kasir/transactions');
    $this->assertDatabaseHas('transactions', [
        'invoice_number' => 'INV-' . now()->format('Ymd') . '-0001',
        'user_id' => $user->id,
        'total' => 10000,
    ]);
    $this->assertDatabaseCount('transactions', 1);
});

it('can visit transaction index with saved data', function () {
    /** @var \Tests\TestCase $this */
    $user = User::factory()->create();

    $transaction = \App\Models\Transaction::create([
        'invoice_number' => 'INV-20260830-0001',
        'user_id' => $user->id,
        'subtotal' => 10000,
        'discount' => 0,
        'total' => 10000,
        'paid_amount' => 15000,
        'change_amount' => 5000,
        'payment_method' => 'cash',
        'status' => 'completed',
        'notes' => 'Test transaksi',
    ]);

    $response = $this->actingAs($user)->get('/kasir/transactions');

    $response->assertOk();
    $this->assertSame('INV-20260830-0001', $transaction->invoice_number);
});

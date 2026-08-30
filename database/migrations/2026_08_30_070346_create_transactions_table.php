<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique(); //Nomor nota, contoh: INV-20260828-001
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete(); //Kasir yang melayani
            $table->decimal('subtotal', 15, 2); //Total sebelum diskon
            $table->decimal('discount', 15, 2)->default(0); //Nominal diskon
            $table->decimal('total', 15, 2); //Total yang harus dibayar
            $table->decimal('paid_amount', 15, 2); //Uang yang diterima dari pelanggan
            $table->decimal('change_amount', 15, 2)->default(0); //Kembalian
            $table->enum('payment_method', ['cash', 'transfer', 'qris'])->default('cash');
            $table->enum('status', ['completed', 'cancelled'])->default('completed');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};

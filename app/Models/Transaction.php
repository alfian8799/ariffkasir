<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'invoice_number', 
        'user_id', 
        'subtotal', 
        'discount', 
        'total', 
        'paid_amount', 
        'change_amount', 
        'payment_method', 
        'status',         
        'notes'];           


    protected $casts = [
        'subtotal' => 'decimal:15,2',
        'discount' => 'decimal:15,2',
        'total' => 'decimal:15,2',
        'paid_amount' => 'decimal:15,2',
        'change_amount' => 'decimal:15,2',

    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function items()
    {
        return $this->hasMany(TransactionItem::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }



}

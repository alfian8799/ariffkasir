<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{

    use HasFactory;

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
        'notes'
    ];


    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'change_amount' => 'decimal:2',
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

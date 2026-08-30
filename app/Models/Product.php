<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'category_id', 
        'name', 
        'description', 
        'price', 
        'stock', 
        'unit', 
        'image',         
        'is_active'];     
        
        

    protected $casts = [
        'is_active' => 'boolean',
    ];
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function transactionItems()
    {
        return $this->hasMany(TransactionItem::class);
    }
}

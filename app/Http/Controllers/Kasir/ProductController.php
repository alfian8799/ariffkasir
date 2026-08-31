<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->latest()->get();

        return Inertia::render('Kasir/products/ProductIndex', [
            'products' => $products
        ]);
    }

    public function create()
{
    return Inertia::render('Kasir/products/ProductCreate', [
        'categories' => Category::active()->get(),
    ]);
}

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required',
            'name'        => 'required|string|max:255',
            'price'       => 'required|numeric',
            'stock'       => 'required|integer',
            'satuan'      => 'required|string',
        ]);

        Product::create($request->all());

        return redirect()->route('kasir.products.index');
    }

   public function edit(Product $product)
{
    return Inertia::render('Kasir/products/ProductEdit', [
        'product' => $product,
        'categories' => Category::active()->get(),
    ]);
}

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'category_id' => 'required',
            'name'        => 'required|string|max:255',
            'price'       => 'required|numeric',
            'stock'       => 'required|integer',
            'satuan'      => 'required|string',
        ]);

        $product->update($request->all());

        return redirect()->route('kasir.products.index');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('kasir.products.index');
    }
}

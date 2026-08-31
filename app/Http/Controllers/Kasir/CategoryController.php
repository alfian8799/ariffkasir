<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('status')) {
            $isActive = $request->status === 'Aktif' ? 1 : 0;
            $query->where('is_active', $isActive);
        }

        $categories = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Kasir/categories/CategoryIndex', [
            'categories' => $categories,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Kasir/categories/CategoryCreate');
    }

  
    public function edit(Category $category)
    {
        return Inertia::render('Kasir/categories/CategoryEdit', [
            'category' => $category,
        ]);
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'is_active' => 'boolean',
    ]);

    // Menggunakan boolean() agar nilai false/0 terbaca akurat
    $validated['is_active'] = $request->boolean('is_active');

    Category::create($validated);

    return redirect()->route('kasir.categories.index')
        ->with('success', 'Kategori berhasil ditambahkan.');
}

public function update(Request $request, Category $category)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'is_active' => 'boolean',
    ]);

    // Menggunakan boolean() agar nilai false/0 terbaca akurat
    $validated['is_active'] = $request->boolean('is_active');

    $category->update($validated);

    return redirect()->route('kasir.categories.index')
        ->with('success', 'Kategori berhasil diperbarui.');
}
   

    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->route('kasir.categories.index')
            ->with('success', 'Kategori berhasil dihapus.');
    }
}
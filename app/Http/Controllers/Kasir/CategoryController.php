<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Category::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'Aktif' ? 1 : 0);
        }

        $categories = $query->orderBy('name')->paginate(10)->withQueryString();

        return Inertia::render('Kasir/categories/CategoryIndex', [
            'categories' => $categories,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Kasir/categories/CategoryCreate');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:100|unique:categories,name',
            'description' => 'nullable|string|max:500',
            'is_active'   => 'boolean',
        ]);

        $validated['is_active'] = $request->has('is_active') ? true : false;

        Category::create($validated);

        return redirect()
            ->route('kasir.categories.index')
            ->with('success', 'Category created successfully.');
    }

    public function edit(Category $category): Response
    {
        return Inertia::render('Kasir/categories/CategoryEdit', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:100|unique:categories,name,' . $category->id,
            'description' => 'nullable|string|max:500',
            'is_active'   => 'boolean',
        ]);

        $validated['is_active'] = $request->has('is_active') ? true : false;

        $category->update($validated);

        return redirect()
            ->route('kasir.categories.index')
            ->with('success', 'Category updated successfully.');
    }


    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();

        return redirect()
            ->route('kasir.categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}
import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Eye, Edit, Trash2, Package } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    category_id: number;
    category?: Category;
    price: number;
    stock: number;
    satuan: string;
    deskripsi?: string;
    aktif?: boolean | number;
    is_active?: boolean | number;
}

interface Props {
    products: Product[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Produk', href: '/kasir/products' },
];

export default function ProductIndex({ products }: Props) {
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('az');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [productToView, setProductToView] = useState<Product | null>(null);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'az') return a.name.localeCompare(b.name);
        if (sortBy === 'za') return b.name.localeCompare(a.name);
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'stock-asc') return a.stock - b.stock;
        if (sortBy === 'stock-desc') return b.stock - a.stock;
        return 0;
    });

    const confirmDelete = (product: Product) => {
        setProductToDelete(product);
        setDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (productToDelete) {
            router.delete(route('kasir.products.destroy', productToDelete.id), {
                onSuccess: () => setDeleteModalOpen(false),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-6 p-4 sm:p-6 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Daftar Produk</h1>
                        <p className="text-sm text-gray-500 mt-1">Kelola inventaris produk, kategori, harga, dan ketersediaan stok kasir.</p>
                    </div>
                    <Link href={route('kasir.products.create')} className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="w-4 h-4" /> Tambah Produk
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Cari nama produk..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 w-full bg-gray-50/50"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Urutkan:</span>
                        <select
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="az">Abjad (A - Z)</option>
                            <option value="za">Abjad (Z - A)</option>
                            <option value="price-asc">Harga (Termurah - Termahal)</option>
                            <option value="price-desc">Harga (Termahal - Termurah)</option>
                            <option value="stock-asc">Stok (Paling Sedikit - Terbanyak)</option>
                            <option value="stock-desc">Stok (Terbanyak - Paling Sedikit)</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 w-full overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50/75 text-gray-600 uppercase font-semibold text-xs border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">Nama</th>
                                    <th className="px-6 py-4">Kategori</th>
                                    <th className="px-6 py-4">Harga</th>
                                    <th className="px-6 py-4">Stok</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sortedProducts.length > 0 ? (
                                    sortedProducts.map((product, index) => {
                                        const isActive = product.aktif === true || product.aktif === 1 || product.is_active === true || product.is_active === 1;
                                        return (
                                            <tr key={product.id} className="hover:bg-blue-50/30 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-500">{index + 1}</td>
                                                <td className="px-6 py-4 font-semibold text-gray-900">{product.name}</td>
                                                <td className="px-6 py-4 text-gray-600">{product.category?.name || '-'}</td>
                                                <td className="px-6 py-4 text-blue-600 font-semibold">
                                                    Rp {Number(product.price).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 font-medium">
                                                    {product.stock} {product.satuan || 'pcs'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge
                                                        className={`font-medium ${
                                                            isActive
                                                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                                                : 'bg-red-100 text-red-700 hover:bg-red-100'
                                                        }`}
                                                    >
                                                        {isActive ? 'Aktif' : 'Tidak Aktif'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                                                    <button
                                                        onClick={() => { setProductToView(product); setViewModalOpen(true); }}
                                                        className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium"
                                                    >
                                                        <Eye className="w-4 h-4" /> Lihat
                                                    </button>
                                                    <Link
                                                        href={route('kasir.products.edit', product.id)}
                                                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                                                    >
                                                        <Edit className="w-4 h-4" /> Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => confirmDelete(product)}
                                                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-medium"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Package className="w-10 h-10 text-gray-300" />
                                                <p className="text-base font-medium text-gray-500">Belum ada produk ditemukan.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Konfirmasi Hapus</DialogTitle>
                            <DialogDescription>
                                Apakah Anda yakin ingin menghapus produk <span className="font-semibold text-gray-900">{productToDelete?.name}</span>? Tindakan ini tidak dapat dibatalkan.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Batal</Button>
                            <Button variant="destructive" onClick={handleDelete}>Ya, Hapus</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Detail Produk</DialogTitle>
                        </DialogHeader>
                        {productToView && (
                            <div className="space-y-4 py-3 text-sm">
                                <div className="grid grid-cols-3 gap-2 border-b pb-3">
                                    <span className="font-medium text-gray-500">Nama Produk</span>
                                    <span className="col-span-2 font-semibold text-gray-900">{productToView.name}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 border-b pb-3">
                                    <span className="font-medium text-gray-500">Kategori</span>
                                    <span className="col-span-2 text-gray-700">{productToView.category?.name || '-'}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 border-b pb-3">
                                    <span className="font-medium text-gray-500">Harga</span>
                                    <span className="col-span-2 text-blue-600 font-bold">Rp {Number(productToView.price).toLocaleString('id-ID')}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 border-b pb-3">
                                    <span className="font-medium text-gray-500">Stok</span>
                                    <span className="col-span-2 font-semibold text-gray-900">{productToView.stock} {productToView.satuan || 'pcs'}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 border-b pb-3">
                                    <span className="font-medium text-gray-500">Status</span>
                                    <span className="col-span-2">
                                        <Badge className={`font-medium ${productToView.aktif || productToView.is_active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-red-100 text-red-700 hover:bg-red-100'}`}>
                                            {productToView.aktif || productToView.is_active ? 'Aktif' : 'Tidak Aktif'}
                                        </Badge>
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="font-medium text-gray-500">Deskripsi</span>
                                    <span className="col-span-2 text-gray-700">{productToView.deskripsi || '-'}</span>
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button onClick={() => setViewModalOpen(false)} className="w-full sm:w-auto">Tutup</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
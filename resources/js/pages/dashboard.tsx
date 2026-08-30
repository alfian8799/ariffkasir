import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

interface Product {
    id: number;
    name: string;
    stock: number;
}

interface Props {
    todayOmzet: number;
    totalTransactionsCount: number;
    totalProductsCount: number;
    lowStockProducts: Product[];
}

export default function Dashboard({ todayOmzet, totalTransactionsCount, totalProductsCount, lowStockProducts }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-col gap-6 p-6 w-full">
                <h1 className="text-xl font-semibold text-gray-800">Dashboard Toko Kelontong</h1>

                {/* Kartu Statistik Atas */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-xl border shadow-sm">
                        <p className="text-xs text-gray-500">Omzet Hari Ini</p>
                        <h3 className="text-2xl font-bold text-blue-600 mt-1">Rp {Number(todayOmzet).toLocaleString('id-ID')}</h3>
                    </div>
                    <div className="bg-white p-5 rounded-xl border shadow-sm">
                        <p className="text-xs text-gray-500">Total Transaksi Hari Ini</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{totalTransactionsCount} Transaksi</h3>
                    </div>
                    <div className="bg-white p-5 rounded-xl border shadow-sm">
                        <p className="text-xs text-gray-500">Total Jenis Produk</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{totalProductsCount} Barang</h3>
                    </div>
                </div>

                {/* Tabel Peringatan Stok Menipis */}
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="p-4 border-b font-semibold text-gray-800 flex justify-between items-center">
                        <span>Peringatan Stok Menipis (≤ 5 pcs)</span>
                        <Link href="/kasir/products">
                            <Button variant="outline" size="sm">Kelola Produk</Button>
                        </Link>
                    </div>
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b bg-gray-50 text-gray-500">
                                <th className="p-3">Nama Produk</th>
                                <th className="p-3">Sisa Stok</th>
                                <th className="p-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowStockProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center text-gray-400 py-6">Semua stok produk aman dan mencukupi.</td>
                                </tr>
                            ) : (
                                lowStockProducts.map((product) => (
                                    <tr key={product.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium">{product.name}</td>
                                        <td className="p-3 text-red-600 font-bold">{product.stock} pcs</td>
                                        <td className="p-3 text-right">
                                            <Link href={`/kasir/products/${product.id}/edit`}>
                                                <Button size="sm" variant="secondary">Restock</Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
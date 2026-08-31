import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Edit, Trash2, FolderKanban } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    description: string | null;
    is_active: number | boolean;
}

interface Filters {
    search?: string;
    status?: string;
}

interface Props {
    categories: {
        data: Category[];
        [key: string]: unknown;
    };
    filters: Filters;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kategori', href: '/kasir/categories' },
];

export default function CategoryIndex({ categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/kasir/categories', { search, status }, { preserveState: true });
    };

    const confirmDelete = (category: Category) => {
        setCategoryToDelete(category);
        setDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (categoryToDelete) {
            router.delete(`/kasir/categories/${categoryToDelete.id}`, {
                onSuccess: () => setDeleteModalOpen(false),
            });
        }
    };
    

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-6 p-4 sm:p-6 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Daftar Kategori</h1>
                        <p className="text-sm text-gray-500 mt-1">Kelola pengelompokan produk dan status ketersediaannya.</p>
                    </div>
                    <Link href="/kasir/categories/create" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="w-4 h-4" /> Tambah Kategori
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleFilter} className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Cari kategori..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 w-full bg-gray-50/50"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                        >
                            <option value="">Semua Status</option>
                            <option value="Aktif">Aktif</option>
                            <option value="Tidak Aktif">Tidak Aktif</option>
                        </select>
                        <Button type="submit" variant="secondary" className="px-4 py-2">
                            Filter
                        </Button>
                    </div>
                </form>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 w-full overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50/75 text-gray-600 uppercase font-semibold text-xs border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">Nama</th>
                                    <th className="px-6 py-4">Deskripsi</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {categories.data.length > 0 ? (
                                    categories.data.map((category, index) => (
                                        <tr key={category.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-500">{index + 1}</td>
                                            <td className="px-6 py-4 font-semibold text-gray-900">{category.name}</td>
                                            <td className="px-6 py-4 text-gray-600">{category.description || '-'}</td>
                                            <td className="px-6 py-4">
                                                <Badge
                                                    variant={category.is_active === 1 || category.is_active === true ? "secondary" : "destructive"}
                                                    className={`font-medium ${
                                                        category.is_active === 1 || category.is_active === true
                                                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                                            : ''
                                                    }`}
                                                >
                                                    {category.is_active === 1 || category.is_active === true ? 'Aktif' : 'Tidak Aktif'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                                                <Link
                                                    href={`/kasir/categories/${category.id}/edit`}
                                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    <Edit className="w-4 h-4" /> Edit
                                                </Link>
                                                <button
                                                    onClick={() => confirmDelete(category)}
                                                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-medium"
                                                >
                                                    <Trash2 className="w-4 h-4" /> Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <FolderKanban className="w-10 h-10 text-gray-300" />
                                                <p className="text-base font-medium text-gray-500">Belum ada kategori ditemukan.</p>
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
                                Apakah Anda yakin ingin menghapus kategori <span className="font-semibold text-gray-900">{categoryToDelete?.name}</span>? Tindakan ini tidak dapat dibatalkan.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Batal</Button>
                            <Button variant="destructive" onClick={handleDelete}>Ya, Hapus</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
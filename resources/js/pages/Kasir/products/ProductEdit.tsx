import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { FormEventHandler } from 'react';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    category_id: number;
    name: string;
    deskripsi?: string;
    price: number;
    stock: number;
    satuan: string;
}

interface Props {
    product: Product;
    categories: Category[];
}

export default function ProductEdit({ product, categories }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        category_id: product.category_id || '',
        name: product.name || '',
        deskripsi: product.deskripsi || '',
        price: product.price || '',
        stock: product.stock || '',
        satuan: product.satuan || 'pcs',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('products.update', product.id));
    };

    return (
        <AppLayout>
            <div className="mb-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem><BreadcrumbLink href={route('dashboard')}>Dashboard</BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem><BreadcrumbLink href={route('products.index')}>Produk</BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem><BreadcrumbPage>Edit</BreadcrumbPage></BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="bg-white p-6 rounded-md shadow-sm border max-w-2xl">
                <h1 className="text-2xl font-bold tracking-tight mb-6">Edit Produk</h1>
                                
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="category_id">Kategori</Label>
                        <select 
                            id="category_id" 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={data.category_id}
                            onChange={(e) => setData('category_id', e.target.value)}
                        >
                            <option value="" disabled>Pilih Kategori</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        {errors.category_id && <p className="text-sm text-red-600">{errors.category_id}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Produk</Label>
                        <Input 
                            id="name" 
                            type="text" 
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="deskripsi">Deskripsi</Label>
                        <textarea
                            id="deskripsi"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={data.deskripsi}
                            onChange={(e) => setData('deskripsi', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Harga (Rp)</Label>
                            <Input 
                                id="price" 
                                type="number" 
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                            />
                            {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stok</Label>
                            <Input 
                                id="stock" 
                                type="number" 
                                value={data.stock}
                                onChange={(e) => setData('stock', e.target.value)}
                            />
                            {errors.stock && <p className="text-sm text-red-600">{errors.stock}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="satuan">Satuan</Label>
                        <select 
                            id="satuan" 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={data.satuan}
                            onChange={(e) => setData('satuan', e.target.value)}
                        >
                            <option value="pcs">pcs</option>
                            <option value="porsi">porsi</option>
                            <option value="pack">pack</option>
                        </select>
                    </div>

                    <div className="pt-4 flex space-x-2">
                        <Button type="submit" disabled={processing}>Simpan Perubahan</Button>
                        <Button type="button" variant="secondary" onClick={() => window.history.back()}>Batal</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
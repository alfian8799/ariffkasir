import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { FormEventHandler } from 'react';

interface Category {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
}

export default function ProductCreate({ categories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        category_id: '',
        name: '',
        deskripsi: '',
        price: '',
        stock: '',
        satuan: 'pcs',
        aktif: true as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('kasir.products.store'));
    };

    return (
        <AppLayout>
            {/* Ubah pembungkus utama agar memiliki jarak padding yang konsisten */}
            <div className="flex h-full flex-col gap-6 p-6 w-full">
                <div className="mb-2">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem><BreadcrumbLink href={route('dashboard')}>Dashboard</BreadcrumbLink></BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem><BreadcrumbLink href={route('kasir.products.index')}>Produk</BreadcrumbLink></BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem><BreadcrumbPage>Tambah</BreadcrumbPage></BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Perbesar padding card menjadi p-8 dan beri border/radius rapi */}
                <div className="bg-white p-8 rounded-xl shadow-sm border max-w-2xl">
                    <h1 className="text-2xl font-bold tracking-tight mb-6">Tambah Produk</h1>
                        
                    {/* Ubah spasi antar elemen form menjadi space-y-6 agar lebih longgar */}
                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="category_id">Kategori</Label>
                            <select 
                                id="category_id" 
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                            >
                                <option value="" disabled>Pilih Kategori</option>
                                {categories && categories.length > 0 ? (
                                    categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>Kategori kosong, harap tambahkan kategori dulu</option>
                                )}
                            </select>
                            {errors.category_id && <p className="text-sm text-red-600">{errors.category_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Produk</Label>
                            <Input 
                                id="name" 
                                type="text" 
                                placeholder="Contoh: Mie Goreng"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <textarea
                                id="deskripsi"
                                placeholder="Opsional"
                                className="flex min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                                    placeholder="5000"
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
                                    placeholder="0"
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

                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox 
                                id="aktif" 
                                checked={data.aktif}
                                onCheckedChange={(checked) => setData('aktif', checked === true)}
                            />
                            <Label htmlFor="aktif" className="font-normal cursor-pointer">Aktif</Label>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" variant="default" disabled={processing}>
                                Simpan
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
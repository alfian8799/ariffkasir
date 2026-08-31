import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { FormEventHandler } from 'react';
import { type BreadcrumbItem } from '@/types';

interface Category {
    id: number;
    name: string;
    description: string | null;
    is_active: number | boolean;
}

interface Props {
    category: Category;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kategori', href: '/kasir/categories' },
    { title: 'Edit', href: '#' },
];

export default function CategoryEdit({ category }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name || '',
        description: category.description || '',
        is_active: Boolean(category.is_active),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/kasir/categories/${category.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Kategori" />
            <div className="flex h-full flex-col gap-4 rounded-xl p-4 w-full">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold leading-tight text-gray-800">Edit Kategori</h1>
                    <Button variant="outline" asChild>
                        <Link href="/kasir/categories">Kembali</Link>
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Form Edit Kategori</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nama Kategori</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Masukkan nama kategori..."
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>
                            <div>
                                <Label htmlFor="description">Deskripsi</Label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Opsional"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                    rows={3}
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500 w-4 h-4"
                                />
                                <Label htmlFor="is_active" className="font-medium cursor-pointer">
                                    Aktif
                                </Label>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="submit" disabled={processing}>
                                    Perbarui
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
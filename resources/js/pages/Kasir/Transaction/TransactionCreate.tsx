import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Transaksi', href: '/kasir/transactions' },
    { title: 'Transaksi Baru', href: '/kasir/transactions/create' },
];

interface Product {
    id: number;
    name: string;
    price: number | string;
    stock: number;
    satuan?: string;
    category?: { name: string };
}

interface CartItem {
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    // Menggunakan union type untuk menghilangkan error ESLint (no-explicit-any) dan memenuhi syarat Inertia
    [key: string]: string | number; 
}

interface TransactionForm {
    items: CartItem[];
    subtotal: number;
    discount: number;
    total: number;
    paid_amount: number;
    change_amount: number;
    payment_method: string;
    notes: string;
    // Menggunakan union type yang mencakup semua tipe properti di atas
    [key: string]: string | number | CartItem[]; 
}

export default function TransactionCreate({ products }: { products: Product[] }) {
    const [search, setSearch] = useState('');

    // Inisialisasi form menggunakan interface TransactionForm
    const { data, setData, post, processing } = useForm<TransactionForm>({
        items: [],
        subtotal: 0,
        discount: 0,
        total: 0,
        paid_amount: 0,
        change_amount: 0,
        payment_method: 'Cash',
        notes: '',
    });

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const calculateTotals = (items: CartItem[], discount: number, paid: number) => {
        const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const total = Math.max(0, subtotal - discount);
        const change = Math.max(0, paid - total);

        setData((prev) => ({
            ...prev,
            items,
            subtotal,
            total,
            change_amount: change,
        }));
    };

    const addToCart = (product: Product) => {
        const existing = data.items.find((i) => i.product_id === product.id);
        let updatedItems: CartItem[];
        if (existing) {
            updatedItems = data.items.map((i) =>
                i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            );
        } else {
            updatedItems = [...data.items, { product_id: product.id, name: product.name, price: Number(product.price), quantity: 1 }];
        }
        calculateTotals(updatedItems, data.discount, data.paid_amount);
    };

    const updateQuantity = (product_id: number, qty: number) => {
        if (qty <= 0) {
            removeFromCart(product_id);
            return;
        }
        const updatedItems = data.items.map((i) =>
            i.product_id === product_id ? { ...i, quantity: qty } : i
        );
        calculateTotals(updatedItems, data.discount, data.paid_amount);
    };

    const removeFromCart = (product_id: number) => {
        const updatedItems = data.items.filter((i) => i.product_id !== product_id);
        calculateTotals(updatedItems, data.discount, data.paid_amount);
    };

    const handleDiscountChange = (val: number) => {
        const discount = isNaN(val) ? 0 : val;
        calculateTotals(data.items, discount, data.paid_amount);
    };

    const handlePaidChange = (val: number) => {
        const paid = isNaN(val) ? 0 : val;
        const change = Math.max(0, paid - data.total);
        setData((prev) => ({ ...prev, paid_amount: paid, change_amount: change }));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.items.length === 0) {
            alert('Keranjang masih kosong!');
            return;
        }
        if (data.paid_amount < data.total) {
            alert('Uang bayar kurang dari total belanja!');
            return;
        }
        post('/kasir/transactions');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaksi Baru" />
            <div className="flex h-full flex-col gap-4 p-6 w-full">
                <h1 className="text-xl font-semibold text-gray-800">Transaksi Baru</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Daftar Produk */}
                    <div className="md:col-span-2 space-y-4">
                        <Input
                            type="text"
                            placeholder="Cari produk..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white"
                        />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="bg-white p-4 rounded-xl border shadow-sm cursor-pointer hover:border-blue-500 transition"
                                >
                                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                                    <p className="text-xs text-gray-500">{product.category?.name || 'Kategori'}</p>
                                    <p className="text-blue-600 font-bold mt-2">Rp {Number(product.price).toLocaleString('id-ID')}</p>
                                    <p className="text-xs text-gray-400 mt-1">Stok: {product.stock} {product.satuan || 'pcs'}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Keranjang & Checkout */}
                    <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3 border-b pb-2">Keranjang</h3>
                            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                                {data.items.length === 0 ? (
                                    <p className="text-gray-400 text-sm text-center py-6">Belum ada item.</p>
                                ) : (
                                    data.items.map((item) => (
                                        <div key={item.product_id} className="flex justify-between items-center text-sm border-b pb-2">
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-xs text-gray-500">Rp {item.price.toLocaleString('id-ID')}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button type="button" onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="px-2 bg-gray-100 rounded">-</button>
                                                <span>{item.quantity}</span>
                                                <button type="button" onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="px-2 bg-gray-100 rounded">+</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <form onSubmit={submit} className="mt-4 space-y-3 border-t pt-3">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>Rp {data.subtotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span>Diskon (Rp)</span>
                                <Input type="number" className="w-28 h-8 text-right" value={data.discount} onChange={(e) => handleDiscountChange(Number(e.target.value))} />
                            </div>
                            <div className="flex justify-between font-bold text-base border-t pt-2">
                                <span>Total</span>
                                <span className="text-blue-600">Rp {data.total.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span>Uang Bayar (Rp)</span>
                                <Input type="number" className="w-28 h-8 text-right" value={data.paid_amount} onChange={(e) => handlePaidChange(Number(e.target.value))} />
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Kembalian</span>
                                <span>Rp {data.change_amount.toLocaleString('id-ID')}</span>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Metode Pembayaran</label>
                                <select className="w-full border rounded-md text-sm p-1.5 mt-1" value={data.payment_method} onChange={(e) => setData('payment_method', e.target.value)}>
                                    <option value="Cash">Cash</option>
                                    <option value="QRIS">QRIS</option>
                                    <option value="Transfer">Transfer</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Catatan</label>
                                <Input type="text" placeholder="Opsional" value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
                            </div>
                            <Button type="submit" className="w-full mt-2" disabled={processing || data.items.length === 0}>
                                Bayar Sekarang
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import InputError from '@/components/input-error';

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
    [key: string]: string | number; 
    
}

interface TransactionForm {
    items: CartItem[];
    subtotal: number;
    discount: string | number; 
    total: number;
    paid_amount: string | number; 
    change_amount: number; // KEMBALI KE change_amount
    payment_method: string;
    notes: string;
    [key: string]: string | number | CartItem[] | undefined;
}

export default function TransactionCreate({ products }: { products: Product[] }) {
    const [search, setSearch] = useState('');

    const { data, setData, post, processing, errors, transform } = useForm<TransactionForm>({
        items: [],
        subtotal: 0,
        discount: '', 
        total: 0,
        paid_amount: '', 
        change_amount: 0,
        payment_method: 'Cash',
        notes: '',
    });

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const calculateTotals = (currentItems: CartItem[], currentDiscount: number, currentPaid: number) => {
        const subtotal = currentItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const total = Math.max(0, subtotal - currentDiscount);
        const changeValue = Math.max(0, currentPaid - total);

        setData(prev => ({ ...prev, items: currentItems, subtotal, total, change_amount: changeValue }));
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
        calculateTotals(updatedItems, Number(data.discount) || 0, Number(data.paid_amount) || 0);
    };

    const updateQuantity = (product_id: number, qty: number) => {
        if (qty <= 0) {
            removeFromCart(product_id);
            return;
        }
        const updatedItems = data.items.map((i) =>
            i.product_id === product_id ? { ...i, quantity: qty } : i
        );
        calculateTotals(updatedItems, Number(data.discount) || 0, Number(data.paid_amount) || 0);
    };

    const removeFromCart = (product_id: number) => {
        const updatedItems = data.items.filter((i) => i.product_id !== product_id);
        calculateTotals(updatedItems, Number(data.discount) || 0, Number(data.paid_amount) || 0);
    };

    const handleDiscountChange = (val: string) => {
        setData('discount', val);
        const numDiscount = Number(val) || 0;
        calculateTotals(data.items, numDiscount, Number(data.paid_amount) || 0);
    };

    const handlePaidChange = (val: string) => {
        setData('paid_amount', val);
        const numPaid = Number(val) || 0;
        calculateTotals(data.items, Number(data.discount) || 0, numPaid);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (data.items.length === 0) {
            alert('Keranjang masih kosong!');
            return;
        }
        if ((Number(data.paid_amount) || 0) < data.total) {
            alert('Uang bayar kurang dari total belanja!');
            return;
        }

        transform((payload) => ({
            ...payload,
            discount: Number(payload.discount) || 0,
            paid_amount: Number(payload.paid_amount) || 0,
            payment_method: String(payload.payment_method).toLowerCase(),
        }));

        post('/kasir/transactions');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaksi Baru" />
            <div className="flex h-full flex-col gap-4 p-6 w-full">
                <h1 className="text-xl font-semibold text-gray-800">Transaksi Baru</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                    <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3 border-b pb-2">Keranjang</h3>
                            <InputError message={errors.items} className="mb-2" />
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
                                <div>
                                    <Input 
                                        type="number" 
                                        className="w-28 h-8 text-right" 
                                        placeholder="0"
                                        value={data.discount} 
                                        onChange={(e) => handleDiscountChange(e.target.value)} 
                                    />
                                    <InputError message={errors.discount} className="mt-1 text-right" />
                                </div>
                            </div>

                            <div className="flex justify-between font-bold text-base border-t pt-2">
                                <span>Total</span>
                                <span className="text-blue-600">Rp {data.total.toLocaleString('id-ID')}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span>Uang Bayar (Rp)</span>
                                <div>
                                    <Input 
                                        type="number" 
                                        className="w-28 h-8 text-right" 
                                        placeholder="0"
                                        value={data.paid_amount} 
                                        onChange={(e) => handlePaidChange(e.target.value)} 
                                    />
                                </div>
                            </div>
                            <InputError message={errors.paid_amount} className="text-right" />
                            
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Kembalian</span>
                                <span>Rp {data.change_amount.toLocaleString('id-ID')}</span> 
                            </div>
                            
                            <div>
                                <label className="text-xs text-gray-500">Metode Pembayaran</label>
                                <select className="w-full border rounded-md text-sm p-1.5 mt-1" value={data.payment_method} onChange={(e) => setData('payment_method', e.target.value)}>
                                    <option value="cash">Cash</option>
                                    <option value="qris">QRIS</option>
                                    <option value="transfer">Transfer</option>
                                </select>
                                <InputError message={errors.payment_method} className="mt-1" />
                            </div>
                            
                            <div>
                                <label className="text-xs text-gray-500">Catatan</label>
                                <Input type="text" placeholder="Opsional" value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
                                <InputError message={errors.notes} className="mt-1" />
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
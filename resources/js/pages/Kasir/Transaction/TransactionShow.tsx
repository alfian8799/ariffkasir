import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Transaksi', href: '/kasir/transactions' },
    { title: 'Detail', href: '#' },
];

interface TransactionDetailItem {
    id: number;
    product_name: string;
    quantity: number;
    price: number | string;
    subtotal: number | string;
}

interface TransactionData {
    invoice_number: string;
    user?: { name: string };
    created_at: string;
    status: string;
    payment_method: string;
    items?: TransactionDetailItem[];
    subtotal: number | string;
    discount: number | string;
    total: number | string;
    paid_amount: number | string;
    change_amount: number | string;
    notes?: string;
}

export default function TransactionShow({ transaction }: { transaction: TransactionData }) {
    const statusLabel = transaction.status === 'completed' ? 'Selesai' : transaction.status === 'cancelled' ? 'Dibatalkan' : transaction.status;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail ${transaction.invoice_number}`} />
            <div className="flex h-full flex-col gap-6 p-6 md:p-8 w-full max-w-4xl">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-gray-800">Detail Nota: {transaction.invoice_number}</h1>
                    <Button variant="outline" asChild>
                        <Link href="/kasir/transactions">Kembali</Link>
                    </Button>
                </div>

                <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
                    <div className="flex justify-between text-sm text-gray-600 border-b pb-4">
                        <div>
                            <p><strong>Kasir:</strong> {transaction.user?.name || 'Kasir'}</p>
                            <p><strong>Tanggal:</strong> {new Date(transaction.created_at).toLocaleString('id-ID')}</p>
                        </div>
                        <div className="text-right">
                            <p><strong>Status:</strong> <span className={transaction.status === 'completed' ? 'text-green-600' : 'text-red-600'}>{statusLabel}</span></p>
                            <p><strong>Metode:</strong> {transaction.payment_method}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Item Pembelian</h3>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-gray-500 text-left">
                                    <th className="py-2">Produk</th>
                                    <th className="py-2 text-center">Qty</th>
                                    <th className="py-2 text-right">Harga</th>
                                    <th className="py-2 text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {transaction.items?.map((item) => (
                                    <tr key={item.id}>
                                        <td className="py-2">{item.product_name}</td>
                                        <td className="py-2 text-center">{item.quantity}</td>
                                        <td className="py-2 text-right">Rp {Number(item.price).toLocaleString('id-ID')}</td>
                                        <td className="py-2 text-right">Rp {Number(item.subtotal).toLocaleString('id-ID')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t pt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>Rp {Number(transaction.subtotal).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Diskon</span>
                            <span>Rp {Number(transaction.discount).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base border-t pt-2">
                            <span>Total</span>
                            <span className="text-blue-600">Rp {Number(transaction.total).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Uang Bayar</span>
                            <span>Rp {Number(transaction.paid_amount).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Kembalian</span>
                            <span>Rp {Number(transaction.change_amount).toLocaleString('id-ID')}</span>
                        </div>
                        {transaction.notes && (
                            <p className="text-xs text-gray-500 pt-2 border-t"><strong>Catatan:</strong> {transaction.notes}</p>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
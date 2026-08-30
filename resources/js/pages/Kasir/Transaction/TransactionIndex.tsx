import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Transaksi', href: '/kasir/transactions' },
];

interface TransactionItemData {
    id: number;
    invoice_number: string;
    user?: { name: string };
    total: number;
    payment_method: string;
    status: string;
    created_at: string;
}

export default function TransactionIndex({ transactions }: { transactions: TransactionItemData[] }) {
    const handleCancel = (id: number) => {
        if (confirm('Apakah Anda yakin ingin membatalkan transaksi ini?')) {
            router.delete(`/kasir/transactions/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Transaksi" />
            <div className="flex h-full flex-col gap-4 rounded-xl p-6 w-full">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold leading-tight text-gray-800">Daftar Transaksi</h1>
                    <Button asChild>
                        <Link href="/kasir/transactions/create">+ Transaksi Baru</Link>
                    </Button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden border">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b bg-gray-50 text-gray-600 text-sm">
                                <th className="p-3">No. Nota</th>
                                <th className="p-3">Kasir</th>
                                <th className="p-3">Total</th>
                                <th className="p-3">Pembayaran</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Tanggal</th>
                                <th className="p-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y">
                            {transactions.length > 0 ? (
                                transactions.map((trx) => (
                                    <tr key={trx.id} className="hover:bg-gray-50">
                                        <td className="p-3 font-medium text-blue-600">{trx.invoice_number}</td>
                                        <td className="p-3">{trx.user?.name || 'Kasir'}</td>
                                        <td className="p-3">Rp {Number(trx.total).toLocaleString('id-ID')}</td>
                                        <td className="p-3">{trx.payment_method}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${trx.status === 'Selesai' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                                {trx.status}
                                            </span>
                                        </td>
                                        <td className="p-3">{new Date(trx.created_at).toLocaleDateString('id-ID')}</td>
                                        <td className="p-3 text-center space-x-2">
                                            <Link href={`/kasir/transactions/${trx.id}`} className="text-blue-600 hover:underline">Detail</Link>
                                            {trx.status !== 'Dibatalkan' && (
                                                <button onClick={() => handleCancel(trx.id)} className="text-red-600 hover:underline">Batalkan</button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-6 text-center text-gray-400">Belum ada transaksi.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
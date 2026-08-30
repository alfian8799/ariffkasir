import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Laporan Keuangan', href: '/kasir/reports' },
];

interface Transaction {
    id: number;
    invoice_number: string;
    total: number;
    payment_method: string;
    created_at: string;
    user?: { name: string };
}

interface Props {
    transactions: Transaction[];
    totalOmzet: number;
    totalTransactions: number;
    paymentMethods: Record<string, number>;
    filters: { start_date: string; end_date: string };
}

export default function ReportIndex({ transactions, totalOmzet, totalTransactions, paymentMethods, filters }: Props) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/kasir/reports', { start_date: startDate, end_date: endDate }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Penjualan" />
            <div className="flex h-full flex-col gap-6 p-6 w-full">
                <h1 className="text-xl font-semibold text-gray-800">Laporan Penjualan & Keuangan</h1>

                {/* Filter Tanggal */}
                <form onSubmit={handleFilter} className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Dari Tanggal</label>
                        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Sampai Tanggal</label>
                        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <Button type="submit">Filter Laporan</Button>
                </form>

                {/* Kartu Ringkasan */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border shadow-sm">
                        <p className="text-xs text-gray-500">Total Omzet</p>
                        <h3 className="text-2xl font-bold text-blue-600 mt-1">Rp {Number(totalOmzet).toLocaleString('id-ID')}</h3>
                    </div>
                    <div className="bg-white p-4 rounded-xl border shadow-sm">
                        <p className="text-xs text-gray-500">Total Transaksi</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{totalTransactions} Transaksi</h3>
                    </div>
                    <div className="bg-white p-4 rounded-xl border shadow-sm">
                        <p className="text-xs text-gray-500">Metode Terfavorit</p>
                        <div className="text-sm font-medium mt-1">
                            {Object.entries(paymentMethods).map(([method, count]) => (
                                <span key={method} className="inline-block bg-gray-100 rounded px-2 py-1 mr-2 text-xs">
                                    {method}: {count}x
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabel Rincian Transaksi */}
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="p-4 border-b font-semibold text-gray-800">Riwayat Transaksi Periode Ini</div>
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b bg-gray-50 text-gray-500">
                                <th className="p-3">No. Invoice</th>
                                <th className="p-3">Tanggal</th>
                                <th className="p-3">Metode</th>
                                <th className="p-3 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center text-gray-400 py-6">Tidak ada data transaksi pada rentang tanggal ini.</td>
                                </tr>
                            ) : (
                                transactions.map((trx) => (
                                    <tr key={trx.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium">{trx.invoice_number}</td>
                                        <td className="p-3 text-gray-500">{new Date(trx.created_at).toLocaleString('id-ID')}</td>
                                        <td className="p-3 uppercase">{trx.payment_method}</td>
                                        <td className="p-3 text-right font-bold text-blue-600">Rp {Number(trx.total).toLocaleString('id-ID')}</td>
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
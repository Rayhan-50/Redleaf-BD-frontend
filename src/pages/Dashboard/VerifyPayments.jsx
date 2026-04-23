import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, CheckCircle, Clock, Search, CreditCard, Banknote, HelpCircle, FileWarning } from 'lucide-react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';

const PAYMENT_METHODS = {
    card: { label: 'Stripe (Card)', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
    bkash_manual: { label: 'bKash (Manual)', icon: Banknote, color: 'text-pink-600', bg: 'bg-pink-50' },
    nagad_manual: { label: 'Nagad (Manual)', icon: Banknote, color: 'text-orange-600', bg: 'bg-orange-50' },
    cod: { label: 'Cash on Delivery', icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
    unknown: { label: 'Unknown', icon: HelpCircle, color: 'text-gray-500', bg: 'bg-gray-50' }
};

const STATUS_CONFIG = {
    paid: { label: 'Paid', icon: CheckCircle, cls: 'bg-green-50 text-green-700 border-green-200' },
    under_review: { label: 'Under Review', icon: Clock, cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    pending: { label: 'Pending', icon: Clock, cls: 'bg-gray-50 text-gray-500 border-gray-200' },
    rejected: { label: 'Rejected', icon: FileWarning, cls: 'bg-red-50 text-red-700 border-red-200' },
};

const VerifyPayments = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [filterMethod, setFilterMethod] = useState('all');

    const { data: payments = [], isLoading } = useQuery({
        queryKey: ['admin-payments'],
        queryFn: async () => {
            const res = await axiosSecure.get('/payments');
            return res.data;
        }
    });

    const handleVerify = (id) => {
        Swal.fire({
            title: "Verify Payment?",
            text: "This will mark the payment as PAID and the order as PROCESSING.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#16a34a",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, Verify Payment",
            background: "#fff",
            customClass: { popup: "rounded-3xl p-6" }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.patch(`/payments/${id}/verify`);
                    Swal.fire({
                        title: "Verified!",
                        text: "Payment has been approved.",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                        background: "#fff",
                        customClass: { popup: "rounded-3xl" }
                    });
                    queryClient.invalidateQueries(['admin-payments']);
                    queryClient.invalidateQueries(['admin-orders']);
                } catch (error) {
                    Swal.fire({ icon: "error", title: "Failed to verify", confirmButtonColor: '#dc2626' });
                }
            }
        });
    };

    const handleReject = (id) => {
        Swal.fire({
            title: "Reject Payment?",
            text: "This will mark the payment as REJECTED and CANCEL the order.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, Reject Payment",
            background: "#fff",
            customClass: { popup: "rounded-3xl p-6" }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.patch(`/payments/${id}/reject`);
                    Swal.fire({
                        title: "Rejected!",
                        text: "Payment has been rejected.",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                        background: "#fff",
                        customClass: { popup: "rounded-3xl" }
                    });
                    queryClient.invalidateQueries(['admin-payments']);
                    queryClient.invalidateQueries(['admin-orders']);
                } catch (error) {
                    Swal.fire({ icon: "error", title: "Failed to reject", confirmButtonColor: '#dc2626' });
                }
            }
        });
    };

    const filteredPayments = payments.filter(p => {
        const matchMethod = filterMethod === 'all' || p.paymentMethod === filterMethod;
        const searchStr = `${p.email} ${p.transactionId} ${p.senderNumber} ${p.orderId}`.toLowerCase();
        const matchSearch = searchStr.includes(search.toLowerCase());
        return matchMethod && matchSearch;
    });

    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="p-4 lg:p-7 space-y-6 font-['Poppins']">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0A3D2A] flex items-center justify-center shadow-lg shadow-green-100">
                    <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight uppercase">Verify Payments</h2>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Review Manual Transactions</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                    <input
                        type="text"
                        placeholder="Search by Email, TxID, or Sender No..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-12 pr-6 py-3.5 rounded-xl border border-gray-100 text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-green-50 focus:border-[#0A3D2A]"
                    />
                </div>
                <select
                    value={filterMethod}
                    onChange={e => setFilterMethod(e.target.value)}
                    className="px-5 py-3.5 rounded-xl border border-gray-100 text-[9px] font-bold uppercase tracking-widest text-gray-500 bg-white focus:outline-none"
                >
                    <option value="all">All Methods</option>
                    <option value="bkash_manual">bKash (Manual)</option>
                    <option value="nagad_manual">Nagad (Manual)</option>
                    <option value="cod">Cash on Delivery</option>
                    <option value="card">Stripe (Card)</option>
                </select>
            </div>

            {/* Data Table */}
            {isLoading ? (
                <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-3 border-green-50 border-t-[#0A3D2A] rounded-full animate-spin" /></div>
            ) : filteredPayments.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-100 py-20 text-center">
                    <FileWarning className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">No Payments Found</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-50 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full">
                            <thead className="bg-gray-50/70">
                                <tr>
                                    {['Method', 'Transaction Info', 'Customer', 'Amount', 'Date', 'Status', 'Action'].map(h => (
                                        <th key={h} className="px-5 py-3.5 text-left text-[8px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                <AnimatePresence mode='popLayout'>
                                    {filteredPayments.map(payment => {
                                        const method = PAYMENT_METHODS[payment.paymentMethod] || PAYMENT_METHODS.unknown;
                                        const status = STATUS_CONFIG[payment.status || 'pending'];
                                        const MethodIcon = method.icon;
                                        const StatusIcon = status.icon;

                                        return (
                                            <motion.tr key={payment._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-gray-50/40">
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`p-1.5 rounded-lg ${method.bg}`}><MethodIcon size={14} className={method.color} /></div>
                                                        <span className="text-[10px] font-bold text-gray-700">{method.label}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    {payment.transactionId && (
                                                        <p className="font-mono text-[9px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md w-max mb-1">
                                                            TxID: {payment.transactionId}
                                                        </p>
                                                    )}
                                                    {payment.senderNumber && (
                                                        <p className="text-[9px] font-bold text-gray-500 tracking-wider mb-1">Sender: {payment.senderNumber}</p>
                                                    )}
                                                    {payment.screenshot && (
                                                        <a href={payment.screenshot} target="_blank" rel="noreferrer" className="text-[9px] font-bold text-blue-500 hover:underline">
                                                            View Screenshot
                                                        </a>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3 text-[11px] font-bold text-gray-900 truncate max-w-[150px]">
                                                    {payment.email}
                                                </td>
                                                <td className="px-5 py-3 font-bold text-gray-900 text-[11px]">
                                                    ৳{(payment.amount || 0).toLocaleString()}
                                                </td>
                                                <td className="px-5 py-3 text-[9px] font-bold text-gray-500 uppercase tracking-tight">
                                                    {new Date(payment.createdAt || payment.paidAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[7px] font-bold uppercase tracking-widest border shadow-xs ${status.cls}`}>
                                                        <StatusIcon size={8} /> {status.label}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3">
                                                    {payment.status === 'under_review' ? (
                                                        <div className="flex items-center gap-2">
                                                            <button 
                                                                onClick={() => handleVerify(payment._id)}
                                                                className="px-3 py-1.5 bg-green-50 hover:bg-green-600 hover:text-white text-green-700 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors shadow-sm"
                                                            >
                                                                Verify
                                                            </button>
                                                            <button 
                                                                onClick={() => handleReject(payment._id)}
                                                                className="px-3 py-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-700 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors shadow-sm"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[9px] text-gray-300 font-bold uppercase">No Action</span>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default VerifyPayments;

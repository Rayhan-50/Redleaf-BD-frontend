import { motion, AnimatePresence } from 'framer-motion';
import { Package, CheckCircle, Clock, XCircle, Truck, ChevronDown, Search, RefreshCw, DollarSign, Eye, X, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusConfig = {
  pending:    { label: 'Pending',      icon: Clock,       cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  processing: { label: 'Processing',   icon: RefreshCw,   cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  shipped:    { label: 'Shipped',      icon: Truck,       cls: 'bg-red-50 text-red-700 border-red-200' },
  delivered:  { label: 'Delivered',    icon: CheckCircle, cls: 'bg-green-50 text-green-700 border-green-200' },
  cancelled:  { label: 'Cancelled',    icon: XCircle,     cls: 'bg-gray-50 text-gray-500 border-gray-200' },
};

const ManagePayments = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch]       = useState('');
  const [filterStatus, setFilter] = useState('all');
  const [updating, setUpdating]   = useState(null);
  const [viewOrderInfo, setViewOrderInfo] = useState(null);

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await axiosSecure.get('/orders');
      return res.data || [];
    },
  });

  const filteredOrders = orders.filter(o => {
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchSearch = !search ||
      o.email?.toLowerCase().includes(search.toLowerCase()) ||
      o._id?.toLowerCase().includes(search.toLowerCase()) ||
      o.orderIdString?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((s, o) => s + (o.totalAmount || 0), 0);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await axiosSecure.patch(`/orders/${orderId}`, { status: newStatus });
      await refetch();
      Swal.fire({ 
        icon: 'success', 
        title: 'Status Updated', 
        showConfirmButton: false, 
        timer: 1400,
        background: '#fff',
        customClass: { popup: 'rounded-2xl shadow-xl border border-gray-50' }
      });
    } catch {
      Swal.fire({ icon: 'error', title: 'Action Failed', confirmButtonColor: '#dc2626' });
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    Swal.fire({
      title: 'Delete Order?',
      text: 'This action is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Exterminate',
      background: '#fff',
      customClass: { popup: 'rounded-3xl p-6' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/orders/${orderId}`);
          Swal.fire({
            title: 'Exterminated!',
            text: 'The order record has been erased.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
            background: '#fff',
            customClass: { popup: 'rounded-3xl' }
          });
          refetch();
        } catch (error) {
          Swal.fire({ icon: 'error', title: 'Deletion Failed', confirmButtonColor: '#dc2626' });
        }
      }
    });
  };

  const formatAddress = (addr) => {
    if (!addr) return 'N/A';
    return addr
      .replace(/\s?(Address \d+:|Street Name:|Building Number:|Street Address:|State:|City:|Post Code:|Mobile:|Email:|Phone:)/gi, '\n$1')
      .trim();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-4 lg:p-7 space-y-6 font-['Poppins',sans-serif]"
    >
      {/* High-Finesse Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-100">
             <Truck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight uppercase">Manage Orders</h2>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Total Orders: {orders.length}</p>
          </div>
        </div>
        <button 
          onClick={() => refetch()} 
          className="flex items-center gap-2 bg-white hover:bg-red-50 text-gray-900 px-5 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all border border-gray-100 shadow-sm"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} /> 
          Refresh Orders
        </button>
      </div>

      {/* High-Density Stats Hub */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: orders.length, icon: Package, color: 'from-gray-800 to-gray-900' },
          { label: 'Cumulative Revenue', value: `৳${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'from-red-600 to-red-700' },
          { label: 'Awaiting Action', value: orders.filter(o=>o.status==='pending').length, icon: Clock, color: 'from-amber-400 to-amber-500' },
          { label: 'Delivered', value: orders.filter(o=>o.status==='delivered').length, icon: CheckCircle, color: 'from-gray-900 to-black' },
        ].map((s, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white shadow-lg relative overflow-hidden`}
          >
            <div className="relative z-10">
               <p className="text-[8px] font-bold text-white/50 uppercase tracking-widest mb-0.5">{s.label}</p>
               <p className="text-xl font-bold tracking-tight">{s.value}</p>
            </div>
            <s.icon className="absolute right-[-8px] bottom-[-8px] h-14 w-14 text-white/5 rotate-12" />
          </div>
        ))}
      </div>

      {/* Command Strip */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative group flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
          <input
            type="text"
            placeholder="Filter Orders by ID, Email or Name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 rounded-xl border border-gray-100 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-4 focus:ring-red-50 focus:border-red-600 transition-all placeholder:text-gray-300"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilter(e.target.value)}
          className="px-5 py-3.5 rounded-xl border border-gray-100 text-[9px] font-bold uppercase tracking-widest text-gray-500 focus:outline-none focus:ring-4 focus:ring-red-50 bg-white"
        >
          <option value="all">Filter Status: All</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
        </select>
      </div>

      {/* Professional Data Manifest */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
           <div className="w-8 h-8 border-3 border-red-50 border-t-red-600 rounded-full animate-spin" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-100 py-20 text-center">
          <Package className="h-10 w-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">No Orders Found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-50 shadow-xl overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full">
              <thead className="bg-gray-50/70">
                <tr>
                  {['#', 'Order ID', 'Customer Info', 'Delivery Location', 'Total Amount', 'Date', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[8px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence mode='popLayout'>
                  {filteredOrders.map((order, idx) => {
                    const cfg = statusConfig[order.status] || statusConfig.pending;
                    return (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group hover:bg-gray-50/40 transition-all"
                      >
                        <td className="px-5 py-3 text-[9px] font-bold text-gray-300">{idx + 1}</td>
                        <td className="px-5 py-3">
                          <span className="font-mono text-[9px] font-bold text-red-600 bg-red-50/50 px-2 py-0.5 rounded-md border border-red-100/50 tracking-tight">
                            {order.orderIdString || order._id?.slice(-10).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <p className="font-bold text-gray-900 text-[11px] truncate max-w-[130px] leading-tight">{order.customerName || 'Agent ID Redacted'}</p>
                          <p className="text-[9px] text-gray-400 font-medium truncate max-w-[130px] mt-0.5 tracking-tighter">{order.email}</p>
                        </td>
                        <td className="px-5 py-3 hidden md:table-cell">
                          <p className="font-bold text-gray-900 text-[11px] truncate max-w-[100px] leading-tight flex items-center gap-1.5">{order.city || 'Regional'}</p>
                          <p className="text-[9px] text-gray-400 font-medium truncate max-w-[130px] mt-0.5 tracking-tighter">{order.address || order.deliveryAddress || 'Address Pending'}</p>
                        </td>
                        <td className="px-5 py-3">
                           <p className="font-bold text-gray-900 text-[11px] tracking-tighter">৳{(order.totalAmount || 0).toLocaleString()}</p>
                           <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{order.items?.length || 0} Assets</p>
                        </td>
                        <td className="px-5 py-3 text-gray-500 font-bold text-[9px] uppercase tracking-tight">
                          {new Date(order.orderedAt).toLocaleDateString('en-BD', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[7px] font-bold uppercase tracking-widest border shadow-xs ${cfg.cls}`}>
                             <cfg.icon size={8} />
                             {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="relative group/select w-32 border border-gray-100 rounded-lg overflow-hidden shrink-0">
                              <select
                                value={order.status}
                                onChange={e => handleStatusUpdate(order._id, e.target.value)}
                                disabled={updating === order._id}
                                className="w-full pl-2 pr-6 py-2 text-[8px] font-bold uppercase tracking-widest text-gray-500 focus:outline-none focus:border-red-600 appearance-none bg-white cursor-pointer transition-all border-none"
                              >
                                {STATUS_OPTIONS.map(s => (
                                  <option key={s} value={s}>{s.toUpperCase()}</option>
                                ))}
                              </select>
                              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                            </div>
                            <button
                              onClick={() => setViewOrderInfo(order)}
                              className="p-1.5 rounded-lg border border-gray-100 text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shrink-0"
                              title="View Order Intelligence"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              className="p-1.5 rounded-lg border border-gray-100 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shrink-0"
                              title="Exterminate Order"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50/30 border-t border-gray-50">
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest text-center">
               Showing {filteredOrders.length} out of {orders.length} total orders.
            </p>
          </div>
        </div>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {viewOrderInfo && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 lg:p-10"
            onClick={() => setViewOrderInfo(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-white rounded-[24px] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
                <div className="p-6 md:p-8 bg-white flex justify-between items-start border-b border-gray-100 shrink-0">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-1">Order Details</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Order ID: <span className="font-mono text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100/50">{viewOrderInfo.orderIdString || viewOrderInfo._id}</span>
                    </p>
                  </div>
                  <button onClick={() => setViewOrderInfo(null)} className="p-2.5 bg-gray-50 hover:bg-gray-100 hover:text-red-600 rounded-xl transition-all text-gray-500 border border-gray-100 shadow-sm">
                    <X size={18} strokeWidth={2.5} />
                  </button>
                </div>
                
                <div className="p-6 md:p-8 bg-gray-50/30 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto no-scrollbar relative shrink">
                  {/* Customer Details Card */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col">
                    <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-5 flex items-center gap-2 border-b border-gray-50 pb-3">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span> Customer Identity
                    </h4>
                    <div className="space-y-4 flex-1">
                      <div className="grid grid-cols-3 gap-2">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Name</p>
                        <p className="col-span-2 font-semibold text-gray-900 text-sm leading-tight">{viewOrderInfo.customerName || 'N/A'}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Email</p>
                        <p className="col-span-2 font-semibold text-gray-900 text-sm break-all leading-tight">{viewOrderInfo.email}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Phone</p>
                        <p className="col-span-2 font-semibold text-gray-900 text-sm leading-tight">
                          {viewOrderInfo.phone || 'N/A'} 
                          {viewOrderInfo.altPhone && <span className="text-gray-400 text-xs ml-1 font-medium">/ {viewOrderInfo.altPhone}</span>}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Information Card */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col">
                    <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-5 flex items-center gap-2 border-b border-gray-50 pb-3">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span> Delivery Logistics
                    </h4>
                    <div className="space-y-4 flex-1">
                      <div className="grid grid-cols-3 gap-2">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">City</p>
                        <p className="col-span-2 font-semibold text-gray-900 text-sm leading-tight">{viewOrderInfo.city || 'N/A'}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Address</p>
                        <p className="col-span-2 font-medium text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{formatAddress(viewOrderInfo.address || viewOrderInfo.deliveryAddress)}</p>
                      </div>
                      {viewOrderInfo.notes && (
                         <div className="grid grid-cols-3 gap-2 pt-3 mt-3 border-t border-dashed border-gray-100">
                           <p className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mt-0.5">Notes</p>
                           <p className="col-span-2 font-semibold text-amber-900 text-xs bg-amber-50 p-3 rounded-xl border border-amber-100/50 italic leading-relaxed">{viewOrderInfo.notes}</p>
                         </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 bg-white border-t border-gray-100 overflow-y-auto no-scrollbar shrink-0 min-h-[150px] max-h-[40vh]">
                  <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                     <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-[10px] shadow-inner">{viewOrderInfo.items?.length || 0}</span> Order Items
                  </h4>
                  <div className="space-y-4">
                    {viewOrderInfo.items?.map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0 last:pb-0 group">
                         <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2 shadow-sm group-hover:scale-105 transition-transform"><img src={item.image} className="w-full h-full object-contain mix-blend-multiply" /></div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 leading-tight mb-1">{item.title}</p>
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.unit || 'Standard'}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-base font-black text-gray-900 tracking-tight">৳{(item.price || 0).toLocaleString()}</p>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">QTY: {item.quantity || 1}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ManagePayments;

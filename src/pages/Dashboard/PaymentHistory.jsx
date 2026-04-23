import { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Package, CheckCircle, Clock, XCircle, Truck, CreditCard, Calendar, MapPin } from 'lucide-react';
import { AuthContext } from '../../Providers/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const statusConfig = {
  pending:    { label: 'Pending',    icon: Clock,        cls: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  processing: { label: 'Processing', icon: Package,      cls: 'bg-blue-100 text-blue-800 border-blue-200'   },
  shipped:    { label: 'Shipped',    icon: Truck,        cls: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  delivered:  { label: 'Delivered',  icon: CheckCircle,  cls: 'bg-green-100 text-green-800 border-green-200' },
  cancelled:  { label: 'Cancelled',  icon: XCircle,      cls: 'bg-red-100 text-red-800 border-red-200'     },
};

const PaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['my-orders', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders?email=${user.email}`);
      return res.data || [];
    },
  });

  const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full" />
    </div>
  );

  const handlePay = (order) => {
    navigate(`/dashboard/payment/${order._id}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center border border-red-100 shadow-sm">
          <CreditCard className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Procurement Archive</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Audit trail of all past transactions and fulfillment cycles</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Total Orders</p>
          <p className="text-2xl font-extrabold text-gray-900">{orders.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Total Spent</p>
          <p className="text-2xl font-extrabold text-red-600">৳{totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 col-span-2 sm:col-span-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Fulfillment Rate</p>
          <p className="text-2xl font-black text-gray-900">
            {Math.round((orders.filter(o => o.status === 'delivered').length / (orders.length || 1)) * 100)}%
          </p>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-20 text-center">
          <ShoppingBag className="h-20 w-20 text-gray-100 mx-auto mb-6" />
          <p className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Archive Empty</p>
          <p className="text-gray-500 text-sm mb-8 font-medium">No procurement logs detected in the system archive.</p>
          <a href="/" className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-3.5 rounded-2xl text-xs uppercase font-black tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200">
            Initialize First Order
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {orders.map((order, idx) => {
              const cfg = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = cfg.icon;
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-[24px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm flex-shrink-0">
                        <ShoppingBag className="h-7 w-7 text-gray-400" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className="font-black text-gray-900 font-mono text-lg tracking-tight">
                            #{order._id?.slice(-8).toUpperCase()}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] uppercase font-black tracking-widest border ${cfg.cls}`}>
                            <StatusIcon className="h-3.5 w-3.5" />{cfg.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(order.orderedAt).toLocaleDateString('en-BD', { year:'numeric', month:'short', day:'numeric' })}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {order.items?.map((item, i) => (
                            <span key={i} className="bg-gray-50 text-gray-600 border border-gray-100 px-3 py-1.5 rounded-xl text-xs font-semibold">
                              {item.title} <span className="text-gray-400 ml-1">×{item.quantity||1}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end justify-center">
                      <p className="text-2xl font-black text-gray-900 tracking-tight">৳{(order.totalAmount || 0).toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total Obligation</p>
                      {order.status === 'pending' && (
                        <button 
                          onClick={() => handlePay(order)} 
                          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-8 py-2.5 rounded-xl text-xs uppercase font-black tracking-widest transition-all shadow-lg shadow-red-100"
                        >
                          Fulfill Payment
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Delivery Info */}
                  {order.deliveryAddress && (
                    <div className="mt-6 pt-5 border-t border-gray-50 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                       <MapPin className="h-4 w-4 text-gray-300" /> {order.deliveryAddress}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default PaymentHistory;

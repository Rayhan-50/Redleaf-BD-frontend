import { motion } from 'framer-motion';
import { Users, Package, ShoppingBag, DollarSign, TrendingUp, Clock, CheckCircle, Truck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const statusConfig = {
  pending:    { label: 'Pending',    cls: 'bg-yellow-50 text-yellow-700 border-yellow-100' },
  processing: { label: 'Processing', cls: 'bg-blue-50 text-blue-700 border-blue-100'     },
  shipped:    { label: 'Shipped',    cls: 'bg-purple-50 text-purple-700 border-purple-100' },
  delivered:  { label: 'Delivered',  cls: 'bg-green-50 text-green-700 border-green-100'   },
  cancelled:  { label: 'Cancelled',  cls: 'bg-red-50 text-red-700 border-red-100'        },
};

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/stats');
      return res.data;
    },
    refetchInterval: 60000,
  });

  const statCards = [
    { label: 'Total Revenue',  value: stats ? `৳${(stats.totalRevenue||0).toLocaleString()}` : '—',  icon: DollarSign, color: 'from-red-600 to-red-700', shadow: 'shadow-red-200' },
    { label: 'Total Orders',   value: stats?.totalOrders  ?? '—',                                      icon: ShoppingBag, color: 'from-yellow-400 to-yellow-500', shadow: 'shadow-yellow-100' },
    { label: 'Registered Users',value: stats?.totalUsers  ?? '—',                                      icon: Users,       color: 'from-gray-800 to-gray-900',  shadow: 'shadow-gray-200' },
    { label: 'Products Listed', value: stats?.totalProducts?? '—',                                      icon: Package,     color: 'from-red-500 to-red-600', shadow: 'shadow-red-200' },
  ];

  const maxBar = stats?.weeklyData ? Math.max(...stats.weeklyData.map(d => d.revenue), 1) : 1;

  if (isLoading) return (
    <div className="flex items-center justify-center h-[400px]">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-red-100 rounded-full" />
        <div className="absolute inset-0 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-6 lg:p-10 space-y-10 font-['Poppins',sans-serif]"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Market Overview</h2>
          <p className="text-gray-400 text-sm font-medium mt-1">
            {new Date().toLocaleDateString('en-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Updates</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`relative overflow-hidden bg-gradient-to-br ${card.color} rounded-[32px] p-6 text-white shadow-2xl ${card.shadow} group overflow-hidden`}
          >
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <div className="px-2 py-1 bg-white/20 rounded-lg backdrop-blur-md">
                  <TrendingUp className="h-3 w-3 text-white" />
                </div>
              </div>
              <p className="text-3xl font-black text-white mb-1 tracking-tighter">{card.value}</p>
              <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Pending Orders', count: stats?.pendingOrders, icon: Clock, bg: 'bg-yellow-50', text: 'text-yellow-600' },
          { label: 'Succesful Deliveries', count: stats?.deliveredOrders, icon: CheckCircle, bg: 'bg-green-50', text: 'text-green-600' },
          { label: 'Overall Efficiency', count: stats?.totalOrders ? `${Math.round(((stats.deliveredOrders||0)/stats.totalOrders)*100)}%` : '—', icon: Truck, bg: 'bg-red-50', text: 'text-red-600' }
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-[24px] border border-gray-100 p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
              <item.icon className={`h-7 w-7 ${item.text}`} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-2xl font-black text-gray-900 tracking-tight">{item.count ?? 0}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Table Section */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Weekly Revenue Chart */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 xl:col-span-3">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Revenue Stream</h3>
              <p className="text-xs text-gray-400 font-bold mt-1">Weekly performance analytics</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-2 text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-red-600"/>Revenue</span>
              <span className="flex items-center gap-2 text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400"/>Orders</span>
            </div>
          </div>

          {stats?.weeklyData ? (
            <div className="flex items-end gap-3 h-56 pt-4">
              {stats.weeklyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="w-full flex flex-col-reverse gap-1.5 relative" style={{ height: '180px' }}>
                    {/* Orders bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(4, (d.orders / Math.max(...stats.weeklyData.map(x=>x.orders), 1)) * 40)}%` }}
                      transition={{ delay: i * 0.1, duration: 0.8 }}
                      className="w-full rounded-full bg-yellow-400/30 group-hover:bg-yellow-400/50 transition-colors"
                    />
                    {/* Revenue bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(4, (d.revenue / maxBar) * 100)}%` }}
                      transition={{ delay: i * 0.1, duration: 0.8 }}
                      className="w-full rounded-full bg-red-600 group-hover:bg-red-700 transition-colors"
                    />
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      ৳{d.revenue}
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{d.day}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center text-gray-300 text-sm font-bold">No data trends found</div>
          )}
        </div>

        {/* Recent Orders List */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm xl:col-span-2 flex flex-col overflow-hidden">
          <div className="p-8 border-b border-gray-50">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Recent Sales</h3>
            <p className="text-xs text-gray-400 font-bold mt-1">Live order feed</p>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-gray-50">
            {stats?.recentOrders?.length ? stats.recentOrders.map((order) => {
              const cfg = statusConfig[order.status] || statusConfig.pending;
              return (
                <div key={order._id} className="px-8 py-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-red-600 mb-0.5 tracking-widest">#{order._id?.slice(-6).toUpperCase()}</p>
                    <p className="text-sm font-bold text-gray-800 truncate leading-tight mb-0.5">{order.email?.split('@')[0]}</p>
                    <p className="text-[10px] font-bold text-gray-400">
                      {new Date(order.orderedAt).toLocaleString('en-BD', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${cfg.cls}`}>{cfg.label}</span>
                    <span className="text-sm font-black text-gray-900 tracking-tight">৳{(order.totalAmount||0).toLocaleString()}</span>
                  </div>
                </div>
              );
            }) : (
              <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm font-bold">No fresh sales</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;

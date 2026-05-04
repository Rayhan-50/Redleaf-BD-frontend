import { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Package, CheckCircle, Clock, XCircle, Truck, Trash2, Calendar, MapPin, Sparkles, ChevronRight } from 'lucide-react';
import { AuthContext } from '../../Providers/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useCart from '../../hooks/useCart';
import useDeliverySettings from '../../hooks/useDeliverySettings';
import useDeliveryPreview from '../../hooks/useDeliveryPreview';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ZONE_NAMES } from '../../utils/deliveryDefaults';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const statusConfig = {
  pending:    { label: 'Pending',    icon: Clock,       cls: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  processing: { label: 'Processing', icon: Package,     cls: 'bg-blue-100 text-blue-800 border-blue-200'    },
  shipped:    { label: 'Shipped',    icon: Truck,       cls: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  delivered:  { label: 'Delivered',  icon: CheckCircle, cls: 'bg-green-100 text-green-800 border-green-200'  },
  cancelled:  { label: 'Cancelled',  icon: XCircle,     cls: 'bg-red-100 text-red-800 border-red-200'       },
};

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [cart, refetchCart] = useCart();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState(location.state?.tab || 'orders');

  useEffect(() => {
    if (location.state?.tab) setTab(location.state.tab);
  }, [location.state?.tab]);

  const [isCheckingOut, setIsCheckingOut]     = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [deliverySettings] = useDeliverySettings();
  // Get zone names from live settings (fallback to defaults)
  const zoneNames = deliverySettings?.zones ? Object.keys(deliverySettings.zones) : ZONE_NAMES;
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    phone: '', altPhone: '', address: '', city: '', notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ── Live server-computed delivery preview ───────────────────────────────
  const preview = useDeliveryPreview({
    cartItems: cart,
    deliveryLocation,
    city:    formData.city,
    address: formData.address,
    enabled: cart.length > 0,
  });

  // Use preview charge when a location is selected; else show 0 as placeholder
  const deliveryCharge    = deliveryLocation ? (preview.charge ?? 0) : 0;
  const cartTotal         = cart.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
  const totalWithDelivery = cartTotal + deliveryCharge;

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['my-orders', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders?email=${user.email}`);
      return res.data || [];
    },
  });

  const totalSpent = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);

  const handleRemoveFromCart = (id) => {
    Swal.fire({
      title: 'Remove item?', icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#dc2626', cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, remove',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axiosSecure.delete(`/carts/${id}`);
        refetchCart();
      }
    });
  };

  const executeCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    const orderData = {
      email: user?.email,
      customerName: formData.fullName,
      phone: formData.phone, altPhone: formData.altPhone,
      deliveryAddress: formData.address + (formData.city ? `, ${formData.city}` : ''),
      address: formData.address, city: formData.city, notes: formData.notes,
      items: cart, deliveryLocation,
    };
    try {
      const res = await axiosSecure.post('/orders', orderData);
      if (res.data.insertedId) {
        Swal.fire({ icon: 'success', title: 'Order Confirmed!', text: 'Your order has been successfully placed.', confirmButtonColor: '#dc2626' });
        await refetchCart();
        await queryClient.invalidateQueries({ queryKey: ['my-orders', user?.email] });
        setShowCheckoutForm(false);
        setTab('orders');
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Checkout Failed', text: `Request failed: ${error.message}` });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center border border-red-100 shadow-sm">
          <ShoppingBag className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">My Orders</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Track your recent orders and their delivery status</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Orders', value: orders.length, color: 'text-gray-900' },
          { label: 'Total Spent',  value: `৳${totalSpent.toLocaleString()}`, color: 'text-red-600' },
          { label: 'Cart Items',   value: cart.length, color: 'text-gray-900' },
          { label: 'Cart Total',   value: `৳${cartTotal.toLocaleString()}`, color: 'text-gray-900' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{s.label}</p>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-gray-50 border border-gray-100 rounded-2xl w-full sm:w-fit mb-8 shadow-inner overflow-hidden">
        {[{key:'orders',label:`Purchase History (${orders.length})`},{key:'cart',label:`Active Cart (${cart.length})`}].map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab===t.key?'bg-white text-red-600 shadow-md border border-gray-100':'text-gray-400 hover:text-gray-600'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── ORDERS TAB ──────────────────────────────────────────────────────── */}
      {tab === 'orders' && (
        <div>
          {ordersLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
              <ShoppingBag className="h-20 w-20 text-gray-100 mx-auto mb-6" />
              <p className="text-2xl font-black text-gray-900 mb-2 tracking-tight">No Orders Yet</p>
              <p className="text-gray-500 text-sm mb-8 font-medium">You haven't placed any orders yet.</p>
              <Link to="/" className="inline-flex items-center justify-center bg-gray-900 px-8 py-3.5 rounded-2xl transition-all shadow-xl shadow-gray-200 hover:bg-black group">
                <span className="text-white text-xs uppercase font-black tracking-widest">Browse Products</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {orders.map((order, idx) => {
                  const cfg = statusConfig[order.status] || statusConfig.pending;
                  const SIcon = cfg.icon;
                  return (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 hover:shadow-xl hover:shadow-gray-100 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <span className="font-black text-gray-900 font-mono text-lg tracking-tight">
                              {order.orderIdString || `#${order._id?.slice(-8).toUpperCase()}`}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] uppercase font-black tracking-widest border ${cfg.cls}`}>
                              <SIcon className="h-3.5 w-3.5" />{cfg.label}
                            </span>
                            {order.deliveryIsFree && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] uppercase font-black tracking-widest border bg-emerald-50 text-emerald-700 border-emerald-100">
                                <Sparkles className="h-3 w-3" /> Free Delivery
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(order.orderedAt).toLocaleDateString('en-BD', { year:'numeric', month:'short', day:'numeric' })}</span>
                            {order.deliveryAddress && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {order.deliveryAddress}</span>}
                          </div>
                          {order.items?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {order.items.map((i, idx2) => (
                                <span key={idx2} className="bg-gray-50 text-gray-600 border border-gray-100 px-3 py-1.5 rounded-xl text-xs font-semibold">
                                  {i.title} <span className="text-gray-400 ml-1">×{i.quantity||1}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-right shrink-0 flex flex-col items-end justify-center">
                          <p className="text-2xl font-black text-gray-900 tracking-tight">৳{(order.totalAmount||0).toLocaleString()}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{order.items?.length||0} items</p>
                          {order.deliveryCharge === 0 && (
                            <p className="text-[10px] font-black text-emerald-600 mt-0.5">✓ Free delivery applied</p>
                          )}
                          {order.status === 'pending' && (
                            <button onClick={() => navigate(`/dashboard/payment/${order._id}`)}
                              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-8 py-2.5 rounded-xl text-xs uppercase font-black tracking-widest transition-all shadow-lg shadow-red-100">
                              Pay Now
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* ── CART TAB ──────────────────────────────────────────────────────── */}
      {tab === 'cart' && (
        <div>
          {cart.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
              <ShoppingBag className="h-20 w-20 text-gray-100 mx-auto mb-6" />
              <p className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Your Cart is Empty</p>
              <p className="text-gray-500 text-sm font-medium mb-8">You haven't added any products yet.</p>
              <Link to="/" className="inline-flex items-center justify-center bg-gray-900 px-8 py-3.5 rounded-2xl transition-all shadow-xl shadow-gray-200 hover:bg-black">
                <span className="text-white text-xs uppercase font-black tracking-widest">Browse Products</span>
              </Link>
            </div>
          ) : showCheckoutForm ? (
            /* ── Checkout Form ──────────────────────────────────────────── */
            <motion.div initial={{opacity:0,scale:0.98}} animate={{opacity:1,scale:1}} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Checkout</h3>
                  <button onClick={() => setShowCheckoutForm(false)} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-widest">← Back to Cart</button>
                </div>

                <form onSubmit={executeCheckout} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
                      <input required name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-50 transition-all font-semibold text-sm" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Phone Number</label>
                      <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-50 transition-all font-semibold text-sm" placeholder="+880..." />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Alternative Phone (Optional)</label>
                      <input name="altPhone" value={formData.altPhone} onChange={handleInputChange} type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-50 transition-all font-semibold text-sm" placeholder="+880..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Delivery Location *</label>
                      <select required value={deliveryLocation} onChange={e => setDeliveryLocation(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-50 transition-all font-semibold text-sm bg-white">
                        <option value="" disabled>Select Delivery Location</option>
                        {zoneNames.map(zone => (
                          <option key={zone} value={zone}>{zone}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">City / Zone</label>
                    <input required name="city" value={formData.city} onChange={handleInputChange} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-50 transition-all font-semibold text-sm" placeholder="Dhaka" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Complete Delivery Address</label>
                    <textarea required name="address" value={formData.address} onChange={handleInputChange} rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-50 transition-all font-semibold text-sm resize-none" placeholder="123 Main St, Apt 4B..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Order Notes (Optional)</label>
                    <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-50 transition-all font-semibold text-sm resize-none" placeholder="Special delivery instructions..." />
                  </div>

                  {/* ── Free Delivery Banner ──────────────────────────────── */}
                  <AnimatePresence>
                    {deliveryLocation && preview.isFree && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        className="flex items-center gap-3 bg-emerald-500 text-white rounded-2xl px-5 py-4 shadow-lg shadow-emerald-200"
                      >
                        <Sparkles className="h-5 w-5 flex-shrink-0 animate-pulse" />
                        <div>
                          <p className="font-black text-sm">🎉 Free Delivery Unlocked!</p>
                          <p className="text-[11px] font-semibold text-emerald-100 mt-0.5">
                            {preview.reason === 'product_free_delivery'
                              ? `You've hit the spend threshold on ${preview.freeRuleProduct || 'a product'}.`
                              : 'Free delivery applied for your order.'}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── "Spend X more" Hints ─────────────────────────────── */}
                  <AnimatePresence>
                    {deliveryLocation && !preview.isFree && preview.hints.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2"
                      >
                        {preview.hints.map(h => (
                          <div key={h.productId} className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
                            <ChevronRight className="h-4 w-4 text-amber-500 flex-shrink-0" />
                            <p className="text-xs font-bold text-amber-800">
                              Spend <span className="font-black text-amber-900">৳{h.amountNeeded.toLocaleString()}</span> more on <span className="font-black">{h.productTitle}</span> to get free delivery
                              <span className="text-amber-500 font-semibold ml-1">(৳{h.currentSpend.toLocaleString()} / ৳{h.minAmount.toLocaleString()})</span>
                            </p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Order Summary ─────────────────────────────────────── */}
                  <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1 text-center sm:text-left">
                      <p className="text-sm font-bold text-gray-500">Subtotal: ৳{cartTotal.toLocaleString()}</p>
                      <p className="text-sm font-bold text-gray-500">
                        Delivery: {deliveryLocation
                          ? (preview.isLoading
                              ? <span className="text-gray-400">Calculating…</span>
                              : preview.isFree
                                ? <span className="text-emerald-600 font-black">FREE ✓</span>
                                : <span>৳{deliveryCharge.toLocaleString()} <span className="text-gray-400 font-medium text-xs">(based on location &amp; order amount)</span></span>)
                          : <span className="text-gray-400">Select location</span>}
                      </p>
                      <p className="font-black text-gray-900 text-xl tracking-tight">
                        Total: <span className="text-red-600">৳{totalWithDelivery.toLocaleString()}</span>
                      </p>
                    </div>
                    <button type="submit" disabled={isCheckingOut || !deliveryLocation}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-2xl text-xs uppercase font-black tracking-widest transition-all shadow-xl shadow-red-200 disabled:opacity-50">
                      {isCheckingOut
                        ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                        : 'Confirm Order'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>

          ) : (
            /* ── Cart Items List ─────────────────────────────────────────── */
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-50">
                {cart.map((item, idx) => (
                  <motion.div key={item._id} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,x:-20}} transition={{delay:idx*0.04}}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50/50">
                    <img src={item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=80'}
                      alt={item.title} className="w-14 h-14 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{item.title}</p>
                      <p className="text-xs text-gray-400">{item.unit} · Qty: {item.quantity || 1}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-red-600">৳{((item.price||0)*(item.quantity||1)).toLocaleString()}</p>
                      <button onClick={() => handleRemoveFromCart(item._id)} className="mt-1 text-gray-300 hover:text-red-500 transition">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-b-2xl">
                <p className="font-black text-gray-900 text-xl tracking-tight">
                  Total: <span className="text-red-600">৳{cartTotal.toLocaleString()}</span>
                </p>
                <button onClick={() => setShowCheckoutForm(true)} disabled={isCheckingOut}
                  className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-8 py-3.5 rounded-2xl text-xs uppercase font-black tracking-widest transition-all shadow-xl shadow-gray-200 disabled:opacity-50">
                  {isCheckingOut
                    ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                    : 'Proceed to Checkout'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default MyBookings;
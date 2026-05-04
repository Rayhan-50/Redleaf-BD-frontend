import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, Pencil, Trash2, Search, X, Check, Image as ImageIcon } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import ImageUploadField from '../../components/Dashboard/ImageUploadField';

const CATEGORIES = ['Honey', 'Poultry & Meat', 'Rice & Grains', 'Oil', 'Spices', 'Super Foods', 'Tea & Snacks', 'Nuts & Dates', 'Pickle', 'Fruits & Veg', 'Electronics', 'Shoes', 'Clothing', 'Other'];

const EMPTY_FORM = {
  title: '', category: '', price: '', originalPrice: '', unit: '',
  image: '', description: '', inStock: true,
  free_delivery_enabled: false, free_delivery_min_amount: '',
};

const ManageProducts = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState({});

  const { data: result = { products: [] }, isLoading, refetch } = useQuery({
    queryKey: ['admin-products', search],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products?search=${search}&limit=100`);
      return res.data || { products: [] };
    },
  });

  const products = result.products || [];

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Required';
    if (!form.category)     e.category = 'Required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Valid price';
    if (!form.unit.trim())  e.unit = 'Required';
    setFormErr(e);
    return Object.keys(e).length === 0;
  };

  const openAdd = () => { setForm(EMPTY_FORM); setFormErr({}); setEditId(null); setModal('add'); };
  const openEdit = (p) => {
    setForm({
      title: p.title, category: p.category, price: p.price,
      originalPrice: p.originalPrice || '', unit: p.unit, image: p.image || '',
      description: p.description || '', inStock: p.inStock !== false,
      free_delivery_enabled: p.free_delivery_enabled === true,
      free_delivery_min_amount: p.free_delivery_min_amount || '',
    });
    setFormErr({});
    setEditId(p._id);
    setModal('edit');
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice) || 0,
      free_delivery_enabled: form.free_delivery_enabled === true,
      free_delivery_min_amount: Number(form.free_delivery_min_amount) || 0,
    };
    try {
      if (modal === 'add') {
        await axiosSecure.post('/products', payload);
      } else {
        await axiosSecure.put(`/products/${editId}`, payload);
      }
      // Invalidate ALL product-related queries so every component refreshes immediately
      await queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      await queryClient.invalidateQueries({ queryKey: ['delivery-products'] });
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['featured'] });
      setModal(null);
      Swal.fire({ 
        icon: 'success', 
        title: modal === 'add' ? 'Product Created' : 'Product Updated', 
        showConfirmButton: false, 
        timer: 1500,
        background: '#fff',
        customClass: { popup: 'rounded-3xl shadow-xl' }
      });
    } catch {
      Swal.fire({ icon: 'error', title: 'Action Failed', confirmButtonColor: '#dc2626' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (product) => {
    Swal.fire({
      title: 'Delete Asset?',
      text: `"${product.title}" will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it',
      background: '#fff',
      customClass: { 
        title: "font-['Poppins'] font-bold text-gray-900",
        popup: 'rounded-[32px] p-8 shadow-2xl' 
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axiosSecure.delete(`/products/${product._id}`);
        await queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        await queryClient.invalidateQueries({ queryKey: ['delivery-products'] });
        await queryClient.invalidateQueries({ queryKey: ['products'] });
        await queryClient.invalidateQueries({ queryKey: ['featured'] });
        Swal.fire({ icon: 'success', title: 'Removed', showConfirmButton: false, timer: 1200 });
      }
    });
  };

  const inputCls = (field) =>
    `w-full px-4 py-3 rounded-2xl border text-sm text-gray-800 transition-all focus:outline-none focus:ring-4 focus:ring-red-50 focus:border-red-600 ${formErr[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-6 lg:p-10 space-y-10 font-['Poppins',sans-serif]"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[24px] bg-red-600 flex items-center justify-center shadow-2xl shadow-red-200">
            <Package className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Product Vault</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">{products.length} Items Live</p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="group flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-red-200 active:scale-95"
        >
          <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" /> 
          Add New Listing
        </button>
      </div>

      {/* Search & Filters */}
      <div className="relative group max-w-xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-red-600 transition-colors" />
        <input
          type="text"
          placeholder="Search by title or category..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-16 pr-6 py-5 rounded-[24px] border border-gray-100 text-sm font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-red-50 focus:border-red-600 shadow-sm transition-all"
        />
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-red-100 rounded-full" />
            <div className="absolute inset-0 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-[40px] border border-dashed border-gray-200 py-32 text-center shadow-inner">
          <Package className="h-20 w-20 text-gray-200 mx-auto mb-6" />
          <p className="text-xl font-black text-gray-900 tracking-tight">No Inventory Found</p>
          <button onClick={openAdd} className="mt-6 bg-red-600 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition shadow-lg shadow-red-100">
            Initialize Stock
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-[40px] border border-gray-50 shadow-sm overflow-hidden p-2">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {['#', 'Product Identity', 'Category', 'Pricing', 'Unit', 'Free Delivery', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence mode='popLayout'>
                  {products.map((p, i) => (
                    <motion.tr
                      key={p._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="group hover:bg-red-50/30 transition-colors"
                    >
                      <td className="px-6 py-6 text-[10px] font-black text-gray-300">{i + 1}</td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 p-1 group-hover:scale-110 transition-transform">
                            {p.image ? (
                              <img src={p.image} alt={p.title} className="w-full h-full object-contain mix-blend-multiply" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-gray-200" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-black text-gray-900 text-xs truncate max-w-[200px] uppercase tracking-tight">{p.title}</p>
                            <p className="text-[10px] text-gray-400 font-bold truncate max-w-[200px] mt-0.5">{p.description || 'No description provided'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-gray-200">{p.category}</span>
                      </td>
                      <td className="px-6 py-6">
                        <p className="font-black text-red-600 text-sm tracking-tighter">৳{(p.price||0).toLocaleString()}</p>
                        {p.originalPrice > 0 && <p className="text-[10px] text-gray-400 font-bold line-through">৳{p.originalPrice}</p>}
                      </td>
                      <td className="px-6 py-6 text-gray-400 font-bold text-xs">{p.unit}</td>
                      <td className="px-6 py-6">
                        {p.free_delivery_enabled ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            ৳{p.free_delivery_min_amount?.toLocaleString() || 0}+
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-6 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${p.inStock !== false ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${p.inStock !== false ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                          {p.inStock !== false ? 'Active' : 'Halted'}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => openEdit(p)}
                            className="p-3 bg-gray-50 hover:bg-red-600 text-gray-400 hover:text-white rounded-2xl transition-all shadow-sm active:scale-90"
                            title="Refine Listing"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            className="p-3 bg-gray-50 hover:bg-black text-gray-400 hover:text-white rounded-2xl transition-all shadow-sm active:scale-90"
                            title="Exterminate"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal Overlay */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[70] flex items-center justify-center p-6"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-8 border-b border-gray-50">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter">{modal === 'add' ? 'Construct Listing' : 'Refine Details'}</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Populate the fields below correctly</p>
                </div>
                <button onClick={() => setModal(null)} className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-2xl transition-colors">
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Product Title <span className="text-red-500">*</span></label>
                  <input value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} className={inputCls('title')} placeholder="e.g. Khaas Premium Honey" />
                  {formErr.title && <p className="text-[10px] font-bold text-red-500 mt-2">{formErr.title}</p>}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Category <span className="text-red-500">*</span></label>
                    <select value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))} className={inputCls('category')}>
                      <option value="">Select Branch…</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {formErr.category && <p className="text-[10px] font-bold text-red-500 mt-2">{formErr.category}</p>}
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Unit/Volume <span className="text-red-500">*</span></label>
                    <input value={form.unit} onChange={e => setForm(f=>({...f,unit:e.target.value}))} className={inputCls('unit')} placeholder="500gm, 1 Ltr…" />
                    {formErr.unit && <p className="text-[10px] font-bold text-red-500 mt-2">{formErr.unit}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Sale Rate (৳) <span className="text-red-500">*</span></label>
                    <input type="number" min="0" value={form.price} onChange={e => setForm(f=>({...f,price:e.target.value}))} className={inputCls('price')} placeholder="214" />
                    {formErr.price && <p className="text-[10px] font-bold text-red-500 mt-2">{formErr.price}</p>}
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">List Price (৳)</label>
                    <input type="number" min="0" value={form.originalPrice} onChange={e => setForm(f=>({...f,originalPrice:e.target.value}))} className={inputCls('originalPrice')} placeholder="Original SRP" />
                  </div>
                </div>

                <ImageUploadField 
                  label="Visual Endpoint"
                  value={form.image} 
                  onChange={(url) => setForm(f => ({ ...f, image: url }))} 
                  placeholder="https://unsplash..." 
                />

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Short Narrative</label>
                  <textarea rows={3} value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} className={`${inputCls('description')} resize-none`} placeholder="Technical specifications or brief story..." />
                </div>

                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                   <span className="text-sm font-black text-gray-900 tracking-tight uppercase">Inventory Flow</span>
                   <button
                    type="button"
                    onClick={() => setForm(f=>({...f,inStock:!f.inStock}))}
                    className={`relative w-14 h-8 rounded-full transition-all ring-4 ring-offset-2 ${form.inStock ? 'bg-red-600 ring-red-50' : 'bg-gray-300 ring-transparent'}`}
                  >
                    <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform ${form.inStock ? 'translate-x-6' : ''}`} />
                  </button>
                </div>

                {/* ── Free Delivery Section ─────────────────────────────── */}
                <div className="p-6 bg-emerald-50/60 rounded-3xl border border-emerald-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-gray-900 tracking-tight uppercase">Free Delivery Rule</p>
                      <p className="text-[10px] font-bold text-gray-400 mt-0.5">Enable free delivery when spend threshold is met</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, free_delivery_enabled: !f.free_delivery_enabled }))}
                      className={`relative w-14 h-8 rounded-full transition-all ring-4 ring-offset-2 ${
                        form.free_delivery_enabled ? 'bg-emerald-600 ring-emerald-100' : 'bg-gray-300 ring-transparent'
                      }`}
                    >
                      <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform ${
                        form.free_delivery_enabled ? 'translate-x-6' : ''
                      }`} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {form.free_delivery_enabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">
                            Min. Spend to Unlock Free Delivery (৳) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={form.free_delivery_min_amount}
                            onChange={e => setForm(f => ({ ...f, free_delivery_min_amount: e.target.value }))}
                            className={inputCls('free_delivery_min_amount')}
                            placeholder="e.g. 500"
                          />
                          <p className="text-[10px] font-medium text-emerald-700 mt-2">
                            🎁 Customer gets free delivery when their total spend on this product reaches ৳{form.free_delivery_min_amount || '—'}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-gray-50 flex gap-4">
                <button onClick={() => setModal(null)} className="flex-1 py-4 rounded-2xl border border-gray-200 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all">
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-4 rounded-2xl bg-red-600 text-white text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-100 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"/> Syncing...</>
                  ) : (
                    <><Check className="h-5 w-5"/> {modal==='add'?'Commit Listing':'Update Records'}</>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ManageProducts;
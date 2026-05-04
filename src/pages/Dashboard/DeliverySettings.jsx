import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useDeliverySettings from '../../hooks/useDeliverySettings';
import Swal from 'sweetalert2';
import {
  Truck, Package, Search, Save, Plus, Trash2,
  CheckCircle, XCircle, Loader2, Settings, ChevronDown,
} from 'lucide-react';
import { DEFAULT_ZONES } from '../../utils/deliveryDefaults';

/* ─────────────────────────────────────────────────────────────────────────────
   Zone Tier Editor — one zone's tiers (rows of min/max/charge)
───────────────────────────────────────────────────────────────────────────── */
const ZoneTierEditor = ({ zoneName, tiers, onChange }) => {
  const addRow = () => {
    const last = tiers[tiers.length - 1];
    const newMin = last ? (last.max !== null ? last.max + 1 : (last.min + 500)) : 0;
    onChange([...tiers, { min: newMin, max: null, charge: 0 }]);
  };

  const updateRow = (idx, field, value) => {
    const updated = tiers.map((t, i) =>
      i === idx ? { ...t, [field]: value === '' ? null : Number(value) } : t
    );
    onChange(updated);
  };

  const removeRow = (idx) => {
    if (tiers.length <= 1) return;
    onChange(tiers.filter((_, i) => i !== idx));
  };

  const inputCls = 'w-full text-sm font-bold text-gray-800 bg-transparent focus:outline-none text-right';

  return (
    <div className="space-y-2">
      {tiers.map((tier, idx) => (
        <motion.div
          key={idx}
          layout
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center"
        >
          {/* Min */}
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex-shrink-0">From ৳</span>
            <input type="number" min="0" value={tier.min}
              onChange={e => updateRow(idx, 'min', e.target.value)}
              className={inputCls} />
          </div>
          {/* Max */}
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex-shrink-0">To ৳</span>
            <input type="number" min="0"
              value={tier.max === null ? '' : tier.max}
              placeholder="∞"
              onChange={e => updateRow(idx, 'max', e.target.value === '' ? null : e.target.value)}
              className={inputCls + ' placeholder:text-gray-300'} />
          </div>
          {/* Charge */}
          <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex-shrink-0">৳</span>
            <input type="number" min="0" value={tier.charge}
              onChange={e => updateRow(idx, 'charge', e.target.value)}
              className={inputCls + ' text-emerald-800'} />
          </div>
          {/* Delete */}
          <button onClick={() => removeRow(idx)} disabled={tiers.length <= 1}
            className="p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-20">
            <Trash2 className="w-4 h-4" />
          </button>
        </motion.div>
      ))}

      <button onClick={addRow}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-700 hover:text-emerald-900 transition-colors mt-1">
        <Plus className="w-3.5 h-3.5" /> Add Tier
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Per-product free delivery row
───────────────────────────────────────────────────────────────────────────── */
const ProductDeliveryRow = ({ product, onSaved }) => {
  const axiosSecure = useAxiosSecure();
  const [enabled, setEnabled] = useState(product.free_delivery_enabled === true);
  const [minAmt,  setMinAmt]  = useState(product.free_delivery_min_amount || '');
  const [saving,  setSaving]  = useState(false);
  const [dirty,   setDirty]   = useState(false);

  useEffect(() => {
    setDirty(
      enabled !== (product.free_delivery_enabled === true) ||
      String(minAmt) !== String(product.free_delivery_min_amount || '')
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, minAmt]);

  const handleSave = async () => {
    if (enabled && (!minAmt || Number(minAmt) <= 0)) {
      Swal.fire({ icon: 'warning', title: 'Invalid Amount', text: 'Enter a valid minimum spend amount.', confirmButtonColor: '#dc2626' });
      return;
    }
    setSaving(true);
    try {
      await axiosSecure.patch(`/products/${product._id}/delivery-settings`, {
        free_delivery_enabled:    enabled,
        free_delivery_min_amount: Number(minAmt) || 0,
      });
      setDirty(false);
      onSaved();
      Swal.fire({ icon: 'success', title: 'Saved!', showConfirmButton: false, timer: 1200 });
    } catch {
      Swal.fire({ icon: 'error', title: 'Failed to save', confirmButtonColor: '#dc2626' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <tr className="group hover:bg-emerald-50/30 transition-colors border-b border-gray-50 last:border-0">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
            {product.image
              ? <img src={product.image} alt={product.title} className="w-full h-full object-contain mix-blend-multiply" />
              : <Package className="w-4 h-4 text-gray-200 m-2.5" />}
          </div>
          <div className="min-w-0">
            <p className="font-black text-gray-900 text-xs truncate max-w-[160px] uppercase tracking-tight">{product.title}</p>
            <p className="text-[10px] font-bold text-gray-400 mt-0.5">৳{(product.price || 0).toLocaleString()} / {product.unit || '—'}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <button type="button" onClick={() => setEnabled(e => !e)}
          className={`relative inline-flex w-11 h-6 rounded-full transition-all ring-2 ring-offset-2 ${
            enabled ? 'bg-emerald-600 ring-emerald-200' : 'bg-gray-200 ring-transparent'}`}>
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${enabled ? 'translate-x-5' : ''}`} />
        </button>
      </td>
      <td className="px-5 py-4">
        <AnimatePresence>
          {enabled ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-1 bg-white border border-emerald-200 rounded-xl px-3 py-1.5 w-32 shadow-sm">
                <span className="text-emerald-700 font-black text-sm">৳</span>
                <input type="number" min="0" value={minAmt} onChange={e => setMinAmt(e.target.value)}
                  placeholder="500"
                  className="flex-1 text-sm font-bold text-gray-800 focus:outline-none bg-transparent w-16" />
              </div>
            </motion.div>
          ) : (
            <span className="text-[10px] font-bold text-gray-300">— Not Set —</span>
          )}
        </AnimatePresence>
      </td>
      <td className="px-5 py-4">
        {enabled
          ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100"><CheckCircle className="w-3 h-3" /> Active</span>
          : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-gray-50 text-gray-400 border border-gray-100"><XCircle className="w-3 h-3" /> Off</span>}
      </td>
      <td className="px-5 py-4">
        <AnimatePresence>
          {dirty && (
            <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleSave} disabled={saving}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-200 disabled:opacity-60">
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
              {saving ? 'Saving…' : 'Save'}
            </motion.button>
          )}
        </AnimatePresence>
      </td>
    </tr>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────────────────────── */
const DeliverySettings = () => {
  const axiosSecure = useAxiosSecure();
  const [deliverySettings, refetchSettings, isLoading] = useDeliverySettings();

  // Local editable copy of zone tiers
  const [zones, setZones]       = useState(DEFAULT_ZONES);
  const [isSaving, setIsSaving] = useState(false);
  const [openZone, setOpenZone] = useState(null); // accordion

  const [search, setSearch]     = useState('');

  // Sync from DB
  useEffect(() => {
    if (deliverySettings?.zones) {
      setZones(deliverySettings.zones);
      setOpenZone(Object.keys(deliverySettings.zones)[0] || null);
    }
  }, [deliverySettings]);

  const handleSaveZones = async () => {
    setIsSaving(true);
    try {
      await axiosSecure.put('/settings/delivery', { zones });
      refetchSettings();
      Swal.fire({ icon: 'success', title: 'Zone Pricing Saved!', showConfirmButton: false, timer: 1400 });
    } catch {
      Swal.fire({ icon: 'error', title: 'Failed to save', confirmButtonColor: '#dc2626' });
    } finally {
      setIsSaving(false);
    }
  };

  const addZone = () => {
    const name = `Zone ${Object.keys(zones).length + 1}`;
    setZones(z => ({ ...z, [name]: [{ min: 0, max: null, charge: 0 }] }));
    setOpenZone(name);
  };

  const renameZone = (oldName, newName) => {
    if (!newName.trim() || newName === oldName) return;
    const entries = Object.entries(zones);
    const updated = Object.fromEntries(entries.map(([k, v]) => [k === oldName ? newName.trim() : k, v]));
    setZones(updated);
    setOpenZone(newName.trim());
  };

  const removeZone = (name) => {
    if (Object.keys(zones).length <= 1) return;
    const updated = { ...zones };
    delete updated[name];
    setZones(updated);
    setOpenZone(Object.keys(updated)[0]);
  };

  // Products
  const { data: result = { products: [] }, refetch: refetchProducts } = useQuery({
    queryKey: ['delivery-products', search],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products?search=${search}&limit=100`);
      return res.data || { products: [] };
    },
  });
  const products = result.products || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="p-4 sm:p-6 lg:p-8 space-y-10 font-['Poppins',sans-serif]">

      {/* Header */}
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-[20px] bg-red-600 flex items-center justify-center shadow-2xl shadow-red-200">
          <Truck className="h-7 w-7 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Delivery Control</h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Zone Tiers · Per-Product Rules · Instant Apply</p>
        </div>
      </div>

      {/* ── Rule Summary Card ─────────────────────────────────────────────── */}
      <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-5 text-xs font-semibold text-blue-800 space-y-1.5 max-w-2xl">
        <p className="font-black text-blue-900 text-sm mb-2">⚡ Delivery Rule Priority</p>
        <p>🎁 <strong>Product rule met</strong> (spend ≥ threshold on that product) → Free delivery</p>
        <p>🚚 <strong>Otherwise</strong> → Zone tier charge based on total cart amount</p>
      </div>

      {/* ── Zone Tier Pricing ─────────────────────────────────────────────── */}
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center shadow-xl shadow-red-200">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Zone Pricing Tiers</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mt-0.5">Charge based on cart total per zone</p>
            </div>
          </div>
          <button onClick={addZone}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 px-4 py-2 rounded-xl transition-all">
            <Plus className="w-3.5 h-3.5" /> Add Zone
          </button>
        </div>

        <div className="space-y-3">
          {Object.entries(zones).map(([zoneName, tiers]) => (
            <div key={zoneName} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Accordion Header */}
              <div
                className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors select-none"
                onClick={() => setOpenZone(openZone === zoneName ? null : zoneName)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                  <input
                    value={zoneName}
                    onClick={e => e.stopPropagation()}
                    onChange={e => renameZone(zoneName, e.target.value)}
                    className="font-black text-gray-900 text-sm bg-transparent focus:outline-none focus:border-b-2 focus:border-red-400 w-auto min-w-0"
                    style={{ width: `${Math.max(zoneName.length, 6) + 2}ch` }}
                  />
                  <span className="text-[10px] font-bold text-gray-400 hidden sm:block">{tiers.length} tier{tiers.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={e => { e.stopPropagation(); removeZone(zoneName); }}
                    disabled={Object.keys(zones).length <= 1}
                    className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-20">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openZone === zoneName ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Accordion Body */}
              <AnimatePresence>
                {openZone === zoneName && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-2 border-t border-gray-50">
                      {/* Column Labels */}
                      <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 mb-2">
                        {['Cart Total (From)', 'Cart Total (To)', 'Delivery Charge', ''].map(h => (
                          <p key={h} className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] text-right first:text-left">{h}</p>
                        ))}
                      </div>
                      <ZoneTierEditor
                        zoneName={zoneName}
                        tiers={tiers}
                        onChange={newTiers => setZones(z => ({ ...z, [zoneName]: newTiers }))}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <button onClick={handleSaveZones} disabled={isSaving}
          className="mt-6 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-red-200 disabled:opacity-50">
          {isSaving
            ? <><span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Saving…</>
            : <><Save className="w-4 h-4" /> Save All Zone Tiers</>}
        </button>
      </div>

      {/* ── Per-product rules table ───────────────────────────────────────── */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-200">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Per-Product Free Delivery</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mt-0.5">Toggle & set spend threshold — applies instantly</p>
            </div>
          </div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-emerald-600 transition-colors" />
            <input type="text" placeholder="Filter products…" value={search} onChange={e => setSearch(e.target.value)}
              className="pl-11 pr-5 py-3 rounded-2xl border border-gray-100 text-sm font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-600 shadow-sm transition-all w-56" />
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-gray-50 shadow-sm overflow-hidden">
          {products.length === 0 ? (
            <div className="py-16 text-center">
              <Package className="h-14 w-14 text-gray-100 mx-auto mb-3" />
              <p className="font-black text-gray-300 text-lg">No products found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    {['Product', 'Free Delivery', 'Min Spend', 'Status', 'Action'].map(h => (
                      <th key={h} className="px-5 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <ProductDeliveryRow key={product._id} product={product} onSaved={refetchProducts} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <p className="mt-3 text-[10px] font-bold text-gray-400 text-center">
          {products.filter(p => p.free_delivery_enabled).length} of {products.length} products have free delivery rules active
        </p>
      </div>

    </motion.div>
  );
};

export default DeliverySettings;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PackagePlus, Check, Image as ImageIcon, Sparkles, Navigation } from 'lucide-react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import ImageUploadField from '../../components/Dashboard/ImageUploadField';

const CATEGORIES = ['Honey', 'Poultry & Meat', 'Rice & Grains', 'Oil', 'Spices', 'Super Foods', 'Tea & Snacks', 'Nuts & Dates', 'Pickle', 'Fruits & Veg', 'Electronics', 'Shoes', 'Clothing', 'Other'];

const EMPTY_FORM = { 
  title: '', category: '', price: '', originalPrice: '', 
  unit: '', image: '', description: '', highlights: '', inStock: true 
};

const AddProduct = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title required';
    if (!form.category)     e.category = 'Category required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Valid price';
    if (!form.unit.trim())  e.unit = 'Unit required';
    setFormErr(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      Swal.fire({ 
        title: 'Validation Failed', 
        text: 'Certain fields require attention (*)', 
        icon: 'error', 
        confirmButtonColor: '#dc2626',
        background: '#fff',
        customClass: { popup: 'rounded-3xl' }
      });
      return;
    }
    
    setSaving(true);
    let formattedHighlights = form.highlights;
    if (form.highlights && !form.highlights.includes('<')) {
        formattedHighlights = `<ul class="list-disc pl-5 space-y-2">` + form.highlights.split('\n').filter(l=>l.trim()).map(line => `<li>${line}</li>`).join('') + `</ul>`;
    }

    const payload = { 
        ...form, 
        price: Number(form.price), 
        originalPrice: Number(form.originalPrice) || 0,
        highlights: formattedHighlights
    };

    try {
      await axiosSecure.post('/products', payload);
      Swal.fire({ 
        icon: 'success', 
        title: 'Listing Published', 
        text: `"${form.title}" is now live in the store.`,
        showConfirmButton: true,
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Return to Inventory',
        background: '#fff',
        customClass: { popup: 'rounded-3xl' }
      }).then((res) => {
        if (res.isConfirmed) {
            navigate('/dashboard/manage-products');
        } else {
            setForm(EMPTY_FORM);
        }
      });
    } catch {
      Swal.fire({ icon: 'error', title: 'Publication Halted', confirmButtonColor: '#dc2626' });
    } finally {
      setSaving(false);
    }
  };

  const inputCls = (field) =>
    `w-full px-5 py-4 rounded-2xl border text-sm font-bold text-gray-800 transition-all focus:outline-none focus:ring-4 focus:ring-red-50 focus:border-red-600 ${formErr[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`;

  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="p-6 lg:p-12 max-w-6xl mx-auto space-y-12 font-['Poppins',sans-serif]"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-[32px] bg-red-600 flex items-center justify-center shadow-2xl shadow-red-200">
            <PackagePlus className="h-10 w-10 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Initialize Listing</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">Constructing a new asset for your catalog</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-stretch">
        {/* Main Form Fields */}
        <div className="xl:col-span-2">
          <div className="h-full bg-white p-8 md:p-12 rounded-[40px] border border-gray-50 shadow-sm space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
                <Sparkles size={40} className="text-red-50 opacity-50" />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Manifest Title <span className="text-red-500">*</span></label>
              <input value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} className={inputCls('title')} placeholder="e.g. Khaas Premium Honey" />
              {formErr.title && <p className="text-[10px] font-bold text-red-500 mt-2">{formErr.title}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Department <span className="text-red-500">*</span></label>
                <select value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))} className={inputCls('category')}>
                  <option value="">Select Branch…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {formErr.category && <p className="text-[10px] font-bold text-red-500 mt-2">{formErr.category}</p>}
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Unit Metric <span className="text-red-500">*</span></label>
                <input value={form.unit} onChange={e => setForm(f=>({...f,unit:e.target.value}))} className={inputCls('unit')} placeholder="e.g. 500gm, 1 Case" />
                {formErr.unit && <p className="text-[10px] font-bold text-red-500 mt-2">{formErr.unit}</p>}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Product Narrative</label>
              <textarea rows={5} value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} className={`${inputCls('description')} resize-none`} placeholder="Write the technical story of this product..." />
            </div>
            
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                Core Highlights 
              </label>
              <textarea rows={4} value={form.highlights} onChange={e => setForm(f=>({...f,highlights:e.target.value}))} className={`${inputCls('highlights')} resize-none`} placeholder="Bullet points (one per line)..." />
              <p className="text-[10px] text-gray-400 mt-3 italic">Example: 100% Organic | Lab Tested | Farmer Sourced</p>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="flex flex-col gap-8 h-full">
          {/* Pricing Logic */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm space-y-8">
             <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase">Pricing Logic</h3>
             <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Trade Share (৳) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-red-600 font-black">৳</span>
                  <input type="number" min="0" value={form.price} onChange={e => setForm(f=>({...f,price:e.target.value}))} className={`pl-10 ${inputCls('price')}`} placeholder="Sale Rate" />
                </div>
                {formErr.price && <p className="text-[10px] font-bold text-red-500 mt-2">{formErr.price}</p>}
             </div>
             <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Market Value (৳)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 font-black">৳</span>
                  <input type="number" min="0" value={form.originalPrice} onChange={e => setForm(f=>({...f,originalPrice:e.target.value}))} className={`pl-10 ${inputCls('originalPrice')}`} placeholder="Regular SRP" />
                </div>
             </div>
                  {/* Asset Preview */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase mb-8">Media Stack</h3>
            
            <ImageUploadField 
              value={form.image} 
              onChange={(url) => setForm(f => ({ ...f, image: url }))}
              placeholder="Paste visual endpoint..."
            />

            <div className="flex items-center justify-between p-6 bg-red-50/30 rounded-[32px] border border-red-50 mt-8">
               <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Active Stock</span>
               <button
                  type="button"
                  onClick={() => setForm(f=>({...f,inStock:!f.inStock}))}
                  className={`relative w-14 h-8 rounded-full transition-all ring-4 ring-offset-2 ${form.inStock ? 'bg-red-600 ring-red-50' : 'bg-gray-300 ring-transparent'}`}
                >
                  <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform ${form.inStock ? 'translate-x-6' : ''}`} />
                </button>
            </div>
          </div>    </div>

          {/* Action Hub */}
          <div className="pt-4 mt-auto">
             <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-6 rounded-[32px] bg-red-600 text-white text-sm font-black uppercase tracking-[0.2em] hover:bg-red-700 transition shadow-2xl shadow-red-200 disabled:opacity-60 flex items-center justify-center gap-3 active:scale-[0.98] group"
              >
                {saving ? (
                  <><span className="animate-spin w-5 h-5 border-4 border-white border-t-transparent rounded-full"/> Synching Registry</>
                ) : (
                  <><Navigation size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/> Publish Listing</>
                )}
              </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default AddProduct;

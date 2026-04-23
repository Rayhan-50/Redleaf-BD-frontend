import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Navigation, Sparkles, Edit, Trash2, Plus, Clock, Eye, MessageSquare } from 'lucide-react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import ImageUploadField from '../../components/Dashboard/ImageUploadField';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Loading from '../../components/Loading/Loading';

const CATEGORIES = [
  'Vlog', 'কোরবানি', 'খাদ্যের গুণাগুণ', 'নিউট্রিশন', 'মৌসুমি ফল', 'রমজান', 'রূপচর্চা', 'রেসিপি', 'রোগ প্রতিরোধ', 'শীতকালীন সুস্থতা', 'হেলথ টিপস'
];

const EMPTY_FORM = { 
  title: '', category: '', readTime: '', image: '', excerpt: '', content: '' 
};

const AddBlog = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState({});
  const [editingId, setEditingId] = useState(null);

  // Fetch all blogs
  const { data: blogs = [], isLoading: blogsLoading } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: async () => {
      const res = await axiosSecure.get('/blogs');
      return res.data;
    }
  });

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title required';
    if (!form.category)     e.category = 'Category required';
    if (!form.readTime.trim()) e.readTime = 'Read time required';
    if (!form.excerpt.trim()) e.excerpt = 'Excerpt required';
    if (!form.content.trim()) e.content = 'Content required';
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
    
    // Generate date if new blog, otherwise preserve
    const payload = { ...form };
    if (!editingId) {
        const currentDate = new Date();
        payload.author = user?.displayName || 'Admin';
        payload.date = currentDate.getDate().toString();
        payload.month = currentDate.toLocaleString('default', { month: 'short' }).toUpperCase();
    }

    try {
      if (editingId) {
        await axiosSecure.put(`/blogs/${editingId}`, payload);
        Swal.fire({ 
            icon: 'success', 
            title: 'Blog Updated', 
            text: `"${form.title}" has been successfully updated.`,
            showConfirmButton: false,
            timer: 1500,
            background: '#fff',
            customClass: { popup: 'rounded-3xl' }
        });
      } else {
        await axiosSecure.post('/blogs', payload);
        Swal.fire({ 
            icon: 'success', 
            title: 'Blog Published', 
            text: `"${form.title}" is now live on the blog.`,
            showConfirmButton: false,
            timer: 1500,
            background: '#fff',
            customClass: { popup: 'rounded-3xl' }
        });
      }
      
      setForm(EMPTY_FORM);
      setEditingId(null);
      setFormErr({});
      queryClient.invalidateQueries(['admin-blogs']);
      queryClient.invalidateQueries(['blogs']); // Also invalidate public blogs
    } catch {
      Swal.fire({ icon: 'error', title: 'Action Failed', text: 'Something went wrong.', confirmButtonColor: '#dc2626' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (blog) => {
      setForm({
          title: blog.title || '',
          category: blog.category || '',
          readTime: blog.readTime || '',
          image: blog.image || '',
          excerpt: blog.excerpt || '',
          content: blog.content || '',
      });
      setEditingId(blog._id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    Swal.fire({
        title: "Delete Blog?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, delete it",
        background: "#fff",
        customClass: { popup: "rounded-3xl" }
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/blogs/${id}`);
                Swal.fire({ icon: "success", title: "Deleted!", showConfirmButton: false, timer: 1500 });
                queryClient.invalidateQueries(['admin-blogs']);
                queryClient.invalidateQueries(['blogs']);
                if (editingId === id) {
                    setEditingId(null);
                    setForm(EMPTY_FORM);
                }
            } catch (error) {
                Swal.fire({ icon: "error", title: "Failed to delete", confirmButtonColor: '#dc2626' });
            }
        }
    });
  };

  const handleCancelEdit = () => {
      setEditingId(null);
      setForm(EMPTY_FORM);
      setFormErr({});
  };

  const inputCls = (field) =>
    `w-full px-5 py-4 rounded-2xl border text-sm font-bold text-gray-800 transition-all focus:outline-none focus:ring-4 focus:ring-red-50 focus:border-red-600 ${formErr[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`;

  return (
    <div className="min-h-screen pb-20">
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="p-6 lg:p-12 max-w-7xl mx-auto space-y-12 font-['Poppins',sans-serif]"
        >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center shadow-2xl transition-colors duration-500 ${editingId ? 'bg-yellow-500 shadow-yellow-200' : 'bg-red-600 shadow-red-200'}`}>
                {editingId ? <Edit className="h-10 w-10 text-white" /> : <FileText className="h-10 w-10 text-white" />}
            </div>
            <div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">
                    {editingId ? 'Update Blog' : 'Initialize Blog'}
                </h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">
                    {editingId ? 'Editing an existing story' : 'Publish a new story or article'}
                </p>
            </div>
            </div>
            {editingId && (
                <button 
                    onClick={handleCancelEdit}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-black uppercase tracking-widest rounded-full transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4 rotate-45" /> Cancel Edit
                </button>
            )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-stretch">
            {/* Main Form Fields */}
            <div className="xl:col-span-2">
            <div className={`h-full bg-white p-8 md:p-12 rounded-[40px] shadow-sm space-y-8 relative overflow-hidden transition-colors border-2 ${editingId ? 'border-yellow-100' : 'border-gray-50'}`}>
                <div className="absolute top-0 right-0 p-8">
                    <Sparkles size={40} className={`${editingId ? 'text-yellow-100' : 'text-red-50'} opacity-50`} />
                </div>

                <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Blog Title <span className="text-red-500">*</span></label>
                <input value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} className={inputCls('title')} placeholder="e.g. Benefits of Pure Honey" />
                {formErr.title && <p className="text-[10px] font-bold text-red-500 mt-2">{formErr.title}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Category <span className="text-red-500">*</span></label>
                    <select value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))} className={inputCls('category')}>
                    <option value="">Select Category…</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {formErr.category && <p className="text-[10px] font-bold text-red-500 mt-2">{formErr.category}</p>}
                </div>
                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Read Time <span className="text-red-500">*</span></label>
                    <input value={form.readTime} onChange={e => setForm(f=>({...f,readTime:e.target.value}))} className={inputCls('readTime')} placeholder="e.g. 5 min" />
                    {formErr.readTime && <p className="text-[10px] font-bold text-red-500 mt-2">{formErr.readTime}</p>}
                </div>
                </div>

                <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Excerpt (Short Description) <span className="text-red-500">*</span></label>
                <textarea rows={3} value={form.excerpt} onChange={e => setForm(f=>({...f,excerpt:e.target.value}))} className={`${inputCls('excerpt')} resize-none`} placeholder="A short summary for the blog card..." />
                {formErr.excerpt && <p className="text-[10px] font-bold text-red-500 mt-2">{formErr.excerpt}</p>}
                </div>
                
                <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    Full Content <span className="text-red-500">*</span>
                </label>
                <textarea rows={8} value={form.content} onChange={e => setForm(f=>({...f,content:e.target.value}))} className={`${inputCls('content')} resize-none`} placeholder="Write the full blog post content here..." />
                {formErr.content && <p className="text-[10px] font-bold text-red-500 mt-2">{formErr.content}</p>}
                </div>
            </div>
            </div>

            {/* Sidebar Controls */}
            <div className="flex flex-col gap-8 h-full">
            {/* Asset Preview */}
            <div className={`bg-white p-8 rounded-[40px] shadow-sm flex flex-col transition-colors border-2 ${editingId ? 'border-yellow-100' : 'border-gray-50'}`}>
                <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase mb-8">Cover Media</h3>
                
                <ImageUploadField 
                value={form.image} 
                onChange={(url) => setForm(f => ({ ...f, image: url }))}
                placeholder="Paste visual endpoint..."
                />
            </div>

            {/* Action Hub */}
            <div className="pt-4 mt-auto">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`w-full py-6 rounded-[32px] text-white text-sm font-black uppercase tracking-[0.2em] transition shadow-2xl disabled:opacity-60 flex items-center justify-center gap-3 active:scale-[0.98] group ${editingId ? 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-200' : 'bg-red-600 hover:bg-red-700 shadow-red-200'}`}
                >
                    {saving ? (
                    <><span className="animate-spin w-5 h-5 border-4 border-white border-t-transparent rounded-full"/> Processing...</>
                    ) : (
                    <><Navigation size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/> {editingId ? 'Save Changes' : 'Publish Blog'}</>
                    )}
                </button>
            </div>
            </div>

        </div>
        </motion.div>

        {/* ── Manage Existing Blogs Section ── */}
        <div className="px-6 lg:px-12 max-w-7xl mx-auto mt-12 font-['Poppins']">
            <div className="flex items-center gap-4 mb-8 pl-4">
                <div className="w-2 h-8 bg-red-600 rounded-full"></div>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Manage Published Blogs</h3>
            </div>

            {blogsLoading ? (
                <div className="flex justify-center py-20"><Loading /></div>
            ) : blogs.length === 0 ? (
                <div className="bg-white rounded-[32px] border border-gray-100 p-12 text-center shadow-sm">
                    <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">No blogs published yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map(blog => (
                        <div key={blog._id} className="bg-white rounded-[24px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-red-500/10 transition-all overflow-hidden flex flex-col group">
                            {/* Image Header */}
                            <div className="h-40 bg-gray-100 relative overflow-hidden">
                                {blog.image ? (
                                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50"><FileText size={40} /></div>
                                )}
                                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur shadow-sm px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-red-600">
                                    {blog.category}
                                </div>
                            </div>
                            
                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <h4 className="font-extrabold text-gray-900 leading-snug mb-3 line-clamp-2 text-lg">
                                    {blog.title}
                                </h4>
                                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">
                                    <span className="flex items-center gap-1.5"><Clock size={12} className="text-red-500" /> {blog.readTime}</span>
                                    <span className="flex items-center gap-1.5"><Eye size={12} className="text-gray-400" /> {blog.views || 0}</span>
                                </div>

                                <div className="mt-auto flex items-center gap-3">
                                    <button 
                                        onClick={() => handleEdit(blog)}
                                        className="flex-1 py-3 bg-gray-50 hover:bg-yellow-50 text-gray-700 hover:text-yellow-600 text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Edit size={14} /> Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(blog._id)}
                                        className="w-12 h-[38px] bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-xl transition-colors flex items-center justify-center"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

export default AddBlog;

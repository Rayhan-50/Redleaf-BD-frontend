import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Search, Plus, Trash2, Package, Loader2, RefreshCw, X } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import Swal from 'sweetalert2';

const ManageFeatured = () => {
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [adding, setAdding] = useState(null);
  const [removing, setRemoving] = useState(null);

  // Fetch current featured products
  const { data: featured = [], isLoading: featuredLoading, refetch } = useQuery({
    queryKey: ['featured-products-admin'],
    queryFn: async () => {
      const res = await axiosPublic.get('/featured-products');
      return res.data || [];
    },
  });

  // Fetch all products matching search
  const { data: searchResult = { products: [] }, isLoading: searchLoading } = useQuery({
    queryKey: ['products-search-featured', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return { products: [] };
      const res = await axiosPublic.get(`/products?search=${encodeURIComponent(searchQuery)}&limit=12`);
      return res.data || { products: [] };
    },
    enabled: !!searchQuery,
  });

  const allProducts = searchResult.products || [];
  const featuredIds = new Set(featured.map(p => p._id?.toString()));

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(search.trim());
  };

  const handleAdd = async (product) => {
    setAdding(product._id);
    try {
      await axiosSecure.post('/featured-products', { productId: product._id });
      queryClient.invalidateQueries(['featured-products-admin']);
      queryClient.invalidateQueries(['featured-products']);
      refetch();
      Swal.fire({
        toast: true, position: 'top-end', icon: 'success',
        title: `"${product.title}" added to Popular!`,
        showConfirmButton: false, timer: 2000,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: err.response?.data?.message || 'Failed to add product',
        confirmButtonColor: '#dc2626',
      });
    } finally {
      setAdding(null);
    }
  };

  const handleRemove = async (productId, title) => {
    Swal.fire({
      title: 'Remove from Popular?',
      text: `"${title}" will no longer appear in Most Popular Items.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Remove',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setRemoving(productId);
        try {
          await axiosSecure.delete(`/featured-products/${productId}`);
          queryClient.invalidateQueries(['featured-products-admin']);
          queryClient.invalidateQueries(['featured-products']);
          refetch();
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Removed!', showConfirmButton: false, timer: 1500 });
        } catch (err) {
          Swal.fire({ icon: 'error', title: 'Failed to remove', confirmButtonColor: '#dc2626' });
        } finally {
          setRemoving(null);
        }
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 lg:p-7 space-y-8 font-['Poppins',sans-serif]"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-100">
          <Star className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight uppercase">Most Popular Items</h2>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
            Manage homepage featured products — {featured.length} active
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="ml-auto flex items-center gap-2 bg-white hover:bg-orange-50 text-gray-900 px-4 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all border border-gray-100 shadow-sm"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${featuredLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Currently Featured */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
          <Star className="h-4 w-4 text-orange-500 fill-orange-400" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Currently Featured</h3>
          <span className="ml-auto text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            {featured.length} products
          </span>
        </div>

        {featuredLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-7 w-7 text-orange-500 animate-spin" />
          </div>
        ) : featured.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-3">
            <Package className="h-10 w-10 text-gray-200" />
            <p className="text-sm font-bold text-gray-400">No featured products yet. Search below to add some.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            <AnimatePresence mode="popLayout">
              {featured.map((product, idx) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors"
                >
                  <span className="text-[10px] font-black text-gray-300 w-5 shrink-0">#{idx + 1}</span>
                  <div className="w-12 h-12 shrink-0 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center p-1.5">
                    <img src={product.image} alt={product.title} className="w-full h-full object-contain mix-blend-multiply" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{product.title}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{product.unit} · ৳{product.price}</p>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 text-orange-600 rounded-full text-[9px] font-bold uppercase tracking-widest border border-orange-100">
                    <Star className="w-2.5 h-2.5 fill-orange-400" /> Featured
                  </span>
                  <button
                    onClick={() => handleRemove(product._id, product.title)}
                    disabled={removing === product._id}
                    className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all disabled:opacity-50 shrink-0"
                    title="Remove from popular"
                  >
                    {removing === product._id
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <Trash2 className="h-4 w-4" />
                    }
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Search & Add Products */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
          <Search className="h-4 w-4 text-gray-400" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Search & Add Products</h3>
        </div>
        <div className="p-6 space-y-5">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by name..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-100 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-4 focus:ring-orange-50 focus:border-orange-400 transition-all placeholder:text-gray-300"
              />
              {search && (
                <button type="button" onClick={() => { setSearch(''); setSearchQuery(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm shadow-orange-200"
            >
              Search
            </button>
          </form>

          {/* Search Results */}
          {searchQuery && (
            <div>
              {searchLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-7 w-7 text-orange-500 animate-spin" />
                </div>
              ) : allProducts.length === 0 ? (
                <p className="text-center text-sm text-gray-400 font-semibold py-8">No products found for "{searchQuery}"</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {allProducts.map(product => {
                    const isFeatured = featuredIds.has(product._id?.toString());
                    return (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all"
                      >
                        <div className="w-12 h-12 shrink-0 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center p-1.5">
                          <img src={product.image} alt={product.title} className="w-full h-full object-contain mix-blend-multiply" loading="lazy" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{product.title}</p>
                          <p className="text-[10px] text-gray-400 font-medium">৳{product.price} · {product.unit}</p>
                        </div>
                        {isFeatured ? (
                          <span className="flex items-center gap-1 text-[9px] font-black text-orange-500 uppercase tracking-widest px-2.5 py-1.5 bg-orange-50 border border-orange-200 rounded-full shrink-0">
                            <Star className="w-2.5 h-2.5 fill-orange-400" /> Added
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAdd(product)}
                            disabled={adding === product._id}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest transition-all shrink-0 disabled:opacity-50 shadow-sm"
                          >
                            {adding === product._id
                              ? <Loader2 className="h-3 w-3 animate-spin" />
                              : <Plus className="h-3 w-3" />
                            }
                            Add
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ManageFeatured;

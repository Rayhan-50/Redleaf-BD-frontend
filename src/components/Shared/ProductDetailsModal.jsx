import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Share2, Plus, Minus, Check, ShoppingCart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import ProductCard from './ProductCard';

const ProductDetailsModal = ({ product, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const [, refetchCart] = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Details');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('wishlist')) || [];
      if (stored.includes(product?._id)) setIsWishlisted(true);
    } catch {}
  }, [product?._id]);

  const { data: relatedProducts = [], isLoading } = useQuery({
    queryKey: ['related-products', product?.category, product?._id],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/products?category=${encodeURIComponent(product.category)}&limit=5`);
        return (res.data?.products || []).filter(p => p._id !== product._id).slice(0, 4);
      } catch (err) { return []; }
    },
    enabled: !!product?.category
  });

  if (!product) return null;

  const handleAddToCart = async () => {
    if (!user && location.pathname) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Access granted after secure login.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#111827',
        confirmButtonText: 'Secure Login'
      }).then((result) => {
        if (result.isConfirmed) navigate('/login', { state: { from: location } });
      });
      return;
    }
    
    setAddingToCart(true);
    const cartItem = {
      productId: product._id,
      email: user.email,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity,
      unit: product.unit
    };
    
    try {
      await axiosSecure.post('/carts', cartItem);
      Swal.fire({
        icon: 'success',
        title: 'Added to Cart',
        text: `${product.title} has been added to your cart.`,
        showConfirmButton: false,
        timer: 1500,
        position: 'center'
      });
      refetchCart();
      onClose();
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to add product to cart.' });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = () => {
    try {
      let stored = JSON.parse(localStorage.getItem('wishlist')) || [];
      if (isWishlisted) {
        stored = stored.filter(id => id !== product._id);
        setIsWishlisted(false);
        Swal.fire({ toast: true, position: 'bottom-end', icon: 'info', title: 'Removed from Wishlist', showConfirmButton: false, timer: 2000 });
      } else {
        stored.push(product._id);
        setIsWishlisted(true);
        Swal.fire({ toast: true, position: 'bottom-end', icon: 'success', title: 'Added to Wishlist', showConfirmButton: false, timer: 2000 });
      }
      localStorage.setItem('wishlist', JSON.stringify(stored));
    } catch (err) {}
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/products/${product._id}`);
      Swal.fire({ toast: true, position: 'bottom-end', icon: 'success', title: 'Link Copied', showConfirmButton: false, timer: 2000 });
    } catch (error) {}
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-gray-900/80 backdrop-blur-md flex justify-center items-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-none sm:rounded-2xl shadow-2xl w-full max-w-5xl h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto no-scrollbar relative flex flex-col"
      >
        <button 
          onClick={onClose} 
          className="absolute right-3 top-3 sm:right-4 sm:top-4 md:right-6 md:top-6 z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl sm:rounded-2xl bg-gray-50/80 text-gray-500 hover:bg-red-600 hover:text-white transition-all shadow-sm group backdrop-blur-md"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 sm:p-6 md:p-8">
          <div className="flex flex-col gap-4">
            <div className="w-full aspect-square sm:aspect-[4/3] md:aspect-square bg-gray-50/50 rounded-2xl relative flex items-center justify-center p-4 border border-gray-100 group overflow-hidden">
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" 
              />
            </div>
            <div className="hidden sm:flex gap-3 overflow-x-auto no-scrollbar">
              <div className="w-16 h-16 shrink-0 border-2 border-red-600 rounded-lg overflow-hidden cursor-pointer p-1 bg-white">
                <img src={product.image} alt="thumb-1" className="w-full h-full object-cover mix-blend-multiply rounded" />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full w-fit mb-3">
              Premium Collection
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-4">
              {product.title}
            </h2>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl sm:text-3xl font-bold text-red-600">৳{product.price}</span>
              {product.originalPrice > product.price && (
                <div className="flex items-center gap-2">
                  <span className="text-lg text-gray-400 line-through">৳{product.originalPrice}</span>
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              <div className="px-3 py-1.5 bg-gray-100 text-gray-800 text-xs font-medium rounded-lg">
                Unit: {product.unit || 'Standard'}
              </div>
              <div className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 ${product.inStock !== false ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {product.inStock !== false ? <Check size={14} /> : <X size={14} />}
                {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>

            {/* Procurement Strategy */}
            <div className="flex flex-col gap-4 mt-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                {/* Quantity Command */}
                <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl overflow-hidden w-full sm:w-32 h-12 flex-shrink-0">
                  <button 
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(q => q - 1)} 
                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="flex-1 text-center font-semibold text-gray-900">
                    {quantity}
                  </div>
                  <button 
                    onClick={() => setQuantity(q => q + 1)} 
                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Primary Action */}
                <button 
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.inStock === false}
                  className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
                >
                  {addingToCart ? (
                    <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>

              {/* Auxiliary Operations */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleWishlist}
                  className={`h-10 flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all
                    ${isWishlisted ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}
                  `}>
                  <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} /> 
                  {isWishlisted ? 'Saved' : 'Wishlist'}
                </button>
                <button 
                  onClick={handleShare}
                  className="h-10 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-medium transition-all"
                >
                  <Share2 size={16} /> Share
                </button>
              </div>
            </div>

            {/* Specifications Ledger */}
            <div className="border-t border-gray-100 pt-6">
              <div className="flex gap-6 border-b border-gray-100">
                {['Highlights', 'Details'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === tab ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
                    )}
                  </button>
                ))}
              </div>
              <div className="py-4 text-sm text-gray-600 leading-relaxed min-h-[100px]">
                {activeTab === 'Highlights' && (
                   product.highlights ? <div dangerouslySetInnerHTML={{__html: product.highlights}} /> : <p>Highlights are currently unavailable.</p>
                )}
                {activeTab === 'Details' && (
                   product.description ? <div className="whitespace-pre-wrap">{product.description}</div> : <p>Product description is currently unavailable.</p>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Global Catalog Integration */}
        <div className="bg-gray-50/50 border-t border-gray-100 p-4 sm:p-6 md:p-12">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">Recommended Products</h3>
             <Link to="/products" className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:underline">View All Products</Link>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-10"><div className="animate-spin w-8 h-8 border-4 border-red-100 border-t-red-600 rounded-full" /></div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(rp => (
                <ProductCard key={rp._id} product={rp} disableHoverAnimation={true} />
              ))}
            </div>
          ) : (
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center py-10">No related products found.</p>
          )}
        </div>

      </motion.div>
    </motion.div>
  );
};

export default ProductDetailsModal;

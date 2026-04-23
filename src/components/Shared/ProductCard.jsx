import React, { useState } from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import ProductDetailsModal from './ProductDetailsModal';
import { useQueryClient, useMutation } from '@tanstack/react-query';

const ProductCard = ({ product, disableHoverAnimation }) => {
  const { title, image, price, originalPrice, discountPercent, unit } = product;
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (cartItem) => {
      return axiosSecure.post('/carts', cartItem);
    },
    onMutate: async (newCartItem) => {
      await queryClient.cancelQueries({ queryKey: ['cart', user?.email] });
      const previousCart = queryClient.getQueryData(['cart', user?.email]);
      
      queryClient.setQueryData(['cart', user?.email], (old) => {
        return [...(old || []), { ...newCartItem, _id: Date.now().toString() }];
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Added to Cart',
        text: `${product.title} has been added to your cart.`,
        showConfirmButton: false,
        timer: 1500,
        position: 'top-end',
        toast: true,
      });
      
      return { previousCart };
    },
    onError: (err, newCartItem, context) => {
      queryClient.setQueryData(['cart', user?.email], context?.previousCart);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to add item to cart.' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.email] });
    }
  });

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user && location.pathname) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please login to add items to cart.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Login'
      }).then((result) => {
        if (result.isConfirmed) navigate('/login', { state: { from: location } });
      });
      return;
    }
    
    const cartItem = {
      productId: product._id,
      email: user.email,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
      unit: product.unit
    };
    
    mutation.mutate(cartItem);
  };

  return (
    <>
      <motion.div
        whileHover={disableHoverAnimation ? {} : { y: -6 }}
        onClick={() => setIsModalOpen(true)}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-red-50 hover:border-red-100 transition-all duration-300 overflow-hidden group flex flex-col h-full cursor-pointer relative"
      >
        {/* Modern Discount Badge */}
        {discountPercent && (
          <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
            {discountPercent}% OFF
          </div>
        )}

        {/* Image Area - Fixed shorter height */}
        <div className="relative bg-[#f8f9fa] flex items-center justify-center p-4 h-36 sm:h-40 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        </div>

        {/* Content Area */}
        <div className="px-3 py-3 flex flex-col flex-1 gap-1.5">
          {/* Title - Clean & Concise */}
          <h4 className="font-semibold text-gray-800 text-[13px] sm:text-sm leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-red-600 transition-colors">
            {title}
          </h4>

          {/* Unit Tag */}
          <div className="text-[11px] text-gray-400 font-medium tracking-wide uppercase">
            {unit || 'Standard Unit'}
          </div>

          <div className="mt-auto flex items-end justify-between pt-3 border-t border-gray-50">
            {/* Price Block */}
            <div className="flex flex-col">
              {originalPrice > price && (
                <span className="text-[11px] text-gray-300 line-through mb-0.5 font-medium">৳{originalPrice}</span>
              )}
              <span className="text-base sm:text-lg font-black text-gray-900 leading-none">৳{price}</span>
            </div>

            {/* Premium Pill-shaped Add Button */}
            <button
              onClick={handleAddToCart}
              disabled={mutation.isPending || product.inStock === false}
              className="group/btn h-9 px-3 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white flex items-center gap-1.5 transition-all duration-300 disabled:opacity-50 shadow-sm"
            >
              {mutation.isPending ? (
                <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <>
                  <span className="text-[11px] font-bold uppercase tracking-wider hidden sm:inline">Add</span>
                  <Plus size={16} strokeWidth={3} />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <ProductDetailsModal product={product} onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductCard;

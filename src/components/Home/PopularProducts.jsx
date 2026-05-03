import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import ProductCard from '../Shared/ProductCard';
import { Loader2, ChevronRight } from 'lucide-react';

const PopularProducts = () => {
  const axiosPublic = useAxiosPublic();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const res = await axiosPublic.get('/featured-products');
      return res.data || [];
    },
    staleTime: 1000 * 60 * 2, // 2 min — matches backend cache TTL
  });

  return (
    <section className="py-10 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #fff8f0 0%, #ffffff 50%, #f0fdf4 100%)' }}
    >
      {/* Decorative background circles */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-[0.04] bg-red-500 pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-[0.04] bg-[#0A3D2A] pointer-events-none" />

      <div className="w-full px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-row items-center justify-between mb-7 gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-red-500 to-orange-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-bold text-orange-500 uppercase tracking-widest mb-0.5 truncate">Redleaf-BD</p>
              <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-tight truncate">
                Most Popular Items
              </h3>
            </div>
          </div>
          <Link
            to="/products"
            className="shrink-0 flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all shadow-md hover:shadow-lg whitespace-nowrap"
          >
            See All <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Link>
        </div>

        {/* Product Cards */}
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="animate-spin text-red-500 h-8 w-8" />
          </div>
        ) : products.length > 0 ? (
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x md:grid md:grid-cols-3 lg:grid-cols-6 md:overflow-visible">
            {products.map((product) => (
              <div
                key={product._id}
                className="min-w-[185px] md:min-w-0 snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10 font-semibold bg-white/60 rounded-2xl border border-orange-100 p-8">
            No popular products available right now.
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default PopularProducts;

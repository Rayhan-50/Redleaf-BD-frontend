import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import ProductCard from '../Shared/ProductCard';
import { Loader2, ChevronRight } from 'lucide-react';

const CategorySection = ({ title, categorySlug, dbCategory, bgStyle, accentFrom = '#dc2626', accentTo = '#ea580c' }) => {
  const axiosPublic = useAxiosPublic();

  const { data: result = { products: [] }, isLoading } = useQuery({
    queryKey: ['category-products', categorySlug],
    queryFn: async () => {
      // Use exact dbCategory if provided, otherwise fallback to title
      const backendCategory = dbCategory || title;
      const res = await axiosPublic.get(`/products?category=${encodeURIComponent(backendCategory)}&limit=6`);
      return res.data || { products: [] };
    },
  });

  const products = result.products || [];

  return (
    <section className="py-8 relative overflow-hidden" style={bgStyle || { background: '#ffffff' }}>
      <div className="w-full px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-row items-center justify-between mb-6 gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-1.5 h-8 rounded-full shrink-0" style={{ background: `linear-gradient(to bottom, ${accentFrom}, ${accentTo})` }} />
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-tight truncate">
              {title}
            </h3>
          </div>
          <Link
            to={`/products?cat=${categorySlug}`}
            className="shrink-0 flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 transition-colors whitespace-nowrap"
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
          <div className="text-center text-gray-400 py-8 font-semibold bg-white/60 rounded-2xl border border-gray-100 p-6">
            Coming soon...
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

export default CategorySection;

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import useAxiosPublic from '../hooks/useAxiosPublic';
import ProductCard from '../components/Shared/ProductCard';
import { Package, Search, ChevronRight, LayoutGrid, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TbPlant, TbMeat, TbSoup, TbBottle, TbPepper, TbLeaf, TbCup, TbLemon, TbApple, TbDeviceLaptop, TbShirt, TbRun, TbGrain } from 'react-icons/tb';

const categories = [
  { id: 'all', name: 'All Products', icon: <LayoutGrid className="w-5 h-5" />, slug: 'all' },
  { id: 'honey', name: 'Honey', icon: <TbSoup className="w-5 h-5" />, slug: 'honey' },
  { id: 'meat', name: 'Poultry & Meat', icon: <TbMeat className="w-5 h-5" />, slug: 'meat' },
  { id: 'rice', name: 'Rice & Grains', icon: <TbPlant className="w-5 h-5" />, slug: 'rice' },
  { id: 'oil', name: 'Oil', icon: <TbBottle className="w-5 h-5" />, slug: 'oil' },
  { id: 'spices', name: 'Spices', icon: <TbPepper className="w-5 h-5" />, slug: 'spices' },
  { id: 'superfoods', name: 'Super Foods', icon: <TbLeaf className="w-5 h-5" />, slug: 'superfoods' },
  { id: 'tea', name: 'Tea & Snacks', icon: <TbCup className="w-5 h-5" />, slug: 'tea' },
  { id: 'nuts', name: 'Nuts & Dates', icon: <TbGrain className="w-5 h-5" />, slug: 'nuts' },
  { id: 'pickles', name: 'Pickle', icon: <TbLemon className="w-5 h-5" />, slug: 'pickles' },
  { id: 'fruits', name: 'Fruits & Veg', icon: <TbApple className="w-5 h-5" />, slug: 'fruits' },
  { id: 'electronics', name: 'Electronics', icon: <TbDeviceLaptop className="w-5 h-5" />, slug: 'electronics' },
  { id: 'shoes', name: 'Shoes', icon: <TbRun className="w-5 h-5" />, slug: 'shoes' },
  { id: 'clothing', name: 'Clothing', icon: <TbShirt className="w-5 h-5" />, slug: 'clothing' },
];

const AllProducts = () => {
  const axiosPublic = useAxiosPublic();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Handle category and search from URL search params
  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory('all');
    }

    const querySearch = searchParams.get('search');
    if (querySearch !== null) {
      setSearch(querySearch);
    }
  }, [searchParams]);

  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: result = { products: [] }, isLoading } = useQuery({
    queryKey: ['public-products', debouncedSearch, selectedCategory],
    queryFn: async () => {
      const catObj = categories.find(c => c.slug === selectedCategory);
      const backendCategory = catObj ? catObj.name : selectedCategory;
      const categoryParam = selectedCategory !== 'all' ? `&category=${encodeURIComponent(backendCategory)}` : '';
      const res = await axiosPublic.get(`/products?limit=100${categoryParam}`);
      return res.data || { products: [] };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const rawProducts = result.products || [];

  const products = rawProducts.filter(p => {
    if (!debouncedSearch) return true;
    const term = debouncedSearch.toLowerCase().trim();
    
    const dict = {
      'honey': 'মধু', 'meat': 'গোশত', 'beef': 'গরু', 'chicken': 'মুরগি', 'rice': 'চাল',
      'oil': 'তেল', 'spice': 'মসলা', 'tea': 'চা', 'ghee': 'ঘি', 'milk': 'দুধ', 'mango': 'আম',
      'pickle': 'আচার', 'date': 'খেজুর', 'nut': 'বাদাম', 'water': 'পানি', 'sugar': 'চিনি',
      'salt': 'লবণ', 'egg': 'ডিম', 'fish': 'মাছ', 'veg': 'সবজি', 'fruit': 'ফল', 'cow': 'গরু'
    };
    
    let translatedTerm = term;
    for (const [en, bn] of Object.entries(dict)) {
      if (term.includes(en)) {
        translatedTerm = bn;
        break;
      }
    }

    return (
      (p.title && p.title.toLowerCase().includes(term)) ||
      (p.title && p.title.includes(translatedTerm)) ||
      (p.category && p.category.toLowerCase().includes(term)) ||
      (p.description && p.description.toLowerCase().includes(term))
    );
  });

  const handleCategorySelect = (slug) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', slug);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="w-full flex-1">
        
        {/* Top Header Area - Full Width Red Background */}
        <div className="w-full bg-gradient-to-r from-red-700 via-red-600 to-red-800 relative overflow-hidden mb-8 shadow-lg">
          {/* Design Texture - Subtle White Dot Grid (Visible on Red) */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.1]"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="container mx-auto px-4 py-12 lg:py-16 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-black text-white border-l-8 border-yellow-400 pl-4 uppercase tracking-tight">
                  {selectedCategory === 'all' ? 'Our Store' : categories.find(c => c.slug === selectedCategory)?.name}
                </h1>
                <p className="text-red-50 pl-4 text-base font-semibold tracking-wide opacity-90">
                  Premium Quality Natural & Organic Products
                </p>
              </div>

              {/* Yellow Search Bar */}
              <div className="relative w-full lg:w-[450px] group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-800" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={e => {
                    setSearch(e.target.value);
                    const newParams = new URLSearchParams(searchParams);
                    if (e.target.value) {
                      newParams.set('search', e.target.value);
                    } else {
                      newParams.delete('search');
                    }
                    setSearchParams(newParams, { replace: true });
                  }}
                  className="w-full pl-14 pr-6 py-4 rounded-2xl border-none bg-yellow-400 shadow-xl focus:outline-none focus:ring-4 focus:ring-yellow-300 ring-0 transition-all text-sm font-black text-gray-900 placeholder:text-gray-700"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch gap-4 px-0 md:px-4 lg:px-6">
          
          {/* Sidebar - Desktop (Matching HeroBanner) */}
          <aside className="hidden lg:flex flex-col w-72 shrink-0 bg-white rounded-none shadow-sm border border-gray-100 overflow-hidden sticky top-28 h-fit">
            <div className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white font-bold text-sm uppercase tracking-wider">
              <Menu className="w-4 h-4" />
              Shop By Category
            </div>
            <div className="flex flex-col divide-y divide-gray-100 flex-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors group
                    ${selectedCategory === cat.slug ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-red-50 hover:text-red-600'}`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`${selectedCategory === cat.slug ? 'text-red-600' : 'text-red-500 group-hover:scale-110 transition-transform'}`}>
                      {cat.icon}
                    </span>
                    <span className="leading-tight group-hover:translate-x-1 transition-transform">{cat.name}</span>
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-all ${selectedCategory === cat.slug ? 'opacity-100' : 'opacity-20 group-hover:opacity-100'}`} />
                </button>
              ))}
            </div>
          </aside>

          {/* Mobile Categories - Horizontal Scroll */}
          <div className="lg:hidden -mx-4 px-4 mb-8">
             <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar scroll-smooth">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`whitespace-nowrap flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all font-bold text-sm ${
                      selectedCategory === cat.slug
                        ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-200'
                        : 'bg-white border-transparent text-gray-600 shadow-sm'
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
             </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 min-h-[400px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Freshness...</p>
              </div>
            ) : products.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[3rem] border-2 border-dashed border-gray-100 p-20 text-center flex flex-col items-center justify-center shadow-inner"
              >
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-200">
                  <Package className="h-12 w-12" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">No Products Today</h3>
                <p className="text-gray-500 font-medium">We couldn't find items in this category.</p>
                <button 
                  onClick={() => handleCategorySelect('all')}
                  className="mt-8 text-red-600 font-bold hover:underline"
                >
                  View All Products instead
                </button>
              </motion.div>
            ) : (
              <AnimatePresence mode='wait'>
                <motion.div 
                  key={selectedCategory + search}
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 px-4 md:px-0"
                >
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;

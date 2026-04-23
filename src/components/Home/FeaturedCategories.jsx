import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TbPlant, TbMeat, TbSoup, TbBottle, TbPepper, TbLeaf, TbCup, TbLemon, TbApple, TbDeviceLaptop, TbShirt, TbRun, TbGrain } from 'react-icons/tb';

const categories = [
  { id: 1,  name: 'Honey',               icon: <TbSoup />,          slug: 'honey',       color: 'text-amber-600', bg: 'bg-amber-50',   border: 'border-amber-100' },
  { id: 2,  name: 'Poultry & Meat',       icon: <TbMeat />,          slug: 'meat',        color: 'text-rose-600',  bg: 'bg-rose-50',    border: 'border-rose-100' },
  { id: 3,  name: 'Rice & Grains',        icon: <TbPlant />,         slug: 'rice',        color: 'text-green-600', bg: 'bg-green-50',   border: 'border-green-100' },
  { id: 4,  name: 'Oil',                  icon: <TbBottle />,        slug: 'oil',         color: 'text-yellow-600',bg: 'bg-yellow-50',  border: 'border-yellow-100' },
  { id: 5,  name: 'Spices',               icon: <TbPepper />,        slug: 'spices',      color: 'text-red-600',   bg: 'bg-red-50',     border: 'border-red-100' },
  { id: 6,  name: 'Super Foods',          icon: <TbLeaf />,          slug: 'superfoods',  color: 'text-emerald-600',bg: 'bg-emerald-50',border: 'border-emerald-100' },
  { id: 7,  name: 'Tea & Snacks',         icon: <TbCup />,           slug: 'tea',         color: 'text-orange-600',bg: 'bg-orange-50', border: 'border-orange-100' },
  { id: 8,  name: 'Nuts & Dates',         icon: <TbGrain />,         slug: 'nuts',        color: 'text-amber-700', bg: 'bg-amber-100',  border: 'border-amber-200' },
  { id: 9,  name: 'Pickle',               icon: <TbLemon />,         slug: 'pickles',     color: 'text-lime-600',  bg: 'bg-lime-50',    border: 'border-lime-100' },
  { id: 10, name: 'Fruits & Veg',         icon: <TbApple />,         slug: 'fruits',      color: 'text-green-700', bg: 'bg-green-100',  border: 'border-green-200' },
  { id: 11, name: 'Electronics',          icon: <TbDeviceLaptop />,  slug: 'electronics', color: 'text-blue-600',  bg: 'bg-blue-50',    border: 'border-blue-100' },
  { id: 12, name: 'Shoes',                icon: <TbRun />,           slug: 'shoes',       color: 'text-purple-600',bg: 'bg-purple-50',  border: 'border-purple-100' },
  { id: 13, name: 'Clothing',             icon: <TbShirt />,         slug: 'clothing',    color: 'text-pink-600',  bg: 'bg-pink-50',    border: 'border-pink-100' },
];

const FeaturedCategories = () => {
  return (
    <section className="py-8 md:py-12 bg-white border-b border-gray-100">
      <div className="max-w-[1536px] w-full mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="space-y-1">
            <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase">
              Browse <span className="text-red-600">Categories</span>
            </h3>
            <p className="text-gray-500 font-medium text-xs md:text-sm">Discover our wide range of premium organic products</p>
          </div>
          <Link 
            to="/products" 
            className="group flex items-center gap-2 text-xs md:text-sm font-bold text-gray-900 hover:text-red-600 transition-colors bg-gray-50 px-4 py-2 rounded-full w-fit"
          >
            View All Store 
            <motion.span 
              animate={{ x: [0, 5, 0] }} 
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.span>
          </Link>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-13 gap-3 md:gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03, duration: 0.4 }}
            >
              <Link
                to={`/products?cat=${cat.slug}`}
                className="flex flex-col items-center group gap-2 md:gap-3"
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full ${cat.bg} ${cat.border} border border-dashed flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-red-100 group-hover:-translate-y-1 relative overflow-hidden group-hover:border-solid group-hover:border-red-200`}>
                   {/* Subtle hover overlay */}
                   <div className="absolute inset-0 bg-white/0 group-hover:bg-white/40 transition-colors" />
                   
                   <span className={`text-2xl md:text-3xl ${cat.color} transition-transform duration-500 group-hover:scale-110`}>
                      {cat.icon}
                   </span>
                </div>
                <span className="text-[10px] md:text-xs font-bold text-gray-700 text-center leading-tight group-hover:text-red-600 transition-colors px-1">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;

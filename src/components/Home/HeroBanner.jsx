import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TbPlant, TbMeat, TbSoup, TbBottle, TbPepper, TbLeaf, TbCup, TbLemon, TbApple, TbDeviceLaptop, TbShirt, TbRun, TbGrain } from 'react-icons/tb';

import heroImg1 from '../../assets/Gemini_Generated_Image_kplmc6kplmc6kplm.png';
import heroImg2 from '../../assets/Gemini_Generated_Image_malwljmalwljmalw.png';
import staticPromoImg from '../../assets/Gemini_Generated_Image_vrp6tvvrp6tvvrp6.png';
import bottomImg1 from '../../assets/10004.jpeg';
import bottomImg2 from '../../assets/10006.png';
import bottomImg3 from '../../assets/Gemini_Generated_Image_xs146axs146axs14.png';

const IconWrapper = ({ children }) => (
  <div className="text-red-500 bg-red-50 p-1.5 rounded-md flex items-center justify-center shrink-0">
    {children}
  </div>
);

const categories = [
  { id: 1,  name: 'Honey',               icon: <IconWrapper><TbSoup className="w-4 h-4 stroke-[2]" /></IconWrapper>,         slug: '/products?cat=honey',      hasChildren: true },
  { id: 2,  name: 'Poultry & Meat',       icon: <IconWrapper><TbMeat className="w-4 h-4 stroke-[2]" /></IconWrapper>,         slug: '/products?cat=meat',       hasChildren: true },
  { id: 3,  name: 'Rice, Pulse & Grains', icon: <IconWrapper><TbPlant className="w-4 h-4 stroke-[2]" /></IconWrapper>,        slug: '/products?cat=rice',       hasChildren: true },
  { id: 4,  name: 'Oil',                  icon: <IconWrapper><TbBottle className="w-4 h-4 stroke-[2]" /></IconWrapper>,       slug: '/products?cat=oil',        hasChildren: true },
  { id: 5,  name: 'Spices',               icon: <IconWrapper><TbPepper className="w-4 h-4 stroke-[2]" /></IconWrapper>,       slug: '/products?cat=spices',     hasChildren: true },
  { id: 6,  name: 'Super Foods',          icon: <IconWrapper><TbLeaf className="w-4 h-4 stroke-[2]" /></IconWrapper>,         slug: '/products?cat=superfoods', hasChildren: true },
  { id: 7,  name: 'Tea, Snacks & Drinks', icon: <IconWrapper><TbCup className="w-4 h-4 stroke-[2]" /></IconWrapper>,          slug: '/products?cat=tea',        hasChildren: true },
  { id: 8,  name: 'Nuts & Dates',         icon: <IconWrapper><TbGrain className="w-4 h-4 stroke-[2]" /></IconWrapper>,        slug: '/products?cat=nuts',       hasChildren: true },
  { id: 9,  name: 'Pickle & Chutney',     icon: <IconWrapper><TbLemon className="w-4 h-4 stroke-[2]" /></IconWrapper>,        slug: '/products?cat=pickles',    hasChildren: true },
  { id: 10, name: 'Fruits & Vegetables',  icon: <IconWrapper><TbApple className="w-4 h-4 stroke-[2]" /></IconWrapper>,        slug: '/products?cat=fruits',     hasChildren: true },
  { id: 11, name: 'Electronics',          icon: <IconWrapper><TbDeviceLaptop className="w-4 h-4 stroke-[2]" /></IconWrapper>, slug: '/products?cat=electronics', hasChildren: true },
  { id: 12, name: 'Shoes',                icon: <IconWrapper><TbRun className="w-4 h-4 stroke-[2]" /></IconWrapper>,          slug: '/products?cat=shoes',      hasChildren: true },
  { id: 13, name: 'Clothing',             icon: <IconWrapper><TbShirt className="w-4 h-4 stroke-[2]" /></IconWrapper>,        slug: '/products?cat=clothing',   hasChildren: true },
];

// Hero banner slides (top row - large)
const heroBannersTop = [
  {
    id: 1,
    bg: 'bg-gradient-to-br from-[#e8f5e9] via-[#f1f8e9] to-[#fff8e1]',
    label: '🌿 Built on Purity',
    title: "Fresh From\nNature's Heart",
    subtitle: 'প্রকৃতির সেরা সংকলন',
    badge: '11 Years',
    badgeSub: 'of Commitment',
    stats: [
      { value: '26+', label: 'Products' },
      { value: '400K+', label: 'Customers' },
      { value: '50+', label: 'Corporate Clients' },
    ],
    img: heroImg1,
    accentColor: '#0A3D2A',
    textColor: 'text-[#0A3D2A]',
  },
  {
    id: 2,
    bg: 'bg-gradient-to-br from-[#fff8e1] via-[#ffe0b2] to-[#fff3e0]',
    label: '🔥 Exclusive Offer',
    title: 'খাঁটি পণ্যে\nবিশেষ ছাড়',
    subtitle: '১১ বছর পূর্তি উপলক্ষে',
    badge: '১১%',
    badgeSub: 'পর্যন্ত ছাড়',
    stats: [],
    img: heroImg2,
    accentColor: '#e63946',
    textColor: 'text-red-600',
  },
];

// Bottom banner row (smaller)
const heroBannersBottom = [
  {
    id: 3,
    bg: 'bg-gradient-to-br from-[#e8f5e9] to-[#f1f8e9]',
    title: 'বিশুদ্ধ দুধে',
    subtitle: 'পুষ্টির নিশ্চয়তা',
    img: bottomImg1,
    accentColor: '#0A3D2A',
    textColor: 'text-[#0A3D2A]',
    wide: false,
  },
  {
    id: 4,
    bg: 'bg-gradient-to-br from-[#fff8e1] to-[#ffe0b2]',
    title: 'সুগন্ধি চিনিগুড়া চাল',
    subtitle: 'স্পেশাল রান্নার জন্য',
    img: bottomImg2,
    accentColor: '#0A3D2A',
    textColor: 'text-[#0A3D2A]',
    wide: false,
  },
  {
    id: 5,
    bg: 'bg-gradient-to-br from-[#fce4ec] to-[#ffecec]',
    title: 'দেশি গরুর গোশত',
    subtitle: 'হালাল ভাবে জবাইকৃত',
    img: bottomImg3,
    accentColor: '#e63946',
    textColor: 'text-red-600',
    wide: false,
  },
];

const HeroBanner = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [topSlide, setTopSlide] = useState(0);

  const nextSlide = () => setTopSlide((s) => (s + 1) % heroBannersTop.length);
  const prevSlide = () => setTopSlide((s) => (s - 1 + heroBannersTop.length) % heroBannersTop.length);

  const active = heroBannersTop[topSlide];

  return (
    <section className="w-full bg-gray-50">
      <div className="w-full py-2 px-4 md:px-6 lg:pl-0 lg:pr-6">
        <div className="flex flex-col lg:flex-row items-stretch gap-3 lg:h-[500px] xl:h-[600px]">

          {/* ── Left Category Sidebar ── */}
          <aside className="hidden lg:flex flex-col w-72 shrink-0 bg-white rounded-none shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white font-bold text-sm uppercase tracking-wider">
              <Menu className="w-4 h-4" />
              Shop By Category
            </div>
            <div className="flex flex-col divide-y divide-gray-100 flex-1 min-h-0 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {categories.map((cat) => (
                <Link
                  to={cat.slug}
                  key={cat.id}
                  onMouseEnter={() => setActiveCategory(cat.id)}
                  onMouseLeave={() => setActiveCategory(null)}
                  className={`flex items-center justify-between px-3 md:px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors group
                    ${activeCategory === cat.id ? 'bg-red-50 text-red-600' : 'hover:bg-red-50 hover:text-red-600'}`}
                >
                  <span className="flex items-center gap-3">
                    {cat.icon}
                    <span className="leading-tight group-hover:translate-x-1 transition-transform">{cat.name}</span>
                  </span>
                  {cat.hasChildren && (
                    <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity shrink-0" />
                  )}
                </Link>
              ))}
            </div>
          </aside>

          {/* ── Right Banner Area ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-3" style={{ minHeight: '100%' }}>

            {/* Top Banner Row */}
            <div className="flex-[3] flex flex-col md:flex-row gap-3">
              {/* Main Hero Slider */}
              <div className="relative rounded-xl overflow-hidden aspect-[16/9] md:aspect-auto md:flex-1 shadow-sm group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    <img
                      src={active.img}
                      alt={active.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Slider Controls */}
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-1.5 rounded-full shadow transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-1.5 rounded-full shadow transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                  {heroBannersTop.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTopSlide(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === topSlide ? 'bg-[#0A3D2A] w-4' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Secondary static promo banner — pure image card */}
              <Link to="/products" className="relative rounded-xl overflow-hidden aspect-[16/9] md:aspect-auto md:flex-1 shadow-sm block group">
                <img
                  src={staticPromoImg}
                  alt="Promotional Banner"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
            </div>

            {/* Bottom Banner Row — pure image cards */}
            <div className="flex-[2] flex flex-col sm:flex-row gap-3">
              {heroBannersBottom.map((banner) => (
                <motion.div
                  key={banner.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="relative rounded-xl overflow-hidden aspect-[16/9] sm:aspect-auto sm:flex-1 shadow-sm cursor-pointer group"
                >
                  <img
                    src={banner.img}
                    alt={banner.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

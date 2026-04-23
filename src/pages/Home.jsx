import React from 'react';
import HeroBanner from '../components/Home/HeroBanner';
import FeaturedCategories from '../components/Home/FeaturedCategories';
import PopularProducts from '../components/Home/PopularProducts';
import CategorySection from '../components/Home/CategorySection';
import AppPromo from '../components/Home/AppPromo';

function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden">
      <main className="flex-grow">
        {/* Hero: Category Sidebar + Banner Grid */}
        <HeroBanner />

        {/* Mobile-only category grid */}
        <FeaturedCategories />

        {/* Most Popular Items */}
        <PopularProducts />

        {/* Nuts & Dates */}
        <CategorySection
          title="Nuts & Dates"
          categorySlug="nuts-dates"
          dbCategory="Nuts & Dates"
          bgStyle={{ background: 'linear-gradient(135deg, #fff5f5 0%, #ffffff 50%, #fff8f0 100%)' }}
        />

        {/* Oil */}
        <CategorySection
          title="Oil"
          categorySlug="oil"
          dbCategory="Oil"
          bgStyle={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #fff8f0 100%)' }}
          accentFrom="#16a34a"
          accentTo="#22c55e"
        />

        {/* Tea, Snacks & Drinks */}
        <CategorySection
          title="Tea, Snacks & Drinks"
          categorySlug="tea"
          dbCategory="Tea & Snacks"
          bgStyle={{ background: 'linear-gradient(135deg, #fff8f0 0%, #ffffff 50%, #fef2f2 100%)' }}
          accentFrom="#ea580c"
          accentTo="#f59e0b"
        />

        {/* Fruits & Vegetables */}
        <CategorySection
          title="Fruits & Vegetables"
          categorySlug="fruits"
          dbCategory="Fruits & Veg"
          bgStyle={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #ecfdf5 100%)' }}
          accentFrom="#16a34a"
          accentTo="#4ade80"
        />
        {/* App Promo */}
        <AppPromo />
      </main>
    </div>
  );
}

export default Home;
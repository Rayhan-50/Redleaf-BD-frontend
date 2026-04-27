import React from 'react';
import { Search, ShoppingCart, User, Menu, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full shadow-md bg-[#0A3D2A] text-white">
      {/* Top micro bar */}
      <div className="hidden md:flex justify-between items-center px-4 py-1 text-xs border-b border-green-800 bg-[#072F20]">
        <div className="flex gap-4">
          <span>Call Us: +8809638898288</span>
          <span>Email: support@redleaf-bd.com</span>
        </div>
        <div className="flex gap-4">
          <Link to="/corporate" className="hover:text-red-400 transition-colors">Corporate</Link>
          <Link to="/impact" className="hover:text-red-400 transition-colors">Impact Stories</Link>
          <Link to="/blog" className="hover:text-red-400 transition-colors">Blog</Link>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <button className="md:hidden p-1 mr-2 text-white">
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            {/* Using a leaf-like symbol and text for logo since we don't have the image file */}
            <div className="w-8 h-8 rounded-full bg-red-600 outline-2 outline-white flex items-center justify-center rounded-tr-none shadow-lg">
              <span className="font-bold text-white text-lg leading-none">R</span>
            </div>
            <span className="font-bold text-2xl tracking-tight hidden sm:block">Redleaf<span className="text-red-500">-BD</span></span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
          <div className="w-full relative group">
            <input 
              type="text" 
              placeholder="পণ্য খুঁজুন..." 
              className="w-full py-2.5 pl-4 pr-12 rounded-lg text-gray-800 bg-white border-2 border-transparent focus:border-red-500 focus:outline-none shadow-sm transition-all text-sm font-medium"
            />
            <button className="absolute right-0 top-0 h-full px-4 text-gray-500 hover:text-[#0A3D2A] hover:bg-green-50 rounded-r-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link to="/login" className="flex items-center gap-2 hover:text-red-400 transition-colors">
            <div className="p-2 bg-green-800/50 rounded-full hover:bg-green-700 transition-colors">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="hidden lg:block text-sm font-medium">Login/Register</span>
          </Link>

          <Link to="/cart" className="flex items-center gap-2 hover:text-red-400 transition-colors relative group">
            <div className="p-2 bg-green-800/50 rounded-full group-hover:bg-green-700 transition-colors relative">
              <ShoppingCart className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-full ring-2 ring-[#0A3D2A]">
                3
              </span>
            </div>
            <span className="hidden lg:block text-sm font-medium">Cart</span>
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar - Visible only on small screens */}
      <div className="md:hidden px-4 pb-3">
        <div className="w-full relative">
          <input 
            type="text" 
            placeholder="পণ্য খুঁজুন..." 
            className="w-full py-2 pl-4 pr-10 rounded-md text-gray-800 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          />
          <button className="absolute right-0 top-0 h-full px-3 text-gray-500">
             <Search className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

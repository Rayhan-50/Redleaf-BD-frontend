import React, { useContext, useState } from 'react';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Providers/AuthProvider';
import useCart from '../../hooks/useCart';

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [cart] = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logOut().then(() => {
      navigate('/');
    });
  };

  const totalCartItems = cart?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

  return (
    <header className="sticky top-0 z-50 w-full shadow-md flex flex-col">
      {/* ── Top Main Header ── */}
      <div className="w-full text-gray-800 border-b-2 border-red-300/30 relative"
        style={{ background: 'linear-gradient(105deg, #ffffff 0%, #fff5f5 45%, #fff8f0 100%)' }}
      >
        {/* Subtle dot-grid texture */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(220,38,38,0.07) 1px, transparent 1px)',
            backgroundSize: '22px 22px'
          }}
        />
        <div className="relative w-full px-4 md:px-8 py-1 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1 text-gray-800 mr-2"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="flex items-center gap-2 md:mr-4">
              <img 
                src="https://ik.imagekit.io/2lax2ytm2/Logo-v1%20(1).png" 
                alt="Redleaf-BD Logo" 
                className="h-16 sm:h-24 w-auto object-contain transition-all"
              />
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative flex items-center w-full rounded-full border border-slate-700 p-[1px] bg-white shadow-sm overflow-hidden">
                <div className="flex w-full items-center rounded-full border border-red-500 bg-white p-[2px]">
                  <input 
                    type="text" 
                    placeholder="|পণ্য খুঁজুন..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2 pl-4 pr-2 bg-transparent border-none focus:outline-none text-sm text-gray-700 placeholder-gray-400"
                  />
                  <button type="submit" className="flex-shrink-0 h-9 w-9 flex items-center justify-center bg-[#FF2A3A] hover:bg-red-600 text-white rounded-full transition-colors shadow-sm ml-1">
                    <Search className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-3 sm:gap-6">
            {user ? (
              <div 
                className="relative cursor-pointer"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="flex items-center gap-2 hover:text-red-600 transition-colors">
                   <div className="p-1 bg-gray-200/50 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center w-9 h-9">
                     {user?.photoURL ? (
                       <img src={user.photoURL} alt="profile" className="w-full h-full rounded-full object-cover" />
                     ) : (
                        <User className="w-5 h-5 text-gray-700" />
                     )}
                   </div>
                   <span className="hidden lg:block text-sm font-medium overflow-hidden text-ellipsis max-w-[100px] whitespace-nowrap">
                     {user.displayName || 'Account'}
                   </span>
                </div>
                {/* Dropdown Menu */}
                 <div className={`absolute right-0 top-full mt-3 w-56 rounded-xl shadow-2xl bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 z-[100] border border-gray-100 ${isUserMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                    <div className="py-1">
                       <div className="px-4 py-2 border-b border-gray-100 mb-1">
                         <p className="text-sm font-medium text-gray-900 truncate">{user.displayName}</p>
                         <p className="text-xs text-gray-500 truncate">{user.email}</p>
                       </div>
                       <Link to="/dashboard" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600">Dashboard</Link>
                       <Link to="/dashboard/profile" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600">Profile</Link>
                       <button onClick={() => { setIsUserMenuOpen(false); handleLogout(); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 mt-1">Logout</button>
                    </div>
                 </div>
              </div>
            ) : (
               <Link to="/login" className="flex items-center gap-2 hover:text-red-600 transition-colors">
                 <div className="p-2 bg-gray-200/50 rounded-full hover:bg-gray-200 transition-colors">
                   <User className="w-5 h-5 text-gray-700" />
                 </div>
                 <span className="hidden lg:block text-sm font-medium">Login/Register</span>
               </Link>
            )}

            <Link to="/dashboard/my-bookings" state={{ tab: 'cart' }} className="flex items-center gap-2 hover:text-red-600 transition-colors relative group">
              <div className="p-2 bg-gray-200/50 rounded-full group-hover:bg-gray-200 transition-colors relative">
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-full ring-2 ring-[#F8F9FA]">
                  {totalCartItems}
                </span>
              </div>
              <span className="hidden lg:block text-sm font-medium">Cart</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar - Visible only on small screens */}
        <div className="md:hidden px-4 pb-3 mt-1">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative flex items-center w-full rounded-full border border-slate-700 p-[1px] bg-white shadow-sm overflow-hidden">
              <div className="flex w-full items-center rounded-full border border-red-500 bg-white p-[2px]">
                <input 
                  type="text" 
                  placeholder="|পণ্য খুঁজুন..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-1.5 pl-4 pr-2 bg-transparent border-none focus:outline-none text-sm text-gray-700 placeholder-gray-400"
                />
                <button type="submit" className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-[#FF2A3A] hover:bg-red-600 text-white rounded-full transition-colors shadow-sm ml-1">
                  <Search className="w-[14px] h-[14px]" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* ── Bottom Nav Bar ── */}
      <div className="w-full hidden md:block border-t border-red-200/40"
        style={{ background: 'linear-gradient(90deg, #fff5f5 0%, #ffffff 30%, #ffffff 70%, #fff8f0 100%)' }}
      >
        <div className="w-full px-4 md:px-8 flex items-center">
          {/* Navigation Links — centered */}
          <nav className="flex flex-1 items-center justify-center gap-8 font-semibold text-gray-800 text-sm py-3">
            <Link to="/products" className="hover:text-red-600 transition-colors">Products</Link>
            <Link to="/impact" className="hover:text-red-600 transition-colors">Impact Stories</Link>
            <Link to="/about" className="hover:text-red-600 transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-red-600 transition-colors">Contact Us</Link>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="absolute top-0 left-0 w-[280px] h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-red-50/50">
              <img 
                src="https://ik.imagekit.io/2lax2ytm2/Logo-v1%20(1).png" 
                alt="Redleaf-BD Logo" 
                className="h-10 w-auto object-contain"
              />
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white rounded-full text-gray-500 hover:text-red-600 shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="flex flex-col gap-2 px-4">
                <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-4 rounded-xl text-sm font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">Products</Link>
                <Link to="/impact" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-4 rounded-xl text-sm font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">Impact Stories</Link>
                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-4 rounded-xl text-sm font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">About Us</Link>
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-4 rounded-xl text-sm font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">Contact Us</Link>
              </nav>

              {!user && (
                <div className="mt-8 px-4 pt-4 border-t border-gray-100">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-bold">
                    <User className="w-4 h-4" /> Login / Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
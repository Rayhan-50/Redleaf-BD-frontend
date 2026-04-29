import React from 'react';
import { MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0A3D2A] text-gray-300 pt-16 pb-8 border-t-8 border-green-700 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center rounded-tr-none">
                <span className="font-bold text-white text-xl">R</span>
              </div>
              <span className="font-bold text-3xl text-white tracking-tight">Redleaf<span className="text-red-500">-BD</span></span>
            </div>
            <p className="text-sm leading-relaxed text-green-100">
              Redleaf-BD is Bangladesh's most trusted online grocery delivery platform. We bring organic, fresh, and handpicked daily necessities right to your door.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="https://www.facebook.com/share/1Nhgq1nMpP/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center hover:bg-red-500 text-white transition-colors"><FaFacebook size={16} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center hover:bg-red-500 text-white transition-colors"><FaTwitter size={16} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center hover:bg-red-500 text-white transition-colors"><FaInstagram size={16} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center hover:bg-red-500 text-white transition-colors"><FaYoutube size={16} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-5 mb-5 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-red-500">Quick Links</h4>
            <ul className="flex flex-col gap-3 text-sm font-medium">
              <li><Link to="/about" className="hover:text-red-400 transition-colors flex items-center gap-1 group"><ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100" /> About Us</Link></li>
              <li><Link to="/contact" className="hover:text-red-400 transition-colors flex items-center gap-1 group"><ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100" /> Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-red-400 transition-colors flex items-center gap-1 group"><ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100" /> Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-red-400 transition-colors flex items-center gap-1 group"><ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100" /> Terms & Conditions</Link></li>
              <li><Link to="/return" className="hover:text-red-400 transition-colors flex items-center gap-1 group"><ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100" /> Return Policy</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-lg mb-5 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-red-500">Top Categories</h4>
            <ul className="flex flex-col gap-3 text-sm font-medium">
               <li><a href="#" className="hover:text-white transition-colors">Pure Honey</a></li>
               <li><a href="#" className="hover:text-white transition-colors">Premium Rice & Grains</a></li>
               <li><a href="#" className="hover:text-white transition-colors">Mustard Oil</a></li>
               <li><a href="#" className="hover:text-white transition-colors">Organic Spices</a></li>
               <li><a href="#" className="hover:text-white transition-colors">Fresh Meat & Poultry</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-lg mb-5 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-red-500">Contact Us</h4>
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="text-red-500 mt-1 shrink-0" size={18} />
                <span>123 Green Valley Road, Block-B, Banani, Dhaka-1213</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-red-500 shrink-0" size={18} />
                <span>+8809638898288</span>
              </li>
              <li className="flex items-center gap-3">
                <FaWhatsapp className="text-[#25D366] shrink-0" size={18} />
                <span>+880 1816-126055</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-red-500 shrink-0" size={18} />
                <span>support@redleaf-bd.com</span>
              </li>
            </ul>
            
            {/* Apps placeholder */}
            <div className="mt-6">
               <p className="text-xs text-green-200 mb-2 font-semibold">Download our App</p>
               <div className="flex gap-2">
                 <div className="bg-gray-900 border border-gray-700 w-28 h-8 rounded shrink-0 flex items-center justify-center text-xs opacity-80 cursor-pointer hover:opacity-100 transition-opacity">Google Play</div>
                 <div className="bg-gray-900 border border-gray-700 w-28 h-8 rounded shrink-0 flex items-center justify-center text-xs opacity-80 cursor-pointer hover:opacity-100 transition-opacity">App Store</div>
               </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-green-800 text-center md:flex md:justify-between md:items-center text-xs text-green-400">
          <p>© {new Date().getFullYear()} Redleaf-BD. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex justify-center gap-4">
            <span className="font-medium">Secure Payments via SSLCommerz</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

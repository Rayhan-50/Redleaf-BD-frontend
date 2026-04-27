import React, { useState } from 'react';
import { MapPin, Mail, Phone, ArrowUpRight, ArrowUp, Send } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useAxiosPublic from '../../hooks/useAxiosPublic';

const Footer = () => {
  const axiosPublic = useAxiosPublic();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setError('');
    setSubscribed(false);
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }
    try {
      await axiosPublic.post('/contactCollection', {
        name: 'Newsletter Subscriber',
        email,
        message: 'Newsletter subscription request from footer',
      });
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    } catch {
      setError('Subscription failed. Please try again.');
    }
  };

  return (
    <footer className="mt-auto font-['Poppins'] w-full" style={{ background: '#ffffff' }}>

      {/* Red top accent bar */}
      <div className="w-full h-1.5 bg-gradient-to-r from-red-700 via-red-500 to-red-700" />

      {/* Subtle red texture strip */}
      <div className="w-full py-6 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ background: 'linear-gradient(90deg, #fff5f5 0%, #ffffff 50%, #fff5f5 100%)' }}>
        {/* Logo */}
        <img
          src="https://ik.imagekit.io/2lax2ytm2/Logo-v1%20(1).png"
          alt="Redleaf-BD Logo"
          className="h-14 w-auto object-contain"
        />
        {/* Tagline */}
        <p className="text-sm text-gray-500 text-center md:text-right max-w-md">
          Bangladesh's most trusted online grocery — fresh, organic & halal, delivered to your door.
        </p>
      </div>

      {/* Red divider */}
      <div className="w-full h-px bg-red-100" />

      {/* Main grid */}
      <div className="w-full px-6 md:px-12 pt-12 pb-8"
        style={{ background: 'linear-gradient(180deg, #fff 0%, #fff5f5 100%)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-500 leading-relaxed">
              Redleaf-BD brings organic, fresh, and handpicked daily necessities right to your door. We believe in quality, trust, and halal living.
            </p>
            <div className="flex gap-3 mt-1">
              <a href="https://www.facebook.com/share/1Nhgq1nMpP/" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-red-200 bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-600 hover:text-white hover:-translate-y-1 transition-all duration-300">
                  <FaFacebook size={15} />
                </a>
                {[FaTwitter, FaInstagram, FaYoutube].map((Icon, i) => (
                  <a key={i} href="#"
                    className="w-9 h-9 rounded-full border border-red-200 bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-600 hover:text-white hover:-translate-y-1 transition-all duration-300">
                    <Icon size={15} />
                  </a>
                ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 font-bold text-base mb-5 flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500" />
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-600">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact Us' },
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/terms', label: 'Terms & Conditions' },
                { to: '/return', label: 'Return Policy' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to}
                    className="hover:text-red-600 transition-colors flex items-center gap-1.5 group font-medium">
                    <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 text-red-500 transition-opacity" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-gray-900 font-bold text-base mb-5 flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500" />
              Top Categories
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-600">
              {['Honey', 'Poultry & Meat', 'Rice & Grains', 'Spices', 'Super Foods', 'Fruits & Vegetables'].map((cat) => (
                <li key={cat}>
                  <a href="#"
                    className="hover:text-red-600 transition-colors flex items-center gap-1.5 group font-medium">
                    <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 text-red-500 transition-opacity" />
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="flex flex-col gap-4">
            <h4 className="text-gray-900 font-bold text-base flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500" />
              Contact Us
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <MapPin className="text-red-500 mt-0.5 shrink-0" size={16} />
                <span>Banani, Dhaka-1213, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-red-500 shrink-0" size={16} />
                <span>+8809638898288</span>
              </li>
              <li className="flex items-center gap-3">
                <FaWhatsapp className="text-[#25D366] shrink-0" size={16} />
                <span>+880 1816-126055</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-red-500 shrink-0" size={16} />
                <span>support@redleaf-bd.com</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-2 bg-red-50 border border-red-100 p-4 rounded-xl">
              <h5 className="text-sm font-bold text-gray-800 mb-2">Subscribe to Newsletter</h5>
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  value={email}
                  disabled={subscribed}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-2.5 bg-white border border-red-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-red-500 transition text-sm disabled:opacity-50"
                  required
                />
                <button
                  type="submit"
                  disabled={subscribed}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-red-600 hover:bg-red-700 rounded-md text-white transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
              {subscribed && <p className="text-green-600 text-xs mt-2 font-medium">✨ Successfully subscribed!</p>}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-red-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} <span className="font-bold text-red-600">Redleaf-BD</span>. All rights reserved.</p>
          <p className="flex items-center gap-1">Secure Payments via <span className="font-bold text-gray-700 ml-1">SSLCommerz</span></p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full text-white text-xs font-semibold transition-all shadow-sm hover:shadow-md"
          >
            Back to Top <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom red bar */}
      <div className="w-full h-1 bg-gradient-to-r from-red-700 via-red-400 to-red-700" />
    </footer>
  );
};

export default Footer;
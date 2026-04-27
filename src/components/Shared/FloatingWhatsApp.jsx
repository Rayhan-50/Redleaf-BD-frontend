import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const FloatingWhatsApp = () => {
  const whatsappNumber = '8801816126055'; // From the image provided
  const message = 'Hello Redleaf-BD! I have an inquiry.';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-[9999] group flex items-center gap-3"
      aria-label="Contact us on WhatsApp"
    >
      {/* Tooltip/Label */}
      <div className="bg-white px-4 py-2 rounded-xl shadow-xl border border-gray-100 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Chat with us</p>
        <p className="text-sm font-bold text-[#25D366] whitespace-nowrap">WhatsApp Support</p>
      </div>

      {/* Pulsing Background */}
      <div className="relative">
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20 group-hover:opacity-40 transition-opacity" />
        
        {/* Main Button */}
        <div className="relative w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-2xl shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all duration-300">
          <FaWhatsapp size={32} />
          
          {/* Online Status Dot */}
          <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </a>
  );
};

export default FloatingWhatsApp;

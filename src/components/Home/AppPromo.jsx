import React from 'react';
import deliveryMan from '../../assets/delivery_man.png';

const AppPromo = () => {
  return (
    <section
      className="relative overflow-hidden min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex items-center"
      style={{
        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)', // Primarily Red
      }}
    >
      {/* Background Shapes */}
      {/* Top Left Dark Red Accent */}
      <div className="absolute top-0 left-0 w-64 h-64 md:w-[400px] md:h-[400px] bg-red-900 rounded-br-full pointer-events-none opacity-40 mix-blend-overlay" />
      
      {/* Right Side White Blob (To seamlessly blend the image's white background) */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[400px] md:w-[600px] md:h-[600px] bg-white rounded-tl-full rounded-bl-3xl translate-x-[10%] translate-y-[5%] pointer-events-none" />

      {/* Container */}
      <div className="w-full px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8 max-w-[1400px] mx-auto relative z-10">

        {/* LEFT */}
        <div className="flex-1 max-w-xl">
          <p className="text-xs font-black text-white/80 uppercase tracking-[0.2em] mb-4 drop-shadow-sm">
            Redleaf-BD App
          </p>

          <h2 className="text-3xl md:text-[44px] font-extrabold text-white leading-[1.1] mb-6 tracking-tight drop-shadow-sm">
            Make your online shop <br />
            <span className="text-yellow-400">
              easier with our mobile app
            </span>
          </h2>

          <p className="text-red-100 text-sm md:text-base leading-relaxed max-w-[90%]">
            Redleaf-BD makes online shopping fast and easy. Get groceries
            delivered and order the best of fresh, organic, and halal farm
            food — right at your doorstep.
          </p>

          {/* App Download Buttons (Visuals, linking nowhere for now) */}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <div className="flex items-center gap-3 bg-white text-gray-900 px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.18 23.76c.3.17.64.24.99.2l12.1-11.95L13.1 9 3.18 23.76z" fill="#EA4335"/>
                <path d="M20.93 10.45l-2.78-1.6-3.25 3.15 3.25 3.14 2.8-1.62c.8-.46.8-1.61-.02-2.07z" fill="#FBBC05"/>
                <path d="M3.18.24C2.88.4 2.67.7 2.67 1.1v21.8c0 .4.21.7.51.86L13.1 12 3.18.24z" fill="#34A853"/>
                <path d="M4.17.04 13.1 9 16.27 6.05 4.17.04z" fill="#4285F4"/>
              </svg>
              <div>
                <p className="text-[9px] font-bold uppercase text-gray-500 leading-none">Get it on</p>
                <p className="text-sm font-extrabold leading-tight">Google Play</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white text-gray-900 px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-gray-900" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div>
                <p className="text-[9px] font-bold uppercase text-gray-500 leading-none">Download on the</p>
                <p className="text-sm font-extrabold leading-tight">App Store</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex-1 relative min-h-[300px] md:min-h-[400px] lg:min-h-[500px]">
          <img 
            src={deliveryMan} 
            alt="Delivery Man" 
            className="absolute bottom-0 right-0 h-[130%] md:h-[140%] lg:h-[150%] w-auto object-contain translate-y-[15%]"
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>

      </div>
    </section>
  );
};

export default AppPromo;
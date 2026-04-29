import React from 'react';
import { Truck, ShieldCheck, PackageCheck, Box, CheckCircle2, Award } from 'lucide-react';

const Corporate = () => {
   return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
         {/* 1. Hero Section */}
         <section className="relative w-full h-[500px] flex items-center justify-start bg-gray-900">
            <div className="absolute inset-0 w-full h-full">
               <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?auto=format&fit=crop&w=1600&q=80"
                  alt="Corporate Bulk Shipping"
                  className="w-full h-full object-cover opacity-30"
               />
            </div>
            <div className="container mx-auto px-4 lg:px-12 relative z-10 text-white w-full">
               <div className="max-w-2xl bg-black/40 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
                  <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">Premium Food Solutions for Businesses</h1>
                  <p className="text-lg md:text-xl font-medium text-green-400 mb-6">Safe, Fresh & High-Quality Products for Your Growth</p>

                  <ul className="space-y-3">
                     <li className="flex items-center gap-2 text-sm md:text-base"><CheckCircle2 className="w-5 h-5 text-green-400" /> <strong>Custom Packaging</strong> – Tailored solutions to meet your business needs.</li>
                     <li className="flex items-center gap-2 text-sm md:text-base"><CheckCircle2 className="w-5 h-5 text-green-400" /> <strong>Uncompromised Quality</strong> – Strict quality control for purity and freshness.</li>
                     <li className="flex items-center gap-2 text-sm md:text-base"><CheckCircle2 className="w-5 h-5 text-green-400" /> <strong>In-House Delivery</strong> – Seamless logistics ensuring reliability.</li>
                     <li className="flex items-center gap-2 text-sm md:text-base"><CheckCircle2 className="w-5 h-5 text-green-400" /> <strong>On-Time Delivery</strong> – Commitment to punctuality for every order.</li>
                     <li className="flex items-center gap-2 text-sm md:text-base"><CheckCircle2 className="w-5 h-5 text-green-400" /> <strong>Scalable Supply</strong> – Supporting businesses of all sizes.</li>
                  </ul>
               </div>
            </div>
         </section>

         {/* 2. Gift Packages Section */}
         <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
               <div className="flex flex-col md:flex-row gap-6 justify-center">

                  {/* Package 1 */}
                  <div className="flex-1 relative rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-shadow">
                     <div className="absolute top-0 left-0 w-full bg-white text-black font-bold text-lg py-3 text-center z-10 shadow-sm border-b-4 border-[#0A3D2A] rounded-t-xl">
                        Gift for Stakeholders
                     </div>
                     <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80" alt="Gift Stakeholders" className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-500 mt-14" />
                     <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors mt-14" />
                  </div>

                  {/* Package 2 */}
                  <div className="flex-1 relative rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-shadow">
                     <div className="absolute top-0 left-0 w-full bg-white text-black font-bold text-lg py-3 text-center z-10 shadow-sm border-b-4 border-gray-600 rounded-t-xl">
                        Gift for Dealers
                     </div>
                     <img src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=600&q=80" alt="Gift Dealers" className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-500 mt-14" />
                     <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors mt-14" />
                  </div>

                  {/* Package 3 */}
                  <div className="flex-1 relative rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-shadow">
                     <div className="absolute top-0 left-0 w-full bg-white text-black font-bold text-lg py-3 text-center z-10 shadow-sm border-b-4 border-[#0A3D2A] rounded-t-xl">
                        Gift for Clients
                     </div>
                     <img src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=600&q=80" alt="Gift Clients" className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-500 mt-14" />
                     <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors mt-14" />
                  </div>

               </div>
            </div>
         </section>

         {/* 3. Why Choose Us Features */}
         <section className="py-16 bg-gray-50 border-y border-gray-200">
            <div className="container mx-auto px-4 max-w-6xl">
               <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12 tracking-tight">Why Choose Redleaf-BD Corporate?</h2>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FeatureCard
                     icon={<Box className="w-12 h-12 text-[#0A3D2A]" />}
                     title="Customized Corporate Rate"
                     description="Take advantage of best prices when purchasing in bulk from our extensive inventory of over 200+ products."
                  />
                  <FeatureCard
                     icon={<ShieldCheck className="w-12 h-12 text-[#0A3D2A]" />}
                     title="Safe and Fresh Products"
                     description="We diligently source fresh produce and our dedicated quality assurance team ensures that you consistently receive the finest."
                  />
                  <FeatureCard
                     icon={<PackageCheck className="w-12 h-12 text-[#0A3D2A]" />}
                     title="Customized Packaging"
                     description="We offer customers to personalize product packaging to their specific needs and preferences."
                  />
                  <FeatureCard
                     icon={<Truck className="w-12 h-12 text-[#0A3D2A]" />}
                     title="We deliver using our own vehicles"
                     description="We deliver ordered products using our own delivery vehicles at your preferred time ensuring peak safety."
                  />
                  <FeatureCard
                     icon={<CheckCircle2 className="w-12 h-12 text-[#0A3D2A]" />}
                     title="Halal Certified"
                     description="We are strict about sourcing completely Halal ingredients and have certification for specific categories."
                  />
                  <FeatureCard
                     icon={<Award className="w-12 h-12 text-[#0A3D2A]" />}
                     title="ISO Certified"
                     description="We operate under rigorous global ISO standard procedures for safety and management."
                  />
               </div>
            </div>
         </section>

         {/* 4. Corporate Clients (Dummy Grid) */}
         <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-6xl text-center">
               <h2 className="text-3xl font-bold text-gray-900 mb-12">Our Corporate Clients</h2>
               <div className="flex flex-wrap justify-center gap-8 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                  {/* We can just put some generic shapes or dummy client names for now to simulate the layout */}
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                     <div key={num} className="w-32 h-16 bg-gray-100 border border-gray-200 rounded flex flex-col items-center justify-center font-bold text-gray-400">
                        Partner {num}
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* 5. Contact CTA */}
         <section className="mt-auto bg-[#071E40] text-white py-16">
            <div className="container mx-auto px-4 text-center">
               <h2 className="text-3xl md:text-4xl font-bold mb-6">Want to be a Corporate Customer?</h2>
               <p className="text-lg text-gray-300 mb-2">Call us at <a href="tel:+8809638898288" className="text-white font-bold hover:underline">+8809638898288</a> (WhatsApp Available) or</p>
               <p className="text-lg text-gray-300 mb-8">Email us at <a href="mailto:contact@redleaf-bd.com" className="text-white font-bold hover:underline">contact@redleaf-bd.com</a></p>

               <button className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-10 rounded-full transition-colors shadow-xl shadow-green-900/50 hover:-translate-y-1 transform duration-200">
                  Request a Quote
               </button>
            </div>
         </section>

      </div>
   );
};

// Sub-component for features
const FeatureCard = ({ icon, title, description }) => (
   <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center flex flex-col items-center hover:shadow-lg transition-shadow">
      <div className="mb-6">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
   </div>
);

export default Corporate;
import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, ShieldCheck, Heart, Users, Target, TrendingUp, MapPin, Search, Leaf, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { value: '200K+', label: 'Customers Served', labelBn: 'সন্তুষ্ট গ্রাহক', icon: Users, color: 'text-red-600' },
  { value: '2500+', label: 'Verified Farmers', labelBn: 'সংযুক্ত কৃষক', icon: Sprout, color: 'text-green-600' },
  { value: '11', label: 'Cities Reached', labelBn: 'শহর ও জেলা', icon: MapPin, color: 'text-blue-600' },
  { value: '30+', label: 'Safety Tests', labelBn: 'মান নিয়ন্ত্রণ পরীক্ষা', icon: ShieldCheck, color: 'text-yellow-600' },
];

const farmerStories = [
  {
    name: 'Abdul Karim',
    location: 'Sirajganj',
    story: 'Previously, middlemen took most of the profit. Now with Redleaf-BD, I get fair prices and technical support for organic farming.',
    image: 'https://images.unsplash.com/photo-1595856455110-38e55e8c9735?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Rabeya Begum',
    location: 'Bogura',
    story: 'Redleaf-BD helped me convert my traditional farm into a tech-driven organic hub. My income has increased by 40%.',
    image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=400&q=80'
  }
];

const ImpactStories = () => {
  return (
    <div className="bg-white overflow-x-hidden font-['Poppins'] pt-10">
      
      {/* ── Section 1: Hero - Scaling the Vision ── */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-red-800 via-red-600 to-red-700 text-white flex items-center overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/10 rounded-full blur-[80px] -translate-x-1/4 translate-y-1/4 pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-white/20 border border-white/30 text-white text-xs md:text-sm font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full mb-8 backdrop-blur-md">
              আমাদের প্রভাব ও গল্প
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
              Scaling Safe Food <br /> <span className="text-yellow-400">Transforming Lives</span>
            </h1>
            <p className="text-red-50 text-lg md:text-xl max-w-3xl mx-auto font-medium opacity-90 mb-10 leading-relaxed">
              We are not just a grocery platform; we are a movement for formalin-free, 
              pure, and organic food that empowers farmers and protects families. 
              <span className="block mt-4 text-white italic">নিরাপদ খাদ্য ও সুস্থ জীবনের প্রতিশ্রুতি।</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Section 2: Empowering the Roots (Farmer Impact) ── */}
      <section className="py-24 px-4 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Empowering the Roots</h2>
            <p className="text-red-600 font-bold tracking-widest text-sm uppercase">কৃষকের উন্নয়ন, দেশের সমৃদ্ধি</p>
            <div className="w-20 h-1.5 bg-red-600 mx-auto mt-6 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {farmerStories.map((story, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-red-500/5 flex flex-col sm:flex-row group border border-gray-100"
              >
                <div className="sm:w-1/3 h-64 sm:h-auto overflow-hidden">
                  <img src={story.image} alt={story.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-2">
                    <MapPin size={14} /> {story.location}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4">{story.name}</h3>
                  <p className="text-gray-600 leading-relaxed italic">"{story.story}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: The Safety Shield (Quality & Health) ── */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 space-y-8"
            >
              <div className="space-y-4">
                <span className="text-red-600 font-black text-xs uppercase tracking-[0.3em] block">Safety First</span>
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
                  Our Toxin-Free <br /> Quality Shield
                </h2>
                <div className="w-20 h-1.5 bg-red-600 rounded-full" />
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                Adulteration is a silent killer. Redleaf-BD implements a multi-layer 
                traceability model that ensures every item is free from over 30 types of 
                harmful contaminants including formalin and pesticides.
              </p>
              
              <div className="space-y-4">
                {[
                   'Post-harvest loss reduction by 25%',
                   'Direct-from-farm cold chain logistics',
                   'Scientifically verified testing protocols',
                   'Fair price assurance for every producer'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-red-600 shrink-0" />
                    <span className="text-gray-900 font-bold">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
               <div className="bg-red-50 rounded-[4rem] p-8 md:p-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10 grid grid-cols-2 gap-8">
                    <div className="space-y-4 text-center">
                       <Search className="w-12 h-12 text-red-600 mx-auto" />
                       <p className="font-black text-gray-900 uppercase text-xs">Tracing Origins</p>
                    </div>
                    <div className="space-y-4 text-center">
                       <ShieldCheck className="w-12 h-12 text-red-600 mx-auto" />
                       <p className="font-black text-gray-900 uppercase text-xs">Purity Tests</p>
                    </div>
                    <div className="space-y-4 text-center">
                       <Leaf className="w-12 h-12 text-red-600 mx-auto" />
                       <p className="font-black text-gray-900 uppercase text-xs">Organic Standards</p>
                    </div>
                    <div className="space-y-4 text-center">
                       <TrendingUp className="w-12 h-12 text-red-600 mx-auto" />
                       <p className="font-black text-gray-900 uppercase text-xs">Social Growth</p>
                    </div>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Impact by Numbers ── */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Real People, Real Impact</h2>
              <div className="w-20 h-1.5 bg-red-600 mx-auto rounded-full" />
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-red-500/5 text-center group hover:-translate-y-2 transition-all duration-300"
                >
                  <div className={`w-16 h-16 rounded-2xl ${s.color} bg-gray-50 flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors`}>
                    <s.icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">{s.value}</h4>
                  <p className="text-gray-500 font-bold text-sm uppercase mb-2">{s.label}</p>
                  <p className="text-red-600 font-extrabold text-[12px] italic">{s.labelBn}</p>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 px-4 bg-red-600 text-white text-center">
         <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="max-w-4xl mx-auto space-y-8"
         >
            <h2 className="text-4xl md:text-6xl font-black leading-tight">Be Part of the Clean <br /> Food Revolution</h2>
            <p className="text-red-100 text-lg md:text-xl font-medium">
               Whether you're a farmer, a customer, or a partner - your support 
               helps us deliver health and hope to millions.
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-4">
               <Link to="/products" className="bg-white !text-red-600 px-10 py-5 rounded-full font-black text-lg shadow-2xl hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                  এখনই শুরু করুন <ArrowRight />
               </Link>
               <Link to="/contact" className="border-2 border-white text-white px-10 py-5 rounded-full font-black text-lg hover:bg-white hover:!text-red-600 transition-all">
                  Contact Us
               </Link>
            </div>
         </motion.div>
      </section>

    </div>
  );
};

export default ImpactStories;

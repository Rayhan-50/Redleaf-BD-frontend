import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, Truck, Users, Heart, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const values = [
  {
    icon: Leaf,
    title: 'Pure & Organic',
    titleBn: 'শতভাগ অর্গানিক',
    desc: 'We source only verified organic and natural products directly from trusted Bangladeshi farmers.',
    color: 'bg-red-50 text-red-600'
  },
  {
    icon: ShieldCheck,
    title: 'Quality Checked',
    titleBn: 'মানসম্পন্ন পণ্য',
    desc: 'Every product passes our strict quality check before it reaches your kitchen. No compromise.',
    color: 'bg-red-50 text-red-600'
  },
  {
    icon: Truck,
    title: 'Express Delivery',
    titleBn: 'দ্রুত ডেলিভারি',
    desc: 'Fresh groceries delivered to your doorstep within 2 hours in Dhaka City.',
    color: 'bg-red-50 text-red-600'
  },
  {
    icon: Users,
    title: 'Community First',
    titleBn: 'কৃষকের পাশে',
    desc: 'We support local farmers and micro-entrepreneurs, building a stronger food supply chain.',
    color: 'bg-red-50 text-red-600'
  },
  {
    icon: Heart,
    title: 'Customer First',
    titleBn: 'আপনার সন্তুষ্টি',
    desc: 'Your satisfaction is our #1 priority. Our support team is here 24/7 to assist you.',
    color: 'bg-red-50 text-red-600'
  },
  {
    icon: Award,
    title: 'Halal Assurance',
    titleBn: 'হালাল নিশ্চয়তা',
    desc: 'We strictly ensure all products are halal and processed following ethical guidelines.',
    color: 'bg-red-50 text-red-600'
  },
];

const stats = [
  { value: '50K+', label: 'Customers', labelBn: 'সন্তুষ্ট গ্রাহক' },
  { value: '1.2K+', label: 'Products', labelBn: 'সেরা পণ্য' },
  { value: '2hr', label: 'Delivery Time', labelBn: 'দ্রুত ডেলিভারি' },
  { value: '99%', label: 'Satisfaction', labelBn: 'সফলতা' },
];

const AboutUs = () => {
  return (
    <div className="bg-white overflow-x-hidden pt-10 font-['Poppins']">

      {/* ── Hero Section ── */}
      <section className="relative min-h-[500px] flex items-center justify-center bg-gradient-to-br from-red-700 via-red-600 to-red-800 py-20 px-4 text-white overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-black/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white text-xs md:text-sm font-bold tracking-widest uppercase px-6 py-2 rounded-full mb-8 backdrop-blur-sm">
              ফরমালিনমুক্ত খাবারের নতুন বিপ্লব
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
              Bangladesh's Most Trusted <br />
              <span className="text-yellow-400">Premium Grocery</span> Shop
            </h1>
            <p className="text-red-50 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium mb-10 opacity-90">
              Redleaf-BD connects you with fresh, organic, and toxin-free grocery products directly from farm to table.
              সরাসরি কৃষকের মাঠ থেকে আপনার দরজায় পৌঁছানো আমাদের অঙ্গীকার।
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/products" className="px-8 py-4 bg-white !text-red-600 font-bold rounded-xl shadow-xl hover:bg-red-50 transition-all hover:scale-105">
                Explore Products
              </Link>
              <Link to="/contact" className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:!text-red-600 transition-all">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="relative z-20 -mt-12 container mx-auto px-4 lg:px-20">
        <div className="bg-white rounded-2xl shadow-2xl shadow-red-500/10 border border-red-50 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 p-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center px-4"
            >
              <h3 className="text-2xl md:text-4xl font-black text-red-600 mb-1">{s.value}</h3>
              <p className="text-gray-900 font-bold text-sm">{s.label}</p>
              <p className="text-gray-400 text-xs mt-0.5">{s.labelBn}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Our Story Section (Full-Bleed Blend) ── */}
      <section className="relative py-24 px-4 overflow-hidden bg-white min-h-[600px] flex items-center">
        {/* Background Image with Gradient Mask */}
        <div className="absolute top-0 left-0 w-full lg:w-3/4 h-full pointer-events-none z-0">
          <img
            src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=1200"
            alt="Organic Field"
            className="w-full h-full object-cover opacity-60 mix-blend-multiply"
            style={{
              maskImage: 'linear-gradient(to right, black 50%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, black 50%, transparent 100%)'
            }}
          />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center">

            {/* Left Spacer for the image visibility */}
            <div className="hidden lg:block lg:flex-1" />

            {/* Content side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex-1 space-y-10 lg:pl-12"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-[2px] bg-red-600" />
                  <span className="text-red-600 font-black text-sm uppercase tracking-[0.3em]">Our Story</span>
                </div>

                <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1]">
                  নিখুঁত বিশুদ্ধতার <br /> এক নতুন গল্প
                </h2>

                <p className="text-2xl font-bold text-red-600 italic">
                  Restoring trust in every kitchen.
                </p>
              </div>

              <div className="space-y-6 text-gray-600 text-lg leading-relaxed font-medium">
                <p>
                  At Redleaf-BD, we started with a simple observation: <span className="text-gray-900 font-bold">Purity is rare.</span>
                  In a market filled with shortcuts and lack of transparency, our journey began
                  to connect honest farmers directly with conscious consumers.
                </p>

                <p>
                  <span className="text-red-600 font-bold">ফরমালিনমুক্ত খাবারের অঙ্গীকার : </span>
                  We don't just sell products; we deliver a promise. Every drop of honey, every
                  grain of rice, and every pinch of spice is vetted by our own quality
                  assurrance team.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="space-y-2">
                  <h4 className="text-3xl font-black text-gray-900 italic">2022</h4>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">JOURNEY STARTED</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-3xl font-black text-gray-900 italic">50K+</h4>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">FAMILIES TRUST US</p>
                </div>
              </div>

              <div className="pt-6">
                <Link to="/contact" className="inline-flex items-center gap-3 bg-red-600 text-white px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-red-700 hover:-translate-y-1 transition-all">
                  Contact Our Team <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Floating Badge (Decorative) */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 left-10 md:left-20 bg-white shadow-2xl rounded-2xl p-6 border border-red-50 hidden md:block z-20"
        >
          <p className="text-red-600 font-black text-xs uppercase tracking-widest mb-1">100% PURE</p>
          <p className="text-gray-900 font-black text-lg italic">সরাসরি সংগৃহীত</p>
        </motion.div>
      </section>

      {/* ── Values Grid ── */}
      <section className="py-24 bg-gray-50 px-4 relative overflow-hidden">
        {/* Design Texture - Subtle Dot Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage: 'radial-gradient(circle, #dc2626 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Decorative Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-100/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-100/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16 space-y-4">
            <span className="text-red-600 font-black text-sm uppercase tracking-[0.3em]">Our Promise</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 italic">আমাদের অঙ্গীকার</h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-medium">
              We operate on the principles of honesty, quality, and care.
              পণ্যর মান আমাদের কাছে বিক্রির চেয়েও বেশি গুরুত্বপূর্ণ।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-red-500/5 hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 group-hover:rotate-6 bg-red-50 text-red-600`}>
                  <v.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-red-600 transition-colors uppercase">
                  {v.title}
                </h3>
                <p className="text-red-600 font-bold text-sm mb-4 leading-none italic">{v.titleBn}</p>
                <p className="text-gray-500 text-base leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Container ── */}
      <section className="relative h-[400px] flex items-center justify-center px-4 overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600"
            className="w-full h-full object-cover grayscale opacity-20"
          />
          <div className="absolute inset-0 bg-red-600 mix-blend-multiply" />
        </div>

        <div className="relative z-10 text-center text-white space-y-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              নির্ভরযোগ্য পণ্য এখন <br /> আপনার হাতেই!
            </h2>
            <p className="text-red-100 text-lg md:text-xl font-medium">
              Join 50,000+ happy families today.Experience the Redleaf-BD standard.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/products" className="inline-flex items-center gap-3 bg-white !text-red-600 px-10 py-5 rounded-full font-black text-lg shadow-2xl hover:bg-gray-100 transition-all hover:scale-110 active:scale-95">
              এখনই কেনাকাটা করুন <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;
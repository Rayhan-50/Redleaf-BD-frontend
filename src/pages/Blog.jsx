import React, { useState } from 'react';
import { MessageSquare, Eye, ChevronRight, Image as ImageIcon, Search, Calendar, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../hooks/useAxiosPublic';
import Loading from '../components/Loading/Loading';

const Blog = () => {
  const [activeTab, setActiveTab] = useState('সব পোস্ট');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'সব পোস্ট', 'Vlog', 'কোরবানি', 'খাদ্যের গুণাগুণ', 'নিউট্রিশন', 'মৌসুমি ফল', 'রমজান', 'রূপচর্চা', 'রেসিপি', 'রোগ প্রতিরোধ', 'শীতকালীন সুস্থতা', 'হেলথ টিপস'
  ];

  const axiosPublic = useAxiosPublic();
  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const res = await axiosPublic.get('/blogs');
      return res.data;
    }
  });

  const filteredPosts = blogPosts.filter(post => 
    (activeTab === 'সব পোস্ট' || post.category === activeTab) &&
    (post.title?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-['Poppins']">
      
      {/* ── Section 1: Hero Header (Restore Red Style) ── */}
      <section className="w-full bg-gradient-to-r from-red-700 via-red-600 to-red-800 relative overflow-hidden shadow-lg">
        {/* Design Texture */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.1]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block bg-white/20 border border-white/30 text-white text-xs font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full mb-6 backdrop-blur-md">
                Redleaf Insights
              </span>
              <h1 className="text-4xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">
                Explore Our <span className="text-yellow-400">Stories</span>
              </h1>
              <p className="text-red-50 text-lg md:text-xl max-w-2xl mx-auto font-medium opacity-90 leading-relaxed">
                স্বাদ ও স্বাস্থ্যের মেলবন্ধনে আমাদের ব্লগ। জানুন খাঁটি খাবার, 
                নিউট্রিশন এবং সুস্থ জীবন যাপনের দারুণ সব টিপস।
              </p>
            </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-7xl -mt-10 md:-mt-14 relative z-20 pb-20">
         
         {/* ── Search & Filter Bar (Restore 8px Radius) ── */}
         <div className="bg-white rounded-[8px] shadow-2xl shadow-red-500/10 p-6 mb-12 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
              
              {/* Categories Scrollable */}
              <div className="w-full lg:flex-1 overflow-x-auto no-scrollbar pb-2">
                <div className="flex items-center gap-3">
                  {categories.map(category => (
                    <button 
                       key={category}
                       onClick={() => setActiveTab(category)}
                       className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap
                        ${activeTab === category 
                          ? 'bg-red-600 text-white shadow-lg shadow-red-200 scale-105' 
                          : 'bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600'
                        }`}
                    >
                       {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Local Search */}
              <div className="relative w-full lg:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600" size={18} />
                <input 
                  type="text" 
                  placeholder="ব্লগ খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-full text-sm font-bold focus:ring-2 focus:ring-red-600/20 transition-all font-['Hind_Siliguri']"
                />
              </div>
            </div>
         </div>

         {/* ── Blog Grid ── */}
         <AnimatePresence mode='wait'>
            <motion.div 
               key={activeTab + searchTerm}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.4 }}
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
               {filteredPosts.length > 0 ? filteredPosts.map((post, index) => (
                  <article key={post._id || index} className="bg-white rounded-[8px] shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 flex flex-col group overflow-hidden">
                     
                     {/* Image & Badges */}
                     <div className="relative h-64 overflow-hidden">
                        <div className="absolute top-6 left-6 z-20 bg-white/95 backdrop-blur-md shadow-xl text-center w-14 py-2 rounded-lg border border-red-50">
                           <span className="block text-2xl font-black text-gray-900 leading-none mb-1">{post.date}</span>
                           <span className="block text-[10px] font-black text-red-600 uppercase tracking-widest">{post.month}</span>
                        </div>
                        
                        <div className="absolute top-6 right-6 z-20">
                          <span className="bg-red-600 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-red-600/30">
                            {post.category}
                          </span>
                        </div>

                        {post.image ? (
                           <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                           <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <ImageIcon className="w-16 h-16 text-gray-200" strokeWidth={1} />
                           </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     </div>

                     {/* Content Body */}
                     <div className="p-8 flex flex-col flex-1">
                        {/* Meta Info */}
                        <div className="flex items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">
                           <span className="flex items-center gap-1.5"><User size={12} className="text-red-500" /> {post.author}</span>
                           <span className="flex items-center gap-1.5"><Clock size={12} className="text-red-500" /> {post.readTime}</span>
                        </div>
                        
                        <h2 className="font-extrabold text-gray-900 text-2xl leading-[1.3] mb-4 group-hover:text-red-600 transition-colors font-['Hind_Siliguri']">
                           {post.title}
                        </h2>
                        
                        <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1 font-['Hind_Siliguri'] opacity-80">
                           {post.excerpt}
                        </p>
                        
                        {/* Interactive Footer */}
                        <div className="flex items-center justify-between mt-auto">
                           <Link to="#" className="group/btn relative overflow-hidden bg-gray-50 text-red-600 px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:bg-red-600 hover:text-white flex items-center gap-2">
                              Explore More
                              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                           </Link>

                           <div className="flex items-center gap-4 text-gray-400">
                             <span className="flex items-center gap-1.5 hover:text-red-600 transition-colors cursor-pointer text-[11px] font-bold">
                               <MessageSquare size={14} /> {post.comments || 0}
                             </span>
                             <span className="flex items-center gap-1.5 hover:text-red-600 transition-colors cursor-pointer text-[11px] font-bold">
                               <Eye size={14} /> {post.views || 0}
                             </span>
                           </div>
                        </div>
                     </div>
                  </article>
               )) : (
                <div className="col-span-full py-20 text-center">
                  <div className="w-20 h-20 bg-red-50 text-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ImageIcon size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">কোন পোস্ট পাওয়া যায়নি</h3>
                  <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Try choosing another category</p>
                </div>
               )}
            </motion.div>
         </AnimatePresence>

      </div>
    </div>
  );
};

export default Blog;
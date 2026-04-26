

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trash2, MessageSquare, Mail, User, Calendar, Eye, X, Crown,
  Search, RefreshCcw, Loader2, Clock, Phone, MapPin, FileText
} from 'lucide-react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const ShowContactData = () => {
  const axiosSecure = useAxiosSecure();
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Fetch contact data on component mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axiosSecure.get('/contactCollection');
        setContacts(response.data);
        setFilteredContacts(response.data);
        setIsLoading(false);
        setError(''); 
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setError('Failed to fetch contact data');
        setIsLoading(false);
        Swal.fire({
          title: 'Retrieval Failed',
          text: 'Unable to connect to contact records.',
          icon: 'error',
          confirmButtonText: 'Retry',
          confirmButtonColor: '#dc2626',
          background: "#fff",
          customClass: { popup: 'rounded-[32px]' }
        });
      }
    };
    fetchContacts();
  }, [axiosSecure]);

  // Filter contacts based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [searchTerm, contacts]);

  // Handle delete contact
  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Exterminate Record?',
      text: `Message from "${name}" will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete',
      background: "#fff",
      customClass: { popup: 'rounded-[32px] p-8' }
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/contactCollection/${id}`);
        const updatedContacts = contacts.filter((contact) => contact._id !== id);
        setContacts(updatedContacts);
        setFilteredContacts(updatedContacts);
        Swal.fire({
          title: 'Removed!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
          background: "#fff",
          customClass: { popup: 'rounded-3xl' }
        });
      } catch {
        Swal.fire({ title: 'Action Failed', icon: 'error', confirmButtonColor: '#dc2626' });
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="w-full font-['Poppins',sans-serif]">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-white p-8 lg:p-10 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-red-600 rounded-[24px] flex items-center justify-center shadow-2xl shadow-red-200">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Inquiry Hub</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">{contacts.length} Client Transmissions</p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <div className="relative group flex-1">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Identity, Subject or Narrative..."
                className="w-full pl-14 pr-6 py-4 rounded-[20px] border border-gray-100 focus:outline-none focus:ring-4 focus:ring-red-50 focus:border-red-600 bg-gray-50/50 text-sm font-bold text-gray-800 transition-all"
              />
              <Search className="w-5 h-5 text-gray-300 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-red-600 transition-colors" />
            </div>
            <button
              onClick={() => window.location.reload()}
              className="p-4 rounded-2xl bg-white border border-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all shadow-sm active:scale-90"
              title="Refresh"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Email-style Layout */}
        <div className="flex flex-col lg:flex-row h-[650px] relative">
          {/* Mobile Header Toggle */}
          <div className="lg:hidden flex items-center justify-between p-6 border-b border-gray-50 bg-white">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <Crown className="h-4 w-4 text-yellow-500" />
              Manifest ({filteredContacts.length})
            </h3>
            <button
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="p-3 rounded-xl bg-red-600 text-white shadow-lg shadow-red-200"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
          </div>

          {/* Left Sidebar - Message List */}
          <div className={`${showMobileSidebar ? 'flex' : 'hidden'} lg:flex w-full lg:w-1/3 border-r border-gray-50 bg-white flex-col absolute lg:relative z-20 lg:z-auto h-full lg:h-auto transform transition-transform duration-300 ease-in-out ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 overflow-y-auto no-scrollbar`}>
            {isLoading ? (
               <div className="flex items-center justify-center p-20">
                 <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full" />
               </div>
            ) : filteredContacts.length === 0 ? (
                <div className="p-20 text-center">
                    <MessageSquare size={48} className="mx-auto text-gray-100 mb-4" />
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Zero Messages</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-50">
                    {filteredContacts.map((contact, idx) => (
                    <motion.div
                        key={contact._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        onClick={() => {
                            setSelectedContact(contact);
                            if (window.innerWidth < 1024) setShowMobileSidebar(false);
                        }}
                        className={`p-6 cursor-pointer border-l-4 transition-all group ${selectedContact?._id === contact._id
                            ? 'border-l-red-600 bg-red-50/30'
                            : 'border-l-transparent hover:bg-gray-50'
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                <User className="h-6 w-6 text-gray-200 group-hover:text-red-600 transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest truncate">
                                        {contact.name}
                                    </h4>
                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                                        {formatDate(contact.createdAt)}
                                    </span>
                                </div>
                                <p className="text-[10px] text-gray-400 font-bold mb-2 truncate">
                                    {contact.email}
                                </p>
                                <p className="text-xs font-black text-gray-900 truncate tracking-tight uppercase">
                                    {contact.subject}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                    ))}
                </div>
            )}
          </div>

          {/* Right Side - Message Content */}
          <div className="flex-1 bg-white flex flex-col min-h-0 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-yellow-400 opacity-20" />
            
            {selectedContact ? (
              <div className="flex flex-col h-full">
                {/* Header Content Area */}
                <div className="p-8 lg:p-12 border-b border-gray-50 bg-gray-50/30">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-[24px] bg-white border border-gray-100 flex items-center justify-center shadow-xl">
                        <User className="h-8 w-8 text-red-600" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-1">
                          {selectedContact.name}
                        </h3>
                        <p className="text-xs font-bold text-red-600 mb-4">{selectedContact.email}</p>
                        <div className="flex items-center gap-4">
                           <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-white px-4 py-2 rounded-full border border-gray-100 italic">
                             <Clock className="w-3.5 h-3.5" />
                             Logged: {new Date(selectedContact.createdAt).toLocaleString()}
                           </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                window.location.href = `mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`;
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-red-100 flex items-center gap-3 active:scale-95 group"
                        >
                            <Mail className="h-5 w-5 group-hover:-rotate-12 transition-transform" />
                            Dispatch Reply
                        </button>
                        <button
                            onClick={() => handleDelete(selectedContact._id, selectedContact.name)}
                            className="p-4 rounded-2xl bg-white border border-gray-100 text-gray-300 hover:text-black hover:border-black transition-all active:scale-90"
                            title="Exterminate"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                  </div>
                </div>

                {/* Narrative Area */}
                <div className="flex-1 p-8 lg:p-12 overflow-y-auto no-scrollbar">
                   <div className="space-y-10">
                      <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-px bg-gray-100 flex-1" />
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] whitespace-nowrap">Subject Narrative</h4>
                            <div className="h-px bg-gray-100 flex-1" />
                        </div>
                        <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase border-l-4 border-yellow-400 pl-6 py-2">
                            {selectedContact.subject}
                        </h2>
                      </div>

                      <div className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm relative italic">
                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-100">
                           <FileText size={40} />
                        </div>
                        <p className="text-gray-600 leading-[1.8] text-sm font-bold whitespace-pre-wrap">
                            {selectedContact.message}
                        </p>
                      </div>
                   </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-24 h-24 rounded-[32px] bg-red-50 flex items-center justify-center mb-10">
                    <MessageSquare size={48} className="text-red-200" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-4">
                  Selection Awaited
                </h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest max-w-xs leading-loose">
                  Select a transmission from the registry on the left to review the narrative details.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ShowContactData;
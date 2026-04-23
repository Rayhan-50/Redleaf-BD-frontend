

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
      title: 'Delete Message?',
      text: `Message from "${name}" will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete',
      background: "#fff",
      customClass: { popup: 'rounded-2xl p-6' }
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
    <div className="w-full h-[calc(100vh-64px)] lg:h-screen p-4 lg:p-8 font-['Poppins',sans-serif] flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] lg:rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden flex flex-col flex-1 min-h-0"
      >
        {/* Header */}
        <div className="bg-white p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-md shadow-red-100">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Contact Messages</h2>
              <p className="text-xs font-semibold text-gray-500 mt-1">{contacts.length} Total Messages</p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative group flex-1">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, subject, or message..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 bg-gray-50 text-sm text-gray-800 transition-all"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-red-600 transition-colors" />
            </div>
            <button
              onClick={() => window.location.reload()}
              className="p-3 rounded-xl bg-white border border-gray-100 hover:bg-gray-50 text-gray-500 hover:text-gray-800 transition-all shadow-sm active:scale-95"
              title="Refresh"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Email-style Layout */}
        <div className="flex flex-col lg:flex-row flex-1 relative min-h-0">
          {/* Mobile Header Toggle */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-50 bg-white">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-gray-500" />
              Inbox ({filteredContacts.length})
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
                <div className="p-10 text-center mt-10">
                    <MessageSquare size={40} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-sm font-medium text-gray-400">No messages found</p>
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
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100 group-hover:bg-red-50 transition-colors">
                                <User className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <h4 className="text-sm font-bold text-gray-900 truncate">
                                        {contact.name}
                                    </h4>
                                    <span className="text-xs font-medium text-gray-400 whitespace-nowrap ml-2">
                                        {formatDate(contact.createdAt)}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mb-1.5 truncate">
                                    {contact.email}
                                </p>
                                <p className="text-sm font-semibold text-gray-800 truncate">
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
              <div className="flex flex-col h-full min-h-0">
                {/* Header Content Area */}
                <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50 shrink-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                        <User className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 mb-0.5 truncate">
                          {selectedContact.name}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
                          <a href={`mailto:${selectedContact.email}`} className="hover:text-red-600 hover:underline">{selectedContact.email}</a>
                          <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-gray-300"></span>
                          <span className="flex items-center gap-1.5">
                             <Clock className="w-4 h-4" />
                             {new Date(selectedContact.createdAt).toLocaleString()}
                           </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            onClick={() => {
                                window.location.href = `mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`;
                            }}
                            className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2 active:scale-95"
                        >
                            <Mail className="h-4 w-4" />
                            Reply
                        </button>
                        <button
                            onClick={() => handleDelete(selectedContact._id, selectedContact.name)}
                            className="p-2.5 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all active:scale-90"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                  </div>
                </div>

                {/* Narrative Area */}
                <div className="flex-1 p-6 md:p-8 overflow-y-auto no-scrollbar">
                   <div className="max-w-4xl">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">
                          {selectedContact.subject}
                      </h2>
                      <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                        <p className="text-gray-700 leading-relaxed text-[15px] whitespace-pre-wrap">
                            {selectedContact.message}
                        </p>
                      </div>
                   </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/30">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                    <MessageSquare size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Message Selected
                </h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Choose a message from the inbox on the left to read its contents and reply.
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
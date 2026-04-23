import { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Calendar, Edit3, Check, MapPin, Phone, Crown, AlertCircle } from 'lucide-react';
import { AuthContext } from '../../Providers/AuthProvider';
import useAdmin from '../../hooks/useAdmin';
import Swal from 'sweetalert2';
import ImageUploadField from '../../components/Dashboard/ImageUploadField';

const Profile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [isAdmin] = useAdmin();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [saving, setSaving] = useState(false);
  
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (user?.email) {
      setPhone(localStorage.getItem(`phone_${user.email}`) || '');
      setAddress(localStorage.getItem(`address_${user.email}`) || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!displayName.trim()) return;
    setSaving(true);
    try {
      await updateUserProfile(displayName.trim(), photoURL.trim() || user?.photoURL);
      if (user?.email) {
        localStorage.setItem(`phone_${user.email}`, phone.trim());
        localStorage.setItem(`address_${user.email}`, address.trim());
      }
      setEditing(false);
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        showConfirmButton: false,
        timer: 1800,
        background: '#fff',
        customClass: { popup: 'rounded-3xl shadow-xl' }
      });
    } catch {
      Swal.fire({ icon: 'error', title: 'Update Failed', confirmButtonColor: '#dc2626' });
    } finally {
      setSaving(false);
    }
  };

  const joinDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-BD', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : 'Unknown';

  const InfoCard = ({ icon: Icon, label, value, colorClass }) => (
    <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={`mt-0.5 p-2 rounded-xl bg-white shadow-sm border border-gray-50 ${colorClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
        <p className="font-bold text-gray-800 text-sm whitespace-pre-wrap">{value || 'Not provided'}</p>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="p-4 sm:p-6 lg:p-8 font-['Poppins',sans-serif]">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="flex items-center gap-4 mb-6 relative">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center border border-red-100 shadow-sm relative z-10">
            <User className="h-6 w-6 text-red-600" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">My Profile</h2>
            <p className="text-sm font-medium text-gray-500 mt-1">Manage your account details and preferences</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Banner */}
          <div className="h-40 bg-gradient-to-r from-red-600 to-red-800 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          </div>

          <div className="px-6 sm:px-10 pb-10">
            {/* Avatar & Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                <div className="relative group -mt-16 md:-mt-20">
                  <div className="absolute -inset-1 bg-red-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <img
                    src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=e63946&color=fff&size=200`}
                    alt="Profile"
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl object-cover bg-white relative z-10"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=e63946&color=fff&size=200`; }}
                  />
                  {isAdmin && (
                    <div className="absolute bottom-2 right-1 z-20 bg-yellow-400 p-2 rounded-full border-2 border-white shadow-md" title="Administrator">
                      <Crown className="h-4 w-4 text-yellow-900" />
                    </div>
                  )}
                </div>
                {!editing && (
                  <div className="text-center md:text-left pb-1">
                    <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                      {user?.displayName || 'Authorized User'}
                    </h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-3">{user?.email}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                {editing ? (
                  <>
                    <button onClick={() => setEditing(false)} className="flex-1 md:flex-none px-6 py-2.5 rounded-xl border border-gray-200 text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all">
                      Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-md shadow-red-100 disabled:opacity-50">
                      <Check className="h-4 w-4" /> {saving ? 'Saving...' : 'Save'}
                    </button>
                  </>
                ) : (
                  <button onClick={() => { setDisplayName(user?.displayName || ''); setPhotoURL(user?.photoURL || ''); setEditing(true); }} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-black uppercase tracking-widest text-gray-700 hover:text-red-600 hover:border-red-200 transition-all shadow-sm shadow-gray-50 active:scale-95">
                    <Edit3 className="h-4 w-4" /> Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Badges */}
            {!editing && (
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-100">
                  <Calendar className="h-3 w-3" /> Joined {joinDate}
                </span>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100 shadow-sm">
                    <Shield className="h-3 w-3" /> Administrator
                  </span>
                )}
              </div>
            )}

            {/* Content Area */}
            {editing ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-gray-50/50 p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-inner">
                <div className="space-y-5">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Display Name</label>
                    <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full px-5 py-3.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all bg-white shadow-sm" placeholder="Your Full Name" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Email Address</label>
                    <input type="email" value={user?.email || ''} disabled className="w-full px-5 py-3.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-400 bg-gray-100 cursor-not-allowed" />
                    <p className="text-[10px] text-gray-400 mt-1 font-medium select-none">Email cannot be changed.</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Phone Number</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-5 py-3.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all bg-white shadow-sm" placeholder="+880 1..." />
                  </div>
                </div>
                <div className="space-y-5 min-h-[100%] flex flex-col">
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Delivery Address</label>
                    <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows="5" className="w-full h-32 px-5 py-3.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all bg-white shadow-sm resize-none" placeholder="Your full local address..."></textarea>
                  </div>
                  <div>
                    <ImageUploadField label="Profile Image URL" value={photoURL} onChange={(url) => setPhotoURL(url)} placeholder="Provide an image URL..." />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoCard icon={Mail} label="Email Address" value={user?.email} colorClass="text-indigo-600" />
                <InfoCard icon={Phone} label="Phone Number" value={phone} colorClass="text-emerald-600" />
                <InfoCard icon={MapPin} label="Delivery Address" value={address} colorClass="text-red-600" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Verification Alert */}
        {!user?.emailVerified && user?.providerData?.[0]?.providerId !== 'google.com' && (
          <div className="p-5 bg-red-50 border border-red-100 rounded-3xl flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-red-50">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
               <h4 className="font-black text-red-900 text-sm tracking-tight">Email Not Verified</h4>
               <p className="text-xs text-red-700 mt-0.5 font-medium">Please check your inbox to verify your email address. Certain features may be restricted until verified.</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;

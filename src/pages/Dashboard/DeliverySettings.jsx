import { useState, useEffect } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useDeliverySettings from '../../hooks/useDeliverySettings';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { Settings, Save } from 'lucide-react';

const DeliverySettings = () => {
  const axiosSecure = useAxiosSecure();
  const [deliverySettings, refetch, isLoading] = useDeliverySettings();
  
  const [dhaka, setDhaka] = useState(80);
  const [outside, setOutside] = useState(120);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (deliverySettings) {
      setDhaka(deliverySettings.dhaka || 80);
      setOutside(deliverySettings.outside || 120);
    }
  }, [deliverySettings]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axiosSecure.put('/settings/delivery', { dhaka, outside });
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Delivery settings updated successfully!',
        confirmButtonColor: '#dc2626'
      });
      refetch();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update delivery settings',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center border border-red-100 shadow-sm">
          <Settings className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Delivery Settings</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Configure delivery charges for different locations</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 max-w-2xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Charge Inside Dhaka (BDT)</label>
            <input 
              type="number" 
              required 
              value={dhaka} 
              onChange={(e) => setDhaka(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-50 transition-all font-semibold"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Charge Outside Dhaka (BDT)</label>
            <input 
              type="number" 
              required 
              value={outside} 
              onChange={(e) => setOutside(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-50 transition-all font-semibold"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSaving}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-2xl text-sm font-black transition-all shadow-lg shadow-red-200 disabled:opacity-50"
          >
            {isSaving ? (
              <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
            ) : (
              <><Save className="w-5 h-5" /> Save Settings</>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default DeliverySettings;

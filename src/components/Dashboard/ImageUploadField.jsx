import React, { useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Link as LinkIcon } from 'lucide-react';
import useImageUpload from '../../hooks/useImageUpload';

const ImageUploadField = ({ value, onChange, label, placeholder = "https://unsplash.com/..." }) => {
  const { uploadImage, uploading } = useImageUpload();
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await uploadImage(file);
      if (url) {
        onChange(url);
      }
    }
  };

  const clearImage = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      {label && (
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">
          {label}
        </label>
      )}

      <div className="flex flex-col gap-4">
        {/* URL Input */}
        <div className="relative group">
          <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-red-600 transition-colors" />
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-16 pr-6 py-4 rounded-2xl border border-gray-100 bg-white text-sm font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-red-50 focus:border-red-600 transition-all"
            placeholder={placeholder}
          />
        </div>

        {/* Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative group cursor-pointer border-2 border-dashed rounded-[32px] p-8 transition-all flex flex-col items-center justify-center
            ${uploading ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100 hover:border-red-200 hover:bg-red-50/30'}
          `}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />

          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Syncing Asset...</p>
            </div>
          ) : value ? (
            <div className="relative w-full aspect-video md:aspect-auto md:h-48 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 p-2 flex items-center justify-center">
              <img src={value} alt="Preview" className="h-full object-contain mix-blend-multiply" />
              <button
                onClick={(e) => { e.stopPropagation(); clearImage(); }}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-red-600 shadow-lg hover:bg-red-600 hover:text-white transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud size={32} />
              </div>
              <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Drop or Select Asset</p>
              <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">Supports JPG, PNG (Max 5MB)</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadField;
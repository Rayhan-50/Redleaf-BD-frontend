import React, { useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Link as LinkIcon, Plus } from 'lucide-react';
import useImageUpload from '../../hooks/useImageUpload';

const MultiImageUploadField = ({ values = [], onChange, label, placeholder = "https://unsplash.com/...", maxImages = 4 }) => {
  const { uploadImage, uploading } = useImageUpload();
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await uploadImage(file);
      if (url) {
        onChange([...values, url]);
      }
    }
    // Reset file input so same file can be uploaded again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (indexToRemove) => {
    onChange(values.filter((_, index) => index !== indexToRemove));
  };

  const addUrlImage = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const url = e.target.value.trim();
      if (url && values.length < maxImages) {
        onChange([...values, url]);
        e.target.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      {label && (
        <div className="flex items-center justify-between mb-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block">
            {label}
          </label>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {values.length} / {maxImages} Uploaded
          </span>
        </div>
      )}

      {/* Grid of Images */}
      <div className="grid grid-cols-2 gap-4">
        {values.map((url, index) => (
          <div key={index} className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 p-2 flex items-center justify-center group">
            <img src={url} alt={`Preview ${index + 1}`} className="h-full object-contain mix-blend-multiply" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeImage(index); }}
              className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-red-600 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white active:scale-90"
            >
              <X size={16} />
            </button>
            {index === 0 && (
              <div className="absolute bottom-2 left-2 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded-md shadow-sm">
                Primary
              </div>
            )}
          </div>
        ))}

        {/* Upload Button Slot */}
        {values.length < maxImages && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative cursor-pointer border-2 border-dashed rounded-2xl aspect-square transition-all flex flex-col items-center justify-center
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
              <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Plus size={20} />
                </div>
                <p className="text-[10px] font-black text-gray-900 uppercase text-center px-2">Add Image</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* URL Input */}
      {values.length < maxImages && (
        <div className="relative group mt-4">
          <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-red-600 transition-colors" />
          <input
            type="url"
            onKeyDown={addUrlImage}
            className="w-full pl-16 pr-6 py-4 rounded-2xl border border-gray-100 bg-white text-sm font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-red-50 focus:border-red-600 transition-all"
            placeholder={placeholder + " (Press Enter to add)"}
          />
        </div>
      )}
    </div>
  );
};

export default MultiImageUploadField;

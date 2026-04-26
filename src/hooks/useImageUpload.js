import { useState } from 'react';

const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file) => {
    if (!file) return null;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
    const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

    try {
      const response = await fetch(image_hosting_api, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(data.error.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading };
};

export default useImageUpload;
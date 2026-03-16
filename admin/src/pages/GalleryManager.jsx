import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Trash2, Maximize2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getGallery, uploadGalleryImage, deleteGalleryImage } from '../api';

const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await getGallery();
      setImages(res.data);
    } catch (err) {
      toast.error('Failed to load gallery');
    }
  };

  const removeImage = async (id) => {
    try {
      await deleteGalleryImage(id);
      setImages(images.filter((img) => img._id !== id));
      toast.success('Image deleted from database');
    } catch (err) {
      toast.error('Failed to delete image');
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading('Uploading image...');
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await uploadGalleryImage(formData);
      setImages([res.data, ...images]);
      toast.success('Image uploaded to gallery', { id: toastId });
    } catch (err) {
      toast.error('Failed to upload image', { id: toastId });
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Gallery Manager</h1>
          <p className="text-gray-400 text-sm mt-1">Upload and manage website gallery images.</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#1E1E1E] rounded-2xl p-8 border border-[#2C2C2C] shadow-lg border-dashed border-2 hover:border-[#FF6B00] transition-colors relative"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-black/50 rounded-full mb-4">
            <UploadCloud size={32} className="text-[#FF6B00]" />
          </div>
          <h3 className="text-lg font-heading font-semibold text-white mb-2">Drag & Drop Image or Video</h3>
          <p className="text-sm text-gray-500 max-w-sm mb-6">High quality JPG, PNG, or MP4. Max file size 10MB.</p>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            style={{ display: 'none' }} 
            accept="image/*,video/mp4" 
          />
          <button onClick={handleBrowseClick} className="px-6 py-2.5 bg-[#FF6B00] hover:bg-[#FF8C00] text-white font-medium rounded-lg shadow-[0_0_15px_rgba(255,107,0,0.3)] transition-all">
            Browse Files
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        <AnimatePresence>
          {images.map((img, idx) => (
            <motion.div 
              key={img._id || idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="group relative aspect-square bg-[#111111] rounded-xl overflow-hidden shadow-lg border border-[#2C2C2C]"
            >
              <img src={img.image_url} alt="Gallery" className="w-full h-full object-cover group-hover:scale-110 group-hover:blur-[2px] transition-all duration-500" />
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-sm transition-colors" title="Preview">
                  <Maximize2 size={18} />
                </button>
                <button onClick={() => removeImage(img._id)} className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white backdrop-blur-sm transition-colors" title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default GalleryManager;

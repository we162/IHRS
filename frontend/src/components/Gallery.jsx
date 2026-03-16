import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionTitle from './SectionTitle';
import { X } from 'lucide-react';
import { getGallery } from '../api';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await getGallery();
        if (res.data && res.data.length > 0) {
          setImages(res.data.map(img => ({ src: img.image_url, title: img.title })));
        } else {
          throw new Error('Empty gallery, load dummies');
        }
      } catch (err) {
        console.error('Loading placeholder gallery...', err.message);
        // Fallback dummy images for when database is empty
        setImages([
          { src: "https://images.unsplash.com/photo-1549480305-6f3decc2283a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Training Session" },
          { src: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Golden Hour Gallop" },
          { src: "https://images.unsplash.com/photo-1598974357801-bca100c65653?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Show Jumping" },
          { src: "https://images.unsplash.com/photo-1596701546200-c5e3f4204561?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Stable Secrets" },
          { src: "https://images.unsplash.com/photo-1577457476685-6b22f0c7ccdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Morning Trails" },
          { src: "https://images.unsplash.com/photo-1550970349-2eeb7edfb3a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "The Companion" }
        ]);
      }
    };
    fetchImages();
  }, []);

  return (
    <section id="gallery" className="py-24 bg-dark relative">
      <div className="container mx-auto px-6 lg:px-12">
        <SectionTitle title="Moments of Grace" subtitle="Our Gallery" centered />

        {/* Masonry Grid Simulation using CSS columns */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 mt-16">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (idx % 3) * 0.1 }}
              className="relative overflow-hidden group cursor-pointer rounded-xl break-inside-avoid shadow-lg"
              onClick={() => setSelectedImage(img)}
            >
              <img 
                src={img.src} 
                alt={img.title} 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <span className="text-white font-heading font-semibold text-xl tracking-wider uppercase translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {img.title}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.button 
              className="absolute top-8 right-8 text-white/70 hover:text-accent transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X size={32} />
            </motion.button>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl max-h-[80vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage.src} 
                alt={selectedImage.title} 
                className="w-full h-full object-contain rounded-lg shadow-2xl"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
                <p className="text-white font-heading tracking-widest uppercase text-sm">
                  {selectedImage.title}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;

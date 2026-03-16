import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from './SectionTitle';
import { Instagram } from 'lucide-react';
import { getInstagramPosts } from '../api';

const InstagramFeed = () => {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await getInstagramPosts();
        if (res.data && res.data.length > 0) {
          setFeed(res.data.map(post => post.url));
        } else {
          throw new Error('Empty feed, load dummies');
        }
      } catch (err) {
        console.error('Loading placeholder instagram...', err.message);
        // Fallback robust dummy images
        setFeed([
          "https://images.unsplash.com/photo-1598974357801-bca100c65653?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          "https://images.unsplash.com/photo-1577457599059-e64e5c54ed64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          "https://images.unsplash.com/photo-1550970349-2eeb7edfb3a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          "https://images.unsplash.com/photo-1549480305-6f3decc2283a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          "https://images.unsplash.com/photo-1596701546200-c5e3f4204561?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
        ]);
      }
    };
    fetchFeed();
  }, []);

  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-end mb-16">
          <SectionTitle title="Follow Our Journey" subtitle="Instagram" />
          <a href="https://www.instagram.com/the_ihrs.in/" className="hidden md:flex items-center gap-2 text-accent font-semibold uppercase tracking-widest text-sm hover:text-white transition-colors mb-4">
            <Instagram size={18} /> @the_ihrs.in
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          {feed.map((src, idx) => {
            const isInsta = src.includes('instagram.com/p/') || src.includes('instagram.com/reel/');
            const embedUrl = isInsta ? (src.endsWith('/') ? `${src}embed/` : `${src}/embed/`) : src;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="relative aspect-square bg-dark rounded-md overflow-hidden block group"
              >
                {isInsta ? (
                  <iframe
                    src={embedUrl}
                    className="w-full h-full border-none"
                    scrolling="no"
                    allowtransparency="true"
                    title={`Instagram Post ${idx}`}
                  ></iframe>
                ) : (
                  <a href="#" className="w-full h-full relative block">
                    <img
                      src={src}
                      alt={`Instagram Post ${idx}`}
                      className="w-full h-full object-cover group-hover:scale-110 group-hover:blur-[2px] transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Instagram className="text-white w-10 h-10 drop-shadow-lg" />
                    </div>
                  </a>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 text-center md:hidden">
          <a href="#" className="inline-flex items-center gap-2 text-accent font-semibold uppercase tracking-widest text-sm hover:text-white transition-colors">
            <Instagram size={18} /> @IHRS_Club
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;

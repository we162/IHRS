import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionTitle from './SectionTitle';
import Button from './Button';
import { ShieldCheck, Users, Sun, CheckCircle } from 'lucide-react';

const About = () => {
  const features = [
    { icon: <Users />, title: "Professional Trainers" },
    { icon: <ShieldCheck />, title: "Safe & Trained Horses" },
    { icon: <Sun />, title: "Beautiful Open Arena" },
    { icon: <CheckCircle />, title: "Beginner Friendly" },
  ];

  const aboutImages = [
    '/about1.jpg',
    '/about2.jpg',
    '/about3.jpg',
    '/about4.jpg'
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % aboutImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="about" className="py-24 bg-primary relative">
      <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Image Slideshow - Slides in from left */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative group h-[500px] lg:h-[650px] w-full"
        >
          {/* Decorative background block */}
          <div className="absolute inset-0 bg-accent translate-x-4 translate-y-4 rounded-2xl -z-10 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-500"></div>
          
          <div className="w-full h-full rounded-2xl overflow-hidden relative shadow-2xl z-10 border border-light-gray/20">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={aboutImages[currentImage]}
                alt="About our club"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent pointer-events-none" />
            
            {/* Pagination Indicators */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
              {aboutImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentImage ? 'w-8 bg-accent' : 'w-4 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Text - Slides in from right */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SectionTitle title="The Legacy of Excellence" subtitle="About Our Club" />
          
          <p className="text-white/70 text-lg mb-8 leading-relaxed">
            Welcome to the premier destination for horse riding enthusiasts. Whether you are stepping into the saddle for the first time or looking to refine your competitive edge, our academy offers an exclusive and safe environment to connect with majestic horses.
          </p>

          <div className="grid grid-cols-2 gap-6 mb-10">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + (idx * 0.1) }}
                className="flex items-center gap-4 bg-dark py-4 px-5 rounded-lg border border-light-gray hover:border-accent/50 transition-colors"
              >
                <div className="text-accent w-8 h-8 flex items-center justify-center">
                  {feature.icon}
                </div>
                <span className="text-sm font-semibold tracking-wide text-white/90">
                  {feature.title}
                </span>
              </motion.div>
            ))}
          </div>

          <Button variant="outline" className="px-10 mt-4 text-accent border-accent hover:bg-accent hover:text-white">
            Meet Our Trainers
          </Button>

        </motion.div>

      </div>
    </section>
  );
};

export default About;

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from './Button';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 400]);

  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Video / Image */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 w-full h-full z-0"
      >
        <div className="absolute inset-0 bg-primary/60 dark:bg-black/70 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Horse galloping at sunset" 
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* Content */}
      <div className="container relative z-20 mx-auto px-6 text-center pt-24">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-accent uppercase tracking-[0.3em] text-sm md:text-base mb-6 font-semibold"
        >
          Where Passion Meets Performance
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-heading text-white mb-8 leading-tight max-w-5xl mx-auto"
        >
          Experience Premium <br />
          <span className="italic font-light">Horse Riding</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12"
        >
          <a href="#booking">
            <Button className="px-10 py-4 text-lg">
              Book Your Ride
            </Button>
          </a>
          <a href="#about" className="uppercase text-white tracking-widest text-sm font-semibold hover:text-accent transition-colors flex items-center gap-2">
            Discover More
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-white/60 text-xs uppercase tracking-[0.2em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="text-accent w-6 h-6" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

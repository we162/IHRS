import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import InstagramFeed from './components/InstagramFeed';
import Gallery from './components/Gallery';
import Booking from './components/Booking';
import Map from './components/Map';
import Footer from './components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { getSettings } from './api';

function App() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    clubName: 'IHRS ',
    email: 'hello@ihrsclub.com',
    phone: '+1 (555) 123-4567',
    mapLink: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.915783305417!2d78.4344!3d17.4168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI1JzAwLjUiTiA3OMKwMjYnMDMuOCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin',
    address: 'Dundigal, Domara Pocham Pally, Telangana 500043, India'
  });

  useEffect(() => {
    // Fetch global settings from database
    const init = async () => {
      try {
        const { data } = await getSettings();
        if (data) setSettings(data);
      } catch (err) {
        console.warn("Failed to load settings, using defaults");
      }

      // Simulate loading for the intro animation
      setTimeout(() => {
        setLoading(false);
      }, 2500);
    };

    init();
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-primary flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Cinematic Ambient Glow */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-accent rounded-full blur-[120px] pointer-events-none"
            />

            {/* Logo & typography Reveal Sequence */}
            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <img
                  src="/logo.png"
                  alt="IHRS Club Logo"
                  className="w-32 h-32 md:w-40 md:h-40 mb-8 filter drop-shadow-[0_0_20px_rgba(255,107,0,0.6)]"
                />
              </motion.div>

              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className="text-white font-heading text-4xl md:text-5xl tracking-[0.3em] font-light uppercase"
                >
                  <span className="text-accent font-bold">IHRS</span>
                </motion.h1>
              </div>

              <motion.div
                initial={{ opacity: 0, letterSpacing: "0.2em" }}
                animate={{ opacity: 1, letterSpacing: "0.5em" }}
                transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
                className="mt-6 text-white/50 text-xs md:text-sm uppercase font-semibold"
              >
                Equestrian Excellence
              </motion.div>
            </div>

            {/* Premium Trailing Progress Line */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "250px", opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.8, ease: "circOut" }}
                className="h-[1px] bg-light-gray/30 relative overflow-hidden"
              >
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "250px" }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 1.5 }}
                  className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_10px_#FF6B00]"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`transition-opacity duration-1000 overflow-x-hidden ${loading ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'}`}>
        <Navbar settings={settings} />
        <Hero />
        <About />
        <Experience />
        <InstagramFeed />
        <Gallery />
        <Booking settings={settings} />
        <Map settings={settings} />
        <Footer settings={settings} />
      </div>
    </>
  );
}

export default App;
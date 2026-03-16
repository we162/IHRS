import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';

const Navbar = ({ settings }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#experience' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed w-full top-0 z-50 transition-all duration-500 flex justify-center ${scrolled ? 'pt-4 md:pt-6 px-4 md:px-0' : 'pt-6 px-6 lg:px-12'}`}
      >
        <div 
          className={`flex justify-between items-center w-full transition-all duration-500 ${
            scrolled 
              ? 'max-w-5xl bg-primary/70 backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.6)] rounded-full px-6 py-3' 
              : 'max-w-7xl px-0 py-2'
          }`}
        >
          {/* Logo Section */}
          <a href="#home" className="text-xl md:text-2xl font-bold font-heading text-white flex items-center gap-3 z-50 relative group">
            <div className={`relative flex items-center justify-center transition-all duration-500 ${scrolled ? 'w-[45px] md:w-[55px]' : 'w-[80px] md:w-[100px]'}`}>
              {/* Subtle Logo Glow on Hover */}
              <div className="absolute inset-0 bg-accent/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img src="/logo.png" alt="IHRS Logo" className="w-full h-auto object-contain drop-shadow-md filter invert-[1] relative z-10" />
            </div>
            <span className={`hidden sm:block transition-all duration-300 ${scrolled ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'}`}>
              <span className="text-accent">{settings?.clubName?.split(' ')[0] || 'IHRS'}</span> {settings?.clubName?.split(' ').slice(1).join(' ')}
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative group text-white/70 hover:text-white transition-colors text-[11px] uppercase tracking-[0.2em] font-medium"
              >
                <span className="relative z-10">{link.name}</span>
                {/* Minimalist dot indicator replacing standard line */}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100 shadow-[0_0_8px_rgba(255,107,0,0.8)]"></span>
              </a>
            ))}
          </div>

          {/* Glowing CTA Button */}
          <a 
            href="#booking" 
            className={`hidden md:flex items-center gap-2 border text-white px-7 py-2.5 rounded-full hover:bg-accent hover:border-accent transition-all duration-500 font-medium text-xs tracking-[0.15em] uppercase group overflow-hidden relative ${scrolled ? 'border-accent/30 bg-accent/5' : 'border-light-gray/40 bg-transparent'}`}
          >
            {/* Light sweep effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"></span>
            <span className="relative z-10">Book Ride</span>
            <ArrowRight size={14} className="relative z-10 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            className="md:hidden text-white z-50 relative p-2 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} className="text-white" /> : <Menu size={28} />}
          </button>
        </div>
      </motion.nav>

      {/* Cinematic Full-Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at right top)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at right top)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at right top)" }}
            transition={{ duration: 0.8, ease: [0.32, 1, 0.23, 1] }}
            className="fixed inset-0 z-40 bg-primary/95 backdrop-blur-3xl flex flex-col items-center justify-center min-h-screen border-t border-accent/10"
          >
            {/* Ambient Background Glows in Mobile Menu */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="flex flex-col items-center gap-10 text-center w-full px-6 relative z-10">
              {navLinks.map((link, idx) => (
                <motion.a
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + (idx * 0.1), duration: 0.6, ease: "easeOut" }}
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white text-3xl md:text-5xl font-heading tracking-widest uppercase hover:text-accent transition-colors relative group"
                >
                  <span className="relative z-10">{link.name}</span>
                  <span className="absolute left-0 bottom-2 w-full h-3 bg-accent/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                </motion.a>
              ))}
              
              <motion.a
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                href="#booking"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-8 border border-accent/30 bg-accent/10 text-white px-12 py-5 rounded-full hover:bg-accent hover:border-accent transition-all duration-300 font-bold tracking-[0.2em] uppercase w-full max-w-[300px] flex items-center justify-center gap-3 relative overflow-hidden group shadow-[0_0_20px_rgba(255,107,0,0.1)]"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"></span>
                Book Now
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

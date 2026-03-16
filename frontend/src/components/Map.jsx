import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';

const Map = ({ settings }) => {
  // Parsing dynamic operating hours or fallback
  const processTime = (t) => {
    if (!t) return '';
    let [h, m] = t.split(':');
    let hr = parseInt(h);
    const ampm = hr >= 12 ? 'PM' : 'AM';
    hr = hr % 12 || 12;
    return `${hr}:${m} ${ampm}`;
  };

  const morningStr = (settings?.morningStart && settings?.morningEnd) 
    ? `${processTime(settings.morningStart)} - ${processTime(settings.morningEnd)}`
    : '06:00 AM - 11:00 AM';
    
  const eveningStr = (settings?.eveningStart && settings?.eveningEnd)
    ? `${processTime(settings.eveningStart)} - ${processTime(settings.eveningEnd)}`
    : '04:00 PM - 07:00 PM';

  return (
    <section id="contact" className="relative w-full h-[800px] md:h-[700px] lg:h-[800px] bg-primary overflow-hidden">
      
      {/* Immersive Background Map */}
      <div className="absolute inset-0 z-0">
        <iframe
          src={settings?.mapLink || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121697.15747110243!2d78.33303148619268!3d17.60101718781005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb8f0061838599%3A0xd9581fee0cc038e4!2sIHRS!5e0!3m2!1sen!2sin!4v1773573917142!5m2!1sen!2sin"}
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(85%) opacity(0.6)' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location Map"
        ></iframe>
        
        {/* Dynamic Vignette / Fade Gradient Over Map */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 lg:via-primary/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10 h-full flex flex-col justify-center">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center h-full pt-20 lg:pt-0">
          
          {/* Floating Glassmorphic Contact Card */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md bg-dark/70 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 lg:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative group overflow-hidden"
          >
            {/* Animated card border reflection */}
            <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 group-hover:animate-sweep pointer-events-none" />

            <div className="mb-10">
              <h2 className="text-sm uppercase tracking-[0.3em] text-accent mb-2">Find Us</h2>
              <h3 className="text-3xl md:text-4xl font-heading text-white mb-4">Headquarters</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Experience the finest equestrian facility built for passion and performance.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-5 group/item">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center border border-white/5 group-hover/item:border-accent/50 group-hover/item:bg-accent/10 transition-colors shadow-inner shrink-0">
                  <MapPin className="text-accent h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white text-xs uppercase tracking-[0.2em] mb-1 font-semibold">Address</h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {settings?.address || 'Dundigal, Domara Pocham Pally\nTelangana 500043, India'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 group/item">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center border border-white/5 group-hover/item:border-accent/50 group-hover/item:bg-accent/10 transition-colors shadow-inner shrink-0">
                  <Phone className="text-accent h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white text-xs uppercase tracking-[0.2em] mb-1 font-semibold">Contact</h4>
                  <a href={`tel:${settings?.phone}`} className="text-white/70 text-sm block hover:text-accent transition-colors">
                    {settings?.phone || '+1 (555) 123-4567'}
                  </a>
                  <a href={`mailto:${settings?.email}`} className="text-white/70 text-sm block hover:text-accent transition-colors">
                    {settings?.email || 'hello@ihrsclub.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-5 group/item">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center border border-white/5 group-hover/item:border-accent/50 group-hover/item:bg-accent/10 transition-colors shadow-inner shrink-0">
                  <Clock className="text-accent h-5 w-5" />
                </div>
                <div className="w-full">
                  <h4 className="text-white text-xs uppercase tracking-[0.2em] mb-2 font-semibold flex items-center justify-between">
                    Operating Hours
                    <span className="text-[10px] bg-accent text-white px-2 py-0.5 rounded-full">Live</span>
                  </h4>
                  <div className="bg-primary/50 border border-white/5 rounded-xl p-3 text-xs flex justify-between items-center text-white/70 group-hover/item:border-accent/30 transition-colors">
                    <span className="text-white/40">Morning</span>
                    <span className="font-mono text-accent">{morningStr}</span>
                  </div>
                  <div className="bg-primary/50 border border-white/5 rounded-xl p-3 text-xs flex justify-between items-center text-white/70 mt-2 group-hover/item:border-accent/30 transition-colors">
                    <span className="text-white/40">Evening</span>
                    <span className="font-mono text-accent">{eveningStr}</span>
                  </div>
                </div>
              </div>
            </div>

            <a href={settings?.mapLink || '#'} target="_blank" rel="noreferrer" className="w-full mt-10 flex items-center justify-center gap-2 border border-white/10 hover:border-accent bg-primary hover:bg-accent/10 transition-all text-white py-4 rounded-xl text-xs uppercase tracking-[0.15em] relative overflow-hidden group/btn font-bold">
               Get Directions
               <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Map;

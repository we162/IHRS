import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionTitle from './SectionTitle';
import Button from './Button';
import { Calendar, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { checkAvailability, createBooking } from '../api';

const Booking = ({ settings }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', date: '', experience_level: 'Beginner', ride_type: 'Arena Training' });
  const [loading, setLoading] = useState(false);
  const [availabilities, setAvailabilities] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [slots, setSlots] = useState([]);

  const MAX_CAPACITY = 10;

  // Generate dynamic slots based on admin settings
  useEffect(() => {
    if (!settings) return;

    const generateSlots = (start, end, duration) => {
      if (!start || !end || !duration) return [];
      
      const toMinutes = (t) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
      };

      const formatTime = (mins) => {
        const h = Math.floor(mins / 60);
        const m = Math.floor(mins % 60);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hr12 = h % 12 || 12;
        return `${String(hr12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
      };

      const startMins = toMinutes(start);
      const endMins = toMinutes(end);
      let current = startMins;
      const result = [];

      while (current + duration <= endMins) {
        result.push(formatTime(current));
        current += duration;
      }
      return result;
    };

    const duration = Number(settings.slotDuration || 45);
    const morningSlots = generateSlots(settings.morningStart || '06:00', settings.morningEnd || '11:00', duration);
    const eveningSlots = generateSlots(settings.eveningStart || '16:00', settings.eveningEnd || '19:00', duration);
    
    setSlots([...morningSlots, ...eveningSlots]);
  }, [settings]);

  // When date changes, fetch available slots for that date
  useEffect(() => {
    if (formData.date) {
      setAvailabilities({});
      setSelectedSlot(null); // Reset selected slot when date changes
      fetchAvailability(formData.date);
    }
  }, [formData.date]);

  const fetchAvailability = async (date) => {
    try {
      const { data } = await checkAvailability(date);
      setAvailabilities(data);
    } catch (err) {
      console.error("Failed to fetch availabilities");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date) {
      alert('Please select a date first.');
      return;
    }
    if (!selectedSlot) {
      alert('Please select a time slot first.');
      return;
    }
    
    setLoading(true);
    try {
      await createBooking({
        ...formData,
        start_time: selectedSlot,
        end_time: selectedSlot, // Mock calculation
        slots: 1
      });
      // Trigger Success Animation
      setIsSuccess(true);

      // Reset form after short delay
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', phone: '', email: '', date: '', experience_level: 'Beginner', ride_type: 'Arena Training' });
        setSelectedSlot(null);
        setAvailabilities({});
      }, 5000);
      
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="booking" className="py-24 bg-primary relative overflow-hidden flex items-center min-h-[900px]">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start lg:items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <SectionTitle title="Reserve Your Saddle" subtitle="Book a Ride" />
            <p className="text-white/60 text-lg mb-8 leading-relaxed max-w-lg">
              Experience the thrill of riding in our premium arena or explore the scenic trails. Select your preferred date to view real-time slot availability.
            </p>
            
            <div className="mb-8 bg-dark/50 backdrop-blur-md p-6 rounded-2xl border border-light-gray/40">
              <h4 className="text-white font-heading text-xl mb-4 flex items-center gap-2">
                <Clock className="text-accent" size={20} /> Slot Availability
              </h4>
              
              {!formData.date ? (
                <div className="p-8 border border-dashed border-light-gray/40 rounded-xl flex flex-col items-center justify-center text-center bg-primary/20">
                  <Calendar size={32} className="text-white/30 mb-3" />
                  <p className="text-white/50 text-sm">Please select a preferred date in the form to view real-time slot availability.</p>
                </div>
              ) : slots.length === 0 ? (
                <div className="p-8 border border-dashed border-light-gray/40 rounded-xl flex flex-col items-center justify-center text-center bg-primary/20">
                  <p className="text-white/50 text-sm">No slots configured by admin.</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  <AnimatePresence>
                    {slots.map((slot, idx) => {
                      const bookedCount = availabilities[slot] || 0;
                      const isFull = bookedCount >= MAX_CAPACITY;
                      const spotsLeft = MAX_CAPACITY - bookedCount;
                      const isSelected = selectedSlot === slot;

                      return (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          key={idx}
                          type="button"
                          disabled={isFull}
                          onClick={() => setSelectedSlot(slot)}
                          className={`relative px-5 py-3 rounded-xl border text-sm font-medium tracking-wide transition-all duration-300 flex flex-col items-start gap-1 overflow-hidden min-w-[120px] ${
                            isFull 
                              ? 'border-red-500/20 bg-red-500/5 text-white/30 cursor-not-allowed grayscale' 
                              : isSelected
                                ? 'border-accent bg-accent/10 text-white shadow-[0_0_20px_rgba(255,107,0,0.2)]'
                                : 'border-light-gray/50 text-white/70 hover:border-accent/50 hover:bg-dark/80 bg-primary'
                          }`}
                        >
                          <span className={`${isSelected ? 'text-accent font-bold' : ''} text-base block w-full text-left`}>{slot}</span>
                          <span className={`text-[10px] uppercase font-bold tracking-wider ${isFull ? 'text-red-500/50' : isSelected ? 'text-white' : 'text-accent'}`}>
                            {isFull ? 'Full' : `${spotsLeft} Spots Left`}
                          </span>
                          
                          {/* Selected Indicator */}
                          {isSelected && (
                            <motion.div 
                              layoutId="activeSlotIndicator"
                              className="absolute top-0 right-0 w-full h-1 bg-accent"
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
            
            <div className="bg-dark/80 border border-accent/20 rounded-xl p-5 flex items-center justify-between mt-8 shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
                  <span className="w-3 h-3 rounded-full bg-accent animate-pulse shadow-[0_0_15px_rgba(255,107,0,1)]"></span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold tracking-wide">Live Database Synced</p>
                  <p className="text-white/50 text-xs mt-1">Capactiy precisely capped at 10 riders per slot.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Form Container */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full relative min-h-[650px] lg:h-[650px] flex items-center"
          >
            {/* Main Form */}
            <AnimatePresence>
              {!isSuccess && (
                <motion.div 
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: -90 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="bg-dark/80 backdrop-blur-2xl border border-light-gray/50 p-8 md:p-12 rounded-3xl shadow-2xl relative w-full h-full"
                >
                  <div className="absolute top-0 right-10 w-32 h-1 bg-gradient-to-r from-accent to-[#FF8C00] rounded-b-lg"></div>
                  
                  <h3 className="text-2xl font-heading text-white mb-8">Booking Details</h3>
                  
                  <form className="space-y-6 h-full" onSubmit={handleSubmit}>
                    
                    <div className="space-y-2">
                      <label className="text-white/60 text-[10px] uppercase font-bold tracking-[0.2em] pl-4">Preferred Date</label>
                      <div className="relative group/date">
                        <input 
                          type="date"
                          required
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full bg-primary/80 border border-light-gray/50 rounded-2xl px-6 py-4 text-white hover:border-accent/50 focus:outline-none focus:border-accent transition-colors [color-scheme:dark] shadow-inner"
                        />
                        <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none group-hover/date:text-accent transition-colors" size={20} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-white/60 text-[10px] uppercase font-bold tracking-[0.2em] pl-4">Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-primary/80 border border-light-gray/50 rounded-2xl px-6 py-4 text-white placeholder-white/20 hover:border-accent/50 focus:outline-none focus:border-accent transition-colors shadow-inner"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-white/60 text-[10px] uppercase font-bold tracking-[0.2em] pl-4">Phone Number</label>
                        <input 
                          type="tel" 
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-primary/80 border border-light-gray/50 rounded-2xl px-6 py-4 text-white placeholder-white/20 hover:border-accent/50 focus:outline-none focus:border-accent transition-colors shadow-inner"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-white/60 text-[10px] uppercase font-bold tracking-[0.2em] pl-4">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-primary/80 border border-light-gray/50 rounded-2xl px-6 py-4 text-white placeholder-white/20 hover:border-accent/50 focus:outline-none focus:border-accent transition-colors shadow-inner"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-white/60 text-[10px] uppercase font-bold tracking-[0.2em] pl-4">Experience Level</label>
                        <select 
                          value={formData.experience_level}
                          onChange={(e) => setFormData({...formData, experience_level: e.target.value})}
                          className="w-full bg-primary/80 border border-light-gray/50 rounded-2xl px-6 py-4 text-white hover:border-accent/50 focus:outline-none focus:border-accent transition-colors appearance-none shadow-inner"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-white/60 text-[10px] uppercase font-bold tracking-[0.2em] pl-4">Ride Type</label>
                        <select 
                          value={formData.ride_type}
                          onChange={(e) => setFormData({...formData, ride_type: e.target.value})}
                          className="w-full bg-primary/80 border border-light-gray/50 rounded-2xl px-6 py-4 text-white hover:border-accent/50 focus:outline-none focus:border-accent transition-colors appearance-none shadow-inner"
                        >
                          <option value="Arena Training">Arena Training</option>
                          <option value="Trail Ride">Trail Ride</option>
                          <option value="Private Coaching">Private Coaching</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-accent hover:bg-[#FF8C00] text-white font-semibold flex items-center justify-center gap-3 py-4 rounded-2xl mt-4 transition-all shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_30px_rgba(255,107,0,0.5)] disabled:opacity-50 disabled:cursor-not-allowed group/btn" 
                      disabled={loading || !formData.date || !selectedSlot}
                    >
                      {loading ? 'Processing...' : (
                        <>
                          Confirm Booking
                          <ArrowRight size={18} className="translate-x-0 group-hover/btn:translate-x-2 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Overlay state - Flips into view */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div 
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.8, ease: "easeInOut", delay: 0.4 }}
                  className="absolute inset-0 bg-dark/95 backdrop-blur-3xl border border-accent/30 p-8 rounded-3xl shadow-[0_0_50px_rgba(255,107,0,0.2)] flex flex-col items-center justify-center text-center overflow-hidden"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, delay: 1 }}
                    className="w-32 h-32 bg-accent/10 rounded-full flex items-center justify-center mb-8 relative"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 bg-accent/20 rounded-full blur-xl"
                    />
                    <CheckCircle className="text-accent w-16 h-16 relative z-10" />
                  </motion.div>
                  
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="text-3xl font-heading text-white mb-4"
                  >
                    Booking Confirmed!
                  </motion.h3>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                    className="text-white/60 text-lg max-w-sm mb-12"
                  >
                    Your saddle is reserved. A confirmation email and SMS has been sent to {formData.email}.
                  </motion.p>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="w-full bg-primary/50 text-white/40 text-sm py-4 rounded-xl border border-light-gray/20"
                  >
                    Taking you back shortly...
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Booking;

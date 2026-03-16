import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Settings2, Clock, MapPin, Mail, Phone, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSettings, updateSettings } from '../api';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    clubName: '',
    email: '',
    phone: '',
    mapLink: '',
    address: '',
    morningStart: '06:00',
    morningEnd: '11:00',
    eveningStart: '16:00',
    eveningEnd: '19:00',
    slotDuration: 45
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await getSettings();
      if(data) setSettings(data);
    } catch (err) {
      toast.error('Failed to load settings');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSettings({...settings, [e.target.name]: e.target.value});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">System Settings</h1>
          <p className="text-gray-400 text-sm mt-1">Configure global club information and hours.</p>
        </div>
        
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="bg-[#FF6B00] hover:bg-[#FF8C00] text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all shadow-[0_0_15px_rgba(255,107,0,0.3)] hover:shadow-[0_0_20px_rgba(255,107,0,0.5)] disabled:opacity-70 mx-0"
        >
          {loading ? <span className="animate-pulse flex items-center gap-2">Saving...</span> : <><Save size={18} /> Save Changes</>}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* General Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#1E1E1E] rounded-2xl p-6 md:p-8 border border-[#2C2C2C] shadow-lg h-fit"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#FF6B00]/10 rounded-lg text-[#FF6B00]">
              <Settings2 size={24} />
            </div>
            <h2 className="text-xl font-heading font-semibold text-white">General Information</h2>
          </div>
          
          <form className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-sm font-medium text-gray-300 ml-1">Club Name</label>
              <input 
                type="text" 
                name="clubName"
                value={settings.clubName}
                onChange={handleChange}
                className="w-full bg-[#111111] border border-[#2C2C2C] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
              />
            </div>
            
            <div className="space-y-2 group">
              <label className="text-sm font-medium text-gray-300 ml-1">Contact Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF6B00] transition-colors" size={18} />
                <input 
                  type="email" 
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  className="w-full bg-[#111111] border border-[#2C2C2C] rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-sm font-medium text-gray-300 ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF6B00] transition-colors" size={18} />
                <input 
                  type="tel" 
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  className="w-full bg-[#111111] border border-[#2C2C2C] rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-sm font-medium text-gray-300 ml-1">Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3 text-gray-500 group-focus-within:text-[#FF6B00] transition-colors" size={18} />
                <textarea 
                  rows="2"
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  className="w-full bg-[#111111] border border-[#2C2C2C] rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[#FF6B00] transition-colors resize-none"
                ></textarea>
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-sm font-medium text-gray-300 ml-1">Location Map Link</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3 text-gray-500 group-focus-within:text-[#FF6B00] transition-colors" size={18} />
                <textarea 
                  rows="3"
                  name="mapLink"
                  value={settings.mapLink}
                  onChange={handleChange}
                  className="w-full bg-[#111111] border border-[#2C2C2C] rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[#FF6B00] transition-colors resize-none"
                ></textarea>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Operating Hours */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-[#1E1E1E] rounded-2xl p-6 md:p-8 border border-[#2C2C2C] shadow-lg h-fit"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#FF6B00]/10 rounded-lg text-[#FF6B00]">
              <Clock size={24} />
            </div>
            <h2 className="text-xl font-heading font-semibold text-white">Operating Hours</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-[#111111] border border-[#2C2C2C] rounded-xl p-5 relative overflow-hidden group">
              <div className="absolute right-0 top-0 h-full w-2 bg-gradient-to-b from-[#FF6B00]/20 to-transparent group-hover:from-[#FF6B00]/50 transition-colors"></div>
              <div className="flex items-center gap-3 border-b border-[#2C2C2C] pb-3 mb-4">
                <Sun size={20} className="text-[#FF6B00]" />
                <h3 className="font-semibold text-white">Morning Session</h3>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm mt-3">
                <div className="space-y-1 w-full">
                  <span className="text-gray-500">From</span>
                  <input type="time" name="morningStart" value={settings.morningStart || '06:00'} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-[#2C2C2C] rounded-lg py-2 px-3 focus:outline-none focus:border-[#FF6B00] text-white [color-scheme:dark]" />
                </div>
                <div className="space-y-1 w-full">
                  <span className="text-gray-500">To</span>
                  <input type="time" name="morningEnd" value={settings.morningEnd || '11:00'} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-[#2C2C2C] rounded-lg py-2 px-3 focus:outline-none focus:border-[#FF6B00] text-white [color-scheme:dark]" />
                </div>
              </div>
            </div>

            <div className="bg-[#111111] border border-[#2C2C2C] rounded-xl p-5 relative overflow-hidden group">
              <div className="absolute right-0 top-0 h-full w-2 bg-gradient-to-b from-indigo-500/20 to-transparent group-hover:from-indigo-500/50 transition-colors"></div>
              <div className="flex items-center gap-3 border-b border-[#2C2C2C] pb-3 mb-4">
                <Moon size={20} className="text-indigo-400" />
                <h3 className="font-semibold text-white">Evening Session</h3>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm mt-3">
                <div className="space-y-1 w-full">
                  <span className="text-gray-500">From</span>
                  <input type="time" name="eveningStart" value={settings.eveningStart || '16:00'} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-[#2C2C2C] rounded-lg py-2 px-3 focus:outline-none focus:border-[#FF6B00] text-white [color-scheme:dark]" />
                </div>
                <div className="space-y-1 w-full">
                  <span className="text-gray-500">To</span>
                  <input type="time" name="eveningEnd" value={settings.eveningEnd || '19:00'} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-[#2C2C2C] rounded-lg py-2 px-3 focus:outline-none focus:border-[#FF6B00] text-white [color-scheme:dark]" />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#2C2C2C] mt-6 flex justify-between items-center text-sm">
              <span className="text-gray-400">Slot Duration</span>
              <select name="slotDuration" value={settings.slotDuration || 45} onChange={handleChange} className="bg-[#111111] border border-[#2C2C2C] rounded-lg px-4 py-2 focus:outline-none focus:border-[#FF6B00] text-white">
                <option value="30">30 Minutes</option>
                <option value="45">45 Minutes</option>
                <option value="60">1 Hour</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;

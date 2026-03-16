import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart, 
  Calendar, 
  Image as ImageIcon, 
  Camera, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: BarChart },
  { name: 'Bookings', path: '/bookings', icon: Calendar },
  { name: 'Gallery', path: '/gallery', icon: ImageIcon },
  { name: 'Instagram', path: '/instagram', icon: Camera },
  { name: 'Admins', path: '/admins', icon: Users },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={toggleSidebar}
      />

      <motion.aside 
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed md:relative z-50 w-64 h-screen flex flex-col bg-[#111111] border-r border-[#2C2C2C] shadow-xl md:translate-x-0 ${!isOpen && 'md:w-20'} transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-6 h-20 border-b border-[#2C2C2C]">
          <h2 className={`text-xl font-heading font-bold text-white transition-opacity duration-300 overflow-hidden flex items-center gap-2 ${!isOpen && 'md:hidden'}`}>
            <img src="/logo.png" alt="IHRS Logo" className="w-8 h-8 object-contain filter invert-[1]" />
            <span className="text-[#FF6B00]">IHRS</span>CLUB
          </h2>
          <button onClick={toggleSidebar} className="md:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 space-y-2 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center py-3 px-4 rounded-xl transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-[#FF6B00] text-white shadow-[0_0_15px_rgba(255,107,0,0.3)]' 
                    : 'text-gray-400 hover:bg-[#1E1E1E] hover:text-white'}`
                }
              >
                <div className="relative">
                  <Icon size={20} className={`${isActive ? 'text-white' : 'group-hover:text-[#FF6B00] transition-colors duration-300'}`} />
                </div>
                
                <span className={`ml-4 font-medium whitespace-nowrap transition-opacity duration-300 ${!isOpen && 'md:hidden'}`}>
                  {item.name}
                </span>

                {/* Tooltip for collapsed sidebar */}
                {!isOpen && (
                  <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-[#1E1E1E] px-3 py-1.5 rounded text-sm text-white opacity-0 pointer-events-none group-hover:opacity-100 hidden md:block whitespace-nowrap z-50 border border-[#2C2C2C]">
                    {item.name}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#2C2C2C]">
          <NavLink
            to="/login"
            className="flex items-center py-3 px-4 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 group"
          >
            <LogOut size={20} className="group-hover:text-red-500" />
            <span className={`ml-4 font-medium transition-opacity duration-300 ${!isOpen && 'md:hidden'}`}>
              Logout
            </span>
          </NavLink>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;

import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <header className="h-20 bg-[#111111] border-b border-[#2C2C2C] flex items-center justify-between px-6 z-30 sticky top-0 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 mr-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1E1E1E] transition-colors"
        >
          <Menu size={24} />
        </button>
        
        {/* Search */}
        <div className="hidden md:flex relative group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF6B00] transition-colors" />
          <input 
            type="text" 
            placeholder="Search bookings..." 
            className="bg-[#1E1E1E] border border-[#2C2C2C] rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all text-white placeholder-gray-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1E1E1E] transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-[#111111]"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-[#2C2C2C]">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-white">Super Admin</p>
            <p className="text-xs text-gray-500 font-medium">admin@horseclub.com</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#1E1E1E] border border-[#FF6B00] overflow-hidden flex items-center justify-center">
            <span className="text-sm font-bold text-[#FF6B00]">AD</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

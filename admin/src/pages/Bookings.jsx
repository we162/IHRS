import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Trash2, Check, X, Clock } from 'lucide-react';
import { getBookings, deleteBooking, cancelBooking } from '../api';
import toast from 'react-hot-toast';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await getBookings();
      setBookings(res.data.map(b => ({
        id: b._id,
        name: b.name,
        phone: b.phone,
        date: b.date,
        slots: b.start_time,
        type: `${b.slots} slot(s)`,
        experience_level: b.experience_level || 'Beginner',
        ride_type: b.ride_type || 'Arena Training',
        status: b.status.charAt(0).toUpperCase() + b.status.slice(1)
      })));
    } catch (err) {
      toast.error('Failed to load bookings');
    }
  };

  const removeBooking = async (id) => {
    try {
      await deleteBooking(id);
      setBookings(bookings.filter(b => b.id !== id));
      toast.success('Booking deleted');
    } catch (err) {
      toast.error('Failed to delete booking');
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      if (newStatus === 'Cancelled') {
        await cancelBooking(id);
      }
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
      toast.success(`Booking ${newStatus}`);
    } catch (err) {
      toast.error('Status update failed');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Confirmed': return 'bg-green-500/10 text-green-500 border border-green-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'Pending': return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Booking Management</h1>
          <p className="text-gray-400 text-sm mt-1">View and manage riding sessions.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group hidden sm:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-[#1E1E1E] border border-[#2C2C2C] rounded-lg py-2 pl-9 pr-4 text-sm w-48 focus:outline-none focus:border-[#FF6B00] text-white"
            />
          </div>
          <button className="bg-[#1E1E1E] border border-[#2C2C2C] text-gray-300 hover:text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors shadow-sm">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#1E1E1E] rounded-2xl border border-[#2C2C2C] shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#111111] border-b border-[#2C2C2C] text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 font-medium">Customer Info</th>
                <th className="px-6 py-4 font-medium">Session Details</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2C2C2C]">
              <AnimatePresence>
                {bookings.map((booking, idx) => (
                  <motion.tr 
                    key={booking.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="group hover:bg-[#2C2C2C]/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-white">{booking.name}</p>
                        <p className="text-xs text-gray-500">{booking.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm text-gray-300 flex items-center gap-1">
                          <Clock size={14} className="text-[#FF6B00]" /> {booking.date} at {booking.slots}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                          <span className="bg-[#2C2C2C] px-2 py-0.5 rounded text-white">{booking.ride_type}</span>
                          <span className="bg-[#2C2C2C] px-2 py-0.5 rounded text-[#FF6B00]">{booking.experience_level}</span>
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {booking.status === 'Pending' && (
                          <button onClick={() => updateStatus(booking.id, 'Confirmed')} className="p-1.5 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-md transition-colors" title="Confirm">
                            <Check size={16} />
                          </button>
                        )}
                        {booking.status !== 'Cancelled' && (
                          <button onClick={() => updateStatus(booking.id, 'Cancelled')} className="p-1.5 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 rounded-md transition-colors" title="Cancel">
                            <X size={16} />
                          </button>
                        )}
                        <button onClick={() => removeBooking(booking.id)} className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-md transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              
              {bookings.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="px-6 py-4 border-t border-[#2C2C2C] flex items-center justify-between text-sm text-gray-400 bg-[#111111]">
          <span>Showing 1 to {bookings.length} of 24 entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-[#1E1E1E] border border-[#2C2C2C] rounded hover:text-white transition-colors disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 bg-[#2C2C2C] text-white rounded">1</button>
            <button className="px-3 py-1 bg-[#1E1E1E] border border-[#2C2C2C] rounded hover:text-white transition-colors">2</button>
            <button className="px-3 py-1 bg-[#1E1E1E] border border-[#2C2C2C] rounded hover:text-white transition-colors">Next</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Bookings;
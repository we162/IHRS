import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Trash2, Clock, ChevronDown, IndianRupee,
  CheckCircle2, XCircle, Ban, RefreshCw, Filter, X, SlidersHorizontal
} from 'lucide-react';
import { getBookings, deleteBooking, updateBookingStatus } from '../api';
import toast from 'react-hot-toast';

const RIDE_PRICE = 500; // ₹500 per session — configurable

const STATUS_CONFIG = {
  confirmed:      { label: 'Confirmed',      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',    dot: 'bg-blue-400' },
  pending:        { label: 'Pending',         color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', dot: 'bg-yellow-400' },
  cancelled:      { label: 'Cancelled',       color: 'bg-red-500/10 text-red-400 border-red-500/20',       dot: 'bg-red-400' },
  ride_completed: { label: 'Ride Completed',  color: 'bg-green-500/10 text-green-400 border-green-500/20', dot: 'bg-green-400' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.confirmed;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full border ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
      {cfg.label}
    </span>
  );
};

const StatusDropdown = ({ bookingId, current, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [amountModal, setAmountModal] = useState(false);
  const [amount, setAmount] = useState(RIDE_PRICE);

  const options = Object.entries(STATUS_CONFIG).filter(([s]) => s !== current);

  const handleSelect = (status) => {
    setOpen(false);
    if (status === 'ride_completed') {
      setAmountModal(true);
    } else {
      onUpdate(bookingId, status, null);
    }
  };

  return (
    <>
      <div className="relative inline-block">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-[#111] border border-[#333] hover:border-[#FF6B00]/50 rounded-lg px-3 py-1.5 transition-all"
        >
          Change <ChevronDown size={12} />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-1 w-44 bg-[#1E1E1E] border border-[#2C2C2C] rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              {options.map(([status, cfg]) => (
                <button
                  key={status}
                  onClick={() => handleSelect(status)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-[#2C2C2C] text-gray-300 hover:text-white transition-colors"
                >
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`}></span>
                  {cfg.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Amount Modal for ride_completed */}
      <AnimatePresence>
        {amountModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setAmountModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1E1E1E] border border-[#2C2C2C] rounded-2xl p-8 w-[360px] shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-heading font-bold text-white mb-1">Mark as Completed</h3>
              <p className="text-gray-400 text-sm mb-6">Enter the amount charged for this session.</p>
              <div className="relative mb-5">
                <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF6B00]" />
                <input
                  type="number"
                  value={amount}
                  min={0}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full bg-[#111] border border-[#333] focus:border-[#FF6B00] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none text-lg font-semibold"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setAmountModal(false)}
                  className="flex-1 py-3 rounded-xl border border-[#333] text-gray-400 hover:text-white text-sm transition-colors"
                >Cancel</button>
                <button
                  onClick={() => { onUpdate(bookingId, 'ride_completed', amount); setAmountModal(false); }}
                  className="flex-1 py-3 rounded-xl bg-[#FF6B00] hover:bg-[#FF8C00] text-white text-sm font-bold shadow-[0_0_15px_rgba(255,107,0,0.3)] transition-all"
                >Confirm ₹{amount}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // all | today | yesterday | this_week
  const [rideTypeFilter, setRideTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getBookings();
      setBookings(res.data.map(b => ({
        id: b._id,
        name: b.name,
        phone: b.phone,
        email: b.email,
        date: b.date,
        slot: b.start_time,
        ride_type: b.ride_type || 'Arena Training',
        experience_level: b.experience_level || 'Beginner',
        status: b.status || 'confirmed',
        amount: b.amount || 0,
        createdAt: b.createdAt,
      })));
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const removeBooking = async (id) => {
    if (!confirm('Delete this booking permanently?')) return;
    try {
      await deleteBooking(id);
      setBookings(prev => prev.filter(b => b.id !== id));
      toast.success('Booking deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleStatusUpdate = async (id, status, amount) => {
    try {
      await updateBookingStatus(id, status, amount);
      setBookings(prev => prev.map(b =>
        b.id === id ? { ...b, status, amount: status === 'ride_completed' ? Number(amount) : b.amount } : b
      ));
      toast.success(`Status updated to "${STATUS_CONFIG[status]?.label}"`);
    } catch {
      toast.error('Status update failed');
    }
  };

  // ── Filtering ───────────────────────────────────
  const filteredBookings = useMemo(() => {
    const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
    const yesterdayStr = new Date(Date.now() - 86400000).toLocaleDateString('en-CA');

    const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 6);

    return bookings.filter(b => {
      const matchSearch =
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.phone.includes(search) ||
        (b.email || '').toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchRide = rideTypeFilter === 'all' || b.ride_type === rideTypeFilter;

      let matchDate = true;
      if (dateFilter === 'today') matchDate = b.date === todayStr;
      else if (dateFilter === 'yesterday') matchDate = b.date === yesterdayStr;
      else if (dateFilter === 'this_week') {
        const bd = new Date(b.date);
        matchDate = bd >= weekStart;
      }

      return matchSearch && matchStatus && matchRide && matchDate;
    });
  }, [bookings, search, statusFilter, rideTypeFilter, dateFilter]);

  const totalRevenue = bookings
    .filter(b => b.status === 'ride_completed')
    .reduce((sum, b) => sum + b.amount, 0);

  const totalPages = Math.ceil(filteredBookings.length / PER_PAGE);
  const paginated = filteredBookings.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const rideTypes = [...new Set(bookings.map(b => b.ride_type))];

  const StatPill = ({ label, value, color }) => (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E1E1E] border border-[#2C2C2C] text-sm`}>
      <span className={`w-2 h-2 rounded-full ${color}`}></span>
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-bold">{value}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap gap-4 justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Booking Management</h1>
          <p className="text-gray-400 text-sm mt-1">Live session tracking with status management and revenue insights.</p>
        </div>
        <button onClick={fetchBookings} className="flex items-center gap-2 text-xs bg-[#1E1E1E] border border-[#2C2C2C] text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Summary Pills */}
      <div className="flex flex-wrap gap-3">
        <StatPill label="Total" value={bookings.length} color="bg-gray-400" />
        <StatPill label="Today" value={bookings.filter(b => b.date === new Date().toLocaleDateString('en-CA')).length} color="bg-blue-400" />
        <StatPill label="Completed" value={bookings.filter(b => b.status === 'ride_completed').length} color="bg-green-400" />
        <StatPill label="Cancelled" value={bookings.filter(b => b.status === 'cancelled').length} color="bg-red-400" />
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-sm">
          <IndianRupee size={14} className="text-[#FF6B00]" />
          <span className="text-gray-400">Revenue</span>
          <span className="text-[#FF6B00] font-bold">₹{totalRevenue.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#1E1E1E] border border-[#2C2C2C] rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <SlidersHorizontal size={16} className="text-[#FF6B00]" />

        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search name, phone, email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-[#111] border border-[#333] rounded-lg py-2 pl-8 pr-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF6B00]"
          />
          {search && <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><X size={12} /></button>}
        </div>

        {/* Status filter */}
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-[#111] border border-[#333] text-sm rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:border-[#FF6B00]">
          <option value="all">All Status</option>
          {Object.entries(STATUS_CONFIG).map(([s, c]) => <option key={s} value={s}>{c.label}</option>)}
        </select>

        {/* Date filter */}
        <select value={dateFilter} onChange={e => { setDateFilter(e.target.value); setPage(1); }}
          className="bg-[#111] border border-[#333] text-sm rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:border-[#FF6B00]">
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="this_week">This Week</option>
        </select>

        {/* Ride type filter */}
        <select value={rideTypeFilter} onChange={e => { setRideTypeFilter(e.target.value); setPage(1); }}
          className="bg-[#111] border border-[#333] text-sm rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:border-[#FF6B00]">
          <option value="all">All Ride Types</option>
          {rideTypes.map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        <span className="ml-auto text-xs text-gray-500">{filteredBookings.length} results</span>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#1E1E1E] rounded-2xl border border-[#2C2C2C] shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#111] border-b border-[#2C2C2C] text-[10px] uppercase tracking-widest text-gray-500">
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Session</th>
                <th className="px-5 py-4 font-semibold">Type & Level</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Amount</th>
                <th className="px-5 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              <AnimatePresence>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 bg-[#2C2C2C] rounded w-24"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-gray-600">
                      <Filter size={32} className="mx-auto mb-3 opacity-30" />
                      No bookings match your filters.
                    </td>
                  </tr>
                ) : (
                  paginated.map(b => (
                    <motion.tr
                      key={b.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-white">{b.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{b.phone}</p>
                        {b.email && <p className="text-[10px] text-gray-600 mt-0.5">{b.email}</p>}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-white flex items-center gap-1.5">
                          <Clock size={12} className="text-[#FF6B00]" />
                          {b.date}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{b.slot}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[11px] bg-[#2C2C2C] text-white px-2 py-0.5 rounded mr-1">{b.ride_type}</span>
                        <span className="text-[11px] bg-[#FF6B00]/10 text-[#FF6B00] px-2 py-0.5 rounded">{b.experience_level}</span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="px-5 py-4">
                        {b.status === 'ride_completed' ? (
                          <span className="text-green-400 font-bold text-sm flex items-center gap-1">
                            <IndianRupee size={13} />
                            {Number(b.amount).toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-gray-600 text-xs italic">Not Yet</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                          <StatusDropdown bookingId={b.id} current={b.status} onUpdate={handleStatusUpdate} />
                          <button
                            onClick={() => removeBooking(b.id)}
                            className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-[#2C2C2C] bg-[#111] flex items-center justify-between text-xs text-gray-500">
          <span>Page {page} of {Math.max(totalPages, 1)} · {filteredBookings.length} entries</span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 bg-[#1E1E1E] border border-[#2C2C2C] rounded-lg hover:text-white disabled:opacity-30 transition-colors"
            >Prev</button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
              <button key={n}
                onClick={() => setPage(n)}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${page === n ? 'bg-[#FF6B00] border-[#FF6B00] text-white' : 'bg-[#1E1E1E] border-[#2C2C2C] hover:text-white'}`}
              >{n}</button>
            ))}
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 bg-[#1E1E1E] border border-[#2C2C2C] rounded-lg hover:text-white disabled:opacity-30 transition-colors"
            >Next</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Bookings;
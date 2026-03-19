import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarCheck, BarChart4, TrendingUp, IndianRupee,
  CalendarDays, ArrowUpRight, ArrowDownRight, Clock
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart
} from 'recharts';
import { getBookings, getBookingStats } from '../api';

const COLORS = ['#FF6B00', '#3B82F6', '#10B981', '#EF4444', '#A855F7'];

const StatCard = ({ icon: Icon, title, value, sub, trend, idx, accentColor = '#FF6B00' }) => {
  const isUp = trend > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.08, duration: 0.4 }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px -10px rgba(0,0,0,0.7)' }}
      className="bg-[#1E1E1E] rounded-2xl p-6 border border-[#2C2C2C] shadow-lg relative overflow-hidden group cursor-default"
    >
      {/* Background ghost icon */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.04] pointer-events-none group-hover:opacity-[0.07] transition-opacity duration-500">
        <Icon size={110} />
      </div>

      <div className="flex justify-between items-start mb-5 relative z-10">
        <div className="p-3 rounded-xl border" style={{ backgroundColor: `${accentColor}15`, borderColor: `${accentColor}25` }}>
          <Icon size={22} style={{ color: accentColor }} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${isUp ? 'bg-green-500/10 text-green-400' : trend < 0 ? 'bg-red-500/10 text-red-400' : 'bg-gray-500/10 text-gray-400'}`}>
            {isUp ? <ArrowUpRight size={12} /> : trend < 0 ? <ArrowDownRight size={12} /> : null}
            {trend > 0 ? `+${trend}` : trend} vs yesterday
          </div>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-1">{title}</p>
        <p className="text-3xl font-heading font-bold text-white">{value}</p>
        {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111] border border-[#2C2C2C] rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-white text-sm font-bold" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [chartRange, setChartRange] = useState('7days');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        getBookingStats(),
        getBookings(),
      ]);
      setStats(statsRes.data);
      setRecentBookings(bookingsRes.data.slice(0, 6).map(b => ({
        name: b.name,
        type: b.ride_type || 'Arena Training',
        status: b.status,
        date: b.date,
        time: b.start_time,
        createdAt: new Date(b.createdAt),
      })));
    } catch (err) {
      console.error('Dashboard fetch failed', err);
    }
  };

  const statCards = stats ? [
    {
      icon: CalendarCheck,
      title: "Today's Bookings",
      value: stats.todayBookings ?? 0,
      trend: (stats.todayBookings ?? 0) - (stats.yesterdayBookings ?? 0),
      sub: `Yesterday: ${stats.yesterdayBookings ?? 0}`,
      accentColor: '#3B82F6',
    },
    {
      icon: CalendarDays,
      title: 'This Week',
      value: stats.weeklyBookings ?? 0,
      sub: `Month total: ${stats.monthlyBookings ?? 0}`,
      accentColor: '#A855F7',
    },
    {
      icon: BarChart4,
      title: 'All Time Bookings',
      value: stats.total ?? 0,
      sub: 'Since inception',
      accentColor: '#FF6B00',
    },
    {
      icon: IndianRupee,
      title: 'Actual Revenue',
      value: `₹${(stats.totalRevenue ?? 0).toLocaleString('en-IN')}`,
      sub: 'Ride-completed sessions only',
      accentColor: '#10B981',
    },
  ] : [];

  // Status distribution for Pie
  const pieData = stats?.statusDistribution?.map(s => ({
    name: s.status === 'ride_completed' ? 'Completed' : s.status.charAt(0).toUpperCase() + s.status.slice(1),
    value: s.count,
  })) || [];

  // Ride type for Pie
  const rideTypePie = stats?.rideTypeDistribution || [];

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const STATUS_DOT = {
    confirmed: 'bg-blue-400',
    pending: 'bg-yellow-400',
    cancelled: 'bg-red-400',
    ride_completed: 'bg-green-400',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => <StatCard key={idx} {...card} idx={idx} />)}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Bar Chart: Bookings per day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="lg:col-span-2 bg-[#1E1E1E] rounded-2xl p-6 border border-[#2C2C2C] shadow-lg"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-heading font-semibold text-white">Bookings Trend</h3>
              <p className="text-gray-500 text-xs mt-0.5">Last 7 days — live database data</p>
            </div>
            <span className="text-[10px] bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Live</span>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.last7DaysChart || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="bookingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" vertical={false} />
                <XAxis dataKey="name" stroke="#555" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#555" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="bookings" stroke="#FF6B00" strokeWidth={2.5} fill="url(#bookingsGrad)" dot={{ fill: '#FF6B00', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#FF8C00' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie: Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="bg-[#1E1E1E] rounded-2xl p-6 border border-[#2C2C2C] shadow-lg"
        >
          <h3 className="text-base font-heading font-semibold text-white mb-1">Status Split</h3>
          <p className="text-gray-500 text-xs mb-5">Distribution of booking statuses</p>
          {pieData.length > 0 ? (
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-600 text-sm">No data yet</div>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {pieData.map((entry, i) => (
              <span key={i} className="flex items-center gap-1.5 text-[11px] text-gray-400">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                {entry.name} ({entry.value})
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Ride Type Distribution Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-[#1E1E1E] rounded-2xl p-6 border border-[#2C2C2C] shadow-lg"
        >
          <h3 className="text-base font-heading font-semibold text-white mb-1">Ride Type</h3>
          <p className="text-gray-500 text-xs mb-5">Booking count by ride category</p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rideTypePie} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" horizontal={false} />
                <XAxis type="number" stroke="#555" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" stroke="#555" tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#FF6B00" radius={[0, 4, 4, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="lg:col-span-2 bg-[#1E1E1E] rounded-2xl p-6 border border-[#2C2C2C] shadow-lg"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-heading font-semibold text-white">Recent Bookings</h3>
              <p className="text-gray-500 text-xs mt-0.5">Latest 6 from database</p>
            </div>
          </div>

          <div className="space-y-4">
            {recentBookings.length === 0 ? (
              <p className="text-gray-600 text-sm text-center py-8">No bookings yet.</p>
            ) : (
              recentBookings.map((b, idx) => (
                <div key={idx} className="flex items-start gap-4 relative">
                  {idx < recentBookings.length - 1 && (
                    <div className="absolute left-3 top-7 bottom-[-16px] w-[1px] bg-[#2C2C2C]" />
                  )}
                  <div className={`w-6 h-6 rounded-full border-2 border-[#111] flex-shrink-0 z-10 ${STATUS_DOT[b.status] || 'bg-gray-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-white font-medium truncate">{b.name}</p>
                      <span className="text-[10px] text-gray-600 whitespace-nowrap">{timeAgo(b.createdAt)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                      <Clock size={10} className="text-[#FF6B00]" /> {b.date} · {b.time}
                      <span className="bg-[#2C2C2C] px-1.5 py-0.5 rounded text-[10px]">{b.type}</span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

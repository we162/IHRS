import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart4, 
  CalendarCheck, 
  TrendingUp, 
  DollarSign
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const data = [
  { name: 'Mon', bookings: 4 },
  { name: 'Tue', bookings: 3 },
  { name: 'Wed', bookings: 7 },
  { name: 'Thu', bookings: 5 },
  { name: 'Fri', bookings: 8 },
  { name: 'Sat', bookings: 12 },
  { name: 'Sun', bookings: 15 },
];

const StatCard = ({ icon: Icon, title, value, change, idx }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: idx * 0.1, duration: 0.4 }}
    whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}
    className="bg-[#1E1E1E] rounded-2xl p-6 border border-[#2C2C2C] shadow-lg relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
      <Icon size={100} />
    </div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className="p-3 bg-black/50 rounded-xl border border-[#FF6B00]/20 shadow-[0_0_10px_rgba(255,107,0,0.1)] group-hover:shadow-[0_0_15px_rgba(255,107,0,0.3)] transition-shadow">
        <Icon size={24} className="text-[#FF6B00]" />
      </div>
      {change && (
        <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${change.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {change}
        </span>
      )}
    </div>
    <div className="relative z-10 space-y-1">
      <h3 className="text-gray-400 font-medium text-sm">{title}</h3>
      <p className="text-3xl font-heading font-bold text-white">{value}</p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    total: 0,
    todayBookings: 0,
    weeklyBookings: 0,
    revenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { getBookingStats } = await import('../api');
        const res = await getBookingStats();
        setDashboardStats({
          total: res.data.total || 0,
          todayBookings: res.data.todayBookings || 0,
          weeklyBookings: res.data.weeklyBookings || 0,
          revenue: (res.data.total || 0) * 150 // Mock revenue
        });
      } catch (err) {
        console.error('Failed to load stats');
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { icon: CalendarCheck, title: "Today's Bookings", value: dashboardStats.todayBookings, change: "Tdy" },
    { icon: BarChart4, title: "Total Bookings", value: dashboardStats.total, change: "All" },
    { icon: TrendingUp, title: "Weekly Bookings", value: dashboardStats.weeklyBookings, change: "Wk" },
    { icon: DollarSign, title: "Est. Revenue", value: `₹${dashboardStats.revenue}`, change: "Est" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back, here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} idx={idx} />
        ))}
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-2 bg-[#1E1E1E] rounded-2xl p-6 border border-[#2C2C2C] shadow-lg"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-heading font-semibold text-white">Bookings per Day</h3>
            <select className="bg-[#111111] border border-[#2C2C2C] text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#FF6B00] text-gray-300">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#2C2C2C', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#111111', border: '1px solid #2C2C2C', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="bookings" fill="#FF6B00" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity or Secondary Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-[#1E1E1E] rounded-2xl p-6 border border-[#2C2C2C] shadow-lg"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-heading font-semibold text-white">Recent Activity</h3>
          </div>
          
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start relative before:absolute before:left-[11px] before:top-8 before:bottom-[-24px] before:w-[2px] before:bg-[#2C2C2C] last:before:hidden">
                <div className="w-6 h-6 rounded-full bg-black border-[3px] border-[#FF6B00] flex-shrink-0 z-10" />
                <div className="-mt-1.5">
                  <p className="text-sm text-white font-medium">New booking for Jane Doe</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago • Professional Training</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, Mail, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginAdmin } from '../api';

const Login = () => {
  const [email, setEmail] = useState('admin@horseclub.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginAdmin({ email, password });
      toast.success('Logged in successfully');
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4 relative overflow-hidden text-white font-body">
      
      {/* Background decoration elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF6B00]/5 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-[#111111] backdrop-blur-xl border border-[#2C2C2C] rounded-2xl shadow-2xl p-10 z-10 relative"
      >
        <div className="text-center mb-10">
          <div className="mx-auto w-24 h-24 mb-4">
            <img src="/logo.png" alt="IHRS Logo" className="w-full h-full object-contain filter invert-[1]" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-white tracking-tight mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-sm">Sign in to your admin dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2 group">
            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF6B00] transition-colors" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1E1E1E] border border-[#2C2C2C] rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF6B00] transition-colors" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1E1E1E] border border-[#2C2C2C] rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all font-sans"
                required
              />
            </div>
          </div>

          <motion.button  
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#FF6B00] hover:bg-[#FF8C00] text-white font-semibold rounded-xl py-4 transition-all shadow-[0_0_15px_rgba(255,107,0,0.4)] hover:shadow-[0_0_25px_rgba(255,107,0,0.6)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
          </motion.button>
        </form>
        
        <p className="text-center text-gray-500 text-xs mt-8">
          Secure Login • IHRS Club CMS
        </p>
      </motion.div>

    </div>
  );
};

export default Login;
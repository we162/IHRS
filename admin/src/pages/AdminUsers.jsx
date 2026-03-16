import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, UserCog, UserMinus, Plus, Mail, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAdmins, createAdmin, deleteAdmin } from '../api';

const AdminUsers = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', role: 'staff_admin' });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data } = await getAdmins();
      setAdmins(data);
    } catch (err) {
      toast.error('Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const t = toast.loading("Adding admin...");
    try {
      const { data } = await createAdmin(formData);
      setAdmins([...admins, data]);
      setShowModal(false);
      setFormData({ email: '', password: '', role: 'staff_admin' });
      toast.success("Admin created successfully", { id: t });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create admin", { id: t });
    }
  };

  const handleRemove = async (id, role) => {
    if (role === 'super_admin') return toast.error("Cannot delete Super Admin");
    if (!window.confirm("Are you sure?")) return;
    
    try {
      await deleteAdmin(id);
      setAdmins(admins.filter(a => a._id !== id));
      toast.success("Admin removed");
    } catch (err) {
      toast.error("Failed to remove admin");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Administrators</h1>
          <p className="text-gray-400 text-sm mt-1">Manage admin roles and permissions.</p>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#FF6B00] hover:bg-[#FF8C00] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm transition-colors shadow-[0_0_15px_rgba(255,107,0,0.3)]"
        >
          <Plus size={18} /> Add Admin
        </button>
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
                <th className="px-6 py-4 font-medium">User Details</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2C2C2C]">
              {loading ? (
                <tr><td colSpan="4" className="text-center py-6 text-gray-500">Loading...</td></tr>
              ) : (
                <AnimatePresence>
                  {admins.map((admin) => (
                    <motion.tr 
                      key={admin._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-[#2C2C2C]/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#111111] border border-[#FF6B00]/40 flex items-center justify-center text-[#FF6B00] font-bold shadow-sm">
                            {admin.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{admin.email.split('@')[0]}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <Mail size={12} /> {admin.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                          ${admin.role === 'super_admin' ? 'bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/20' : 'bg-gray-500/10 text-gray-300 border border-gray-500/20'}
                        `}>
                          {admin.role === 'super_admin' ? <ShieldCheck size={14} /> : <UserCog size={14} />}
                          {admin.role.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="flex items-center gap-2 text-sm text-gray-300">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span> Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => handleRemove(admin._id, admin.role)}
                            className={`p-1.5 rounded-md transition-colors ${admin.role === 'super_admin' ? 'opacity-30 cursor-not-allowed text-gray-500' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`} 
                            disabled={admin.role === 'super_admin'} 
                            title="Remove"
                          >
                            <UserMinus size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1E1E1E] rounded-xl border border-[#2C2C2C] p-6 w-full max-w-md shadow-2xl relative"
          >
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-xl font-heading font-bold text-white mb-6">Create New Admin</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-400 mb-1 block">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-[#111111] border border-[#2C2C2C] rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-[#FF6B00]" 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400 mb-1 block">Password</label>
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-[#111111] border border-[#2C2C2C] rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-[#FF6B00]" 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400 mb-1 block">Role</label>
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-[#111111] border border-[#2C2C2C] rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-[#FF6B00]"
                >
                  <option value="staff_admin">Staff Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-[#FF6B00] hover:bg-[#FF8C00] text-white py-3 rounded-lg font-semibold mt-4">
                Create Account
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

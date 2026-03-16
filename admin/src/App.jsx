import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import GalleryManager from './pages/GalleryManager';
import InstagramManager from './pages/InstagramManager';
import AdminUsers from './pages/AdminUsers';
import Settings from './pages/Settings';

function App() {
  // Simple auth simulation for demonstration
  const isAuthenticated = true;

  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1E1E1E', color: '#fff', border: '1px solid #2C2C2C' } }} />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes inside Layout */}
        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="gallery" element={<GalleryManager />} />
          <Route path="instagram" element={<InstagramManager />} />
          <Route path="admins" element={<AdminUsers />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

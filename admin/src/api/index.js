import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Admin
export const loginAdmin = (credentials) => api.post('/admin/login', credentials);
export const getAdmins = () => api.get('/admin/users');
export const createAdmin = (data) => api.post('/admin/users', data);
export const deleteAdmin = (id) => api.delete(`/admin/users/${id}`);

// Bookings
export const getBookings = () => api.get('/bookings');
export const createBooking = (bookingData) => api.post('/bookings', bookingData);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);
export const cancelBooking = (id) => api.patch(`/bookings/cancel/${id}`);
export const getBookingStats = () => api.get('/bookings/stats');

// Gallery
export const getGallery = () => api.get('/gallery');
export const uploadGalleryImage = (formData) => api.post('/gallery', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const updateGalleryImage = (id, data) => api.put(`/gallery/${id}`, data);
export const deleteGalleryImage = (id) => api.delete(`/gallery/${id}`);

// Instagram
export const getInstagramPosts = () => api.get('/instagram');
export const addInstagramPost = (data) => api.post('/instagram', data);
export const deleteInstagramPost = (id) => api.delete(`/instagram/${id}`);

// Settings
export const getSettings = () => api.get('/settings');
export const updateSettings = (data) => api.put('/settings', data);

export default api;

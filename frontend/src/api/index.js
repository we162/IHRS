import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const createBooking = (bookingData) => api.post('/bookings', bookingData);
export const checkAvailability = (date) => api.get(`/bookings/availability?date=${date}`);
export const getGallery = () => api.get('/gallery');
export const getInstagramPosts = () => api.get('/instagram');
export const getSettings = () => api.get('/settings');

export default api;

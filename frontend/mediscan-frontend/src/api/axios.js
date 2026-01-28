import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Check karein aapka backend isi port par hai na?
});

// Ye part zaroori hai login ke liye
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
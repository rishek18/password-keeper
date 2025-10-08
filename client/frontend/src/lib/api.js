import axios from 'axios';

// Automatically use backend URL from env in production,
// or fallback to relative '/api' (for local dev proxy)
const api = axios.create({
  baseURL: process.env.BACKEND_URL
    ? `${process.env.BACKEND_URL}/api`
    : 'https://password-keeper-d93t.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth token interceptor
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
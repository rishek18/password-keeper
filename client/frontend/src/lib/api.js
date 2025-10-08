// client/frontend/src/lib/api.js
import axios from 'axios';

// No need for environment variables or full URLs for development!
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`, // The proxy will forward this to http://localhost:5000/api
  headers: {
    'Content-Type': 'application/json',
  },
});

// The interceptor remains the same and is perfect
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
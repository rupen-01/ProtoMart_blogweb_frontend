import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('📤 [AXIOS] Making request to:', config.baseURL + config.url);
    console.log('📤 [AXIOS] Token exists:', !!token);
    console.log('📤 [AXIOS] Token preview:', token?.substring(0, 30) + '...');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ [AXIOS] Authorization header set');
    } else {
      console.log('❌ [AXIOS] No token found in localStorage');
    }
    
    console.log('📤 [AXIOS] Final headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('❌ [AXIOS] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default axiosInstance;
import axios from 'axios';
import { message } from 'antd';

const API_BASE_URL = 'https://blogapp-backend-e23a.onrender.com/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL
});

// Add request interceptor to automatically add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const errorData = error.response.data;
      
      // Check if it's a token expiration or invalid token error
      if (errorData.error === 'token expired' || errorData.error === 'token invalid') {
        message.warning({
          content: errorData.message || 'Your session has expired. Redirecting to login...',
          duration: 3,
        });
        
        // Clear localStorage
        localStorage.removeItem('userToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { API_BASE_URL };

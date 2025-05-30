// client/src/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://skillsharehubaicodebackend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to network issues or server is down
    if (!error.response) {
      console.error('Network Error:', error);
      return Promise.reject({
        message: 'Unable to connect to the server. Please check your internet connection and try again.'
      });
    }

    // If the error is 401 (Unauthorized)
    if (error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject({
        message: 'Your session has expired. Please log in again.'
      });
    }

    // If the error is 503 (Service Unavailable)
    if (error.response.status === 503) {
      return Promise.reject({
        message: 'The server is temporarily unavailable. Please try again later.'
      });
    }

    // For other errors
    return Promise.reject({
      message: error.response.data?.message || 'An error occurred. Please try again.'
    });
  }
);

export default axiosInstance;

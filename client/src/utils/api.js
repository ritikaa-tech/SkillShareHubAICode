import axios from 'axios';

const API_BASE_URL = 'https://skillsharehubbackend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to handle dynamic port
api.interceptors.request.use(
  async (config) => {
    // Try ports in sequence if the default port fails
    const ports = [5000, 5001, 5002, 5003];
    let lastError;

    for (const port of ports) {
      try {
        config.baseURL = `http://localhost:${port}/api`;
        return config;
      } catch (error) {
        lastError = error;
        continue;
      }
    }

    throw lastError;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
      return Promise.reject({ message: 'Request setup failed' });
    }
  }
);

export default api; 

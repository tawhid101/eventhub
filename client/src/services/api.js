import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (Zustand persist)
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      try {
        const { state } = JSON.parse(authData);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.error('Error parsing auth data:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear auth data and redirect to login
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
      }
      
      if (status === 403) {
        // Forbidden
        console.error('Access forbidden');
      }
      
      if (status === 404) {
        // Not found
        console.error('Resource not found');
      }
      
      if (status === 500) {
        // Server error
        console.error('Server error');
      }
      
      // Pass the error along with server message
      error.message = data?.message || error.message;
    } else if (error.request) {
      // Request made but no response received
      error.message = 'Network error. Please check your connection.';
    } else {
      // Something else happened
      error.message = 'An unexpected error occurred.';
    }
    
    return Promise.reject(error);
  }
);

export default api;
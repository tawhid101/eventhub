import api from './api';

const authService = {
  // User login
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response;
  },

  // User registration
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response;
  },

  // Get current user
  getMe: async (token) => {
    const response = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  },

  // Update user profile
  updateProfile: async (token, profileData) => {
    const response = await api.put('/auth/profile', profileData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  },

  // Get user dashboard stats
  getDashboardStats: async (token) => {
    const response = await api.get('/users/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  },

  // Get user's events
  getMyEvents: async (token, page = 1, limit = 10) => {
    const response = await api.get(`/users/events?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  },

  // Delete user account
  deleteAccount: async (token) => {
    const response = await api.delete('/users/account', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  }
};

export default authService;
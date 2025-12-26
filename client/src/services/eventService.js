import api from './api';

const eventService = {
  // Get all events with filters
  getEvents: async (filters = {}, page = 1, token = null) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '12',
      ...filters
    });

    const config = {};
    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
    }

    const response = await api.get(`/events?${params.toString()}`, config);
    return response;
  },

  // Get single event
  getEvent: async (id, token = null) => {
    const config = {};
    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
    }

    const response = await api.get(`/events/${id}`, config);
    return response;
  },

  // Create new event
  createEvent: async (eventData, token) => {
    const response = await api.post('/events', eventData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  },

  // Update event
  updateEvent: async (id, eventData, token) => {
    const response = await api.put(`/events/${id}`, eventData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  },

  // Delete event
  deleteEvent: async (id, token) => {
    const response = await api.delete(`/events/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  },

  // Toggle save/unsave event
  toggleSaveEvent: async (id, token) => {
    const response = await api.post(`/events/${id}/save`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  },

  // Get saved events
  getSavedEvents: async (token) => {
    const response = await api.get('/events/saved', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  },

  // Search events
  searchEvents: async (query, filters = {}) => {
    const params = new URLSearchParams({
      search: query,
      ...filters
    });

    const response = await api.get(`/events?${params.toString()}`);
    return response;
  },

  // Get events by category
  getEventsByCategory: async (category, page = 1) => {
    const params = new URLSearchParams({
      category,
      page: page.toString(),
      limit: '12'
    });

    const response = await api.get(`/events?${params.toString()}`);
    return response;
  },

  // Get upcoming events (featured on homepage)
  getUpcomingEvents: async () => {
    const params = new URLSearchParams({
      sortBy: 'date',
      limit: '6'
    });

    const response = await api.get(`/events?${params.toString()}`);
    return response;
  }
};

export default eventService;
import { create } from 'zustand'
import eventService from '../services/eventService'
import authService from '../services/authService'
import useAuthStore from './authStore'

const useEventStore = create((set, get) => ({
  // State
  events: [],
  savedEvents: [],
  currentEvent: null,
  categories: [
    'Music',
    'Sports',
    'Business',
    'Arts',
    'Food',
    'Health',
    'Technology',
    'Education',
    'Entertainment',
    'Other',
  ],
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  dashboardStats: {
    totalEvents: 0,
    activeEvents: 0,
    savedEvents: 0
  },
  filters: {
    category: 'all',
    search: '',
    date: '',
    location: '',
    price: 'all',
    sortBy: 'date',
  },

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  
  // Current event actions
  setCurrentEvent: (event) => set({ currentEvent: event }),
  clearCurrentEvent: () => set({ currentEvent: null }),

  // Set filters
  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
  clearFilters: () =>
    set({
      filters: {
        category: 'all',
        search: '',
        date: '',
        location: '',
        price: 'all',
        sortBy: 'date',
      },
    }),

  // Fetch events
  fetchEvents: async (page = 1) => {
    const token = useAuthStore.getState().token
    const filters = get().filters

    set({ isLoading: true, error: null })
    try {
      const response = await eventService.getEvents(filters, page, token)
      const { events, pagination } = response.data.data

      set({
        events,
        pagination,
        isLoading: false,
        error: null,
      })

      return { success: true, events }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch events'
      set({
        isLoading: false,
        error: errorMessage,
      })
      return { success: false, error: errorMessage }
    }
  },

  // Fetch single event
  fetchEvent: async (id) => {
    const token = useAuthStore.getState().token

    set({ isLoading: true, error: null })
    try {
      const response = await eventService.getEvent(id, token)
      const { event } = response.data.data

      set({
        currentEvent: event,
        isLoading: false,
        error: null,
      })

      return { success: true, event }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch event'
      set({
        isLoading: false,
        error: errorMessage,
        currentEvent: null,
      })
      return { success: false, error: errorMessage }
    }
  },

  // Create event
  createEvent: async (eventData) => {
    const token = useAuthStore.getState().token
    if (!token) return { success: false, error: 'Not authenticated' }

    set({ isLoading: true, error: null })
    try {
      const response = await eventService.createEvent(eventData, token)
      const { event } = response.data.data

      // Add new event to the list
      const currentEvents = get().events
      set({
        events: [event, ...currentEvents],
        isLoading: false,
        error: null,
      })

      // Re-fetch dashboard stats
      await get().getDashboardStats();

      return { success: true, event }
    } catch (error) {
      // Check for detailed validation errors from the backend
      if (error.response?.data?.errors) {
        set({
          isLoading: false,
          error:
            error.response?.data?.message || 'Validation failed',
        })
        // Propagate detailed errors to the component
        throw error.response.data
      }

      const errorMessage =
        error.response?.data?.message || 'Failed to create event'
      set({
        isLoading: false,
        error: errorMessage,
      })
      return { success: false, error: errorMessage }
    }
  },

  // Update event
  updateEvent: async (id, eventData) => {
    const token = useAuthStore.getState().token
    if (!token) return { success: false, error: 'Not authenticated' }

    set({ isLoading: true, error: null })
    try {
      const response = await eventService.updateEvent(id, eventData, token)
      const { event: updatedEvent } = response.data.data

      // Update event in the list
      const currentEvents = get().events
      const updatedEvents = currentEvents.map((event) =>
        event._id === id ? updatedEvent : event,
      )

      set({
        events: updatedEvents,
        currentEvent: updatedEvent,
        isLoading: false,
        error: null,
      })

      return { success: true, event: updatedEvent }
    } catch (error) {
      if (error.response?.data?.errors) {
        set({
          isLoading: false,
          error:
            error.response?.data?.message || 'Validation failed',
        })
        throw error.response.data
      }

      const errorMessage =
        error.response?.data?.message || 'Failed to update event'
      set({
        isLoading: false,
        error: errorMessage,
      })
      return { success: false, error: errorMessage }
    }
  },

  // Delete event
  deleteEvent: async (id) => {
    const token = useAuthStore.getState().token
    if (!token) return { success: false, error: 'Not authenticated' }

    set({ isLoading: true, error: null })
    try {
      await eventService.deleteEvent(id, token)

      // Remove event from the list
      const currentEvents = get().events
      const updatedEvents = currentEvents.filter((event) => event._id !== id)

      set({
        events: updatedEvents,
        isLoading: false,
        error: null,
      })

      // Re-fetch dashboard stats
      await get().getDashboardStats();

      return { success: true }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to delete event'
      set({
        isLoading: false,
        error: errorMessage,
      })
      return { success: false, error: errorMessage }
    }
  },

  // Toggle save event
  toggleSaveEvent: async (id) => {
    const token = useAuthStore.getState().token;
    if (!token) return { success: false, error: 'Not authenticated' };

    // Optimistic UI update can be added here in future
    
    try {
      const response = await eventService.toggleSaveEvent(id, token);
      const { isSaved } = response.data.data;

      set((state) => ({
        // Update the main events list
        events: state.events.map((event) =>
          event._id === id ? { ...event, isSaved } : event
        ),
        // Update current event if it matches
        currentEvent:
          state.currentEvent && state.currentEvent._id === id
            ? { ...state.currentEvent, isSaved }
            : state.currentEvent,
      }));

      // Re-fetch the list of all saved events to update the count
      await get().fetchSavedEvents();
      // Re-fetch dashboard stats to update saved events count there
      await get().getDashboardStats();


      return { success: true, isSaved };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to save event';
      set({
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch saved events
  fetchSavedEvents: async () => {
    const token = useAuthStore.getState().token
    if (!token) return { success: false, error: 'Not authenticated' }

    set({ isLoading: true, error: null })
    try {
      const response = await eventService.getSavedEvents(token)
      const { events } = response.data.data

      set({
        savedEvents: events,
        isLoading: false,
        error: null,
      })

      return { success: true, events }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch saved events'
      set({
        isLoading: false,
        error: errorMessage,
      })
      return { success: false, error: errorMessage }
    }
  },

  // Get events by category
  getEventsByCategory: (category) => {
    const events = get().events || []
    if (category === 'all') return events
    return events.filter((event) => event.category === category)
  },

  // Get upcoming events
  getUpcomingEvents: () => {
    const events = get().events || []
    const now = new Date()
    return events.filter((event) => new Date(event.date) > now).slice(0, 6)
  },

  // Search events
  searchEvents: (query) => {
    const events = get().events || []
    const searchTerm = query.toLowerCase()

    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.category.toLowerCase().includes(searchTerm) ||
        event.location.address.toLowerCase().includes(searchTerm),
    )
  },
  
  // Fetch current user's events (for Dashboard)
  fetchMyEvents: async (page = 1, limit = 10) => {
    const token = useAuthStore.getState().token
    if (!token) return { success: false, error: 'Not authenticated' }

    set({ isLoading: true, error: null })
    try {
      const response = await authService.getMyEvents(token, page, limit) // Using authService
      const { events, pagination } = response.data.data // Assuming backend returns events and pagination

      set({
        events, // Update the main 'events' state with user's events
        pagination,
        isLoading: false,
        error: null,
      })


      return { success: true, events }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch my events'
      set({
        isLoading: false,
        error: errorMessage,
      })
      return { success: false, error: errorMessage }
    }
  },

  // Get dashboard statistics (for Dashboard)
  getDashboardStats: async () => {
    const token = useAuthStore.getState().token
    if (!token) return { success: false, error: 'Not authenticated' }

    set({ isLoading: true, error: null })
    try {
      const response = await authService.getDashboardStats(token)
      const stats = response.data.data.stats
      set({
        dashboardStats: stats,
        isLoading: false,
        error: null,
      })
      return { success: true, data: { stats } }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch dashboard stats'
      set({
        isLoading: false,
        error: errorMessage,
      })
      return { success: false, error: errorMessage }
    }
  },
}))

export default useEventStore

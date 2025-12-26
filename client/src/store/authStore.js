import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/authService';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Login
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(email, password);
          const { user, token } = response.data.data;
          console.log("user object from login response: ", user)
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Login failed';
          set({
            isLoading: false,
            error: errorMessage
          });
          return { success: false, error: errorMessage };
        }
      },

      // Register
      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(name, email, password);
          const { user, token } = response.data.data;
          console.log("user object from register response: ", user)
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Registration failed';
          set({
            isLoading: false,
            error: errorMessage
          });
          return { success: false, error: errorMessage };
        }
      },

      // Logout
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
      },

      // Get current user
      getCurrentUser: async () => {
        const token = get().token;
        if (!token) return;

        set({ isLoading: true });
        try {
          const response = await authService.getMe(token);
          console.log("Response from authService.getMe: ", response)
          set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          // Token might be expired, logout user
          get().logout();
          set({ isLoading: false });
        }
      },

      // Update profile
      updateProfile: async (profileData) => {
        const token = get().token;
        if (!token) return { success: false, error: 'Not authenticated' };

        set({ isLoading: true, error: null });
        try {
          const response = await authService.updateProfile(token, profileData);
          set({
            user: response.data.user,
            isLoading: false,
            error: null
          });
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Profile update failed';
          set({
            isLoading: false,
            error: errorMessage
          });
          return { success: false, error: errorMessage };
        }
      },

      // Check if user is organizer of event
      isEventOrganizer: (organizerId) => {
        const user = get().user;
        return user && user.id === organizerId;
      }
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }) // Only persist these fields
    }
  )
);

export default useAuthStore;
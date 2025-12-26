import { create } from 'zustand';
import useEventStore from './eventStore'; // Import the event store

const useUIStore = create((set, get) => ({
  // State
  isMobileMenuOpen: false,
  isAuthModalOpen: false,
  authModalView: 'login', // 'login' or 'register'
  isEventFormOpen: false,
  isLoading: false,
  toast: null,

  // Actions
  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  // Auth modal
  setAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen }),
  setAuthModalView: (view) => set({ authModalView: view }),
  openAuthModal: (view = 'login') => set({ 
    isAuthModalOpen: true, 
    authModalView: view 
  }),
  closeAuthModal: () => set({ 
    isAuthModalOpen: false,
    authModalView: 'login'
  }),

  // Event form modal
  setEventFormOpen: (isOpen) => set({ isEventFormOpen: isOpen }),
  openEventForm: (event = null) => {
    if (event) {
      useEventStore.getState().setCurrentEvent(event);
    }
    set({ isEventFormOpen: true });
  },
  closeEventForm: () => {
    set({ isEventFormOpen: false });
    useEventStore.getState().clearCurrentEvent();
  },

  // Loading state
  setLoading: (isLoading) => set({ isLoading }),

  // Toast notifications (using react-hot-toast instead)
  showToast: (message, type = 'success') => {
    // This will be handled by react-hot-toast in components
    console.log(`${type.toUpperCase()}: ${message}`);
  }
}));

export default useUIStore;
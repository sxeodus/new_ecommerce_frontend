import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCartStore } from './cartStore';
import toast from 'react-hot-toast';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      setUser: (user) => set({ user }),

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || 'Failed to login');
          }
          // The `data` object from the API *is* the user object.
          // The token is handled by an http-only cookie and is not in the response body.
          set({ user: data, loading: false });
          toast.success('Logged in successfully!');
          return data; // Return the user object
        } catch (error) {
          set({ error: error.message, loading: false });
          toast.error(error.message);
          return null; // Return null on failure
        }
      },

      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || 'Failed to register');
          }
          // After successful registration, the backend sends back the user data
          // and an http-only cookie for authentication. We can log the user in.
          set({ user: data, loading: false });
          toast.success('Registered and logged in successfully!');
          return data; // Return the user object, consistent with login
        } catch (error) {
          set({ error: error.message, loading: false });
          toast.error(error.message);
          return null; // Return null on failure, consistent with login
        }
      },

      logout: async () => {
        set({ loading: true, error: null });
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
          });
          // Reset the cart state by calling the action from the cart store.
          // This ensures that when a user logs out, their cart is also cleared.
          useCartStore.getState().clearCart();

          set({ user: null, loading: false });
          toast.success('Logged out successfully!');
        } catch (error) {
          set({ error: error.message, loading: false });
          toast.error(error.message || 'Failed to log out');
        }
      },

      fetchUserProfile: async () => {
        set({ loading: true, error: null });
        try {
          const res = await fetch('/api/users/profile');
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || 'Failed to fetch profile');
          }
          // Update the user state with the fetched profile data
          set((state) => ({ user: { ...state.user, ...data }, loading: false }));
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          toast.error(error.message);
          return null;
        }
      },

      updateUserProfile: async (userData) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || 'Failed to update profile');
          }
          // Update the user in the store with the new data from the backend
          set({ user: data, loading: false });
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          toast.error(error.message);
          return null;
        }
      },
    }),
    {
      name: 'auth-storage',
      // Only persist the 'user' part of the state. This prevents saving
      // 'loading' or 'error' states to localStorage.
      partialize: (state) => ({ user: state.user }),
    }
  )
);

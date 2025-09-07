import { create } from 'zustand';
import toast from 'react-hot-toast';
import api from '../api/axios';

// Helper function to get user from localStorage
const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Failed to parse user from localStorage', error);
    return null;
  }
};

const initialState = {
  user: getUserFromStorage(),
  loading: false,
  error: null,
};

export const useAuthStore = create(
  (set) => ({
    ...initialState,

    login: async (email, password) => {
      set({ loading: true, error: null });
      try {
        // The backend expects an object with email and password
        const res = await api.post('/auth/login', {
          email,
          password,
        });
        const data = res.data;

        localStorage.setItem('user', JSON.stringify(data));
        set({ user: data, loading: false });
        toast.success('Logged in successfully!');
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Login failed';
        set({ error: errorMessage, loading: false });
        toast.error(errorMessage);
      }
    },

    register: async (userData) => {
      set({ loading: true, error: null });
      try {
        // The backend expects an object with username, email, and password
        const res = await api.post('/auth/register', userData);
        const data = res.data;

        localStorage.setItem('user', JSON.stringify(data));
        set({ user: data, loading: false });
        toast.success('Registered successfully!');
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Registration failed';
        set({ error: errorMessage, loading: false });
        toast.error(errorMessage);
      }
    },

    logout: async () => {
      try {
        await api.post('/auth/logout');
        localStorage.removeItem('user');
        // Also clear cart from localStorage on logout
        localStorage.removeItem('cart');
        // Reset the entire auth store to its initial state
        set(initialState);
        toast.success('Logged out successfully');
      } catch (error) {
        // Even if logout fails on the server, we clear the client-side
        console.error('Logout failed', error);
        toast.error(error.response?.data?.message || 'Logout failed');
      }
    },

    fetchUserProfile: async () => {
      set({ loading: true });
      try {
        const res = await api.get('/users/profile');
        const data = res.data;
        set({ user: data, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    },

    updateUserProfile: async (profileData) => {
      set({ loading: true });
      try {
        const res = await api.put('/users/profile', profileData);
        const data = res.data;

        localStorage.setItem('user', JSON.stringify(data));
        set({ user: data, loading: false });
        toast.success('Profile updated successfully!');
        return true;
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Update failed';
        set({ error: errorMessage, loading: false });
        toast.error(errorMessage);
        return false;
      }
    },
  })
);

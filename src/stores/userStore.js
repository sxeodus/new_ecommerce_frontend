import { create } from 'zustand';
import { useAuthStore } from './authStore';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '';

export const useUserStore = create((set) => ({
  users: [],
  loading: true,
  error: null,

  fetchUsers: async () => {
    const { token } = useAuthStore.getState();
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch users.');
      const users = await response.json();
      set({ users, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message);
    }
  },

  deleteUser: async (userId) => {
    const { token } = useAuthStore.getState();
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user.');
      }

      set((state) => ({
        users: state.users.filter((u) => u.id !== userId),
      }));
      toast.success('User deleted successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  },
}));
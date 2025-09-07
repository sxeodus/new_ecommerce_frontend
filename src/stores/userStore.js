import { create } from 'zustand';
import toast from 'react-hot-toast';
import api from '../api/axios';

export const useUserStore = create((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/admin/users');
      const data = res.data;
      set({ users: data, loading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Could not fetch users';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  deleteUser: async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    set({ loading: true });
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully');
      set((state) => ({
        users: state.users.filter((u) => u.id !== userId),
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Could not delete user';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },
}));
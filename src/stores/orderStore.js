import { create } from 'zustand';
import toast from 'react-hot-toast';
import api from '../api/axios';

export const useOrderStore = create((set) => ({
  myOrders: [],
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,

  createOrder: async (orderData) => {
    set({ loading: true });
    try {
      const res = await api.post('/orders', orderData);
      const data = res.data;
      set({ currentOrder: data, loading: false });
      toast.success('Order placed successfully!');
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Could not create order';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  fetchMyOrders: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/orders/myorders');
      const data = res.data;
      set({ myOrders: data, loading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Could not fetch orders';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  fetchOrderById: async (id) => {
    set({ loading: true });
    try {
      const res = await api.get(`/orders/${id}`);
      const data = res.data;
      set({ currentOrder: data, loading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Could not fetch order';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  // --- ADMIN ---
  fetchOrders: async () => { // For admin to fetch all orders
    set({ loading: true });
    try {
      const res = await api.get('/admin/orders');
      const data = res.data;
      set({ orders: data, loading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Could not fetch orders';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  markAsDelivered: async (id) => {
    set({ loading: true });
    try {
      const res = await api.put(`/admin/orders/${id}/deliver`);
      const updatedOrder = res.data;
      toast.success('Order marked as delivered!');
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? updatedOrder : o)),
        currentOrder: state.currentOrder?.id === id ? updatedOrder : state.currentOrder,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Could not mark as delivered';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },
}));

import { create } from 'zustand';
import { useAuthStore } from './authStore';
import toast from 'react-hot-toast';

export const useOrderStore = create((set, get) => ({
  orders: [],
  myOrders: [],
  currentOrder: null,
  loading: false,
  error: null,

  createOrder: async (orderData) => {
    const { user } = useAuthStore.getState();
    if (!user) {
      toast.error('You must be logged in to place an order.');
      return null;
    }

    set({ loading: true });
    try {
      const response = await fetch('/api/orders', { // The http-only cookie is sent automatically
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order.');
      }

      const newOrder = await response.json();
      set({ loading: false });
      return newOrder;
    } catch (error) {
      toast.error(error.message);
      set({ loading: false, error: error.message });
      return null;
    }
  },

  fetchOrderDetails: async (orderId) => {
    set({ loading: true, currentOrder: null });
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) throw new Error('Failed to fetch order details.');
      const order = await response.json();
      set({ currentOrder: order, loading: false });
    } catch (error) {
      toast.error(error.message);
      set({ loading: false, error: error.message });
    }
  },

  payOrder: async (orderId) => {
    set({ loading: true });
    try {
      const response = await fetch(`/api/orders/${orderId}/pay`, { method: 'PUT' });
      if (!response.ok) throw new Error('Payment failed.');
      
      // After paying, refetch the order details to get updated status
      await get().fetchOrderDetails(orderId);
      toast.success('Payment successful!');
      set({ loading: false });

    } catch (error) {
      toast.error(error.message);
      set({ loading: false, error: error.message });
    }
  },

  fetchMyOrders: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/api/orders/myorders');
      if (!response.ok) throw new Error('Could not fetch your orders.');
      const data = await response.json();
      set({ myOrders: data, loading: false });
    } catch (error) {
      toast.error(error.message);
      set({ loading: false, error: error.message });
    }
  },

  // --- ADMIN ---
  fetchOrders: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/api/admin/orders');
      if (!response.ok) throw new Error('Failed to fetch orders.');
      const orders = await response.json();
      set({ orders, loading: false });
    } catch (error)
    {
      toast.error(error.message);
      set({ loading: false, error: error.message });
    }
  },

  markAsDelivered: async (orderId) => {
    set({ loading: true });
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/deliver`, { method: 'PUT' });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update order.');
      }
      
      // Refetch all orders to get the updated list
      get().fetchOrders();
      // Also refetch details if we are on the details page
      if (get().currentOrder?.id === parseInt(orderId)) {
        get().fetchOrderById(orderId);
      }
      toast.success('Order marked as delivered!');
      set({ loading: false });
    } catch (error) {
      toast.error(error.message);
      set({ loading: false, error: error.message });
    }
  },

  fetchOrderById: async (orderId) => {
    set({ loading: true, currentOrder: null, error: null });
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch order details.');
      }

      const orderDetails = await response.json();
      set({ currentOrder: orderDetails, loading: false });
    } catch (error) {
      toast.error(error.message);
      set({ loading: false, error: error.message });
    }
  },
}));

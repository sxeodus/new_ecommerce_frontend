import { create } from 'zustand';
import { useAuthStore } from './authStore';
import toast from 'react-hot-toast';

export const useProductStore = create((set) => ({
  products: [],
  featuredProducts: [],
  page: 1,
  pages: 1,
  categories: [],
  loading: false,
  error: null,

  fetchProducts: async ({ pageNumber = 1, keyword = '', category = '' } = {}) => {
    set({ loading: true });
    try {
      const params = new URLSearchParams({ pageNumber, keyword, category });
      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      set({ products: data.products, page: data.page, pages: data.pages, loading: false });
    } catch (error) {
      toast.error(error.message);
      set({ error: error.message, loading: false });
    }
  },

  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/api/products/top');
      if (!response.ok) throw new Error('Failed to fetch featured products');
      const data = await response.json();
      set({ featuredProducts: data, loading: false });
    } catch (error) {
      toast.error(error.message);
      set({ error: error.message, loading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const response = await fetch('/api/products/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      set({ categories: data });
    } catch (error) {
      toast.error(error.message);
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true });
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      const data = await response.json();
      set({ loading: false });
      return data;
    } catch (error) {
      toast.error(error.message);
      set({ error: error.message, loading: false });
      return null;
    }
  },

  createProduct: async (productData) => {
    const { token } = useAuthStore.getState();
    set({ loading: true });
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error('Failed to create product');
      const newProduct = await response.json();
      set((state) => ({
        products: [newProduct, ...state.products],
        loading: false,
      }));
      toast.success('Product created successfully');
      return newProduct;
    } catch (error) {
      toast.error(error.message);
      set({ loading: false, error: error.message });
      return null;
    }
  },

  updateProduct: async (id, productData) => {
    const { token } = useAuthStore.getState();
    set({ loading: true });
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error('Failed to update product');
      const updatedProduct = await response.json();
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
        loading: false,
      }));
      toast.success('Product updated successfully');
      return updatedProduct;
    } catch (error) {
      toast.error(error.message);
      set({ loading: false, error: error.message });
      return null;
    }
  },

  deleteProduct: async (id) => {
    const { token } = useAuthStore.getState();
    set({ loading: true });
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete product');
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        loading: false,
      }));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error(error.message);
      set({ loading: false, error: error.message });
    }
  },
}));

import { create } from 'zustand';
import toast from 'react-hot-toast';
import api from '../api/axios';

export const useProductStore = create((set) => ({
  products: [],
  product: null, // Add product to state for detail page
  page: 1,
  pages: 1,
  categories: [],
  loading: false,
  error: null,

  fetchProducts: async ({ pageNumber = 1, keyword = '', category = '' } = {}) =>
  {
    set({ loading: true });
    try {
      const params = new URLSearchParams({ pageNumber, keyword, category });
      const res = await api.get(`/products?${params.toString()}`);
      const data = res.data;
      set({
        products: data.products,
        page: data.page,
        pages: data.pages,
        loading: false,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Could not fetch products';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  fetchCategories: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/products/categories');
      const data = res.data;
      set({ categories: data, loading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Could not fetch categories';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true, product: null });
    try {
      const res = await api.get(`/products/${id}`);
      const data = res.data;
      set({ product: data, loading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Could not fetch product';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await api.post('/admin/products', productData);
      const newProduct = res.data;
      toast.success('Product created successfully!');
      set({ loading: false });
      return newProduct;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Could not create product';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  updateProduct: async (id, productData) => {
    set({ loading: true });
    try {
      const res = await api.put(`/api/admin/products/${id}`, productData);
      const updatedProduct = res.data;
      toast.success('Product updated successfully!');
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
        product: state.product?.id === id ? updatedProduct : state.product,
        loading: false,
      }));
      return updatedProduct;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Could not update product';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await api.delete(`/api/admin/products/${id}`);
      toast.success('Product deleted successfully!');
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Could not delete product';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },
}));

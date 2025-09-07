import { create } from 'zustand';

export const useCartStore = create((set) => ({
  items: [],
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        // If item already exists, increment its quantity
        const updatedItems = state.items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        return { items: updatedItems };
      } else {
        // If item is new, add it to the cart with quantity 1
        return { items: [...state.items, { ...product, quantity: 1 }] };
      }
    }),

  removeFromCart: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    })),

  incrementQuantity: (productId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      ),
    })),

  decrementQuantity: (productId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ),
    })),

  clearCart: () => set({ items: [] }),
}));
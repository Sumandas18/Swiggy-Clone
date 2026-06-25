import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      userId: null,

      setUserId: (id) => set((state) => {
        // Transfer guest cart to logged-in user
        if (state.userId === null) {
          return { userId: id };
        }
        // If a DIFFERENT user logs in, clear the previous user's cart
        if (state.userId !== id) {
          return { userId: id, items: [], restaurantId: null };
        }
        return state;
      }),

      addItem: (foodItem, restaurantId) => set((state) => {
        // If adding an item from a different restaurant, clear the cart first
        if (state.restaurantId && state.restaurantId !== restaurantId) {
          if (!window.confirm("Your cart contains items from another restaurant. Do you want to clear it and add this new item?")) {
            return state;
          }
          return {
            items: [{ ...foodItem, quantity: 1 }],
            restaurantId: restaurantId
          };
        }

        const existingItem = state.items.find(i => i._id === foodItem._id);
        if (existingItem) {
          return {
            items: state.items.map(i => 
              i._id === foodItem._id ? { ...i, quantity: i.quantity + 1 } : i
            ),
            restaurantId
          };
        }

        return {
          items: [...state.items, { ...foodItem, quantity: 1 }],
          restaurantId
        };
      }),

      removeItem: (foodItemId) => set((state) => {
        const existingItem = state.items.find(i => i._id === foodItemId);
        if (existingItem.quantity === 1) {
          const newItems = state.items.filter(i => i._id !== foodItemId);
          return {
            items: newItems,
            restaurantId: newItems.length === 0 ? null : state.restaurantId
          };
        }

        return {
          items: state.items.map(i => 
            i._id === foodItemId ? { ...i, quantity: i.quantity - 1 } : i
          )
        };
      }),

      clearCart: () => set({ items: [], restaurantId: null, userId: null }),

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      userId: null,

      setUserId: (id) => set((state) => {
        if (state.userId === null) {
          return { userId: id };
        }
        if (state.userId !== id) {
          return { userId: id, items: [] };
        }
        return state;
      }),

      addItem: (foodItem, restaurantId) => set((state) => {
        const existingItem = state.items.find(i => i._id === foodItem._id);
        if (existingItem) {
          return {
            items: state.items.map(i => 
              i._id === foodItem._id ? { ...i, quantity: i.quantity + 1 } : i
            )
          };
        }

        return {
          items: [...state.items, { ...foodItem, quantity: 1, restaurantId }]
        };
      }),

      removeItem: (foodItemId) => set((state) => {
        const existingItem = state.items.find(i => i._id === foodItemId);
        if (existingItem.quantity === 1) {
          return {
            items: state.items.filter(i => i._id !== foodItemId)
          };
        }

        return {
          items: state.items.map(i => 
            i._id === foodItemId ? { ...i, quantity: i.quantity - 1 } : i
          )
        };
      }),

      clearCart: () => set({ items: [], userId: null }),

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

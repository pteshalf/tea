import { create } from 'zustand';
import { CartItem } from './types';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => set((state) => {
    // Basic check if same configuration exists
    const existing = state.items.find(i => 
      i.productId === item.productId &&
      i.size === item.size &&
      i.sugar === item.sugar &&
      i.ice === item.ice &&
      JSON.stringify(i.toppings.sort()) === JSON.stringify(item.toppings.sort())
    );

    if (existing) {
      return {
        items: state.items.map(i => 
          i.id === existing.id 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      };
    }
    return { items: [...state.items, { ...item, id: Math.random().toString(36).substring(2, 9) }] };
  }),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  updateQuantity: (id, delta) => set((state) => ({
    items: state.items.map(i => {
      if (i.id === id) {
        const newQ = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQ };
      }
      return i;
    })
  })),
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}));

import { create } from "zustand";
import { type MenuItem } from "@/data/data";

export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: MenuItem, quantity?: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  total: () => number;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item, quantity = 1) =>
    set((state) => {
      const existing = state.items.find((entry) => entry.id === item.id);
      if (existing) {
        return {
          items: state.items.map((entry) =>
            entry.id === item.id ? { ...entry, quantity: entry.quantity + quantity } : entry,
          ),
        };
      }

      return { items: [...state.items, { ...item, quantity }] };
    }),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((entry) => entry.id !== id),
    })),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
}));

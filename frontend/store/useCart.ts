import { create } from "zustand";
import { api } from "@/lib/api";

interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  image: string | null;
  size: string;
  back_option: string;
  quantity: number;
  subtotal: number;
}

interface CartStore {
  items: CartItem[];
  total: number;
  isOpen: boolean;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (product_id: string, size: string, back_option?: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateItem: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  total: 0,
  isOpen: false,
  loading: false,

  fetchCart: async () => {
    try {
      const data = await api.getCart();
      set({ items: data.items, total: data.total });
    } catch {}
  },

  addItem: async (product_id, size, back_option = "") => {
    set({ loading: true });
    try {
      await api.addToCart({ product_id, size, back_option, quantity: 1 });
      await get().fetchCart();
    } finally {
      set({ loading: false });
    }
  },

  removeItem: async (id) => {
    await api.removeCartItem(id);
    await get().fetchCart();
  },

  updateItem: async (id, quantity) => {
    await api.updateCartItem(id, { quantity });
    await get().fetchCart();
  },

  clearCart: async () => {
    await api.clearCart();
    set({ items: [], total: 0 });
  },

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
}));
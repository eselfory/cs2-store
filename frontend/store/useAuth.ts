import { create } from "zustand";
import { api } from "@/lib/api";

interface User {
  id: string;
  username: string;
  email: string;
  steam_id: string | null;
  steam_username: string | null;
  steam_avatar: string | null;
  is_admin: boolean;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const data = await api.login({ email, password });
      localStorage.setItem("token", data.access_token);
      set({ token: data.access_token });
      const me = await api.getMe();
      set({ user: me });
    } finally {
      set({ loading: false });
    }
  },

  register: async (username, email, password) => {
    set({ loading: true });
    try {
      const data = await api.register({ username, email, password });
      localStorage.setItem("token", data.access_token);
      set({ token: data.access_token });
      const me = await api.getMe();
      set({ user: me });
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  fetchMe: async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const me = await api.getMe();
      set({ user: me });
    } catch {
      localStorage.removeItem("token");
    }
  },
}));
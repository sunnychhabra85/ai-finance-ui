import { create } from "zustand";

interface AuthState {
  user: any;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user?: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  login: (token: string, user?: any) => set({ token, user: user ?? true }),
  logout: () => set({ token: null, user: null }),
}));

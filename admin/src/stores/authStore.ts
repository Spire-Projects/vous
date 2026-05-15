import { create } from "zustand";

export type AdminRole = "admin" | "superadmin";

export interface AuthUser {
  uid: string;
  email: string | null;
  name: string;
  role: AdminRole;
}

interface AuthStore {
  user: AuthUser | null;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AppStore {
  user: User | null;
  theme: 'light' | 'dark';
  setUser: (user: User | null) => void;
  toggleTheme: () => void;
  logout: () => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      user: null,
      theme: 'light',
      setUser: (user) => set({ user }),
      toggleTheme: () =>
        set((s) => {
          const next = s.theme === 'light' ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', next);
          return { theme: next };
        }),
      logout: async () => {
        try {
          await fetch(import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + '/auth/logout' : 'http://localhost:3000/api/auth/logout', { 
            method: 'POST',
            credentials: 'include'
          });
        } catch (e) {
          console.error('Logout failed:', e);
        }
        set({ user: null });
        window.location.href = '/login';
      },
    }),
    { name: 'desivagabond-store' }
  )
);

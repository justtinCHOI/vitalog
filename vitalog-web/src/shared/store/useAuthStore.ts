import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type State = {
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
};

type Actions = {
  login: (token: string) => void;
  logout: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const useAuthStore = create<State & Actions>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,
      login: (token: string) => {
        set({ token, isAuthenticated: true });
      },
      logout: () => {
        set({ token: null, isAuthenticated: false });
      },
      setHasHydrated: (hasHydrated) => {
        set({
          _hasHydrated: hasHydrated,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({ token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
); 
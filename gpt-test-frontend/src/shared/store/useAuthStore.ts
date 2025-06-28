import { create } from 'zustand';

type State = {
  token: string | null;
  isAuthenticated: boolean;
};

type Actions = {
  login: (token: string) => void;
  logout: () => void;
  initialize: () => void;
};

export const useAuthStore = create<State & Actions>((set) => ({
  token: null,
  isAuthenticated: false,
  login: (token: string) => {
    localStorage.setItem('accessToken', token);
    set({ token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    set({ token: null, isAuthenticated: false });
  },
  initialize: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        set({ token, isAuthenticated: true });
      }
    }
  },
})); 
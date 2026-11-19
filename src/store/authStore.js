import { create } from 'zustand';
import { api } from '../services/api';

// NOTE: demo auth only. Replace with real token-based auth from your backend.
const KEY = 'servease_admin_user';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } };

export const useAuthStore = create((set) => ({
  user: load(),
  async login(email, password) {
    const user = await api.login(email, password);
    try { localStorage.setItem(KEY, JSON.stringify(user)); } catch { /* ignore */ }
    set({ user });
  },
  logout() {
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    set({ user: null });
  },
}));

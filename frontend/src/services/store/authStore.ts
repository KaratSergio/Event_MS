import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../auth/auth.api';
import type { User, LoginCredentials, RegisterCredentials } from '../auth/auth.types';
import type { ApiError } from '../api/client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  clearError: () => void;

  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authApi.login(credentials);
          set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false
          });
          return response.data.user;
        } catch (err) {
          const apiError = err as ApiError;
          set({ error: apiError.message, isLoading: false });
          throw apiError;
        }
      },

      register: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authApi.register(credentials);
          set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false
          });
          return response.data.user;
        } catch (err) {
          const apiError = err as ApiError;
          set({ error: apiError.message, isLoading: false });
          throw apiError;
        }
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          await authApi.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false
          });
        }
      },

      checkAuth: async () => {
        try {
          const response = await authApi.getCurrentUser();
          if (response.data) {
            set({ user: response.data, isAuthenticated: true });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
    }),

    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);
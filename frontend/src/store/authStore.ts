import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          // TODO: Replace with actual API call
          console.log('Login API call:', { email, password });

          // Mock success
          const mockUser = {
            id: '1',
            email,
            name: email === 'bob@g.com' ? 'Bob Dylan' : 'Jane Smith'
          };
          const mockToken = 'mock-jwt-token';

          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false
          });
        }
      },

      register: async (email: string, password: string, name?: string) => {
        set({ isLoading: true, error: null });

        try {
          // TODO: Replace with actual API call
          console.log('Register API call:', { email, password, name });
          set({ isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false
          });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);
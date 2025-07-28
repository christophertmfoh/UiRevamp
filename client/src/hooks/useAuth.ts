import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import React from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      login: (user: User, token: string) => {
        set({ 
          user, 
          token, 
          isAuthenticated: true,
          isLoading: false 
        });
      },

      logout: async () => {
        const { token } = get();
        
        if (token) {
          try {
            await fetch('/api/auth/logout', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
          } catch (error) {
            // Logout anyway even if server request fails
            console.error('Logout request failed:', error);
          }
        }

        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isLoading: false 
        });
      },

      checkAuth: async () => {
        const { token } = get();
        
        if (!token) {
          set({ isLoading: false });
          return;
        }

        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            set({ 
              user: data.user, 
              isAuthenticated: true,
              isLoading: false 
            });
          } else {
            // Silently clear invalid tokens without throwing
            set({ 
              user: null, 
              token: null, 
              isAuthenticated: false,
              isLoading: false 
            });
          }
        } catch (error) {
          // Network error or invalid token - silently clear auth state
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false,
            isLoading: false 
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      }
    }),
    {
      name: 'fablecraft-auth',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);

// Hook to initialize auth state on app load
export function useAuthInit() {
  const checkAuth = useAuth(state => state.checkAuth);
  
  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);
}
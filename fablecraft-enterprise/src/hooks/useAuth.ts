import React from 'react'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * User interface representing authenticated user data
 */
export interface User {
  id: string
  email: string
  username: string
  fullName?: string
  createdAt: string
  updatedAt?: string
  lastLoginAt?: string
  isActive: boolean
}

/**
 * Authentication state interface
 * Manages user authentication, tokens, and auth-related operations
 */
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User, token: string) => void
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  setLoading: (loading: boolean) => void
}

/**
 * Authentication store using Zustand with persistence
 * Handles user authentication state across the application
 * 
 * @example
 * ```tsx
 * const { user, login, logout } = useAuth()
 * ```
 */
export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      /**
       * Login user and store authentication data
       */
      login: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      /**
       * Logout user and clear authentication data
       * Attempts to notify server of logout
       */
      logout: async () => {
        const { token } = get()

        if (token) {
          try {
            const apiUrl = import.meta.env.VITE_API_URL || '/api'
            await fetch(`${apiUrl}/auth/logout`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            })
          } catch (error) {
            // Logout anyway even if server request fails
            console.error('Logout request failed:', error)
          }
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      /**
       * Verify current authentication status
       * Validates token with server and updates state
       */
      checkAuth: async () => {
        const { token } = get()

        if (!token) {
          set({ isLoading: false })
          return
        }

        try {
          const apiUrl = import.meta.env.VITE_API_URL || '/api'
          const response = await fetch(`${apiUrl}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            set({
              user: data.user,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            // Silently clear invalid tokens without throwing
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            })
          }
        } catch (error) {
          // Network error or invalid token - silently clear auth state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      /**
       * Set loading state
       */
      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: 'fablecraft-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

/**
 * Hook to initialize auth state on app load
 * Checks authentication status when component mounts
 * 
 * @example
 * ```tsx
 * function App() {
 *   useAuthInit() // Call at app root
 *   return <Routes />
 * }
 * ```
 */
export function useAuthInit() {
  const checkAuth = useAuth((state) => state.checkAuth)

  React.useEffect(() => {
    checkAuth()
  }, [checkAuth])
}
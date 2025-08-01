import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * USER DATA INTERFACE
 * Define the structure for authenticated user data
 */
export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  preferences?: Record<string, unknown>
  createdAt?: string
}

/**
 * AUTHENTICATION ERROR INTERFACE
 * Structured error handling for auth operations
 */
export interface AuthError {
  message: string
  code?: string
  field?: string
}

/**
 * AUTHENTICATION STATE INTERFACE
 * Complete type definition for auth store state and actions
 */
interface AuthState {
  // State
  user: User | null
  token: string | null
  refreshToken: string | null
  isLoading: boolean
  error: AuthError | null
  isInitialized: boolean

  // Actions
  login: (user: User, token: string, refreshToken?: string) => void
  logout: () => void
  setUser: (user: User) => void
  setTokens: (token: string, refreshToken?: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: AuthError | null) => void
  refreshAuth: () => Promise<boolean>
  clearError: () => void
  initialize: () => void
}

/**
 * AUTHENTICATION STORE
 * 
 * Zustand store with localStorage persistence for managing authentication state.
 * Features:
 * - Type-safe state management
 * - Automatic persistence across sessions
 * - Error handling and loading states
 * - Token refresh capabilities
 * - Initialization tracking
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      error: null,
      isInitialized: false,

      // Login Action
      login: (user: User, token: string, refreshToken?: string) => {
        set({
          user,
          token,
          refreshToken: refreshToken || null,
          isLoading: false,
          error: null,
          isInitialized: true,
        })
      },

      // Logout Action
      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isLoading: false,
          error: null,
          isInitialized: true,
        })
      },

      // Set User Action
      setUser: (user: User) => {
        set({ user, error: null })
      },

      // Set Tokens Action
      setTokens: (token: string, refreshToken?: string) => {
        set({
          token,
          refreshToken: refreshToken || get().refreshToken,
          error: null,
        })
      },

      // Set Loading Action
      setLoading: (isLoading: boolean) => {
        set({ isLoading })
      },

      // Set Error Action
      setError: (error: AuthError | null) => {
        set({ error, isLoading: false })
      },

      // Clear Error Action
      clearError: () => {
        set({ error: null })
      },

      // Initialize Action
      initialize: () => {
        set({ isInitialized: true })
      },

      // Refresh Authentication
      refreshAuth: async (): Promise<boolean> => {
        const { refreshToken, setError, setTokens, logout } = get()

        if (!refreshToken) {
          logout()
          return false
        }

        try {
          set({ isLoading: true, error: null })

          // In a real implementation, this would be an API call
          // For now, we'll simulate the refresh logic
          // TODO: Replace with actual API call when backend is ready
          const mockRefreshSuccess = true

          if (mockRefreshSuccess) {
            // Mock successful token refresh
            const newToken = `new_token_${Date.now()}`
            const newRefreshToken = `new_refresh_token_${Date.now()}`
            
            setTokens(newToken, newRefreshToken)
            set({ isLoading: false })
            return true
          } else {
            throw new Error('Token refresh failed')
          }
        } catch (error) {
          const authError: AuthError = {
            message: error instanceof Error ? error.message : 'Token refresh failed',
            code: 'REFRESH_FAILED',
          }
          
          setError(authError)
          logout()
          return false
        }
      },
    }),
    {
      name: 'fablecraft-auth', // localStorage key
      storage: createJSONStorage(() => localStorage),
      
      // Only persist essential data, exclude loading and error states
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isInitialized: state.isInitialized,
      }),

      // Handle state rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Clear any persisted loading or error states
          state.isLoading = false
          state.error = null
        }
      },
    }
  )
)

/**
 * AUTHENTICATION SELECTOR HOOKS
 * Convenient selectors for common auth state patterns
 */

// Check if user is authenticated
export const useIsAuthenticated = () => 
  useAuthStore((state) => !!state.user && !!state.token)

// Get user data only
export const useUser = () => 
  useAuthStore((state) => state.user)

// Get auth tokens
export const useAuthTokens = () => 
  useAuthStore((state) => ({ 
    token: state.token, 
    refreshToken: state.refreshToken 
  }))

// Get loading state
export const useAuthLoading = () => 
  useAuthStore((state) => state.isLoading)

// Get error state
export const useAuthError = () => 
  useAuthStore((state) => state.error)

// Get initialization state
export const useAuthInitialized = () => 
  useAuthStore((state) => state.isInitialized)

/**
 * AUTHENTICATION UTILITIES
 * Helper functions for common auth operations
 */

// Get auth headers for API requests
export const getAuthHeaders = (): Record<string, string> => {
  const token = useAuthStore.getState().token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Check if tokens are available
export const hasValidTokens = (): boolean => {
  const { token, refreshToken } = useAuthStore.getState()
  return !!(token && refreshToken)
}

// Export store actions for use outside components
export const authActions = {
  login: (user: User, token: string, refreshToken?: string) => 
    useAuthStore.getState().login(user, token, refreshToken),
  logout: () => useAuthStore.getState().logout(),
  setUser: (user: User) => useAuthStore.getState().setUser(user),
  setTokens: (token: string, refreshToken?: string) => 
    useAuthStore.getState().setTokens(token, refreshToken),
  setLoading: (loading: boolean) => useAuthStore.getState().setLoading(loading),
  setError: (error: AuthError | null) => useAuthStore.getState().setError(error),
  refreshAuth: () => useAuthStore.getState().refreshAuth(),
  clearError: () => useAuthStore.getState().clearError(),
  initialize: () => useAuthStore.getState().initialize(),
}
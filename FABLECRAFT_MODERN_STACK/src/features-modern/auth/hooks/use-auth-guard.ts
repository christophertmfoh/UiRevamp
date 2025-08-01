import { useIsAuthenticated, useAuthLoading, useAuthInitialized } from '../stores/auth-store'

/**
 * Custom hook that encapsulates the common authentication guard logic
 * Used by both ProtectedRoute and RequireAuth components
 * 
 * @returns Authentication state and loading status
 */
export const useAuthGuard = () => {
  const isAuthenticated = useIsAuthenticated()
  const isLoading = useAuthLoading()
  const isInitialized = useAuthInitialized()
  
  return {
    isAuthenticated,
    isLoading: isLoading || !isInitialized,
    shouldRedirect: !isAuthenticated && isInitialized,
  }
}

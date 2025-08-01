import { Navigate } from 'react-router-dom'
import { useIsAuthenticated, useAuthLoading, useAuthInitialized } from '../stores/auth-store'

/**
 * AUTHENTICATION GUARD HOOK
 * 
 * Custom hook for imperative authentication checks in components
 * 
 * Usage:
 * ```tsx
 * const { isAuthenticated, isLoading, redirectToLogin } = useAuthGuard()
 * 
 * if (isLoading) return <Loading />
 * if (!isAuthenticated) return redirectToLogin()
 * ```
 */
export const useAuthGuard = (redirectTo: string = '/login') => {
  const isAuthenticated = useIsAuthenticated()
  const isLoading = useAuthLoading()
  const isInitialized = useAuthInitialized()
  
  const redirectToLogin = () => (
    <Navigate to={redirectTo} replace />
  )
  
  return {
    isAuthenticated,
    isLoading,
    isInitialized,
    redirectToLogin,
    needsRedirect: !isLoading && isInitialized && !isAuthenticated,
  }
}

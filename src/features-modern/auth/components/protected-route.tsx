import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore, useIsAuthenticated, useAuthLoading, useAuthInitialized } from '../stores/auth-store'

/**
 * PROTECTED ROUTE COMPONENT
 * 
 * Modern React Router v6 protected route implementation that:
 * - Uses Zustand auth store for authentication state
 * - Integrates with Navigate for redirects
 * - Uses Outlet for nested route rendering
 * - Handles loading and initialization states
 * - Provides proper TypeScript support
 */

interface ProtectedRouteProps {
  /**
   * Optional redirect path for unauthenticated users
   * Defaults to '/login'
   */
  redirectTo?: string
  
  /**
   * Optional fallback component for loading state
   * Defaults to a simple loading div
   */
  fallback?: React.ComponentType
}

/**
 * Loading Component
 * Simple loading state component that matches our design system
 */
const DefaultLoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center space-friends">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p className="text-sm text-muted-foreground">Checking authentication...</p>
    </div>
  </div>
)

/**
 * Protected Route Component
 * 
 * Usage:
 * ```tsx
 * <Route path="/dashboard" element={<ProtectedRoute />}>
 *   <Route index element={<Dashboard />} />
 *   <Route path="profile" element={<Profile />} />
 * </Route>
 * ```
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectTo = '/login',
  fallback: Fallback = DefaultLoadingFallback,
}) => {
  const isAuthenticated = useIsAuthenticated()
  const isLoading = useAuthLoading()
  const isInitialized = useAuthInitialized()
  
  // Show loading state while authentication is being checked
  if (isLoading || !isInitialized) {
    return <Fallback />
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }
  
  // Render protected routes
  return <Outlet />
}

/**
 * REQUIRE AUTH COMPONENT
 * 
 * Alternative component-based approach for wrapping individual components
 * 
 * Usage:
 * ```tsx
 * <Route 
 *   path="/dashboard" 
 *   element={
 *     <RequireAuth>
 *       <Dashboard />
 *     </RequireAuth>
 *   } 
 * />
 * ```
 */

interface RequireAuthProps {
  children: React.ReactNode
  redirectTo?: string
  fallback?: React.ComponentType
}

export const RequireAuth: React.FC<RequireAuthProps> = ({
  children,
  redirectTo = '/login',
  fallback: Fallback = DefaultLoadingFallback,
}) => {
  const isAuthenticated = useIsAuthenticated()
  const isLoading = useAuthLoading()
  const isInitialized = useAuthInitialized()
  
  // Show loading state while authentication is being checked
  if (isLoading || !isInitialized) {
    return <Fallback />
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }
  
  // Render protected content
  return <>{children}</>
}

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

export default ProtectedRoute
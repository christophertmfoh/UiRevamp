import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useIsAuthenticated } from '../stores/auth-store'
import { LoginForm } from '../components/login-form'

/**
 * LOGIN PAGE COMPONENT
 * 
 * Complete login page that integrates with the existing design system.
 * Features:
 * - Automatic redirect for authenticated users
 * - Theme-reactive design matching landing page
 * - Mathematical spacing system integration
 * - Golden ratio typography
 * - Responsive layout
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const isAuthenticated = useIsAuthenticated()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  // Handle successful login
  const handleLoginSuccess = () => {
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {/* Main Container */}
      <div className="w-full max-w-md space-strangers">
        
        {/* Header Section */}
        <div className="text-center space-friends">
          {/* Logo/Brand */}
          <div className="mb-acquaintances">
            <h1 className="text-golden-xl font-bold text-foreground tracking-wide">
              FABLECRAFT
            </h1>
            <p className="text-golden-sm text-muted-foreground mt-best-friends">
              Welcome back to your creative workspace
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="
          bg-card border border-border rounded-lg 
          p-strangers shadow-sm
          space-friends
        ">
          <div className="space-friends">
            <div className="text-center space-best-friends">
              <h2 className="text-golden-lg font-semibold text-card-foreground">
                Sign In
              </h2>
              <p className="text-golden-md text-muted-foreground">
                Access your creative projects and continue writing
              </p>
            </div>

            {/* Login Form */}
            <LoginForm 
              onSuccess={handleLoginSuccess}
              showRememberMe={true}
              className="space-friends"
            />
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center space-best-friends">
          <div className="space-best-friends">
            <p className="text-golden-md text-muted-foreground">
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/signup')}
                className="
                  text-primary hover:text-primary/80 
                  font-medium transition-colors
                  underline-offset-4 hover:underline
                "
              >
                Sign up
              </button>
            </p>
          </div>
          
          <div className="space-best-friends">
            <button 
              onClick={() => navigate('/forgot-password')}
              className="
                text-golden-sm text-muted-foreground 
                hover:text-foreground transition-colors
                underline-offset-4 hover:underline
              "
            >
              Forgot your password?
            </button>
          </div>
          
          <div className="space-best-friends">
            <button 
              onClick={() => navigate('/')}
              className="
                text-golden-sm text-muted-foreground 
                hover:text-foreground transition-colors
                underline-offset-4 hover:underline
              "
            >
              ← Back to landing page
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
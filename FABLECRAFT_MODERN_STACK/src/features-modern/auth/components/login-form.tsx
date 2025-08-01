import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuthStore } from '../stores/auth-store'
import { Button } from '@/components/ui/button'

/**
 * LOGIN FORM VALIDATION SCHEMA
 * 
 * Zod schema for type-safe form validation with comprehensive rules:
 * - Email format validation
 * - Password length requirements
 * - Custom error messages
 */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

/**
 * TypeScript type inference from Zod schema
 * Automatically generates types for form data
 */
type LoginFormData = z.infer<typeof loginSchema>

/**
 * LOGIN FORM PROPS INTERFACE
 * Configurable props for form customization
 */
interface LoginFormProps {
  /**
   * Callback function called after successful login
   */
  onSuccess?: () => void
  
  /**
   * Optional CSS classes for form styling
   */
  className?: string
  
  /**
   * Show/hide the "Remember me" checkbox
   */
  showRememberMe?: boolean
}

/**
 * LOGIN FORM COMPONENT
 * 
 * Modern React form using React Hook Form + Zod validation.
 * Features:
 * - Type-safe form validation
 * - Integration with Zustand auth store
 * - Design system integration (Button component)
 * - Theme-reactive styling using CSS custom properties
 * - Loading states and error handling
 * - Password visibility toggle
 * - Mathematical spacing (friendship levels)
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  className = '',
  showRememberMe = false,
}) => {
  // Auth store integration
  const { login, setLoading, setError } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  // React Hook Form setup with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  /**
   * Form submission handler
   * Integrates with auth store for login logic
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      // Clear any previous errors
      clearErrors()
      setError(null)
      setLoading(true)

      // Mock authentication - replace with actual API call
      await mockAuthentication(data.email, data.password)
      
      // Create user object for store
      const user = {
        id: '1',
        email: data.email,
        name: data.email.split('@')[0], // Extract name from email for demo
      }

      // Generate mock tokens
      const token = `token_${Date.now()}`
      const refreshToken = `refresh_${Date.now()}`

      // Update auth store
      login(user, token, refreshToken)
      
      // Call success callback
      onSuccess?.()
      
    } catch (error) {
      // Handle authentication errors
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      
      if (errorMessage.includes('email')) {
        setFormError('email', { message: 'Invalid email address' })
      } else if (errorMessage.includes('password')) {
        setFormError('password', { message: 'Invalid password' })
      } else {
        setError({ message: errorMessage })
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Mock authentication function
   * Replace with actual API integration
   */
  const mockAuthentication = async (email: string, password: string): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock validation - replace with real authentication
    if (email === 'demo@fablecraft.com' && password === 'password') {
      return // Success
    }
    
    throw new Error('Invalid email or password')
  }

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className={`space-friends ${className}`}
      noValidate
    >
      {/* Email Field */}
      <div className="space-best-friends">
        <label 
          htmlFor="email" 
          className="block text-golden-md font-medium text-foreground"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={`
            w-full px-3 py-2 border rounded-md text-golden-md
            bg-background text-foreground
            border-border placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
            disabled:cursor-not-allowed disabled:opacity-50
            transition-colors
            ${errors.email ? 'border-destructive focus:ring-destructive' : ''}
          `}
          placeholder="Enter your email"
          {...register('email')}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-golden-sm text-destructive mt-best-friends" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-best-friends">
        <label 
          htmlFor="password" 
          className="block text-golden-md font-medium text-foreground"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            className={`
              w-full px-3 py-2 pr-10 border rounded-md text-golden-md
              bg-background text-foreground
              border-border placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
              disabled:cursor-not-allowed disabled:opacity-50
              transition-colors
              ${errors.password ? 'border-destructive focus:ring-destructive' : ''}
            `}
            placeholder="Enter your password"
            {...register('password')}
            disabled={isSubmitting}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="
              absolute inset-y-0 right-0 h-full w-10
              text-muted-foreground hover:text-foreground
              disabled:cursor-not-allowed
            "
            onClick={() => setShowPassword(!showPassword)}
            disabled={isSubmitting}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errors.password && (
          <p className="text-golden-sm text-destructive mt-best-friends" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Remember Me Checkbox */}
      {showRememberMe && (
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="
              h-4 w-4 rounded border-border 
              text-primary focus:ring-ring focus:ring-2
            "
          />
          <label htmlFor="remember-me" className="ml-friends text-golden-md text-foreground">
            Remember me
          </label>
        </div>
      )}

      {/* Submit Button - Using design system Button component */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-friends animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>

      {/* Demo Credentials Helper */}
      <div className="mt-friends p-friends bg-muted rounded-md">
        <p className="text-golden-sm text-muted-foreground">
          <strong>Demo credentials:</strong>
          <br />
          Email: demo@fablecraft.com
          <br />
          Password: password
        </p>
      </div>
    </form>
  )
}

export default LoginForm

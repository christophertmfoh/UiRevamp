import type { 
  User, 
  LoginCredentials, 
  RegisterCredentials, 
  AuthTokens, 
  PasswordResetRequest,
  PasswordReset 
} from '../types'

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }
    
    return response.json()
  },

  register: async (credentials: RegisterCredentials): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Registration failed')
    }
    
    return response.json()
  },

  logout: async (): Promise<void> => {
    await fetch('/api/auth/logout', { method: 'POST' })
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },

  refreshToken: async (): Promise<AuthTokens> => {
    const refreshToken = localStorage.getItem('refreshToken')
    
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    })
    
    if (!response.ok) {
      throw new Error('Token refresh failed')
    }
    
    return response.json()
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await fetch('/api/auth/me')
    
    if (!response.ok) {
      throw new Error('Failed to get current user')
    }
    
    return response.json()
  },

  requestPasswordReset: async (data: PasswordResetRequest): Promise<void> => {
    const response = await fetch('/api/auth/password-reset/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Password reset request failed')
    }
  },

  resetPassword: async (data: PasswordReset): Promise<void> => {
    const response = await fetch('/api/auth/password-reset/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Password reset failed')
    }
  },

  verifyEmail: async (token: string): Promise<void> => {
    const response = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Email verification failed')
    }
  }
}
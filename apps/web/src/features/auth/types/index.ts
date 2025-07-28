export interface User {
  id: string
  email: string
  username: string
  displayName?: string
  avatar?: string
  role: UserRole
  emailVerified: boolean
  createdAt: Date
  lastLoginAt: Date
  preferences: UserPreferences
}

export type UserRole = 'user' | 'premium' | 'admin'

export interface UserPreferences {
  theme: string
  language: string
  emailNotifications: boolean
  writingReminders: boolean
  defaultProjectType: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterCredentials {
  email: string
  username: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordReset {
  token: string
  newPassword: string
  confirmPassword: string
}
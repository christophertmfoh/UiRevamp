// Re-export shared schema types
export * from '../../../../../shared/schema'

// Common UI types
export interface LoadingState {
  isLoading: boolean
  error: string | null
}

export interface PaginationState {
  page: number
  pageSize: number
  total: number
  hasNext: boolean
  hasPrev: boolean
}

export interface SortState {
  field: string
  direction: 'asc' | 'desc'
}

export interface FilterState {
  [key: string]: unknown
}

// API Response types
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  code?: string
  field?: string
}

// Theme types
export interface ThemeConfig {
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    foreground: string
    muted: string
    accent: string
    destructive: string
  }
  fonts: {
    sans: string
    serif: string
    mono: string
  }
}

// Navigation types
export interface NavItem {
  label: string
  href: string
  icon?: string
  disabled?: boolean
  external?: boolean
}

export interface MenuItem extends NavItem {
  children?: MenuItem[]
}

// Form types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio'
  placeholder?: string
  required?: boolean
  validation?: {
    min?: number
    max?: number
    pattern?: string
    custom?: (value: unknown) => boolean | string
  }
  options?: { label: string; value: string }[]
}
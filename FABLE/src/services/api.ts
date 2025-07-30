import axios from 'axios'

// Create axios instance with default config
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Example API functions
export const apiService = {
  // GET request
  get: async <T>(url: string): Promise<T> => {
    const response = await api.get<T>(url)
    return response.data
  },

  // POST request
  post: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await api.post<T>(url, data)
    return response.data
  },

  // PUT request
  put: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await api.put<T>(url, data)
    return response.data
  },

  // DELETE request
  delete: async <T>(url: string): Promise<T> => {
    const response = await api.delete<T>(url)
    return response.data
  },
}

// Example usage with React Query
export const queryKeys = {
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  posts: ['posts'] as const,
  post: (id: string) => ['posts', id] as const,
}
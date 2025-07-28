/**
 * Enterprise Test Setup Configuration
 * 
 * This file configures the testing environment for professional
 * enterprise-grade testing with proper mocking and utilities.
 */

import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'

// Clean up after each test automatically
afterEach(() => {
  cleanup()
})

// Mock environment setup
beforeAll(() => {
  // Mock environment variables for consistent testing
  process.env.NODE_ENV = 'test'
  process.env.DATABASE_URL = 'mock://test-database'
  
  // Mock browser APIs that aren't available in jsdom
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))

  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  })

  // Mock sessionStorage
  Object.defineProperty(window, 'sessionStorage', {
    value: localStorageMock,
  })

  // Mock fetch for API testing
  global.fetch = vi.fn()

  // Suppress console errors in tests unless debugging
  if (!process.env.DEBUG_TESTS) {
    console.error = vi.fn()
    console.warn = vi.fn()
  }
})

// Test utilities for consistent testing
export const testUtils = {
  // Mock user for authentication tests
  mockUser: {
    id: 'test-user-1',
    username: 'testuser',
    email: 'test@fablecraft.io',
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },

  // Mock project for project tests
  mockProject: {
    id: 'test-project-1',
    userId: 'test-user-1',
    name: 'Test Project',
    type: 'novel' as const,
    description: 'A test project for testing',
    genre: ['Fantasy', 'Adventure'],
    manuscriptNovel: '',
    manuscriptScreenplay: '',
    synopsis: 'Test synopsis',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },

  // Mock task for task management tests
  mockTask: {
    id: 'test-task-1',
    text: 'Test task',
    completed: false,
    priority: 'medium' as const,
    estimatedMinutes: 30,
    createdAt: new Date(),
    dueDate: null,
    projectId: null,
    category: 'writing',
  },

  // Mock API responses
  mockApiSuccess: (data: any) => ({
    ok: true,
    status: 200,
    json: async () => data,
  }),

  mockApiError: (status: number, message: string) => ({
    ok: false,
    status,
    json: async () => ({ error: message }),
  }),

  // Wait for async operations in tests
  waitFor: (ms: number = 0) => new Promise(resolve => setTimeout(resolve, ms)),
}
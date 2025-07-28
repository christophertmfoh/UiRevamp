/**
 * Enterprise Server Test Setup
 * 
 * Configuration for server-side API and integration testing
 */

import { beforeAll, afterAll, vi } from 'vitest'

beforeAll(() => {
  // Set test environment
  process.env.NODE_ENV = 'test'
  process.env.DATABASE_URL = 'mock://test-database'
  
  // Disable console logs in tests unless debugging
  if (!process.env.DEBUG_TESTS) {
    console.log = vi.fn()
    console.info = vi.fn()
    console.warn = vi.fn()
    console.error = vi.fn()
  }
})

afterAll(() => {
  // Cleanup after all tests
  vi.restoreAllMocks()
})

// Test utilities for server testing
export const serverTestUtils = {
  // Mock request/response objects
  mockRequest: (overrides = {}) => ({
    params: {},
    query: {},
    body: {},
    headers: {},
    ...overrides,
  }),

  mockResponse: () => {
    const res: any = {}
    res.status = vi.fn().mockReturnValue(res)
    res.json = vi.fn().mockReturnValue(res)
    res.send = vi.fn().mockReturnValue(res)
    res.end = vi.fn().mockReturnValue(res)
    return res
  },

  // Mock next function for middleware testing
  mockNext: vi.fn(),

  // Wait for async operations
  waitFor: (ms: number = 0) => new Promise(resolve => setTimeout(resolve, ms)),
}
import '@testing-library/jest-dom';
import { expect, afterEach, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';

// Extend Vitest's expect with Jest DOM matchers
expect.extend({});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: () => {},
});

// Mock localStorage
const localStorageMock = {
  getItem: (key: string) => global.localStorage[key] || null,
  setItem: (key: string, value: string) => {
    global.localStorage[key] = value;
  },
  removeItem: (key: string) => {
    delete global.localStorage[key];
  },
  clear: () => {
    global.localStorage = {};
  },
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: (key: string) => global.sessionStorage[key] || null,
  setItem: (key: string, value: string) => {
    global.sessionStorage[key] = value;
  },
  removeItem: (key: string) => {
    delete global.sessionStorage[key];
  },
  clear: () => {
    global.sessionStorage = {};
  },
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock fetch for tests that don't use MSW
global.fetch = global.fetch || (() => 
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200,
    statusText: 'OK',
  })
) as any;

// Setup MSW server for API mocking
beforeAll(() => {
  // Start the MSW server
  server.listen({
    onUnhandledRequest: 'error', // Fail tests on unhandled requests
  });
});

// Reset request handlers between tests
afterEach(() => {
  // Cleanup DOM after each test
  cleanup();
  
  // Reset MSW handlers
  server.resetHandlers();
  
  // Clear localStorage and sessionStorage
  localStorage.clear();
  sessionStorage.clear();
  
  // Clear any timers
  vi.clearAllTimers();
  
  // Clear all mocks
  vi.clearAllMocks();
});

// Clean up after all tests
afterAll(() => {
  server.close();
});

// Global test utilities
export const mockConsole = () => {
  const originalConsole = console;
  const mockConsole = {
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  };
  
  beforeEach(() => {
    Object.assign(console, mockConsole);
  });
  
  afterEach(() => {
    Object.assign(console, originalConsole);
  });
  
  return mockConsole;
};

// Helper for testing async components
export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0));

// Helper for testing with fake timers
export const withFakeTimers = (callback: () => void | Promise<void>) => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });
  
  return callback;
};

// Custom matchers for better testing experience
declare global {
  namespace Vi {
    interface JestAssertion<T = any> {
      toHaveBeenCalledOnceWith(...args: any[]): T;
      toHaveBeenCalledBefore(mock: any): T;
      toHaveBeenCalledAfter(mock: any): T;
    }
  }
}

// Extend expect with custom matchers
expect.extend({
  toHaveBeenCalledOnceWith(received, ...expected) {
    const pass = received.mock.calls.length === 1 && 
                 received.mock.calls[0].every((arg: any, index: number) => 
                   Object.is(arg, expected[index])
                 );
    
    return {
      message: () =>
        `expected ${received.getMockName()} to have been called once with ${expected}`,
      pass,
    };
  },
  
  toHaveBeenCalledBefore(received, other) {
    const receivedOrder = received.mock.invocationCallOrder[0];
    const otherOrder = other.mock.invocationCallOrder[0];
    const pass = receivedOrder < otherOrder;
    
    return {
      message: () =>
        `expected ${received.getMockName()} to have been called before ${other.getMockName()}`,
      pass,
    };
  },
  
  toHaveBeenCalledAfter(received, other) {
    const receivedOrder = received.mock.invocationCallOrder[0];
    const otherOrder = other.mock.invocationCallOrder[0];
    const pass = receivedOrder > otherOrder;
    
    return {
      message: () =>
        `expected ${received.getMockName()} to have been called after ${other.getMockName()}`,
      pass,
    };
  },
});
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock browser APIs that may not be available in jsdom
beforeAll(() => {
  // Mock IntersectionObserver
  (
    globalThis as unknown as { IntersectionObserver: unknown }
  ).IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  };

  // Mock ResizeObserver
  (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver =
    class ResizeObserver {
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

  // Mock scrollTo
  Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: () => {},
  });

  // Mock localStorage
  const localStorageMock = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null,
  };
  Object.defineProperty(window, 'localStorage', {
    writable: true,
    value: localStorageMock,
  });

  // Mock sessionStorage
  Object.defineProperty(window, 'sessionStorage', {
    writable: true,
    value: { ...localStorageMock },
  });
});

afterAll(() => {
  // Cleanup any global mocks if needed
});

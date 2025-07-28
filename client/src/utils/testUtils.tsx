/**
 * Enterprise Test Utilities
 * Comprehensive testing framework setup
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastProvider } from '@/components/ui/Toast';

// Mock implementations for testing
const mockQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
    mutations: {
      retry: false,
    },
  },
});

// Test wrapper with all providers
interface TestWrapperProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

function TestWrapper({ children, queryClient = mockQueryClient }: TestWrapperProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <ToastProvider>
          {children}
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  const { queryClient, ...renderOptions } = options;

  return render(ui, {
    wrapper: ({ children }) => (
      <TestWrapper queryClient={queryClient}>
        {children}
      </TestWrapper>
    ),
    ...renderOptions,
  });
}

// Mock API responses
export const mockApiResponses = {
  projects: [
    {
      id: 'test-project-1',
      name: 'Test Novel',
      type: 'novel' as const,
      description: 'A test novel project',
      createdAt: new Date('2024-01-01'),
      userId: 'test-user-1',
      synopsis: 'Test synopsis',
      genre: ['Fantasy'],
      lastModified: new Date('2024-01-01'),
      manuscriptNovel: 'Test content',
      manuscriptScreenplay: null,
    }
  ],
  characters: [
    {
      id: 'test-character-1',
      projectId: 'test-project-1',
      name: 'Test Character',
      fields: {
        age: '25',
        occupation: 'Adventurer',
        personality: 'Brave and loyal',
      },
      template: 'fantasy-hero',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      tags: ['protagonist'],
    }
  ],
  user: {
    id: 'test-user-1',
    email: 'test@example.com',
    displayName: 'Test User',
    createdAt: new Date('2024-01-01'),
    lastActiveAt: new Date('2024-01-01'),
  }
};

// Mock hooks for testing
export const mockUseAuth = {
  user: mockApiResponses.user,
  isAuthenticated: true,
  isLoading: false,
};

export const mockUseProjects = {
  projects: mockApiResponses.projects,
  isLoading: false,
  error: null,
  refetch: jest.fn(),
};

// Test utilities for character system
export const characterTestUtils = {
  createMockCharacter: (overrides = {}) => ({
    ...mockApiResponses.characters[0],
    ...overrides,
  }),
  
  createMockCharacterField: (name: string, value: string, type: 'text' | 'textarea' | 'select' = 'text') => ({
    id: `field-${name}`,
    name,
    value,
    type,
    category: 'basic' as const,
    isRequired: false,
  }),
};

// Performance testing utilities
export const performanceTestUtils = {
  measureRenderTime: async (renderFn: () => void) => {
    const start = performance.now();
    renderFn();
    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for render
    const end = performance.now();
    return end - start;
  },

  expectFastRender: (renderTime: number, maxTime: number = 100) => {
    expect(renderTime).toBeLessThan(maxTime);
  },
};

// Accessibility testing utilities
export const a11yTestUtils = {
  expectKeyboardNavigable: (element: HTMLElement) => {
    expect(element).toHaveAttribute('tabindex');
  },

  expectScreenReaderAccessible: (element: HTMLElement) => {
    expect(
      element.hasAttribute('aria-label') || 
      element.hasAttribute('aria-labelledby') ||
      element.textContent
    ).toBeTruthy();
  },

  expectProperHeadingStructure: (container: HTMLElement) => {
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let currentLevel = 0;
    
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      expect(level).toBeLessThanOrEqual(currentLevel + 1);
      currentLevel = level;
    });
  },
};

// Integration test utilities
export const integrationTestUtils = {
  simulateUserFlow: {
    createProject: async (user: any, projectName: string) => {
      // Simulate complete project creation flow
      // Implementation would depend on actual UI flow
    },
    
    createCharacter: async (user: any, projectId: string, characterName: string) => {
      // Simulate complete character creation flow
      // Implementation would depend on actual UI flow
    },
  },
};

// Mock server handlers for MSW (Mock Service Worker)
export const mockServerHandlers = [
  // API endpoint mocks would go here
  // Example using MSW syntax:
  // rest.get('/api/projects', (req, res, ctx) => {
  //   return res(ctx.json(mockApiResponses.projects));
  // }),
];

// Custom matchers for testing
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeAccessible(): R;
      toLoadWithinTime(maxTime: number): R;
      toHaveValidForm(): R;
    }
  }
}

// Export everything for easy importing
export {
  TestWrapper,
  mockQueryClient,
};

// Re-export testing library utilities
export * from '@testing-library/react';
export * from '@testing-library/user-event';
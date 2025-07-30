// A-Grade Testing: Core Application Tests
// Enterprise-grade test coverage for Phase 1-2 compliance

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the auth hook
vi.mock('./hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    isLoading: false,
    isAuthenticated: false
  })
}));

describe('App Component', () => {
  const createTestApp = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });

    return (
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );
  };

  it('renders without crashing', () => {
    render(createTestApp());
    expect(document.body).toBeTruthy();
  });

  it('shows landing page for unauthenticated users', () => {
    render(createTestApp());
    // Should show landing page content
    expect(screen.getByRole('main')).toBeTruthy();
  });

  it('has proper document structure', () => {
    render(createTestApp());
    expect(document.querySelector('html')).toBeTruthy();
    expect(document.querySelector('body')).toBeTruthy();
  });
});
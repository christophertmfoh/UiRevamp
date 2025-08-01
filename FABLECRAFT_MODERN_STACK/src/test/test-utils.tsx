/**
 * Test Utilities
 * Custom render function and testing utilities
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@/shared/lib/theme-system/theme-provider';
import userEvent from '@testing-library/user-event';

/**
 * Custom render function that includes all providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string;
  theme?: 'light' | 'dark';
}

function AllTheProviders({ children, theme = 'light' }: { children: React.ReactNode; theme?: 'light' | 'dark' }) {
  return (
    <MemoryRouter>
      <ThemeProvider defaultTheme={theme}>
        {children}
      </ThemeProvider>
    </MemoryRouter>
  );
}

export function customRender(
  ui: React.ReactElement,
  options?: CustomRenderOptions
) {
  const { initialRoute = '/', theme = 'light', ...renderOptions } = options || {};

  // Set initial route if provided
  if (initialRoute !== '/') {
    window.history.pushState({}, 'Test page', initialRoute);
  }

  return {
    user: userEvent.setup(),
    ...render(ui, {
      wrapper: ({ children }) => <AllTheProviders theme={theme}>{children}</AllTheProviders>,
      ...renderOptions,
    }),
  };
}

/**
 * Re-export everything from testing library
 */
export * from '@testing-library/react';
export { customRender as render };

/**
 * Custom queries for common patterns
 */
export const queries = {
  // Find form elements by label
  getFormInput: (container: HTMLElement, labelText: string) => {
    const label = container.querySelector(`label:has-text("${labelText}")`);
    if (!label) return null;
    const inputId = label.getAttribute('for');
    return inputId ? container.querySelector(`#${inputId}`) : null;
  },

  // Find glass card components
  getGlassCard: (container: HTMLElement, variant?: 'light' | 'heavy' | 'elevated') => {
    const className = variant
      ? variant === 'light' ? 'bg-card\\/95'
      : variant === 'heavy' ? 'bg-card\\/90'
      : 'surface-elevated'
      : 'backdrop-blur';
    
    return container.querySelector(`[class*="${className}"]`);
  },
};

/**
 * Accessibility testing utilities
 */
export { default as axe } from '@axe-core/react';
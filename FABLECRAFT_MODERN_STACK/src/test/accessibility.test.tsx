/**
 * Accessibility Testing Configuration
 * Sets up axe-core for automated accessibility testing
 */

import React from 'react';
import { configureAxe } from 'jest-axe';
import { render } from './test-utils';

// Configure axe with custom rules
export const axe = configureAxe({
  rules: {
    // Disable specific rules that might not apply
    'region': { enabled: false }, // Don't require landmarks for every test
    'color-contrast': { enabled: true }, // Ensure color contrast
    'label': { enabled: true }, // Ensure form labels
    'button-name': { enabled: true }, // Ensure buttons have text
    'image-alt': { enabled: true }, // Ensure images have alt text
  },
});

/**
 * Custom accessibility test helper
 */
export async function testAccessibility(
  component: React.ReactElement,
  options?: {
    /**
     * Specific axe rules to run
     */
    rules?: string[];
    /**
     * Skip certain violations by rule ID
     */
    skip?: string[];
  }
) {
  const { container } = render(component);
  
  const results = await axe(container, {
    rules: options?.rules?.reduce((acc, rule) => {
      acc[rule] = { enabled: true };
      return acc;
    }, {} as Record<string, { enabled: boolean }>),
  });

  // Filter out skipped violations
  if (options?.skip) {
    results.violations = results.violations.filter(
      violation => !options.skip!.includes(violation.id)
    );
  }

  return results;
}

/**
 * Example accessibility test
 */
describe('Accessibility Testing Setup', () => {
  it('should be configured correctly', async () => {
    const TestComponent = () => (
      <div>
        <h1>Test Page</h1>
        <button>Click me</button>
        <input type="text" aria-label="Test input" />
      </div>
    );

    const results = await testAccessibility(<TestComponent />);
    expect(results).toHaveNoViolations();
  });

  it('should catch accessibility violations', async () => {
    const BadComponent = () => (
      <div>
        {/* Missing label */}
        <input type="text" />
        {/* Poor color contrast */}
        <div style={{ color: '#e0e0e0', backgroundColor: '#f0f0f0' }}>
          Hard to read text
        </div>
        {/* Missing alt text */}
        <img src="test.jpg" />
      </div>
    );

    const results = await testAccessibility(<BadComponent />);
    expect(results.violations.length).toBeGreaterThan(0);
  });
});

/**
 * Keyboard navigation test helpers
 */
export const keyboardTests = {
  /**
   * Test tab navigation order
   */
  async testTabOrder(user: any, expectedOrder: string[]) {
    for (const elementText of expectedOrder) {
      await user.tab();
      const focused = document.activeElement;
      expect(focused).toHaveTextContent(elementText);
    }
  },

  /**
   * Test escape key closes modal/dialog
   */
  async testEscapeKey(user: any, modalTestId: string) {
    const modal = screen.getByTestId(modalTestId);
    expect(modal).toBeInTheDocument();
    
    await user.keyboard('{Escape}');
    
    expect(modal).not.toBeInTheDocument();
  },

  /**
   * Test arrow key navigation
   */
  async testArrowKeys(user: any, options: {
    direction: 'up' | 'down' | 'left' | 'right';
    expectedFocus: string;
  }) {
    await user.keyboard(`{Arrow${options.direction.charAt(0).toUpperCase() + options.direction.slice(1)}}`);
    expect(document.activeElement).toHaveTextContent(options.expectedFocus);
  },
};

// Re-export jest-axe matchers
export { toHaveNoViolations } from 'jest-axe';
import { toHaveNoViolations } from 'jest-axe';
import { expect } from 'vitest';
import { screen } from '@testing-library/react';

// Extend Vitest matchers with jest-axe matchers
expect.extend(toHaveNoViolations);
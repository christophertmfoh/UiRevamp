/**
 * Authentication Test Utilities
 * Helper functions for testing auth flows
 */

import { screen, waitFor } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';

/**
 * Mock auth store for testing
 */
export const mockAuthStore = {
  user: null,
  token: null,
  isAuthenticated: false,
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn(),
  checkAuth: jest.fn(),
};

/**
 * Fill out login form helper
 */
export async function fillLoginForm(
  user: UserEvent,
  email: string,
  password: string
) {
  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);

  await user.clear(emailInput);
  await user.type(emailInput, email);

  await user.clear(passwordInput);
  await user.type(passwordInput, password);
}

/**
 * Fill out signup form helper
 */
export async function fillSignupForm(
  user: UserEvent,
  data: {
    username: string;
    email: string;
    password: string;
    confirmPassword?: string;
  }
) {
  const usernameInput = screen.getByLabelText(/username/i);
  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/^password/i);

  await user.clear(usernameInput);
  await user.type(usernameInput, data.username);

  await user.clear(emailInput);
  await user.type(emailInput, data.email);

  await user.clear(passwordInput);
  await user.type(passwordInput, data.password);

  if (data.confirmPassword !== undefined) {
    const confirmInput = screen.getByLabelText(/confirm password/i);
    await user.clear(confirmInput);
    await user.type(confirmInput, data.confirmPassword);
  }
}

/**
 * Submit form and wait for validation
 */
export async function submitForm(user: UserEvent, buttonText = /submit/i) {
  const submitButton = screen.getByRole('button', { name: buttonText });
  await user.click(submitButton);

  // Wait for any validation errors to appear
  await waitFor(() => {
    // Allow time for async validation
  }, { timeout: 1000 });
}

/**
 * Assert validation error appears
 */
export function expectValidationError(fieldName: string, errorMessage: string | RegExp) {
  const errorElement = screen.getByRole('alert', { name: new RegExp(fieldName, 'i') });
  expect(errorElement).toHaveTextContent(errorMessage);
}

/**
 * Mock API responses
 */
export const mockApiResponses = {
  loginSuccess: {
    token: 'mock-jwt-token',
    user: {
      id: '123',
      email: 'test@example.com',
      username: 'testuser',
    },
  },
  loginError: {
    error: 'Invalid credentials',
  },
  signupSuccess: {
    token: 'mock-jwt-token',
    user: {
      id: '456',
      email: 'newuser@example.com',
      username: 'newuser',
    },
  },
  signupError: {
    error: 'Email already exists',
  },
};

/**
 * Wait for navigation after auth
 */
export async function waitForNavigation(pathname: string) {
  await waitFor(() => {
    expect(window.location.pathname).toBe(pathname);
  }, { timeout: 3000 });
}

/**
 * Test data generators
 */
export const testData = {
  validEmail: () => `test${Date.now()}@example.com`,
  validPassword: () => 'SecurePass123!',
  weakPassword: () => '123',
  invalidEmail: () => 'not-an-email',
  validUsername: () => `user${Date.now()}`,
};
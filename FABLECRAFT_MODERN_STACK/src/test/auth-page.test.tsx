import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthPage } from '../features-modern/auth/pages/auth-page';

// helper to set viewport width
const setViewport = (width: number) => {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  window.dispatchEvent(new Event('resize'));
};

describe('AuthPage integration', () => {
  const renderPage = () =>
    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );

  it('shows login form by default and toggles to signup', () => {
    setViewport(375);
    renderPage();

    // login visible
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();

    // switch to signup
    fireEvent.click(screen.getByRole('button', { name: /need an account/i }));

    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });
});
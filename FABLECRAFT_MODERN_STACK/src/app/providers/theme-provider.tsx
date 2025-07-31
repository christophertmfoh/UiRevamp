'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

/**
 * Enhanced theme provider props with comprehensive TypeScript interfaces
 * Fablecraft Modern Stack - Enterprise Architecture
 */
interface ThemeProviderProps {
  children: React.ReactNode;
  /** CSS attribute to use for theme switching */
  attribute?: 'class' | 'data-theme' | 'data-mode';
  /** Default theme to use on first visit */
  defaultTheme?: string;
  /** Enable system theme detection */
  enableSystem?: boolean;
  /** Available theme names for the application */
  themes?: string[];
  /** Disable CSS transitions when changing themes */
  disableTransitionOnChange?: boolean;
  /** Force a specific theme (useful for SSR) */
  forcedTheme?: string;
  /** LocalStorage key for theme persistence */
  storageKey?: string;
  /** Theme value mapping for custom theme names */
  value?: Record<string, string>;
  /** CSP nonce for inline styles */
  nonce?: string;
}

/**
 * Fablecraft Theme Provider
 *
 * Provides theme context to the entire application with support for:
 * - 8 custom writer-focused themes
 * - System theme detection
 * - Theme persistence via localStorage
 * - WCAG AA contrast compliance across all themes
 *
 * @param props - Theme provider configuration
 * @returns JSX element wrapping children with theme context
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

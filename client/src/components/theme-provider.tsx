import React, { createContext, useContext, useEffect } from 'react';

type ThemeProviderProps = {
  children: React.ReactNode;
};

type ThemeProviderState = {
  theme: 'dark';
  isDark: true;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

// Apply dark mode to DOM immediately
const applyDarkMode = () => {
  const root = window.document.documentElement;
  root.classList.add('dark');
  root.setAttribute('data-theme', 'dark');
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Apply dark mode immediately and on every render
  useEffect(() => {
    applyDarkMode();
  }, []);

  // Also apply on mount to ensure it's set
  React.useLayoutEffect(() => {
    applyDarkMode();
  }, []);

  const value: ThemeProviderState = {
    theme: 'dark',
    isDark: true,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
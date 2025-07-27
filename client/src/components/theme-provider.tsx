import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'dark' | 'light' | 'system';
type ResolvedTheme = 'dark' | 'light';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableSystem?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  themes: Theme[];
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

// Get system theme preference
const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Apply theme to DOM - FAST, class-only approach
const applyTheme = (theme: ResolvedTheme) => {
  const root = document.documentElement;
  
  // Remove all theme classes first
  root.classList.remove('light', 'dark');
  
  // Add the current theme class
  root.classList.add(theme);
};

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'fablecraft-theme',
  enableSystem = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme;
    return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
  });

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => getSystemTheme());
  
  // Calculate resolved theme
  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : (theme as ResolvedTheme);
  
  // Available themes
  const themes: Theme[] = enableSystem ? ['light', 'dark', 'system'] : ['light', 'dark'];

  // Handle theme changes
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newTheme);
    }
  }, [storageKey]);

  // Apply theme to DOM when resolved theme changes
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (!enableSystem || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, enableSystem]);

  // Update system theme on mount
  useEffect(() => {
    if (enableSystem) {
      setSystemTheme(getSystemTheme());
    }
  }, [enableSystem]);

  const value: ThemeProviderState = {
    theme,
    resolvedTheme,
    setTheme,
    themes,
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

// Utility functions for theme checking
export const isLightTheme = (resolvedTheme: ResolvedTheme) => resolvedTheme === 'light';
export const isDarkTheme = (resolvedTheme: ResolvedTheme) => resolvedTheme === 'dark';

// Theme configuration for future expansion
export const THEME_CONFIG = {
  themes: {
    dark: {
      name: 'Dark',
      class: 'dark',
    },
    light: {
      name: 'Light', 
      class: 'light',
    },
    system: {
      name: 'System',
      class: 'system',
    },
  },
  // Future theme variants can go here
  variants: {
    // 'ocean': { name: 'Ocean Blue', class: 'theme-ocean' },
    // 'forest': { name: 'Forest Green', class: 'theme-forest' },
    // 'sunset': { name: 'Sunset Orange', class: 'theme-sunset' },
  }
} as const;
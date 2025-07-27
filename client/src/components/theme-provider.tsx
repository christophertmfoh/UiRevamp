import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';
type ResolvedTheme = 'dark' | 'light';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
  systemTheme: ResolvedTheme;
  themes: Theme[];
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  resolvedTheme: 'dark',
  systemTheme: 'dark',
  themes: ['dark', 'light', 'system'],
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'vite-ui-theme',
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>('dark');
  
  // Get resolved theme (what's actually applied)
  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme;
  
  // Available themes for this provider
  const themes: Theme[] = enableSystem ? ['dark', 'light', 'system'] : ['dark', 'light'];

  // Listen to system theme changes
  useEffect(() => {
    if (!enableSystem) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    // Set initial system theme
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [enableSystem]);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Disable transitions temporarily if requested
    if (disableTransitionOnChange) {
      root.style.transition = 'none';
    }

    // Remove all theme classes
    root.classList.remove('light', 'dark');
    
    // Apply the resolved theme
    root.classList.add(resolvedTheme);
    
    // Re-enable transitions
    if (disableTransitionOnChange) {
      // Use a small timeout to ensure the class change has been applied
      setTimeout(() => {
        root.style.transition = '';
      }, 1);
    }
  }, [resolvedTheme, disableTransitionOnChange]);

  const handleSetTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme);
    setTheme(newTheme);
  };

  const value = {
    theme,
    setTheme: handleSetTheme,
    resolvedTheme,
    systemTheme,
    themes,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};

// Utility function for checking current theme
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
  // Future theme variants could go here
  // variants: {
  //   'dark-warm': { name: 'Dark Warm', class: 'dark-warm' },
  //   'light-cool': { name: 'Light Cool', class: 'light-cool' },
  // }
} as const;
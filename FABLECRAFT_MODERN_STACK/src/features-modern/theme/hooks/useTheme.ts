import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'arctic-focus' | 'golden-hour' | 'midnight-ink' | 'forest-manuscript' | 'starlit-prose' | 'coffee-house' | 'system';
export type ResolvedTheme = Exclude<Theme, 'system'>;

interface UseThemeReturn {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  themes: Theme[];
}

const STORAGE_KEY = 'fablecraft-theme';
const DEFAULT_THEME: Theme = 'system';

// Get system preference
const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Resolve theme (handle system preference)
const resolveTheme = (theme: Theme): ResolvedTheme => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

// Apply theme to document
const applyTheme = (theme: Theme) => {
  const resolved = resolveTheme(theme);
  const root = document.documentElement;
  
  // Remove all theme attributes
  root.removeAttribute('data-theme');
  root.removeAttribute('class');
  
  // Apply new theme
  root.setAttribute('data-theme', resolved);
  
  // For Tailwind dark mode compatibility
  if (resolved === 'dark' || resolved.includes('dark') || resolved.includes('midnight') || resolved.includes('starlit') || resolved.includes('coffee')) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return DEFAULT_THEME;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return (stored as Theme) || DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => 
    resolveTheme(theme)
  );

  // Handle theme changes
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (e) {
      console.warn('Failed to save theme preference:', e);
    }
    
    applyTheme(newTheme);
    setResolvedTheme(resolveTheme(newTheme));
  }, []);

  // Apply theme on mount and handle system changes
  useEffect(() => {
    applyTheme(theme);
    setResolvedTheme(resolveTheme(theme));

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
        setResolvedTheme(getSystemTheme());
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const newTheme = e.newValue as Theme;
        setThemeState(newTheme);
        applyTheme(newTheme);
        setResolvedTheme(resolveTheme(newTheme));
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const themes: Theme[] = [
    'system',
    'light',
    'dark',
    'arctic-focus',
    'golden-hour',
    'midnight-ink',
    'forest-manuscript',
    'starlit-prose',
    'coffee-house'
  ];

  return {
    theme,
    resolvedTheme,
    setTheme,
    themes
  };
}
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

type Theme = 'light' | 'dark' | 'midnight-ink' | 'sunrise-creative' | 'sepia-parchment' | 'evergreen-focus' | 'obsidian-minimal' | 'system';
type ResolvedTheme = Exclude<Theme, 'system'>;

type ThemeConfig = {
  id: Theme;
  name: string;
  description: string;
  mood: string;
  isLight: boolean;
  category: 'light' | 'dark' | 'creative';
  featured?: boolean;
};

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  availableThemes: ThemeConfig[];
  getThemeConfig: (theme: Theme) => ThemeConfig | undefined;
  isLightTheme: boolean;
  isDarkTheme: boolean;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

// Theme configurations with metadata
export const THEME_CONFIGS: ThemeConfig[] = [
  {
    id: 'light',
    name: 'Fablecraft Light',
    description: 'Clean, airy, with soft cream background and green-cyan gradients',
    mood: 'Clean & Professional',
    isLight: true,
    category: 'light',
    featured: true,
  },
  {
    id: 'dark',
    name: 'Fablecraft Dark',
    description: 'Deep charcoal with magical emerald-cyan harmony',
    mood: 'Modern & Focused',
    isLight: false,
    category: 'dark',
    featured: true,
  },
  {
    id: 'midnight-ink',
    name: 'Midnight Ink',
    description: 'Deep navy with brilliant gold accents for scholarly elegance',
    mood: 'Scholarly & Premium',
    isLight: false,
    category: 'creative',
  },
  {
    id: 'sunrise-creative',
    name: 'Sunrise Creative',
    description: 'Inspiring purple-to-orange gradients for creative energy',
    mood: 'Inspiring & Vibrant',
    isLight: false,
    category: 'creative',
  },
  {
    id: 'sepia-parchment',
    name: 'Sepia Parchment',
    description: 'Warm browns and cream for classic literary feel',
    mood: 'Classic & Literary',
    isLight: true,
    category: 'light',
  },
  {
    id: 'evergreen-focus',
    name: 'Evergreen Focus',
    description: 'Monochromatic greens for natural calm and focus',
    mood: 'Natural & Calming',
    isLight: false,
    category: 'creative',
  },
  {
    id: 'obsidian-minimal',
    name: 'Obsidian Minimal',
    description: 'Distraction-free grayscale with sharp blue accents',
    mood: 'Minimal & Technical',
    isLight: false,
    category: 'dark',
  },
];

// Get system theme preference (only returns light or dark)
const getSystemTheme = (): 'light' | 'dark' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Apply theme to DOM using class-based switching
const applyTheme = (theme: ResolvedTheme) => {
  const root = window.document.documentElement;
  
  // Remove all theme classes
  const allThemeClasses = THEME_CONFIGS.map(config => config.id).filter(id => id !== 'system');
  root.classList.remove(...allThemeClasses);
  
  // Add the selected theme class
  if (theme !== 'light') {
    root.classList.add(theme);
  }
  
  // Maintain backward compatibility with Tailwind's dark: utilities
  const themeConfig = THEME_CONFIGS.find(config => config.id === theme);
  if (themeConfig && !themeConfig.isLight) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  // Set data attribute for potential CSS targeting
  root.setAttribute('data-theme', theme);
};

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'fablecraft-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first
    const stored = localStorage.getItem(storageKey) as Theme | null;
    return stored || defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    return theme === 'system' ? getSystemTheme() : theme as ResolvedTheme;
  });

  // Handle theme changes
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(storageKey, newTheme);
  }, [storageKey]);

  // Apply theme to DOM
  useEffect(() => {
    const resolved = theme === 'system' ? getSystemTheme() : theme as ResolvedTheme;
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setResolvedTheme(newTheme);
      applyTheme(newTheme);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme]);

  // Helper functions
  const getThemeConfig = useCallback((themeId: Theme): ThemeConfig | undefined => {
    return THEME_CONFIGS.find(config => config.id === themeId);
  }, []);

  const currentThemeConfig = useMemo(() => {
    return getThemeConfig(resolvedTheme);
  }, [resolvedTheme, getThemeConfig]);

  const isLightTheme = useMemo(() => {
    return currentThemeConfig?.isLight ?? false;
  }, [currentThemeConfig]);

  const isDarkTheme = useMemo(() => {
    return !isLightTheme;
  }, [isLightTheme]);

  const value = useMemo(() => ({
    theme,
    resolvedTheme,
    setTheme,
    availableThemes: THEME_CONFIGS,
    getThemeConfig,
    isLightTheme,
    isDarkTheme,
  }), [theme, resolvedTheme, setTheme, getThemeConfig, isLightTheme, isDarkTheme]);

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

// Export individual theme configs for external use
export const FEATURED_THEMES = THEME_CONFIGS.filter(theme => theme.featured);
export const LIGHT_THEMES = THEME_CONFIGS.filter(theme => theme.isLight);
export const DARK_THEMES = THEME_CONFIGS.filter(theme => !theme.isLight);
export const CREATIVE_THEMES = THEME_CONFIGS.filter(theme => theme.category === 'creative');
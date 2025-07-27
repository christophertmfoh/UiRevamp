import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'midnight-ink' | 'sunrise-creative' | 'sepia-parchment' | 'evergreen-focus' | 'obsidian-minimal' | 'system';
type ResolvedTheme = Exclude<Theme, 'system'>;

type ThemeConfig = {
  id: ResolvedTheme;
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
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Simplified, robust theme application
const applyTheme = (theme: ResolvedTheme) => {
  if (typeof window === 'undefined') return;
  
  try {
    const root = document.documentElement;
    
    // Clear all existing theme classes safely
    const allThemeClasses = ['light', 'dark', 'midnight-ink', 'sunrise-creative', 'sepia-parchment', 'evergreen-focus', 'obsidian-minimal'];
    allThemeClasses.forEach(cls => {
      root.classList.remove(cls);
    });
    
    // Add the selected theme class
    root.classList.add(theme);
    
    // Set data attribute
    root.setAttribute('data-theme', theme);
    
    // Store in localStorage for persistence
    localStorage.setItem('fablecraft-theme', theme);
    
  } catch (error) {
    console.warn('Theme application failed:', error);
  }
};

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'fablecraft-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme;
    
    try {
      const stored = localStorage.getItem(storageKey) as Theme | null;
      return stored && stored !== 'system' ? stored : defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (theme === 'system') return getSystemTheme();
    return theme as ResolvedTheme;
  });

  // Handle theme changes
  const setTheme = (newTheme: Theme) => {
    try {
      setThemeState(newTheme);
      
      const resolved = newTheme === 'system' ? getSystemTheme() : newTheme as ResolvedTheme;
      setResolvedTheme(resolved);
      
      // Apply immediately
      applyTheme(resolved);
      
    } catch (error) {
      console.warn('Theme setting failed:', error);
    }
  };

  // Apply theme on mount and when theme changes
  useEffect(() => {
    const resolved = theme === 'system' ? getSystemTheme() : theme as ResolvedTheme;
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const newTheme = getSystemTheme();
      setResolvedTheme(newTheme);
      applyTheme(newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Helper functions
  const getThemeConfig = (themeId: Theme): ThemeConfig | undefined => {
    if (themeId === 'system') return undefined;
    return THEME_CONFIGS.find(config => config.id === themeId);
  };

  const currentThemeConfig = getThemeConfig(resolvedTheme);
  const isLightTheme = currentThemeConfig?.isLight ?? false;
  const isDarkTheme = !isLightTheme;

  const value: ThemeProviderState = {
    theme,
    resolvedTheme,
    setTheme,
    availableThemes: THEME_CONFIGS,
    getThemeConfig,
    isLightTheme,
    isDarkTheme,
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

// Export individual theme configs for external use
export const FEATURED_THEMES = THEME_CONFIGS.filter(theme => theme.featured);
export const LIGHT_THEMES = THEME_CONFIGS.filter(theme => theme.isLight);
export const DARK_THEMES = THEME_CONFIGS.filter(theme => !theme.isLight);
export const CREATIVE_THEMES = THEME_CONFIGS.filter(theme => theme.category === 'creative');

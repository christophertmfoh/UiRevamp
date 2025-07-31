'use client'

import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/app/providers/use-theme';

type Theme = 'light' | 'dark' | 'arctic-focus' | 'golden-hour' | 'midnight-ink' | 'forest-manuscript' | 'starlit-prose' | 'coffee-house' | 'system'

interface ThemeConfig {
  icon: typeof Sun | typeof Moon | typeof Monitor;
  label: string;
  description: string;
}

const themeConfig: Record<Theme, ThemeConfig> = {
  system: { icon: Monitor, label: 'System', description: 'Follow system preference' },
  light: { icon: Sun, label: 'Light', description: 'Default light theme' },
  dark: { icon: Moon, label: 'Dark', description: 'Default dark theme' },
  'arctic-focus': { icon: Sun, label: 'Arctic Focus', description: 'Cool blues and whites' },
  'golden-hour': { icon: Sun, label: 'Golden Hour', description: 'Warm yellows' },
  'midnight-ink': { icon: Moon, label: 'Midnight Ink', description: 'Deep blue-black' },
  'forest-manuscript': { icon: Moon, label: 'Forest Manuscript', description: 'Green and brown' },
  'starlit-prose': { icon: Moon, label: 'Starlit Prose', description: 'Purple cosmic' },
  'coffee-house': { icon: Moon, label: 'Coffee House', description: 'Warm browns' },
} as const;

// Type-safe theme arrays
const lightThemes: readonly Theme[] = ['light', 'arctic-focus', 'golden-hour'] as const;
const darkThemes: readonly Theme[] = ['dark', 'midnight-ink', 'forest-manuscript', 'starlit-prose', 'coffee-house'] as const;

interface ThemeMenuItemProps {
  theme: Theme;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const ThemeMenuItem = ({ theme, currentTheme, onThemeChange }: ThemeMenuItemProps) => {
  const config = themeConfig[theme];
  const Icon = config.icon;
  
  return (
    <DropdownMenuItem
      onClick={() => onThemeChange(theme)}
      className="cursor-pointer"
    >
      <div className="flex items-center gap-3 w-full">
        <Icon className="h-4 w-4" />
        <div className="flex-1">
          <div className="font-medium">{config.label}</div>
          <div className="text-xs text-muted-foreground">{config.description}</div>
        </div>
        {currentTheme === theme && (
          <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
        )}
      </div>
    </DropdownMenuItem>
  );
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  // Get current theme config with proper fallback
  const currentConfig = themeConfig[theme as Theme] ?? themeConfig.light;
  const CurrentIcon = currentConfig.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <CurrentIcon className="h-5 w-5 transition-all" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* System preference */}
        <ThemeMenuItem
          theme="system"
          currentTheme={theme as Theme}
          onThemeChange={setTheme}
        />
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Light Themes</DropdownMenuLabel>
        
        {/* Light themes */}
        {lightThemes.map((themeOption) => (
          <ThemeMenuItem
            key={themeOption}
            theme={themeOption}
            currentTheme={theme as Theme}
            onThemeChange={setTheme}
          />
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Dark Themes</DropdownMenuLabel>
        
        {/* Dark themes */}
        {darkThemes.map((themeOption) => (
          <ThemeMenuItem
            key={themeOption}
            theme={themeOption}
            currentTheme={theme as Theme}
            onThemeChange={setTheme}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
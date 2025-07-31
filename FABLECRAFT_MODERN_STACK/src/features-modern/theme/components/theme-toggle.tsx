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
import { useTheme } from '../hooks/useTheme';

const themeConfig = {
  system: { icon: Monitor, label: 'System' },
  light: { icon: Sun, label: 'Light' },
  dark: { icon: Moon, label: 'Dark' },
  'arctic-focus': { icon: Sun, label: 'Arctic Focus' },
  'golden-hour': { icon: Sun, label: 'Golden Hour' },
  'midnight-ink': { icon: Moon, label: 'Midnight Ink' },
  'forest-manuscript': { icon: Moon, label: 'Forest Manuscript' },
  'starlit-prose': { icon: Moon, label: 'Starlit Prose' },
  'coffee-house': { icon: Moon, label: 'Coffee House' },
} as const;

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  // Get current icon based on resolved theme
  const getCurrentIcon = () => {
    if (theme === 'system') return Monitor;
    const isDark = resolvedTheme === 'dark' || 
                   resolvedTheme.includes('dark') || 
                   resolvedTheme.includes('midnight') || 
                   resolvedTheme.includes('starlit') || 
                   resolvedTheme.includes('coffee') ||
                   resolvedTheme.includes('forest');
    return isDark ? Moon : Sun;
  };

  const CurrentIcon = getCurrentIcon();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <CurrentIcon className="h-5 w-5 transition-all" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* System preference */}
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="cursor-pointer"
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
          {theme === 'system' && (
            <span className="ml-auto text-xs text-muted-foreground">✓</span>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Light Themes</DropdownMenuLabel>
        
        {/* Light themes */}
        {['light', 'arctic-focus', 'golden-hour'].map((t) => {
          const config = themeConfig[t as keyof typeof themeConfig];
          const Icon = config.icon;
          return (
            <DropdownMenuItem
              key={t}
              onClick={() => setTheme(t as any)}
              className="cursor-pointer"
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{config.label}</span>
              {theme === t && (
                <span className="ml-auto text-xs text-muted-foreground">✓</span>
              )}
            </DropdownMenuItem>
          );
        })}
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Dark Themes</DropdownMenuLabel>
        
        {/* Dark themes */}
        {['dark', 'midnight-ink', 'forest-manuscript', 'starlit-prose', 'coffee-house'].map((t) => {
          const config = themeConfig[t as keyof typeof themeConfig];
          const Icon = config.icon;
          return (
            <DropdownMenuItem
              key={t}
              onClick={() => setTheme(t as any)}
              className="cursor-pointer"
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{config.label}</span>
              {theme === t && (
                <span className="ml-auto text-xs text-muted-foreground">✓</span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
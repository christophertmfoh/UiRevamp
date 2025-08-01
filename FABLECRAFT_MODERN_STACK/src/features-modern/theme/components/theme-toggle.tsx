'use client'

import { Monitor, Moon, Sun, Palette, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useTheme } from '@/app/providers/use-theme';

type Theme = 
  | 'light' 
  | 'dark' 
  | 'arctic-focus' 
  | 'golden-hour' 
  | 'midnight-ink' 
  | 'forest-manuscript' 
  | 'starlit-prose' 
  | 'coffee-house'
  | 'sunset-coral'
  | 'lavender-dusk'
  | 'halloween'
  | 'cherry-lacquer'
  | 'volcanic-ash'
  | 'cyberpunk'
  | 'arctic-aurora'
  | 'desert-mirage'
  | 'moonlit-garden'
  | 'dragons-hoard'
  | 'true-black-white'
  | 'system'

interface ThemeConfig {
  icon: typeof Sun | typeof Moon | typeof Monitor | typeof Palette | typeof Sparkles | typeof Zap;
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
  'sunset-coral': { icon: Sun, label: 'Sunset Coral', description: 'Warm coral and gold' },
  'lavender-dusk': { icon: Sun, label: 'Lavender Dusk', description: 'Soft lavender and grey' },
  'halloween': { icon: Zap, label: 'Halloween', description: 'Spooky orange and black' },
  'cherry-lacquer': { icon: Moon, label: 'Cherry Lacquer', description: 'Luxury deep red' },
  'volcanic-ash': { icon: Moon, label: 'Volcanic Ash', description: 'Molten orange and ash' },
  'cyberpunk': { icon: Zap, label: 'Cyberpunk', description: 'Neon cyan and magenta' },
  'arctic-aurora': { icon: Sun, label: 'Arctic Aurora', description: 'Cool teal aurora' },
  'desert-mirage': { icon: Sun, label: 'Desert Mirage', description: 'Warm desert gold' },
  'moonlit-garden': { icon: Sparkles, label: 'Moonlit Garden', description: 'Fantasy moonlit blues' },
  'dragons-hoard': { icon: Sparkles, label: "Dragon's Hoard", description: 'Fantasy gold treasures' },
  'true-black-white': { icon: Palette, label: 'True Black & White', description: 'Pure contrast' },
} as const;

// Type-safe theme arrays organized by category
const coreThemes: readonly Theme[] = ['light', 'dark'] as const;
const classicLightThemes: readonly Theme[] = ['arctic-focus', 'golden-hour'] as const;
const classicDarkThemes: readonly Theme[] = ['midnight-ink', 'forest-manuscript', 'starlit-prose', 'coffee-house'] as const;
const modernLightThemes: readonly Theme[] = ['sunset-coral', 'lavender-dusk', 'arctic-aurora', 'desert-mirage'] as const;
const modernDarkThemes: readonly Theme[] = ['cherry-lacquer', 'volcanic-ash'] as const;
const fantasyThemes: readonly Theme[] = ['moonlit-garden', 'dragons-hoard'] as const;
const specialtyThemes: readonly Theme[] = ['halloween', 'cyberpunk', 'true-black-white'] as const;

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
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Theme Selection</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Scrollable content area with responsive max height */}
                  <ScrollArea.Root className="h-full" type="always">
          <ScrollArea.Viewport className="max-h-96 w-full">
            {/* System preference */}
            <ThemeMenuItem
              theme="system"
              currentTheme={theme as Theme}
              onThemeChange={setTheme}
            />
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">Core Themes</DropdownMenuLabel>
            
            {/* Core themes */}
            {coreThemes.map((themeOption) => (
              <ThemeMenuItem
                key={themeOption}
                theme={themeOption}
                currentTheme={theme as Theme}
                onThemeChange={setTheme}
              />
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">Classic Light Themes</DropdownMenuLabel>
            
            {/* Classic light themes */}
            {classicLightThemes.map((themeOption) => (
              <ThemeMenuItem
                key={themeOption}
                theme={themeOption}
                currentTheme={theme as Theme}
                onThemeChange={setTheme}
              />
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">Classic Dark Themes</DropdownMenuLabel>
            
            {/* Classic dark themes */}
            {classicDarkThemes.map((themeOption) => (
              <ThemeMenuItem
                key={themeOption}
                theme={themeOption}
                currentTheme={theme as Theme}
                onThemeChange={setTheme}
              />
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">Modern Light Themes</DropdownMenuLabel>
            
            {/* Modern light themes */}
            {modernLightThemes.map((themeOption) => (
              <ThemeMenuItem
                key={themeOption}
                theme={themeOption}
                currentTheme={theme as Theme}
                onThemeChange={setTheme}
              />
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">Modern Dark Themes</DropdownMenuLabel>
            
            {/* Modern dark themes */}
            {modernDarkThemes.map((themeOption) => (
              <ThemeMenuItem
                key={themeOption}
                theme={themeOption}
                currentTheme={theme as Theme}
                onThemeChange={setTheme}
              />
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">Fantasy Themes</DropdownMenuLabel>
            
            {/* Fantasy themes */}
            {fantasyThemes.map((themeOption) => (
              <ThemeMenuItem
                key={themeOption}
                theme={themeOption}
                currentTheme={theme as Theme}
                onThemeChange={setTheme}
              />
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">Specialty Themes</DropdownMenuLabel>
            
            {/* Specialty themes */}
            {specialtyThemes.map((themeOption) => (
              <ThemeMenuItem
                key={themeOption}
                theme={themeOption}
                currentTheme={theme as Theme}
                onThemeChange={setTheme}
              />
            ))}
           </ScrollArea.Viewport>
          
          {/* Simplified functional scrollbar */}
          <ScrollArea.Scrollbar 
            className="flex select-none touch-none w-2.5 bg-border/20 hover:bg-border/50 transition-colors"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="flex-1 bg-border rounded-[1px] hover:bg-border/80" />
          </ScrollArea.Scrollbar>
          
          <ScrollArea.Corner />
        </ScrollArea.Root>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
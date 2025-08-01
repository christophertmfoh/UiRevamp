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
  | 'ocean-depths'
  | 'sunset-coral'
  | 'forest-sage' 
  | 'ocean-teal'
  | 'lavender-dusk'
  | 'midnight-amber'
  | 'monochrome'
  | 'halloween'
  | 'cyberpunk'
  | 'mystic-realm'
  | 'enchanted-forest'
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
  'ocean-depths': { icon: Moon, label: 'Ocean Depths', description: 'Cool blues and teals' },
  'sunset-coral': { icon: Sun, label: 'Sunset Coral', description: 'Warm coral and gold' },
  'forest-sage': { icon: Sun, label: 'Forest Sage', description: 'Deep green and cream' },
  'ocean-teal': { icon: Sun, label: 'Ocean Teal', description: 'Deep teal and silver' },
  'lavender-dusk': { icon: Sun, label: 'Lavender Dusk', description: 'Soft lavender and grey' },
  'midnight-amber': { icon: Moon, label: 'Midnight Amber', description: 'Dark navy and gold' },
  'monochrome': { icon: Palette, label: 'Monochrome', description: 'Pure black and white' },
  'halloween': { icon: Zap, label: 'Halloween', description: 'Spooky orange and black' },
  'cyberpunk': { icon: Zap, label: 'Cyberpunk', description: 'Neon colors' },
  'mystic-realm': { icon: Sparkles, label: 'Mystic Realm', description: 'Mystical purples and golds' },
  'enchanted-forest': { icon: Sparkles, label: 'Enchanted Forest', description: 'Magical greens and silvers' },
} as const;

// Type-safe theme arrays organized by category
const coreThemes: readonly Theme[] = ['light', 'dark'] as const;
const classicLightThemes: readonly Theme[] = ['arctic-focus', 'golden-hour'] as const;
const classicDarkThemes: readonly Theme[] = ['midnight-ink', 'forest-manuscript', 'starlit-prose', 'coffee-house'] as const;
const modernLightThemes: readonly Theme[] = ['sunset-coral', 'forest-sage', 'ocean-teal', 'lavender-dusk'] as const;
const modernDarkThemes: readonly Theme[] = ['ocean-depths', 'midnight-amber'] as const;
const specialtyThemes: readonly Theme[] = ['monochrome', 'halloween', 'cyberpunk'] as const;
const fantasyThemes: readonly Theme[] = ['mystic-realm', 'enchanted-forest'] as const;

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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
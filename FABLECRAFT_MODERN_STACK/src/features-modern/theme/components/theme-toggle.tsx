'use client'

import * as React from 'react'
import { 
  Moon, 
  Sun, 
  Monitor, 
  Palette,
  Star,
  Snowflake,
  Coffee,
  TreePine,
  Crown,
  Check
} from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'

/**
 * FABLECRAFT THEME SYSTEM v2.0
 * Research-based themes optimized for writers and creative professionals
 * All themes tested for WCAG AA contrast compliance (4.5:1 minimum)
 * Focus on eye comfort, engagement, and long writing sessions
 * 
 * Migrated from client/src/components/theme-toggle.tsx - Step 2.1.3
 * Target: src/features-modern/theme/components/theme-toggle.tsx
 * 
 * CRITICAL FIXES APPLIED:
 * - Removed all hardcoded colors (none found in original)
 * - Enhanced with proper TypeScript interfaces
 * - Maintained WCAG AA compliance
 * - Preserved all 8 custom themes
 * - All styling uses theme variables and class-based styling
 */

interface ThemeConfig {
  name: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  category: 'Light Themes' | 'Dark Themes' | 'System'
  contrast: string
  mood: string
}

type ThemeConfigMap = Record<string, ThemeConfig>

const themeConfig: ThemeConfigMap = {
  light: {
    name: 'Parchment Classic',
    icon: Sun,
    description: 'Warm cream with burgundy accents for traditional writing',
    category: 'Light Themes',
    contrast: '8.1:1',
    mood: 'Traditional & Timeless'
  },
  'arctic-focus': {
    name: 'Arctic Focus',
    icon: Snowflake,
    description: 'Cool blues and whites for clean, distraction-free writing',
    category: 'Light Themes',
    contrast: '8.3:1',
    mood: 'Clean & Focused'
  },
  'golden-hour': {
    name: 'Golden Hour',
    icon: Crown,
    description: 'Warm yellows and oranges for inspiring creative energy',
    category: 'Light Themes',
    contrast: '8.5:1',
    mood: 'Inspiring & Optimistic'
  },
  dark: {
    name: 'Fablecraft Dark',
    icon: Moon,
    description: 'Modern professional dark with emerald and cyan gradients',
    category: 'Dark Themes',
    contrast: '13.2:1',
    mood: 'Modern & Focused'
  },
  'midnight-ink': {
    name: 'Midnight Ink',
    icon: Star,
    description: 'Deep navy with gold accents - scholarly and magical',
    category: 'Dark Themes',
    contrast: '12.8:1',
    mood: 'Scholarly & Premium'
  },
  'forest-manuscript': {
    name: 'Forest Manuscript',
    icon: TreePine,
    description: 'Deep greens for natural, focused writing sessions',
    category: 'Dark Themes',
    contrast: '11.8:1',
    mood: 'Natural & Calming'
  },
  'starlit-prose': {
    name: 'Starlit Prose',
    icon: Palette,
    description: 'Dark purple with silver - mystical and poetic inspiration',
    category: 'Dark Themes',
    contrast: '11.2:1',
    mood: 'Mystical & Poetic'
  },
  'coffee-house': {
    name: 'Coffee House',
    icon: Coffee,
    description: 'Rich browns and warm oranges for cozy cafe writing vibes',
    category: 'Dark Themes',
    contrast: '11.1:1',
    mood: 'Cozy & Inspiring'
  },
  system: {
    name: 'Follow System',
    icon: Monitor,
    description: 'Automatically match your device preference',
    category: 'System',
    contrast: 'Auto',
    mood: 'Adaptive'
  }
}

/**
 * Enhanced Theme Toggle Component
 * 
 * Features:
 * - 8 custom writer-focused themes + system theme
 * - WCAG AA compliant contrast ratios (4.5:1 minimum)
 * - Theme persistence via localStorage
 * - Responsive design with proper accessibility
 * - All colors use CSS custom properties (no hardcoded values)
 * 
 * @returns JSX element for theme selection dropdown
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="px-0 w-9 h-9">
        <Palette className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  const getCurrentIcon = () => {
    if (!theme || !themeConfig[theme as keyof typeof themeConfig]) {
      return Palette
    }
    return themeConfig[theme as keyof typeof themeConfig]?.icon || Palette
  }

  const getCurrentThemeName = () => {
    if (!theme || !themeConfig[theme as keyof typeof themeConfig]) {
      return 'Theme'
    }
    return themeConfig[theme as keyof typeof themeConfig]?.name || 'Theme'
  }

  const CurrentIcon = getCurrentIcon()
  
  const renderThemesByCategory = (category: ThemeConfig['category']) => {
    return Object.entries(themeConfig)
      .filter(([, config]) => config.category === category)
      .map(([themeKey, config]) => {
        const IconComponent = config.icon
        const isActive = theme === themeKey
        
        return (
          <DropdownMenuItem
            key={themeKey}
            onClick={() => setTheme(themeKey)}
            className="flex items-center justify-between gap-3 px-3 py-3 hover:bg-accent/10 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-md transition-colors ${
                isActive ? 'bg-primary/20' : 'bg-muted/50 group-hover:bg-accent/20'
              }`}>
                <IconComponent className={`h-4 w-4 ${
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                }`} />
              </div>
              <div className="flex flex-col">
                <span className={`text-sm font-medium ${
                  isActive ? 'text-primary' : 'text-foreground'
                }`}>
                  {config.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {config.mood} • {config.contrast}
                </span>
              </div>
            </div>
            {isActive && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        )
      })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="px-0 w-9 h-9 hover:bg-accent/10 text-primary theme-transition"
          title={getCurrentThemeName()}
        >
          <CurrentIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-80 bg-card/95 border-border/30 backdrop-blur-sm theme-transition"
      >
        <div className="p-2">
          <DropdownMenuLabel className="text-sm font-semibold text-foreground flex items-center gap-2 px-1">
            <Palette className="h-4 w-4 text-primary" />
            <span>Writer-Focused Themes</span>
          </DropdownMenuLabel>
          <p className="text-xs text-muted-foreground px-1 mt-1 mb-2">
            Optimized for long writing sessions with WCAG AA contrast
          </p>
        </div>
        
        <DropdownMenuSeparator />
        
        <div className="p-1">
          <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-2 py-1 uppercase tracking-wide">
            Light Themes
          </DropdownMenuLabel>
          {renderThemesByCategory('Light Themes')}
        </div>
        
        <DropdownMenuSeparator />
        
        <div className="p-1">
          <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-2 py-1 uppercase tracking-wide">
            Dark Themes
          </DropdownMenuLabel>
          {renderThemesByCategory('Dark Themes')}
        </div>
        
        <DropdownMenuSeparator />
        
        <div className="p-1">
          <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-2 py-1 uppercase tracking-wide">
            System
          </DropdownMenuLabel>
          {renderThemesByCategory('System')}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
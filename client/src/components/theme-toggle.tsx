'use client'

import * as React from 'react'
import { 
  Moon, 
  Sun, 
  Monitor, 
  Palette,
  Star,
  Sunrise,
  Scroll,
  TreePine,
  Square,
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

/* 
 * Research-Based Theme Configuration (2024-2025 UX/UI Studies)
 * Based on eye strain reduction, color psychology, and user engagement research
 * Sources: UX Stack Exchange, Toptal Dark UI, Discord/GitHub/Notion/Spotify analysis
 */
const themeConfig = {
  light: {
    name: 'Off-White Light',
    icon: Sun,
    description: 'Reduces eye strain vs pure white (UX Research 2024)',
    category: 'Essential',
    engagement: 'Trust & Productivity'
  },
  dark: {
    name: 'GitHub Dark',
    icon: Moon,
    description: 'High contrast for developer-style engagement',
    category: 'Essential',
    engagement: 'Focus & Development'
  },
  system: {
    name: 'System Auto',
    icon: Monitor,
    description: 'Auto-adapts to your device preference',
    category: 'Essential',
    engagement: 'Personalized Experience'
  },
  'discord-gaming': {
    name: 'Discord Gaming',
    icon: Square,
    description: 'Deep purples/blues with neon accents for creativity',
    category: 'High Engagement',
    engagement: 'Gaming & Creative Energy'
  },
  'notion-focus': {
    name: 'Notion Focus',
    icon: Scroll,
    description: 'Clean pastels optimized for productivity',
    category: 'High Engagement',
    engagement: 'Reading & Focus'  
  },
  'spotify-energy': {
    name: 'Spotify Energy',
    icon: Star,
    description: 'Bright green system for dynamic engagement',
    category: 'High Engagement',
    engagement: 'Dynamic & Energetic'
  },
  'mocha-luxury': {
    name: 'Mocha Luxury',
    icon: TreePine,
    description: '2025 Pantone trend with gold accents',
    category: 'Premium',
    engagement: 'Luxury & Sophistication'
  }
} as const;

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
    return themeConfig[theme as keyof typeof themeConfig].icon
  }

  const getCurrentThemeName = () => {
    if (!theme || !themeConfig[theme as keyof typeof themeConfig]) {
      return 'Theme'
    }
    return themeConfig[theme as keyof typeof themeConfig].name
  }

  const CurrentIcon = getCurrentIcon()
  
  const renderThemesByCategory = (category: string) => {
    return Object.entries(themeConfig)
      .filter(([_, config]) => config.category === category)
      .map(([themeKey, config]) => {
        const IconComponent = config.icon
        const isActive = theme === themeKey
        
        return (
          <DropdownMenuItem
            key={themeKey}
            onClick={() => setTheme(themeKey)}
            className="flex items-center justify-between gap-3 px-3 py-2 hover:bg-accent/10 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <IconComponent className="h-4 w-4 text-primary" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{config.name}</span>
                <span className="text-xs text-muted-foreground">{config.description}</span>
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
          className="px-0 w-9 h-9 hover:bg-accent/10 text-primary"
          title={getCurrentThemeName()}
        >
          <CurrentIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-80 bg-card/95 border-border/30 backdrop-blur-sm"
      >
        <DropdownMenuLabel className="text-sm font-semibold text-foreground px-3 py-2">
          Essential Themes
        </DropdownMenuLabel>
        {renderThemesByCategory('Essential')}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-sm font-semibold text-foreground px-3 py-2">
          High Engagement
        </DropdownMenuLabel>
        {renderThemesByCategory('High Engagement')}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-sm font-semibold text-foreground px-3 py-2">
          Premium Experience
        </DropdownMenuLabel>
        {renderThemesByCategory('Premium')}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
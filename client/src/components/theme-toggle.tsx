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

const themeConfig = {
  light: {
    name: 'Fablecraft Light',
    icon: Sun,
    description: 'Clean, airy, modern SaaS feel',
    category: 'Featured'
  },
  dark: {
    name: 'Fablecraft Dark',
    icon: Moon,
    description: 'Strong, focused, modern dark mode',
    category: 'Featured'
  },
  system: {
    name: 'Follow System',
    icon: Monitor,
    description: 'Automatically match your device',
    category: 'Featured'
  },
  'midnight-ink': {
    name: 'Midnight Ink',
    icon: Star,
    description: 'Premium, intellectual, magical',
    category: 'Creative Collection'
  },
  'sunrise-creative': {
    name: 'Sunrise Creative',
    icon: Sunrise,
    description: 'High-energy, inspiring, vibrant',
    category: 'Creative Collection'
  },
  'sepia-parchment': {
    name: 'Sepia Parchment',
    icon: Scroll,
    description: 'Vintage, academic, warm',
    category: 'Creative Collection'
  },
  'evergreen-focus': {
    name: 'Evergreen Focus',
    icon: TreePine,
    description: 'Natural, calm, restorative',
    category: 'Classic'
  },
  'obsidian-minimal': {
    name: 'Obsidian Minimal',
    icon: Square,
    description: 'Distraction-free, zen',
    category: 'Classic'
  }
}

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
          Featured Themes
        </DropdownMenuLabel>
        {renderThemesByCategory('Featured')}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-sm font-semibold text-foreground px-3 py-2">
          Creative Collection
        </DropdownMenuLabel>
        {renderThemesByCategory('Creative Collection')}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-sm font-semibold text-foreground px-3 py-2">
          Classic Themes
        </DropdownMenuLabel>
        {renderThemesByCategory('Classic')}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
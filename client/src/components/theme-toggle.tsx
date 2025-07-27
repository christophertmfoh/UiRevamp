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
  Check,
  BookOpen,
  Trees,
  Coffee,
  Snowflake,
  Edit3,
  Pen,
  Library,
  Heart,
  Flower
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
    name: 'Parchment Classic',
    icon: Sun,
    description: 'Warm cream with burgundy accents for traditional writing',
    category: 'Classic Writers',
    engagement: 'Traditional & Timeless'
  },
  'midnight-ink': {
    name: 'Midnight Ink',
    icon: Moon,
    description: 'Deep navy with gold accents - scholarly and magical',
    category: 'Classic Writers',
    engagement: 'Scholarly & Premium'
  },
  'parchment-scholar': {
    name: 'Parchment Scholar',
    icon: BookOpen,
    description: 'Vintage academic vibes with warm cream and brown tones',
    category: 'Classic Writers',
    engagement: 'Academic & Vintage'
  },
  'forest-manuscript': {
    name: 'Forest Manuscript',
    icon: Trees,
    description: 'Deep greens for natural, focused writing sessions',
    category: 'Classic Writers',
    engagement: 'Natural & Focused'
  },
  'starlit-prose': {
    name: 'Starlit Prose',
    icon: Star,
    description: 'Dark purple with silver - mystical and poetic inspiration',
    category: 'Creative Inspiration',
    engagement: 'Mystical & Poetic'
  },
  'coffee-house': {
    name: 'Coffee House',
    icon: Coffee,
    description: 'Rich browns and warm oranges for cozy cafe writing vibes',
    category: 'Creative Inspiration',
    engagement: 'Cozy & Inspiring'
  },
  'arctic-focus': {
    name: 'Arctic Focus',
    icon: Snowflake,
    description: 'Cool blues and whites for clean, distraction-free writing',
    category: 'Creative Inspiration',
    engagement: 'Clean & Focused'
  },
  'sunset-chapter': {
    name: 'Sunset Chapter',
    icon: Sunrise,
    description: 'Warm oranges and reds for inspiring creative energy',
    category: 'Creative Inspiration',
    engagement: 'Inspiring & Creative'
  },
  'graphite-minimal': {
    name: 'Graphite Minimal',
    icon: Edit3,
    description: 'Monochrome grays for distraction-free, professional writing',
    category: 'Minimalist Focus',
    engagement: 'Professional & Minimal'
  },
  'obsidian-writer': {
    name: 'Obsidian Writer',
    icon: Pen,
    description: 'Ultra-minimal pure blacks for serious, focused writing',
    category: 'Minimalist Focus',
    engagement: 'Ultra-Minimal & Serious'
  },
  'emerald-library': {
    name: 'Emerald Library',
    icon: Library,
    description: 'Rich emerald with gold for classic library atmosphere',
    category: 'Premium Literary',
    engagement: 'Classic & Literary'
  },
  'rose-quartz': {
    name: 'Rose Quartz',
    icon: Heart,
    description: 'Soft pinks and whites for gentle, romantic writing',
    category: 'Premium Literary',
    engagement: 'Gentle & Romantic'
  },
  'golden-hour': {
    name: 'Golden Hour',
    icon: Sun,
    description: 'Warm yellows and oranges for inspiring, optimistic writing',
    category: 'Premium Literary',
    engagement: 'Optimistic & Uplifting'
  },
  'lavender-fields': {
    name: 'Lavender Fields',
    icon: Flower,
    description: 'Purple and lavender tones for calm, poetic inspiration',
    category: 'Premium Literary',
    engagement: 'Calm & Poetic'
  },
  'copper-manuscript': {
    name: 'Copper Manuscript',
    icon: Palette,
    description: 'Warm metallic copper tones for premium, artistic writing',
    category: 'Premium Literary',
    engagement: 'Premium & Artistic'
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
          Classic Writers
        </DropdownMenuLabel>
        {renderThemesByCategory('Classic Writers')}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-sm font-semibold text-foreground px-3 py-2">
          Creative Inspiration
        </DropdownMenuLabel>
        {renderThemesByCategory('Creative Inspiration')}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-sm font-semibold text-foreground px-3 py-2">
          Minimalist Focus
        </DropdownMenuLabel>
        {renderThemesByCategory('Minimalist Focus')}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-sm font-semibold text-foreground px-3 py-2">
          Premium Literary
        </DropdownMenuLabel>
        {renderThemesByCategory('Premium Literary')}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
'use client'

import * as React from 'react'
import { Palette, Check } from 'lucide-react'
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
import { themeConfig, getThemeConfig, type ThemeConfig } from '../config/theme-config'

/**
 * FABLECRAFT THEME SYSTEM v2.0
 * Research-based themes optimized for writers and creative professionals
 * All themes tested for WCAG AA contrast compliance (4.5:1 minimum)
 * Focus on eye comfort, engagement, and long writing sessions
 * 
 * Fablecraft Modern Stack - Enterprise Theme System
 * 
 * FEATURES:
 * - 8 research-based writer-focused themes
 * - Enhanced TypeScript interfaces and type safety
 * - WCAG AA compliance maintained (4.5:1+ contrast ratios)
 * - Theme persistence via localStorage
 * - All styling uses CSS custom properties
 */



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
    // Debug logging to help troubleshoot theme issues
    if (process.env.NODE_ENV !== 'production') {
      console.debug('ThemeToggle: Current theme:', theme)
      console.debug('ThemeToggle: Document data-theme:', document.documentElement.getAttribute('data-theme'))
    }
  }, [theme])

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="px-0 w-9 h-9">
        <Palette className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  const getCurrentIcon = () => {
    if (!theme) return Palette
    const config = getThemeConfig(theme)
    return config?.icon || Palette
  }

  const getCurrentThemeName = () => {
    if (!theme) return 'Theme'
    const config = getThemeConfig(theme)
    return config?.name || 'Theme'
  }

  const CurrentIcon = getCurrentIcon()
  
  const handleThemeChange = (themeKey: string) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug('ThemeToggle: Changing theme to:', themeKey)
    }
    setTheme(themeKey)
    
    // Force a slight delay to ensure theme is applied
    setTimeout(() => {
      if (process.env.NODE_ENV !== 'production') {
        console.debug('ThemeToggle: Theme changed to:', document.documentElement.getAttribute('data-theme'))
      }
    }, 100)
  }
  
  const renderThemesByCategory = (category: ThemeConfig['category']) => {
    return Object.entries(themeConfig)
      .filter(([, config]) => config.category === category)
      .map(([themeKey, config]) => {
        const IconComponent = config.icon
        const isActive = theme === themeKey
        
        return (
          <DropdownMenuItem
            key={themeKey}
            onClick={() => handleThemeChange(themeKey)}
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
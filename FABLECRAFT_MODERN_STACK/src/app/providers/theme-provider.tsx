'use client'

import * as React from 'react'
import { useEffect, useState, useCallback } from 'react'
import { ThemeContext } from './theme-context'

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

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: "class" | "data-theme"
  defaultTheme?: Theme
  enableSystem?: boolean
  themes?: Theme[]
  disableTransitionOnChange?: boolean
  storageKey?: string
}

const isDarkTheme = (theme: Theme): boolean => {
  const darkThemes = [
    'dark',
    'midnight-ink',
    'forest-manuscript', 
    'starlit-prose',
    'coffee-house',
    'halloween',
    'cherry-lacquer',
    'volcanic-ash',
    'cyberpunk',
    'dragons-hoard',
    'true-black-white'
  ]
  return darkThemes.includes(theme)
}

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(key, value)
    } catch {
      // Silently fail if localStorage is not available
    }
  }
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  themes = [
    'light', 
    'dark', 
    'arctic-focus', 
    'golden-hour', 
    'midnight-ink', 
    'forest-manuscript', 
    'starlit-prose', 
    'coffee-house',
    'sunset-coral',
    'lavender-dusk',
    'halloween',
    'cherry-lacquer',
    'volcanic-ash',
    'cyberpunk',
    'arctic-aurora',
    'desert-mirage',
    'moonlit-garden',
    'dragons-hoard',
    'true-black-white',
    'system'
  ],
  disableTransitionOnChange = false,
  storageKey = "theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  const setTheme = useCallback((newTheme: Theme) => {
    if (!disableTransitionOnChange) {
      const css = document.createElement("style")
      css.appendChild(
        document.createTextNode(
          `* {
             -webkit-transition: none !important;
             -moz-transition: none !important;
             -o-transition: none !important;
             -ms-transition: none !important;
             transition: none !important;
           }`
        )
      )
      document.head.appendChild(css)

      // Force browser reflow
      void window.getComputedStyle(css).opacity
      document.head.removeChild(css)
    }

    const resolvedTheme = newTheme === 'system' && enableSystem
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : newTheme

    setThemeState(newTheme)
    
    if (attribute === "class") {
      document.documentElement.className = document.documentElement.className
        .replace(/theme-\w+/g, '')
        .trim()
      document.documentElement.classList.add(`theme-${resolvedTheme}`)
      
      // Apply dark mode class for CSS compatibility
      if (isDarkTheme(resolvedTheme)) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else {
      document.documentElement.setAttribute(attribute, resolvedTheme)
    }

    safeLocalStorage.setItem(storageKey, newTheme)
  }, [attribute, enableSystem, disableTransitionOnChange, storageKey])

  useEffect(() => {
    const stored = safeLocalStorage.getItem(storageKey) as Theme | null
    const initialTheme = stored && themes.includes(stored) ? stored : defaultTheme
    setTheme(initialTheme)
    setMounted(true)
  }, [defaultTheme, setTheme, storageKey, themes])

  useEffect(() => {
    if (!enableSystem || theme !== 'system' || !mounted) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => setTheme('system')
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [enableSystem, theme, setTheme, mounted])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
      themes,
    }),
    [theme, setTheme, themes]
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}


'use client'

import * as React from 'react'
import { useEffect, useState, useCallback } from 'react'

import { ThemeContext } from './theme-context'

type Theme = 'light' | 'dark' | 'arctic-focus' | 'golden-hour' | 'midnight-ink' | 'forest-manuscript' | 'starlit-prose' | 'coffee-house' | 'system'

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
  return theme.includes('dark') || 
         theme.includes('midnight') || 
         theme.includes('forest') || 
         theme.includes('starlit') || 
         theme.includes('coffee')
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
      // Silently fail - localStorage may be disabled
    }
  }
}

export function ThemeProvider({
  children,
  attribute = 'data-theme',
  defaultTheme = 'system',
  enableSystem = true,
  themes = ['light', 'dark', 'arctic-focus', 'golden-hour', 'midnight-ink', 'forest-manuscript', 'starlit-prose', 'coffee-house', 'system'],
  disableTransitionOnChange = true,
  storageKey = 'fablecraft-theme'
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = safeLocalStorage.getItem(storageKey) as Theme
    return stored && themes.includes(stored) ? stored : defaultTheme
  })

  const [mounted, setMounted] = useState(false)

  // Handle system theme
  const getSystemTheme = useCallback((): Theme => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }, [])

  // Resolve the actual theme to apply
  const resolveTheme = useCallback((t: Theme): Theme => {
    if (t === 'system' && enableSystem) {
      return getSystemTheme()
    }
    return t
  }, [enableSystem, getSystemTheme])

  // Apply theme to DOM with proper transition handling
  const applyTheme = useCallback((t: Theme) => {
    if (typeof window === 'undefined') return
    
    const resolved = resolveTheme(t)
    const root = document.documentElement

    // Create style element for disabling transitions during theme change
    const disableTransitionsStyle = document.createElement('style')
    const css = document.createTextNode(':root { transition: none !important; }')
    disableTransitionsStyle.appendChild(css)

    // Disable transitions using the research-backed approach
    if (disableTransitionOnChange) {
      document.head.appendChild(disableTransitionsStyle)
    }

    if (attribute === 'class') {
      // Remove all theme classes
      themes.forEach(themeClass => {
        if (themeClass !== 'system') {
          root.classList.remove(themeClass)
        }
      })
      // Add new theme class
      if (resolved !== 'light') {
        root.classList.add(resolved)
      }
    } else {
      // Set data-theme attribute
      root.setAttribute(attribute, resolved)
    }

    if (disableTransitionOnChange) {
      // Use the modern approach: getComputedStyle forces browser to apply styles
      if (typeof window.getComputedStyle !== 'undefined') {
        window.getComputedStyle(disableTransitionsStyle).opacity
        document.head.removeChild(disableTransitionsStyle)
      } else if (typeof window.requestAnimationFrame !== 'undefined') {
        window.requestAnimationFrame(() => {
          document.head.removeChild(disableTransitionsStyle)
        })
      } else {
        // Ultimate fallback: setTimeout
        window.setTimeout(() => {
          if (document.head.contains(disableTransitionsStyle)) {
            document.head.removeChild(disableTransitionsStyle)
          }
        }, 100)
      }
    }
  }, [attribute, themes, disableTransitionOnChange, resolveTheme])

  // Set theme and persist to localStorage
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    safeLocalStorage.setItem(storageKey, newTheme)
  }, [storageKey])

  // Apply theme on mount and when it changes
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    applyTheme(theme)
  }, [theme, mounted, applyTheme])

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystem || !mounted || typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, enableSystem, mounted, applyTheme])

  // Listen for storage changes (sync across tabs)
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return

    const handleStorage = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        const newTheme = e.newValue as Theme
        if (themes.includes(newTheme)) {
          setThemeState(newTheme)
        }
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [storageKey, themes, mounted])

  // Prevent flash of unstyled content
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const root = document.documentElement
    const colorScheme = theme === 'system' ? '' : isDarkTheme(theme) ? 'dark' : 'light'
    root.style.colorScheme = colorScheme
  }, [theme])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  )
}


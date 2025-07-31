'use client'

import * as React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

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

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  themes: Theme[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  attribute = 'data-theme',
  defaultTheme = 'system',
  enableSystem = true,
  themes = ['light', 'dark', 'arctic-focus', 'golden-hour', 'midnight-ink', 'forest-manuscript', 'starlit-prose', 'coffee-house', 'system'],
  disableTransitionOnChange = false,
  storageKey = 'fablecraft-theme'
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Get theme from localStorage or use default
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey) as Theme
      return stored && themes.includes(stored) ? stored : defaultTheme
    }
    return defaultTheme
  })

  const [mounted, setMounted] = useState(false)

  // Handle system theme
  const getSystemTheme = (): Theme => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // Resolve the actual theme to apply
  const resolveTheme = (t: Theme): Theme => {
    if (t === 'system' && enableSystem) {
      return getSystemTheme()
    }
    return t
  }

  // Apply theme to DOM
  const applyTheme = (t: Theme) => {
    const resolved = resolveTheme(t)
    const root = document.documentElement

    if (disableTransitionOnChange) {
      root.style.transition = 'none'
    }

    if (attribute === 'class') {
      // Remove all theme classes
      themes.forEach(theme => {
        if (theme !== 'system') {
          root.classList.remove(theme)
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
      // Force reflow
      void root.offsetHeight
      root.style.transition = ''
    }
  }

  // Set theme and persist to localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    try {
      localStorage.setItem(storageKey, newTheme)
    } catch (e) {
      console.warn('Failed to save theme preference:', e)
    }
  }

  // Apply theme on mount and when it changes
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    applyTheme(theme)
  }, [theme, mounted])

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystem || !mounted) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, enableSystem, mounted])

  // Listen for storage changes (sync across tabs)
  useEffect(() => {
    if (!mounted) return

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
    const root = document.documentElement
    root.style.colorScheme = theme === 'system' ? '' : theme.includes('dark') || theme.includes('midnight') || theme.includes('forest') || theme.includes('starlit') || theme.includes('coffee') ? 'dark' : 'light'
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

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
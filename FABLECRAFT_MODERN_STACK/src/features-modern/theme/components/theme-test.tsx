'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { themeConfig } from '../config/theme-config'

/**
 * COMPREHENSIVE THEME TESTING COMPONENT
 * 
 * This component helps diagnose theme switcher issues by:
 * - Testing all 9 custom themes 
 * - Checking CSS custom properties in real-time
 * - Verifying next-themes state vs DOM state
 * - Testing theme persistence
 * 
 * Use this component to debug production vs development theme issues
 */
export function ThemeTest() {
  const { theme, setTheme, themes } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [cssValues, setCssValues] = React.useState<Record<string, string>>({})
  const [domTheme, setDomTheme] = React.useState<string | null>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Test CSS custom properties in real-time
  React.useEffect(() => {
    if (!mounted) return

    const updateCssValues = () => {
      const rootElement = document.documentElement
      const computedStyle = getComputedStyle(rootElement)
      
      const values = {
        '--background': computedStyle.getPropertyValue('--background').trim(),
        '--foreground': computedStyle.getPropertyValue('--foreground').trim(),
        '--primary': computedStyle.getPropertyValue('--primary').trim(),
        '--card': computedStyle.getPropertyValue('--card').trim(),
        '--accent': computedStyle.getPropertyValue('--accent').trim(),
      }
      
      setCssValues(values)
      setDomTheme(rootElement.getAttribute('data-theme'))
    }

    updateCssValues()
    
    // Watch for changes
    const observer = new MutationObserver(updateCssValues)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    })

    return () => observer.disconnect()
  }, [mounted, theme])

  if (!mounted) {
    return (
      <div className="p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">🧪 Theme Testing (Loading...)</h2>
        <p className="text-muted-foreground">Waiting for hydration...</p>
      </div>
    )
  }

  const testTheme = (themeKey: string) => {
    console.group(`🧪 Testing theme: ${themeKey}`)
    console.log('Before change:', {
      nextThemesState: theme,
      domAttribute: document.documentElement.getAttribute('data-theme'),
      cssVariables: cssValues
    })
    
    setTheme(themeKey)
    
    // Check after a delay
    setTimeout(() => {
      console.log('After change:', {
        nextThemesState: theme,
        domAttribute: document.documentElement.getAttribute('data-theme'),
        cssVariables: {
          '--background': getComputedStyle(document.documentElement).getPropertyValue('--background').trim(),
          '--primary': getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
        }
      })
      console.groupEnd()
    }, 200)
  }

  const runFullTest = () => {
    console.clear()
    console.log('🚀 RUNNING COMPREHENSIVE THEME TEST')
    console.log('Environment:', process.env.NODE_ENV)
    console.log('Available themes from next-themes:', themes)
    console.log('Available themes from config:', Object.keys(themeConfig))
    
    // Test each theme
    Object.keys(themeConfig).forEach((themeKey, index) => {
      setTimeout(() => {
        testTheme(themeKey)
      }, index * 1000)
    })
  }

  return (
    <div className="p-6 border rounded-lg space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">🧪 Theme System Testing</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Use this component to diagnose theme switching issues in production vs development.
        </p>
      </div>

      {/* Current State */}
      <div className="space-y-3">
        <h3 className="font-medium">📊 Current State</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-muted rounded">
            <strong>next-themes:</strong>
            <br />
            <code>{theme || 'undefined'}</code>
          </div>
          <div className="p-3 bg-muted rounded">
            <strong>DOM Attribute:</strong>
            <br />
            <code>{domTheme || 'null'}</code>
          </div>
          <div className="p-3 bg-muted rounded">
            <strong>Environment:</strong>
            <br />
            <code>{process.env.NODE_ENV}</code>
          </div>
        </div>
      </div>

      {/* CSS Variables Test */}
      <div className="space-y-3">
        <h3 className="font-medium">🎨 CSS Custom Properties</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
          {Object.entries(cssValues).map(([prop, value]) => (
            <div key={prop} className="p-2 bg-muted rounded font-mono">
              <strong>{prop}:</strong>
              <br />
              <span className="text-muted-foreground">{value || 'NOT SET'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Theme Testing Buttons */}
      <div className="space-y-3">
        <h3 className="font-medium">🔬 Test Individual Themes</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(themeConfig).map(([themeKey, config]) => {
            const isActive = theme === themeKey
            const IconComponent = config.icon
            
            return (
              <Button
                key={themeKey}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => testTheme(themeKey)}
                className="flex items-center gap-2 text-xs"
              >
                <IconComponent className="h-3 w-3" />
                {config.name}
                {isActive && "✓"}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Automated Testing */}
      <div className="space-y-3">
        <h3 className="font-medium">🤖 Automated Testing</h3>
        <Button onClick={runFullTest} variant="secondary">
          Run Full Theme Test (Check Console)
        </Button>
        <p className="text-xs text-muted-foreground">
          This will cycle through all themes and log detailed info to console.
          Open DevTools (F12) → Console to see results.
        </p>
      </div>

      {/* Visual Color Test */}
      <div className="space-y-3">
        <h3 className="font-medium">👁️ Visual Color Test</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="h-12 bg-background border rounded flex items-center justify-center text-xs">
            Background
          </div>
          <div className="h-12 bg-primary text-primary-foreground rounded flex items-center justify-center text-xs">
            Primary
          </div>
          <div className="h-12 bg-card border rounded flex items-center justify-center text-xs">
            Card
          </div>
          <div className="h-12 bg-muted rounded flex items-center justify-center text-xs">
            Muted
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          These colors should change when you switch themes. If they don't change,
          CSS custom properties aren't working correctly.
        </p>
      </div>
    </div>
  )
}
'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string | string[]
  defaultTheme?: string
  enableSystem?: boolean  
  themes?: string[]
  // Match NextThemes exact interface
  disableTransitionOnChange?: boolean
  forcedTheme?: string
  storageKey?: string
  value?: any
  nonce?: string
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

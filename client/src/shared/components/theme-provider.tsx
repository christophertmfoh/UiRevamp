'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider 
    attribute="class"
    defaultTheme="dark"
    enableSystem
    themes={[
      'light', 'dark', 'system',
      'arctic-focus', 'golden-hour', 
      'midnight-ink', 'forest-manuscript', 
      'starlit-prose', 'coffee-house'
    ]}
    {...props}
  >
    {children}
  </NextThemesProvider>
}

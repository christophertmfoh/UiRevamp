import { createContext } from 'react'

type Theme = 'light' | 'dark' | 'arctic-focus' | 'golden-hour' | 'midnight-ink' | 'forest-manuscript' | 'starlit-prose' | 'coffee-house' | 'system'

export interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  themes: Theme[]
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
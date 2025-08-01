import { createContext } from 'react'

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
  | 'netrunner'
  | 'moonlit-garden'
  | 'dragons-hoard'
  | 'system'

export interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  themes: Theme[]
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
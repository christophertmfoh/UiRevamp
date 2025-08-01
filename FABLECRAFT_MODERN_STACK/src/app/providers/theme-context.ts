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
  | 'ocean-depths'
  | 'sunset-coral'
  | 'forest-sage' 
  | 'ocean-teal'
  | 'lavender-dusk'
  | 'midnight-amber'
  | 'monochrome'
  | 'halloween'
  | 'cyberpunk'
  | 'mystic-realm'
  | 'enchanted-forest'
  | 'system'

export interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  themes: Theme[]
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
import type { GlobalProvider } from '@ladle/react'
import '../src/index.css'
import '../src/shared/lib/theme/variables.css'
import { ThemeProvider } from '../src/app/providers/theme-provider'

// Extend Ladle's global state types
declare module '@ladle/react' {
  export interface GlobalState {
    theme: 'light' | 'dark'
    rtl: boolean
    background?: string
    customTheme?: string
  }
}

export const Provider: GlobalProvider = ({ children, globalState }) => {
  // Map Ladle's built-in theme control to our theme system
  // If customTheme is set, use that, otherwise use Ladle's theme
  const theme = globalState.customTheme || globalState.theme || 'light'
  
  return (
    <ThemeProvider
      attribute='data-theme'
      defaultTheme={theme as any}
      enableSystem={false}
      disableTransitionOnChange
    >
      <div 
        className={`ladle-wrapper ${globalState.rtl ? 'rtl' : 'ltr'}`}
        style={{ 
          minHeight: '100vh',
          backgroundColor: globalState.background || 'transparent' 
        }}
      >
        {children}
      </div>
    </ThemeProvider>
  )
}

// Global controls available to all stories
export const argTypes = {
  customTheme: {
    control: { type: 'select' },
    options: [
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
      'netrunner',
      'moonlit-garden',
      'dragons-hoard',
    ],
    defaultValue: 'light',
    description: 'FableCraft custom themes',
  },
  background: {
    control: { type: 'background' },
    options: ['white', '#f5f5f5', '#1a1a1a', '#ed7326', 'transparent'],
    defaultValue: 'transparent',
    description: 'Canvas background color',
  },
}
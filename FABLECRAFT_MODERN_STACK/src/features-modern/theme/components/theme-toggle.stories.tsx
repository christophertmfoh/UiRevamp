import type { Story } from '@ladle/react'
import { ThemeToggle } from './theme-toggle'
import { useTheme } from '@/app/providers/theme-provider'

export default {
  title: 'Features/Theme Toggle',
}

export const Default: Story = () => <ThemeToggle />

export const WithLabel: Story = () => (
  <div className="flex items-center gap-4 p-4">
    <span>Toggle theme:</span>
    <ThemeToggle />
  </div>
)

export const AllThemes: Story = () => {
  const { theme, setTheme, themes } = useTheme()
  
  return (
    <div className="p-8 space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Theme Showcase</h2>
        <p className="text-muted-foreground mb-4">
          Current theme: <span className="font-semibold text-primary">{theme}</span>
        </p>
        <ThemeToggle />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {themes.filter(t => t !== 'system').map((themeName) => (
          <button
            key={themeName}
            onClick={() => setTheme(themeName as any)}
            className={`p-4 rounded-lg border-2 transition-all ${
              theme === themeName 
                ? 'border-primary bg-primary/10' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="text-sm font-medium mb-2">{themeName}</div>
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded bg-background border" />
              <div className="w-6 h-6 rounded bg-primary" />
              <div className="w-6 h-6 rounded bg-secondary" />
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-8 p-6 rounded-lg bg-card">
        <h3 className="text-lg font-semibold mb-4">Theme Preview</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <button className="btn btn-primary">Primary Button</button>
            <button className="btn btn-secondary">Secondary</button>
            <button className="btn btn-destructive">Destructive</button>
          </div>
          <div className="p-4 bg-muted rounded">
            <p className="text-muted-foreground">Muted background with muted text</p>
          </div>
          <div className="p-4 bg-accent rounded">
            <p className="text-accent-foreground">Accent background with accent text</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const InContext: Story = () => (
  <div className="max-w-md mx-auto p-6">
    <div className="bg-card p-6 rounded-lg shadow-lg border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Appearance</h2>
        <ThemeToggle />
      </div>
      <p className="text-muted-foreground">
        Choose between light and dark themes. Your preference will be saved automatically.
      </p>
      <div className="mt-6 space-y-2">
        <div className="p-3 bg-primary/10 rounded text-primary">Primary color preview</div>
        <div className="p-3 bg-secondary/10 rounded text-secondary">Secondary color preview</div>
        <div className="p-3 bg-muted rounded text-muted-foreground">Muted color preview</div>
      </div>
    </div>
  </div>
)
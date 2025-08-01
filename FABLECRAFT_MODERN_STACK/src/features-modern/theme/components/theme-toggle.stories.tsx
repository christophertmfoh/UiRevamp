import type { Story } from '@ladle/react'
import { ThemeToggle } from './theme-toggle'
import { ThemeProvider } from '@/app/providers/theme-provider'

// Wrap stories in ThemeProvider for proper functionality
const ThemeDecorator = (Story: any) => (
  <ThemeProvider>
    <div className="min-h-[200px] p-8 bg-background text-foreground">
      <Story />
    </div>
  </ThemeProvider>
)

export default {
  title: 'Features/Theme Toggle',
  decorators: [ThemeDecorator],
}

export const Default: Story = () => <ThemeToggle />

export const WithLabel: Story = () => (
  <div className="flex items-center gap-4">
    <span>Toggle theme:</span>
    <ThemeToggle />
  </div>
)

export const MultipleInstances: Story = () => (
  <div className="space-y-8">
    <div className="flex items-center justify-between p-4 border rounded">
      <h3 className="text-lg font-semibold">Header</h3>
      <ThemeToggle />
    </div>
    <div className="flex items-center justify-between p-4 border rounded">
      <h3 className="text-lg font-semibold">Settings Panel</h3>
      <ThemeToggle />
    </div>
    <p className="text-sm text-muted-foreground">
      All toggles are synchronized through the theme provider
    </p>
  </div>
)

export const InContext: Story = () => (
  <div className="max-w-md mx-auto">
    <div className="bg-card p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Appearance</h2>
        <ThemeToggle />
      </div>
      <p className="text-muted-foreground">
        Choose between light and dark themes. Your preference will be saved automatically.
      </p>
      <div className="mt-6 space-y-2">
        <div className="p-3 bg-primary/10 rounded">Primary color preview</div>
        <div className="p-3 bg-secondary/10 rounded">Secondary color preview</div>
        <div className="p-3 bg-muted rounded">Muted color preview</div>
      </div>
    </div>
  </div>
)
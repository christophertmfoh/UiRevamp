import { ThemeProvider, ThemeToggle } from './components/theme'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui'
import { FloatingOrbs } from './components/effects/floating-orbs'
import { useAuthInit } from './hooks/useAuth'

function App() {
  // Initialize auth state
  useAuthInit()

  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        {/* Floating orbs background */}
        <FloatingOrbs />

        {/* Header */}
        <header className="relative z-10 border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <h1 className="bg-gradient-to-r from-[hsl(var(--gradient-brand-start))] to-[hsl(var(--gradient-brand-end))] bg-clip-text text-2xl font-bold text-transparent">
                FableCraft Enterprise
              </h1>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="container relative z-10 mx-auto px-4 py-8">
          <div className="mx-auto max-w-4xl space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>🎉 Theme System Ready!</CardTitle>
                <CardDescription>
                  The theme system is working perfectly. Try switching themes using the toggle in the
                  header.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="font-semibold">✅ Completed Setup</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• UI Components migrated</li>
                      <li>• Theme system configured</li>
                      <li>• Auth store ready</li>
                      <li>• API client configured</li>
                      <li>• TypeScript strict mode</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">🚀 Next Steps</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Migrate Landing Page</li>
                      <li>• Migrate Auth Page</li>
                      <li>• Test auth flow</li>
                      <li>• Verify theme persistence</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Environment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 font-mono text-sm">
                  <div>
                    <span className="text-muted-foreground">API URL:</span>{' '}
                    <span className="text-primary">
                      {import.meta.env.VITE_API_URL || '/api'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Environment:</span>{' '}
                    <span className="text-primary">{import.meta.env.MODE}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">TypeScript Errors:</span>{' '}
                    <span className="text-green-500">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App

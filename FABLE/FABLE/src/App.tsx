import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            FABLE
          </h1>
          <p className="text-lg text-muted-foreground">
            Clean, Modern React Starter Template
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚡ React 19
              </CardTitle>
              <CardDescription>
                Latest React with concurrent features
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎨 Tailwind CSS
              </CardTitle>
              <CardDescription>
                Utility-first CSS with custom theme
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📦 Modern Stack
              </CardTitle>
              <CardDescription>
                Vite, TypeScript, Zustand, React Query
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Interactive Demo */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Interactive Demo</CardTitle>
            <CardDescription>
              Test the component system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-semibold">{count}</p>
              <p className="text-sm text-muted-foreground">Current count</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setCount(count + 1)}
                className="flex-1"
              >
                Increment
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCount(0)}
                className="flex-1"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <div className="text-center text-sm text-muted-foreground">
          Ready to build something amazing! 🚀
        </div>
      </div>
    </div>
  )
}

export default App
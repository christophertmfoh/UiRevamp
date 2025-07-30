import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import React from 'react'

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            🚀 FableCraft Enterprise
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Professional Creative Writing Platform
          </p>
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="card-elegant">
              <h2 className="text-xl font-semibold mb-2">✨ Enterprise Foundation Ready</h2>
              <p className="text-muted-foreground">
                React 19 + Vite 7 + TypeScript 5.8 with professional tooling
              </p>
            </div>
            <div className="card-elegant">
              <h2 className="text-xl font-semibold mb-2">🎨 Design System</h2>
              <p className="text-muted-foreground">
                Complete Tailwind CSS theme with Radix UI components
              </p>
            </div>
            <div className="card-elegant">
              <h2 className="text-xl font-semibold mb-2">🔧 Development Tools</h2>
              <p className="text-muted-foreground">
                ESLint, Prettier, Vitest, Playwright, and enterprise CI/CD
              </p>
            </div>
          </div>
          <div className="mt-8">
            <p className="text-sm text-muted-foreground">
              Ready to build the future of creative writing platforms
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
})

// Index route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Welcome to FableCraft Enterprise</h2>
        <p className="text-muted-foreground">
          Start building your features here
        </p>
      </div>
    </div>
  ),
})

// Route tree
export const routeTree = rootRoute.addChildren([indexRoute])
import { lazy } from 'react';

// Lazy load heavy components for better performance
export const LazyWorkspace = lazy(() => 
  Promise.resolve({
    default: () => (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Workspace</h1>
          <p className="text-muted-foreground">Coming soon...</p>
          <a href="/" className="text-primary hover:text-primary/80 mt-4 inline-block">Return to Home</a>
        </div>
      </div>
    )
  })
);
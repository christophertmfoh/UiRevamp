import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "./shared/components/theme-provider"
import { Router, Route, Switch } from "wouter"
import { LandingPage } from "./pages/LandingPage"
import { suppressResizeObserverError } from "./shared/utils/resizeObserver"
import { Suspense } from "react"
import { LazyWorkspace } from "./shared/components/ui/lazy-loading"
import './index.css'

// Suppress ResizeObserver errors on app load
suppressResizeObserverError();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <Router>
          <Switch>
            <Route path="/">
              <LandingPage />
            </Route>
            <Route path="/workspace">
              <Suspense fallback={
                <div className="min-h-screen bg-background flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              }>
                <LazyWorkspace />
              </Suspense>
            </Route>
            <Route>
              <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
                  <a href="/" className="text-blue-400 hover:text-blue-300">
                    Return to FableCraft
                  </a>
                </div>
              </div>
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
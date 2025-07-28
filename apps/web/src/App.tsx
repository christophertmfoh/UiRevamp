import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "./shared/components/theme-provider"
import { TooltipProvider } from "./shared/components/ui/tooltip"
import { Router } from "wouter"

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
      <ThemeProvider defaultTheme="system">
        <TooltipProvider>
          <Router>
            <div className="min-h-screen bg-background text-foreground">
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">FableCraft</h1>
                  <p className="text-muted-foreground">
                    Production-ready React architecture in progress...
                  </p>
                </div>
              </div>
            </div>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "./shared/components/theme-provider"
import { ToastProvider } from "./shared/components/ui/Toast"
import { Router, Route, Switch } from "wouter"
import { LandingPage } from "./pages/landing/LandingPage"

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
      <ThemeProvider defaultTheme="light" storageKey="fablecraft-theme">
        <Router>
          <Switch>
            <Route path="/">
              <LandingPage 
                onNavigate={() => {}}
                onNewProject={() => {}}
                onUploadManuscript={() => {}}
                onAuth={() => {}}
                onLogout={() => Promise.resolve()}
                user={null}
                isAuthenticated={false}
                guideMode={false}
                setGuideMode={() => {}}
              />
            </Route>
            <Route>
              <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">FableCraft</h1>
                  <p className="text-muted-foreground">Page not found</p>
                </div>
              </div>
            </Route>
          </Switch>
        </Router>
        <ToastProvider><div /></ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
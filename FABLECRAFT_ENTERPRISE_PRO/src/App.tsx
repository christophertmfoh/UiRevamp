import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Router, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { ErrorBoundary } from '@/components/error-boundary'
import '@/styles/globals.css'

// Create a query client with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes('404')) {
          return false
        }
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 1,
    },
  },
})

// Create router instance
const router = new Router({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

/**
 * FableCraft Enterprise Application
 * 
 * A sophisticated creative writing platform that combines the power of
 * modern web technologies with an intuitive, writer-focused interface.
 * 
 * Features:
 * - Real-time collaborative editing
 * - AI-powered writing assistance
 * - Advanced project management
 * - Professional publishing tools
 */
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RouterProvider router={router} />
          <Toaster
            position="bottom-right"
            richColors
            closeButton
            duration={4000}
            className="toaster"
          />
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools
              initialIsOpen={false}
              position="bottom-left"
              buttonPosition="bottom-left"
            />
          )}
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
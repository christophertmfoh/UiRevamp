import React from 'react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

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
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-green-400">✅ FableCraft</h1>
          <p className="text-slate-300 text-xl mb-4">
            Production-ready React architecture WORKING!
          </p>
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-green-400 font-semibold">Phase 6 Refactor Complete:</p>
            <ul className="text-left text-sm text-slate-300 mt-2">
              <li>✅ Monorepo structure (apps/web/, apps/api/)</li>
              <li>✅ Feature-first organization</li>
              <li>✅ TypeScript workspace config</li>
              <li>✅ Production-ready architecture</li>
            </ul>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  )
}

export default App
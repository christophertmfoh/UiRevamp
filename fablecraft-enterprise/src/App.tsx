import { useState } from 'react'
import { cn } from './lib/utils'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            FableCraft Enterprise
          </h1>
          <h2 className="text-2xl text-gray-300">
            Clean Build - Zero TypeScript Errors!
          </h2>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
          <div className="space-y-4">
            <p className="text-lg text-gray-300">
              This is the clean enterprise build with:
            </p>
            <ul className="text-left space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Tailwind CSS
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Zustand State Management
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> React Query
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> React Hook Form + Zod
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Radix UI Components
              </li>
            </ul>
          </div>
          
          <button
            onClick={() => setCount((count) => count + 1)}
            className={cn(
              "mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700",
              "rounded-lg font-semibold transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            )}
          >
            Count is {count}
          </button>
        </div>
        
        <p className="text-gray-400">
          Ready to rebuild FableCraft the RIGHT way!
        </p>
      </div>
    </div>
  )
}

export default App

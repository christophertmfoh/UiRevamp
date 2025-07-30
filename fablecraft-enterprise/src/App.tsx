import { useState } from 'react'

import { cn } from './lib/utils'

function App() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                FableCraft Enterprise
              </h1>
              <nav className="hidden space-x-6 md:flex">
                <button className="text-gray-300 transition-colors hover:text-white">
                  Dashboard
                </button>
                <button className="text-gray-300 transition-colors hover:text-white">
                  Characters
                </button>
                <button className="text-gray-300 transition-colors hover:text-white">
                  Projects
                </button>
                <button className="text-gray-300 transition-colors hover:text-white">
                  World Bible
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-sm text-gray-300 transition-colors hover:text-white">
                Settings
              </button>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700">
                New Project
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
              <h2 className="mb-4 text-lg font-semibold text-white">Quick Stats</h2>
              <div className="space-y-4">
                <div className="rounded-lg bg-gray-800 p-4">
                  <p className="text-sm text-gray-400">Total Characters</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
                <div className="rounded-lg bg-gray-800 p-4">
                  <p className="text-sm text-gray-400">Active Projects</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
                <div className="rounded-lg bg-gray-800 p-4">
                  <p className="text-sm text-gray-400">TypeScript Errors</p>
                  <p className="text-2xl font-bold text-green-400">0</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Panel */}
          <div className="lg:col-span-3">
            <div className="rounded-lg border border-gray-800 bg-gray-900">
              {/* Tabs */}
              <div className="border-b border-gray-800 p-4">
                <div className="flex space-x-6">
                  {['overview', 'setup', 'documentation'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        'relative px-1 pb-2 text-sm font-medium transition-colors',
                        activeTab === tab
                          ? 'border-b-2 border-blue-400 text-blue-400'
                          : 'text-gray-400 hover:text-gray-300',
                      )}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-2 text-xl font-semibold text-white">
                        Welcome to FableCraft Enterprise
                      </h3>
                      <p className="text-gray-400">
                        A clean, modern foundation for rebuilding FableCraft with enterprise-grade
                        standards.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
                        <h4 className="mb-2 font-medium text-white">✨ Modern Stack</h4>
                        <ul className="space-y-1 text-sm text-gray-400">
                          <li>• React 19 + TypeScript 5.8</li>
                          <li>• Vite for lightning-fast builds</li>
                          <li>• Tailwind CSS for styling</li>
                          <li>• Strict TypeScript configuration</li>
                        </ul>
                      </div>
                      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
                        <h4 className="mb-2 font-medium text-white">🛠️ Developer Experience</h4>
                        <ul className="space-y-1 text-sm text-gray-400">
                          <li>• Zero TypeScript errors</li>
                          <li>• Feature-based architecture</li>
                          <li>• Hot Module Replacement</li>
                          <li>• ESLint + Prettier ready</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'setup' && (
                  <div className="space-y-4">
                    <h3 className="mb-4 text-xl font-semibold text-white">
                      Installed Dependencies
                    </h3>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {[
                        'Tailwind CSS',
                        'Zustand State Management',
                        'React Query (TanStack)',
                        'React Hook Form + Zod',
                        'Radix UI Components',
                        'Axios HTTP Client',
                        'React Router',
                        'Lucide React Icons',
                      ].map((dep) => (
                        <div
                          key={dep}
                          className="flex items-center gap-2 rounded-lg bg-gray-800 p-3"
                        >
                          <span className="text-green-400">✓</span>
                          <span className="text-gray-300">{dep}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'documentation' && (
                  <div className="prose prose-invert max-w-none">
                    <h3 className="mb-4 text-xl font-semibold text-white">Getting Started</h3>
                    <div className="space-y-4 text-gray-400">
                      <p>This is your clean slate for rebuilding FableCraft the right way.</p>
                      <div className="rounded-lg bg-gray-800 p-4 font-mono text-sm">
                        <p className="mb-2 text-gray-300">Next steps:</p>
                        <ol className="list-inside list-decimal space-y-1">
                          <li>Configure testing with Vitest</li>
                          <li>Set up Prettier and git hooks</li>
                          <li>Start migrating features from the old app</li>
                          <li>Implement proper error boundaries</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

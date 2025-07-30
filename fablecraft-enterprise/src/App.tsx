import { useState } from 'react'
import { cn } from './lib/utils'

function App() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                FableCraft Enterprise
              </h1>
              <nav className="hidden md:flex space-x-6">
                <button className="text-gray-300 hover:text-white transition-colors">Dashboard</button>
                <button className="text-gray-300 hover:text-white transition-colors">Characters</button>
                <button className="text-gray-300 hover:text-white transition-colors">Projects</button>
                <button className="text-gray-300 hover:text-white transition-colors">World Bible</button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">
                Settings
              </button>
              <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                New Project
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-400 text-sm">Total Characters</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-400 text-sm">Active Projects</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-400 text-sm">TypeScript Errors</p>
                  <p className="text-2xl font-bold text-green-400">0</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Panel */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900 rounded-lg border border-gray-800">
              {/* Tabs */}
              <div className="border-b border-gray-800 p-4">
                <div className="flex space-x-6">
                  {['overview', 'setup', 'documentation'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "pb-2 px-1 text-sm font-medium transition-colors relative",
                        activeTab === tab
                          ? "text-blue-400 border-b-2 border-blue-400"
                          : "text-gray-400 hover:text-gray-300"
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
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Welcome to FableCraft Enterprise
                      </h3>
                      <p className="text-gray-400">
                        A clean, modern foundation for rebuilding FableCraft with enterprise-grade standards.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <h4 className="font-medium text-white mb-2">✨ Modern Stack</h4>
                        <ul className="space-y-1 text-sm text-gray-400">
                          <li>• React 19 + TypeScript 5.8</li>
                          <li>• Vite for lightning-fast builds</li>
                          <li>• Tailwind CSS for styling</li>
                          <li>• Strict TypeScript configuration</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <h4 className="font-medium text-white mb-2">🛠️ Developer Experience</h4>
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
                    <h3 className="text-xl font-semibold text-white mb-4">Installed Dependencies</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Tailwind CSS',
                        'Zustand State Management',
                        'React Query (TanStack)',
                        'React Hook Form + Zod',
                        'Radix UI Components',
                        'Axios HTTP Client',
                        'React Router',
                        'Lucide React Icons'
                      ].map((dep) => (
                        <div key={dep} className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg">
                          <span className="text-green-400">✓</span>
                          <span className="text-gray-300">{dep}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'documentation' && (
                  <div className="prose prose-invert max-w-none">
                    <h3 className="text-xl font-semibold text-white mb-4">Getting Started</h3>
                    <div className="space-y-4 text-gray-400">
                      <p>This is your clean slate for rebuilding FableCraft the right way.</p>
                      <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                        <p className="text-gray-300 mb-2">Next steps:</p>
                        <ol className="list-decimal list-inside space-y-1">
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

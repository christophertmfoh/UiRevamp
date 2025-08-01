import { useUser } from '../../auth/stores/auth-store'
import { useVisibleWidgets, useDashboardStore } from '../stores/dashboard-store'
import { AdaptiveHeader } from '../components/adaptive-header'

/**
 * DASHBOARD PAGE COMPONENT
 * 
 * Main dashboard page implementing the widget-based architecture from DASHBOARD_MASTER_PLAN.
 * Features:
 * - Widget-based layout with mathematical spacing
 * - Zustand store integration for dashboard state
 * - Adaptive header with context-aware navigation
 * - Theme-reactive design with golden ratio typography
 * - Responsive grid layout using friendship levels spacing
 */
export const DashboardPage: React.FC = () => {
  const user = useUser()
  const visibleWidgets = useVisibleWidgets()
  const { recentProjects, writingGoals, todoItems, aiGenerations } = useDashboardStore()

  return (
    <div className="min-h-screen bg-background">
      {/* Adaptive Header - Context-aware navigation */}
      <AdaptiveHeader />
      
      {/* Dashboard Content */}
      <main className="container mx-auto px-strangers py-strangers">
        <div className="space-strangers">
          
          {/* Welcome Section */}
          <div className="space-friends">
            <h1 className="text-golden-xl font-bold text-foreground">
              Welcome back, {user?.name || 'Writer'}! ✨
            </h1>
            <p className="text-golden-md text-muted-foreground">
              Continue your creative journey with FableCraft
            </p>
          </div>

          {/* Widget Grid - Mathematical spacing with friendship levels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-friends auto-rows-min">
            
            {/* Recent Projects Widget */}
            {visibleWidgets.find(w => w.type === 'recent-projects') && (
              <div className="bg-card border border-border rounded-lg p-friends shadow-sm space-best-friends">
                <h2 className="text-golden-lg font-semibold text-card-foreground flex items-center">
                  <span className="mr-best-friends">📚</span>
                  Recent Projects
                </h2>
                <div className="space-best-friends">
                  {recentProjects.slice(0, 3).map((project) => (
                    <div 
                      key={project.id}
                      className="p-best-friends bg-muted/50 rounded border hover:bg-muted/80 transition-colors cursor-pointer"
                    >
                      <h3 className="text-golden-md font-medium text-foreground truncate">
                        {project.title}
                      </h3>
                      <div className="flex items-center justify-between mt-acquaintances">
                        <span className="text-golden-sm text-muted-foreground">
                          {project.type}
                        </span>
                        <span className="text-golden-sm text-primary font-medium">
                          {project.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Writing Goals Widget */}
            {visibleWidgets.find(w => w.type === 'writing-goals') && (
              <div className="bg-card border border-border rounded-lg p-friends shadow-sm space-best-friends">
                <h2 className="text-golden-lg font-semibold text-card-foreground flex items-center">
                  <span className="mr-best-friends">🎯</span>
                  Writing Goals
                </h2>
                <div className="space-best-friends">
                  {writingGoals.slice(0, 2).map((goal) => (
                    <div key={goal.id} className="space-acquaintances">
                      <div className="flex items-center justify-between">
                        <h3 className="text-golden-md font-medium text-foreground">
                          {goal.title}
                        </h3>
                        <span className="text-golden-sm text-muted-foreground">
                          {goal.currentWords}/{goal.targetWords}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((goal.currentWords / goal.targetWords) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* To-Do List Widget */}
            {visibleWidgets.find(w => w.type === 'todo-list') && (
              <div className="bg-card border border-border rounded-lg p-friends shadow-sm space-best-friends">
                <h2 className="text-golden-lg font-semibold text-card-foreground flex items-center">
                  <span className="mr-best-friends">✅</span>
                  To-Do List
                </h2>
                <div className="space-acquaintances">
                  {todoItems.slice(0, 4).map((todo) => (
                    <div 
                      key={todo.id}
                      className="flex items-center space-x-best-friends p-acquaintances hover:bg-muted/30 rounded transition-colors"
                    >
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        todo.isCompleted 
                          ? 'bg-primary border-primary text-primary-foreground' 
                          : 'border-border'
                      }`}>
                        {todo.isCompleted && <span className="text-xs">✓</span>}
                      </div>
                      <span className={`text-golden-sm flex-1 ${
                        todo.isCompleted 
                          ? 'text-muted-foreground line-through' 
                          : 'text-foreground'
                      }`}>
                        {todo.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Generations Widget */}
            {visibleWidgets.find(w => w.type === 'ai-generations') && (
              <div className="bg-card border border-border rounded-lg p-friends shadow-sm space-best-friends md:col-span-2 lg:col-span-3">
                <h2 className="text-golden-lg font-semibold text-card-foreground flex items-center">
                  <span className="mr-best-friends">🤖</span>
                  Recent AI Generations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-best-friends">
                  {aiGenerations.slice(0, 3).map((generation) => (
                    <div 
                      key={generation.id}
                      className="p-best-friends bg-muted/50 rounded border hover:bg-muted/80 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-acquaintances">
                        <span className="text-golden-sm text-primary font-medium capitalize">
                          {generation.type}
                        </span>
                        <span className="text-golden-xs text-muted-foreground">
                          {new Date(generation.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-golden-sm text-foreground line-clamp-3">
                        {generation.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Quick Actions Section */}
          <div className="space-friends">
            <h2 className="text-golden-lg font-semibold text-foreground">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-best-friends">
              <button className="p-friends bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-center space-acquaintances">
                <div className="text-2xl">📝</div>
                <div className="text-golden-sm font-medium">New Project</div>
              </button>
              <button className="p-friends bg-muted hover:bg-muted/80 transition-colors rounded-lg text-center space-acquaintances">
                <div className="text-2xl">🎯</div>
                <div className="text-golden-sm font-medium text-foreground">Set Goal</div>
              </button>
              <button className="p-friends bg-muted hover:bg-muted/80 transition-colors rounded-lg text-center space-acquaintances">
                <div className="text-2xl">📊</div>
                <div className="text-golden-sm font-medium text-foreground">Analytics</div>
              </button>
              <button className="p-friends bg-muted hover:bg-muted/80 transition-colors rounded-lg text-center space-acquaintances">
                <div className="text-2xl">⚙️</div>
                <div className="text-golden-sm font-medium text-foreground">Settings</div>
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default DashboardPage
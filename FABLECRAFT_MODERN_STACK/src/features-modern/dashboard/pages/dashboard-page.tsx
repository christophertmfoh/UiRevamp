import { useUser } from '../../auth/stores/auth-store'
import { useVisibleWidgets, useDashboardStore } from '../stores/dashboard-store'
import { AdaptiveHeader } from '../components/adaptive-header'

/**
 * DASHBOARD PAGE COMPONENT
 * 
 * Main dashboard page implementing the CSS Grid widget-based architecture.
 * Features:
 * - CSS Grid layout with auto-fill responsive columns
 * - Mathematical spacing using friendship levels
 * - Theme-reactive design with CSS custom properties
 * - Adaptive header with context-aware navigation
 * - Widget-based architecture for modular content
 * 
 * LAYOUT RESEARCH IMPLEMENTATION:
 * - Based on Notion, Linear, Figma dashboard patterns
 * - Uses research-backed CSS Grid with minmax() and auto-fill
 * - Responsive breakpoints that adapt widget sizes
 * - Mathematical spacing system for visual hierarchy
 */
export const DashboardPage: React.FC = () => {
  const user = useUser()
  const visibleWidgets = useVisibleWidgets()
  const { isLoading } = useDashboardStore()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-friends">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-friends"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Adaptive Header */}
      <AdaptiveHeader />
      
      {/* Dashboard Content */}
      <main className="dashboard-grid">
        {/* Welcome Widget - spans 2 columns on larger screens */}
        <div className="widget widget-w2 widget-h1 widget-elevated">
          <div className="widget-header">
            <div>
              <h1 className="widget-title">Welcome back, {user?.name || 'Creator'}!</h1>
              <p className="widget-subtitle">Ready to bring your ideas to life?</p>
            </div>
          </div>
          <div className="widget-content">
            <p className="text-muted-foreground">
              Your creative workspace is ready. Explore your projects, track your progress, 
              and discover new inspiration below.
            </p>
          </div>
          <div className="widget-footer">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              Start Creating
            </button>
          </div>
        </div>

        {/* Quick Stats Widget */}
        <div className="widget widget-w1 widget-h1">
          <div className="widget-header">
            <h2 className="widget-title">Quick Stats</h2>
          </div>
          <div className="widget-content">
            <div className="grid grid-cols-1 gap-best-friends">
              <div className="text-center">
                <div className="text-golden-2xl font-bold text-primary">12</div>
                <div className="text-golden-sm text-muted-foreground">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-golden-2xl font-bold text-secondary">1.2k</div>
                <div className="text-golden-sm text-muted-foreground">Words Today</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Projects Widget */}
        <div className="widget widget-w3 widget-h2">
          <div className="widget-header">
            <h2 className="widget-title">Recent Projects</h2>
            <button className="text-golden-sm text-primary hover:text-primary/80">View All</button>
          </div>
          <div className="widget-content space-friends">
            {/* Project Item 1 */}
            <div className="flex items-center justify-between p-acquaintances bg-card/50 rounded-md border border-border/50">
              <div>
                <h3 className="font-medium">Epic Fantasy Novel</h3>
                <p className="text-golden-sm text-muted-foreground">Last edited 2 hours ago</p>
              </div>
              <div className="text-right">
                <div className="text-golden-sm font-medium">45,231 words</div>
                <div className="text-golden-sm text-muted-foreground">78% complete</div>
              </div>
            </div>

            {/* Project Item 2 */}
            <div className="flex items-center justify-between p-acquaintances bg-card/50 rounded-md border border-border/50">
              <div>
                <h3 className="font-medium">Character Development Guide</h3>
                <p className="text-golden-sm text-muted-foreground">Last edited yesterday</p>
              </div>
              <div className="text-right">
                <div className="text-golden-sm font-medium">12,847 words</div>
                <div className="text-golden-sm text-muted-foreground">92% complete</div>
              </div>
            </div>

            {/* Project Item 3 */}
            <div className="flex items-center justify-between p-acquaintances bg-card/50 rounded-md border border-border/50">
              <div>
                <h3 className="font-medium">World Building Notes</h3>
                <p className="text-golden-sm text-muted-foreground">Last edited 3 days ago</p>
              </div>
              <div className="text-right">
                <div className="text-golden-sm font-medium">8,934 words</div>
                <div className="text-golden-sm text-muted-foreground">34% complete</div>
              </div>
            </div>
          </div>
        </div>

        {/* Writing Goals Widget */}
        <div className="widget widget-w1 widget-h2 widget-success">
          <div className="widget-header">
            <h2 className="widget-title">Writing Goals</h2>
          </div>
          <div className="widget-content space-friends">
            {/* Daily Goal */}
            <div>
              <div className="flex justify-between items-center mb-best-friends">
                <span className="text-golden-sm">Daily Target</span>
                <span className="text-golden-sm font-medium">1,200 / 1,000</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <p className="text-golden-sm text-muted-foreground mt-best-friends">Goal exceeded! 🎉</p>
            </div>

            {/* Weekly Goal */}
            <div>
              <div className="flex justify-between items-center mb-best-friends">
                <span className="text-golden-sm">Weekly Target</span>
                <span className="text-golden-sm font-medium">4,200 / 7,000</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="text-golden-sm text-muted-foreground mt-best-friends">3 days remaining</p>
            </div>

            {/* Monthly Goal */}
            <div>
              <div className="flex justify-between items-center mb-best-friends">
                <span className="text-golden-sm">Monthly Target</span>
                <span className="text-golden-sm font-medium">18,430 / 30,000</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '61%' }}></div>
              </div>
              <p className="text-golden-sm text-muted-foreground mt-best-friends">On track for this month</p>
            </div>
          </div>
        </div>

        {/* To-Do List Widget */}
        <div className="widget widget-w2 widget-h2">
          <div className="widget-header">
            <h2 className="widget-title">Today's Tasks</h2>
            <button className="text-golden-sm text-primary hover:text-primary/80">Add Task</button>
          </div>
          <div className="widget-content space-friends">
            {/* Task Item 1 */}
            <div className="flex items-center space-friends">
              <input type="checkbox" className="rounded border-border" />
              <span className="flex-1">Complete Chapter 7 outline</span>
              <span className="text-golden-sm text-muted-foreground">High</span>
            </div>

            {/* Task Item 2 */}
            <div className="flex items-center space-friends">
              <input type="checkbox" defaultChecked className="rounded border-border" />
              <span className="flex-1 line-through text-muted-foreground">Research medieval weaponry</span>
              <span className="text-golden-sm text-muted-foreground">Medium</span>
            </div>

            {/* Task Item 3 */}
            <div className="flex items-center space-friends">
              <input type="checkbox" className="rounded border-border" />
              <span className="flex-1">Review beta reader feedback</span>
              <span className="text-golden-sm text-muted-foreground">Medium</span>
            </div>

            {/* Task Item 4 */}
            <div className="flex items-center space-friends">
              <input type="checkbox" className="rounded border-border" />
              <span className="flex-1">Update character relationship map</span>
              <span className="text-golden-sm text-muted-foreground">Low</span>
            </div>

            {/* Task Item 5 */}
            <div className="flex items-center space-friends">
              <input type="checkbox" className="rounded border-border" />
              <span className="flex-1">Plan next writing session</span>
              <span className="text-golden-sm text-muted-foreground">Low</span>
            </div>
          </div>
        </div>

        {/* AI Text Generations Widget */}
        <div className="widget widget-w2 widget-h1 widget-elevated">
          <div className="widget-header">
            <h2 className="widget-title">AI Inspiration</h2>
            <button className="text-golden-sm text-primary hover:text-primary/80">Generate New</button>
          </div>
          <div className="widget-content">
            <div className="bg-card/50 rounded-md p-acquaintances border border-border/50">
              <p className="text-golden-md italic text-foreground mb-friends">
                "The ancient library held secrets that whispered through time, each book a doorway 
                to forgotten worlds where magic and technology danced in perfect harmony."
              </p>
              <div className="flex justify-between items-center text-golden-sm text-muted-foreground">
                <span>Fantasy Opening Line</span>
                <span>Generated 5 minutes ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Inspiration Widget */}
        <div className="widget widget-w1 widget-h1">
          <div className="widget-header">
            <h2 className="widget-title">Daily Quote</h2>
          </div>
          <div className="widget-content">
            <blockquote className="text-center">
              <p className="text-golden-md italic mb-friends">
                "A professional writer is an amateur who didn't quit."
              </p>
              <footer className="text-golden-sm text-muted-foreground">
                — Richard Bach
              </footer>
            </blockquote>
          </div>
        </div>

        {/* Hidden widgets based on user preferences */}
        {visibleWidgets.map((widget) => (
          <div key={widget.id} className="widget widget-w1 widget-h1">
            <div className="widget-header">
              <h2 className="widget-title">{widget.title}</h2>
            </div>
            <div className="widget-content">
              <p className="text-muted-foreground">
                Widget type: {widget.type}
              </p>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}

export default DashboardPage
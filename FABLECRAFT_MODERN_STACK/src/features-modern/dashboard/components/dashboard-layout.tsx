import React, { ReactNode } from 'react'

/**
 * DASHBOARD LAYOUT PROPS INTERFACE
 * Configurable layout options for the dashboard
 */
interface DashboardLayoutProps {
  /**
   * Main dashboard content (widgets, projects, etc.)
   */
  children: ReactNode
  
  /**
   * Optional sidebar content
   */
  sidebar?: ReactNode
  
  /**
   * Show/hide the sidebar
   */
  showSidebar?: boolean
  
  /**
   * Custom CSS classes
   */
  className?: string
}

/**
 * DASHBOARD LAYOUT COMPONENT
 * 
 * Modern grid-based dashboard layout inspired by Notion, Linear, and Figma.
 * Features:
 * - CSS Grid responsive layout
 * - Mathematical spacing (friendship levels) 
 * - Theme-reactive containers
 * - Mobile-first responsive design
 * - Widget-based architecture support
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  sidebar,
  showSidebar = false,
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Main Dashboard Grid Container */}
      <div 
        className={`
          h-screen grid transition-all duration-300
          ${showSidebar 
            ? 'grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]' 
            : 'grid-cols-1'
          }
        `}
      >
        {/* Sidebar */}
        {showSidebar && sidebar && (
          <aside className="
            border-r border-border bg-card
            overflow-y-auto scrollbar-thin
            hidden md:block
          ">
            <div className="p-strangers">
              {sidebar}
            </div>
          </aside>
        )}

        {/* Main Content Area */}
        <main className="overflow-y-auto scrollbar-thin">
          <div className="p-strangers space-friends max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

/**
 * WIDGET GRID CONTAINER
 * 
 * Responsive grid container for dashboard widgets following 8dp grid system.
 * Supports various widget sizes and responsive breakpoints.
 */
interface WidgetGridProps {
  children: ReactNode
  className?: string
}

export const WidgetGrid: React.FC<WidgetGridProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`
      grid gap-friends
      grid-cols-1 
      md:grid-cols-2 
      lg:grid-cols-3 
      xl:grid-cols-4
      ${className}
    `}>
      {children}
    </div>
  )
}

/**
 * DASHBOARD SECTION
 * 
 * Semantic section wrapper for dashboard content areas.
 * Provides consistent spacing and typography hierarchy.
 */
interface DashboardSectionProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
  actions?: ReactNode
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  title,
  description,
  children,
  className = '',
  actions,
}) => {
  return (
    <section className={`space-friends ${className}`}>
      {(title || description || actions) && (
        <div className="flex items-center justify-between mb-friends">
          <div className="space-best-friends">
            {title && (
              <h2 className="text-golden-lg font-semibold text-foreground">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-golden-md text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-best-friends">
              {actions}
            </div>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

/**
 * WIDGET CONTAINER
 * 
 * Base container for dashboard widgets with consistent styling.
 * Provides theme-reactive backgrounds and proper spacing.
 */
interface WidgetContainerProps {
  children: ReactNode
  className?: string
  title?: string
  subtitle?: string
  actions?: ReactNode
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  children,
  className = '',
  title,
  subtitle,
  actions,
}) => {
  return (
    <div className={`
      bg-card border border-border rounded-lg
      p-friends shadow-sm
      hover:shadow-md transition-shadow
      space-friends
      ${className}
    `}>
      {(title || subtitle || actions) && (
        <div className="flex items-center justify-between pb-best-friends border-b border-border">
          <div className="space-best-friends">
            {title && (
              <h3 className="text-golden-md font-medium text-card-foreground">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-golden-sm text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-best-friends">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className="space-friends">
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout

import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FloatingOrbs } from '../FloatingOrbs';
import { ProjectsHeader } from './ProjectsHeader';
import { ProjectsFilters } from './ProjectsFilters';
import { ProjectsStats } from './ProjectsStats';
import { LazyProjectsList, LazyProjectModals } from './LazyProjectComponents';
import { DashboardWidgets } from './DashboardWidgets';
import { useProjectsLogic } from '@/hooks/useProjectsLogic';
import { useTaskManagement } from '@/hooks/useTaskManagement';
import { useWidgetManagement } from '@/hooks/useWidgetManagement';
import { useOptimizedScroll } from '@/hooks/useOptimizedScroll';
import { Card } from '@/components/ui/card';

interface User {
  username?: string;
}

interface Project {
  id: string;
  name: string;
  type?: string;
  genre?: string | string[];
  description?: string;
  createdAt: string;
  [key: string]: any;
}

interface ProjectsPageProps {
  user: User | null;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onSelectProject: (project: Project) => void;
  onNewProject: () => void;
}

export const ProjectsPage = React.memo(function ProjectsPage({
  user,
  onNavigate,
  onLogout,
  onSelectProject,
  onNewProject
}: ProjectsPageProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const { scrollY } = useOptimizedScroll();

  // Mock data - replace with actual API call
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      // Replace with actual API call
      return [];
    },
  });

  // Custom hook for projects logic
  const {
    searchQuery,
    viewMode,
    sortBy,
    filteredProjects,
    projectStats,
    setSearchQuery,
    setViewMode,
    setSortBy,
  } = useProjectsLogic({ projects });

  // Custom hook for task management
  const taskManagement = useTaskManagement();

  // Custom hook for widget management
  const widgetManagement = useWidgetManagement();

  // Memoized handlers
  const handleToggleEditMode = useCallback(() => {
    setIsEditMode(prev => !prev);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, [setSearchQuery]);

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, [setViewMode]);

  const handleSortChange = useCallback((sort: 'name' | 'updated' | 'created' | 'type') => {
    setSortBy(sort);
  }, [setSortBy]);

  return (
    <div className="min-h-screen relative transition-all duration-300 overflow-hidden bg-background">
      {/* Background System */}
      <FloatingOrbs />

      {/* Modern Abstract Background System */}
      <div className="absolute inset-0">
        {/* Theme-aware background orbs */}
        <div 
          className="absolute top-0 -left-4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" 
          style={{ backgroundColor: 'hsl(var(--orb-primary) / 0.3)' }}
        />
        <div 
          className="absolute top-0 -right-4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
          style={{ backgroundColor: 'hsl(var(--orb-secondary) / 0.3)' }}
        />
        <div 
          className="absolute -bottom-8 left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"
          style={{ backgroundColor: 'hsl(var(--orb-primary) / 0.2)' }}
        />

        {/* Noise Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            transform: `translateY(${scrollY * 0.05}px)`
          }}
        />

        {/* Animated Geometric Patterns */}
        <svg className="absolute inset-0 w-full h-full opacity-5 dark:opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="0.5" fill="currentColor" className="text-foreground/20"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" style={{ transform: `translateY(${scrollY * 0.1}px)` }}/>
        </svg>
      </div>

      {/* Floating Orbs with Parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(var(--orb-primary) / 0.1) 0%, transparent 70%)',
            transform: `translate(${scrollY * 0.02}px, ${scrollY * 0.15}px) scale(${1 + scrollY * 0.0001})`,
            filter: 'blur(40px)'
          }}
        />
        <div 
          className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(var(--orb-secondary) / 0.1) 0%, transparent 70%)',
            transform: `translate(${-scrollY * 0.03}px, ${-scrollY * 0.1}px) scale(${1 + scrollY * 0.0001})`,
            filter: 'blur(30px)'
          }}
        />
      </div>

      {/* Header */}
      <ProjectsHeader
        user={user}
        isEditMode={isEditMode}
        onNavigate={onNavigate}
        onLogout={onLogout}
        onToggleEditMode={handleToggleEditMode}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Page Header - Improved spacing and alignment */}
        <div className="text-center mb-8">
          <p className="text-lg text-muted-foreground font-medium mb-2">
            Welcome back, {user?.username || 'Writer'}
          </p>
          <h1 className="text-4xl lg:text-5xl font-black text-foreground leading-tight tracking-tight mb-4">
            Your Projects
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Organize, track, and bring your stories to life with intelligent project management.
          </p>
        </div>

        {/* Stats Section */}
        <ProjectsStats
          totalProjects={projectStats.total}
          completedProjects={projectStats.active}
          onNewProject={onNewProject}
        />

        {/* Filters Section */}
        <ProjectsFilters
          searchQuery={searchQuery}
          viewMode={viewMode}
          sortBy={sortBy}
          onSearchChange={handleSearchChange}
          onViewModeChange={handleViewModeChange}
          onSortChange={handleSortChange}
        />

        {/* Projects List Section */}
        <LazyProjectsList
          projects={filteredProjects}
          searchQuery={searchQuery}
          sortBy={sortBy}
          viewMode={viewMode}
          isLoading={isLoading}
          onSelectProject={onSelectProject}
          onNewProject={onNewProject}
          enableVirtualization={filteredProjects.length > 20}
        />

        {/* Dashboard Widgets Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-heading-2 text-foreground">Dashboard</h2>
            {isEditMode && (
              <Button
                size="sm"
                onClick={widgetManagement.resetWidgets}
                className="text-xs text-muted-foreground hover:text-foreground"
                variant="ghost"
              >
                Reset Layout
              </Button>
            )}
          </div>
          <DashboardWidgets
            widgets={widgetManagement.widgets}
            projects={projects}
            todayTasks={taskManagement.todayTasks}
            isLoadingTasks={taskManagement.isLoadingTasks}
            actualGoals={taskManagement.tempGoals}
            todayProgress={taskManagement.todayProgress}
            isEditMode={isEditMode}
            draggedWidget={widgetManagement.draggedWidget}
            dragOverWidget={widgetManagement.dragOverWidget}
            onWidgetDragStart={widgetManagement.handleWidgetDragStart}
            onWidgetDragOver={widgetManagement.handleWidgetDragOver}
            onWidgetDrop={widgetManagement.handleWidgetDrop}
            onWidgetDragLeave={widgetManagement.handleWidgetDragLeave}
            onOpenGoalsModal={taskManagement.handleOpenGoalsModal}
            onShowTasksModal={() => taskManagement.setShowTasksModal(true)}
            onShowAddTaskModal={() => taskManagement.setShowAddTaskModal(true)}
            onToggleTaskCompletion={taskManagement.handleToggleTaskCompletion}
          />
        </div>
      </div>

      {/* Lazy Loaded Modals */}
      <LazyProjectModals
        // Add Task Modal
        showAddTaskModal={taskManagement.showAddTaskModal}
        onCloseAddTaskModal={() => taskManagement.setShowAddTaskModal(false)}
        newTaskText={taskManagement.newTaskText}
        setNewTaskText={taskManagement.setNewTaskText}
        newTaskPriority={taskManagement.newTaskPriority}
        setNewTaskPriority={taskManagement.setNewTaskPriority}
        newTaskEstimatedTime={taskManagement.newTaskEstimatedTime}
        setNewTaskEstimatedTime={taskManagement.setNewTaskEstimatedTime}
        onCreateTask={taskManagement.handleCreateTask}
        editingTask={taskManagement.editingTask}

        // Tasks Modal
        showTasksModal={taskManagement.showTasksModal}
        onCloseTasksModal={() => taskManagement.setShowTasksModal(false)}
        todayTasks={taskManagement.todayTasks}
        isLoadingTasks={taskManagement.isLoadingTasks}
        taskStats={taskManagement.taskStats}
        onToggleTaskCompletion={taskManagement.handleToggleTaskCompletion}
        onEditTask={taskManagement.handleEditTask}
        onDeleteTask={taskManagement.handleDeleteTask}

        // Goals Modal
        showGoalsModal={taskManagement.showGoalsModal}
        onCloseGoalsModal={() => taskManagement.setShowGoalsModal(false)}
        tempGoals={taskManagement.tempGoals}
        setTempGoals={taskManagement.setTempGoals}
        todayProgress={taskManagement.todayProgress}
        onSaveGoals={taskManagement.handleSaveGoals}
      />
    </div>
  );
});
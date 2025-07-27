import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FloatingOrbs } from '../FloatingOrbs';
import { ProjectsHeader } from './ProjectsHeader';
import { ProjectsFilters } from './ProjectsFilters';
import { ProjectsStats } from './ProjectsStats';
import { LazyProjectsList, LazyProjectModals } from './LazyProjectComponents';
import { useProjectsLogic } from '@/hooks/useProjectsLogic';
import { useTaskManagement } from '@/hooks/useTaskManagement';
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
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-8">
        {/* Page Header */}
        <Card className="relative surface-elevated backdrop-blur-xl rounded-[2rem] p-6 shadow-xl border-border/30 mb-6 overflow-hidden">
          {/* Vignette gradient overlay - only visible in dark mode */}
          <div className="absolute inset-0 vignette-gradient opacity-0 dark:opacity-100 pointer-events-none rounded-[2rem]"></div>
          <div className="text-center">
            <div className="overflow-visible">
              <div className="mb-2">
                <p className="text-lg text-muted-foreground font-medium">
                  Welcome back, {user?.username || 'Writer'}
                </p>
              </div>
              <h1 className="text-heading-1 text-foreground leading-[1.3] tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] mb-2">
                Your Projects
              </h1>
            </div>
            
            <p className="text-body-large text-muted-foreground leading-[1.6] font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] tracking-wide max-w-lg mx-auto">
              Organize, track, and bring your stories to life with intelligent project management.
            </p>
          </div>
        </Card>

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
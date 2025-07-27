import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PlusCircle, 
  Search, 
  Grid3X3, 
  List, 
  Clock, 
  Calendar,
  FileText,
  BookOpen,
  Settings,
  LogOut,
  User,
  Moon,
  Sun,
  ChevronDown,
  Sparkles,
  PenTool,
  Library,
  Feather,
  ArrowLeft,
  Activity,
  TrendingUp,
  Image,
  CheckCircle,
  Plus,
  Target,
  Edit2,
  Trash2,
  Pencil,
  GripVertical,
  Lock,
  Unlock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ThemeToggle } from '@/components/theme-toggle';
import { MessageOfTheDay } from '@/components/ui/MessageOfTheDay';
import { Project } from '@/lib/types';
import { taskService, goalsService } from '@/lib/services/taskService';
import type { Task, WritingGoal } from '@shared/schema';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ProjectsPageRedesignProps {
  onNavigate: (view: string) => void;
  onNewProject: () => void;
  onSelectProject: (project: Project) => void;
  onLogout: () => Promise<void>;
  user: any;
}

// Types for drag and drop
type SectionType = 'project-management' | 'dashboard-widgets';
type WidgetType = 'daily-inspiration' | 'recent-project' | 'writing-progress' | 'quick-tasks';

interface LayoutSection {
  id: SectionType;
  name: string;
  order: number;
}

interface DashboardWidget {
  id: WidgetType;
  name: string;
  order: number;
}

const DEFAULT_LAYOUT: LayoutSection[] = [
  { id: 'project-management', name: 'Project Management', order: 0 },
  { id: 'dashboard-widgets', name: 'Dashboard Widgets', order: 1 }
];

const DEFAULT_WIDGETS: DashboardWidget[] = [
  { id: 'daily-inspiration', name: 'Daily Inspiration', order: 0 },
  { id: 'recent-project', name: 'Recent Project', order: 1 },
  { id: 'writing-progress', name: 'Writing Progress', order: 2 },
  { id: 'quick-tasks', name: 'Quick Tasks', order: 3 }
];

export function ProjectsPageRedesign({ 
  onNavigate, 
  onNewProject, 
  onSelectProject, 
  onLogout,
  user 
}: ProjectsPageRedesignProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    const saved = localStorage.getItem('projects-view-mode');
    return (saved as 'grid' | 'list') || 'list';
  });
  const [sortBy, setSortBy] = useState<'name' | 'updated' | 'created' | 'type'>(() => {
    const saved = localStorage.getItem('projects-sort-by');
    return (saved as 'name' | 'updated' | 'created' | 'type') || 'updated';
  });
  const [scrollY, setScrollY] = useState(0);
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  
  // Drag and drop state
  const [isEditMode, setIsEditMode] = useState(false);
  const [layoutSections, setLayoutSections] = useState<LayoutSection[]>(() => {
    const saved = localStorage.getItem('projectsLayoutSections');
    return saved ? JSON.parse(saved) : DEFAULT_LAYOUT;
  });
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>(() => {
    const saved = localStorage.getItem('projectsDashboardWidgets');
    return saved ? JSON.parse(saved) : DEFAULT_WIDGETS;
  });
  const [draggedSection, setDraggedSection] = useState<SectionType | null>(null);
  const [draggedWidget, setDraggedWidget] = useState<WidgetType | null>(null);
  const [dragOverSection, setDragOverSection] = useState<SectionType | null>(null);
  const [dragOverWidget, setDragOverWidget] = useState<WidgetType | null>(null);
  
  // Task modal states
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskEstimatedTime, setNewTaskEstimatedTime] = useState<number>(30);
  
  // Temporary goals state for modal
  const [tempGoals, setTempGoals] = useState({
    dailyWords: 500,
    dailyMinutes: 60,
    streakDays: 30
  });
  
  // Open modal handler
  const handleOpenGoalsModal = () => {
    // Will be populated after queries are defined
    setShowGoalsModal(true);
  };
  
  // Save goals handler
  const handleSaveGoals = () => {
    updateGoalsMutation.mutate(tempGoals);
    setShowGoalsModal(false);
  };
  
  // Create new task handler
  const handleCreateTask = () => {
    if (!newTaskText.trim()) return;
    
    createTaskMutation.mutate({
      text: newTaskText,
      priority: newTaskPriority,
      estimatedTime: newTaskEstimatedTime,
      status: 'pending',
      dueDate: new Date(),
      projectId: null // Tasks from dashboard are not project-specific
    }, {
      onSuccess: () => {
        setNewTaskText('');
        setNewTaskPriority('medium');
        setNewTaskEstimatedTime(30);
        setShowAddTaskModal(false);
      }
    });
  };
  
  // Update task handler
  const handleUpdateTask = () => {
    if (!editingTask || !newTaskText.trim()) return;
    
    updateTaskMutation.mutate({
      id: editingTask.id,
      updates: {
        text: newTaskText,
        priority: newTaskPriority,
        estimatedTime: newTaskEstimatedTime
      }
    });
    
    setEditingTask(null);
    setNewTaskText('');
    setNewTaskPriority('medium');
    setNewTaskEstimatedTime(30);
  };

  // Helper functions to update preferences and save to localStorage
  const updateViewMode = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('projects-view-mode', mode);
  };

  const updateSortBy = (sort: 'name' | 'updated' | 'created' | 'type') => {
    setSortBy(sort);
    localStorage.setItem('projects-sort-by', sort);
  };

  // Parallax scrolling effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { toast } = useToast();
  
  // Save layout to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('projectsLayoutSections', JSON.stringify(layoutSections));
  }, [layoutSections]);
  
  useEffect(() => {
    localStorage.setItem('projectsDashboardWidgets', JSON.stringify(dashboardWidgets));
  }, [dashboardWidgets]);
  
  // Drag and drop handlers for sections
  const handleSectionDragStart = (e: React.DragEvent, sectionId: SectionType) => {
    if (!isEditMode) return;
    setDraggedSection(sectionId);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleSectionDragOver = (e: React.DragEvent, sectionId: SectionType) => {
    if (!isEditMode || !draggedSection) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSection(sectionId);
  };
  
  const handleSectionDrop = (e: React.DragEvent, targetSectionId: SectionType) => {
    if (!isEditMode || !draggedSection) return;
    e.preventDefault();
    
    if (draggedSection !== targetSectionId) {
      const newSections = [...layoutSections];
      const draggedIndex = newSections.findIndex(s => s.id === draggedSection);
      const targetIndex = newSections.findIndex(s => s.id === targetSectionId);
      
      // Swap the sections
      const temp = newSections[draggedIndex];
      newSections[draggedIndex] = newSections[targetIndex];
      newSections[targetIndex] = temp;
      
      // Update order values
      newSections.forEach((section, index) => {
        section.order = index;
      });
      
      setLayoutSections(newSections);
    }
    
    setDraggedSection(null);
    setDragOverSection(null);
  };
  
  // Drag and drop handlers for widgets
  const handleWidgetDragStart = (e: React.DragEvent, widgetId: WidgetType) => {
    if (!isEditMode) return;
    setDraggedWidget(widgetId);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleWidgetDragOver = (e: React.DragEvent, widgetId: WidgetType) => {
    if (!isEditMode || !draggedWidget) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverWidget(widgetId);
  };
  
  const handleWidgetDrop = (e: React.DragEvent, targetWidgetId: WidgetType) => {
    if (!isEditMode || !draggedWidget) return;
    e.preventDefault();
    
    if (draggedWidget !== targetWidgetId) {
      const newWidgets = [...dashboardWidgets];
      const draggedIndex = newWidgets.findIndex(w => w.id === draggedWidget);
      const targetIndex = newWidgets.findIndex(w => w.id === targetWidgetId);
      
      // Swap the widgets
      const temp = newWidgets[draggedIndex];
      newWidgets[draggedIndex] = newWidgets[targetIndex];
      newWidgets[targetIndex] = temp;
      
      // Update order values
      newWidgets.forEach((widget, index) => {
        widget.order = index;
      });
      
      setDashboardWidgets(newWidgets);
    }
    
    setDraggedWidget(null);
    setDragOverWidget(null);
  };
  
  // Queries
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects']
  });
  
  const { data: todayTasks = [], isLoading: isLoadingTasks } = useQuery<Task[]>({
    queryKey: ['tasks', 'today'],
    queryFn: () => taskService.getTodayTasks(),
    enabled: !!user
  });
  
  const { data: taskStats } = useQuery({
    queryKey: ['tasks', 'stats'],
    queryFn: () => taskService.getTaskStats(),
    enabled: !!user
  });
  
  const { data: writingGoals } = useQuery<WritingGoal>({
    queryKey: ['goals'],
    queryFn: () => goalsService.getGoals(),
    enabled: !!user
  });
  
  // Update tempGoals when writingGoals data is loaded
  useEffect(() => {
    if (writingGoals) {
      setTempGoals({
        dailyWords: writingGoals.dailyWords || 500,
        dailyMinutes: writingGoals.dailyMinutes || 60,
        streakDays: writingGoals.streakDays || 30
      });
    }
  }, [writingGoals]);
  
  // Computed values
  const actualGoals = {
    dailyWords: writingGoals?.dailyWords || tempGoals.dailyWords,
    dailyMinutes: writingGoals?.dailyMinutes || tempGoals.dailyMinutes,
    streakDays: writingGoals?.streakDays || tempGoals.streakDays
  };
  
  const todayProgress = {
    words: taskStats?.completedTasks ? taskStats.completedTasks * 150 : 0,
    minutes: taskStats?.completedTasks ? taskStats.completedTasks * 30 : 0,
    currentStreak: 7
  };
  
  // Mutations
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) => 
      taskService.updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'stats'] });
    }
  });
  
  const createTaskMutation = useMutation({
    mutationFn: (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'completedAt'>) => 
      taskService.createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'stats'] });
      toast({
        title: "Task created",
        description: "Your new task has been added successfully."
      });
    }
  });
  
  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'stats'] });
      toast({
        title: "Task deleted",
        description: "The task has been removed."
      });
    }
  });
  
  const updateGoalsMutation = useMutation({
    mutationFn: (goals: { dailyWords: number; dailyMinutes: number; streakDays: number }) => 
      goalsService.updateGoals(goals),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast({
        title: "Goals updated",
        description: "Your writing goals have been saved."
      });
    }
  });
  
  // Toggle task completion
  const toggleTaskCompletion = (task: Task) => {
    const updates = {
      status: task.status === 'completed' ? 'pending' : 'completed',
      completedAt: task.status === 'completed' ? null : new Date()
    };
    updateTaskMutation.mutate({ id: task.id, updates });
  };
  
  const filteredProjects = projects.filter((project: Project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (typeof project.genre === 'string' && project.genre.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a: Project, b: Project) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'updated':
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'type':
        return (a.type || '').localeCompare(b.type || '');
      default:
        return 0;
    }
  });

  // Calculate stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p: Project) => 
    new Date(p.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
  ).length;
  const uniqueGenres = Array.from(new Set(projects.map((p: Project) => p.genre).filter(Boolean))).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-emerald-50 dark:from-stone-950 dark:via-stone-900 dark:to-emerald-950 transition-all duration-300">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/35 via-stone-300/50 to-amber-300/35 dark:from-emerald-900/20 dark:via-stone-900/40 dark:to-amber-900/20"></div>
        
        {/* Floating Orbs */}
        <div 
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/45 to-emerald-600/50 dark:from-emerald-600/30 dark:to-emerald-800/30 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        ></div>
        <div 
          className="absolute top-20 -right-32 w-96 h-96 bg-gradient-to-br from-amber-400/40 to-amber-600/45 dark:from-amber-600/20 dark:to-amber-800/20 rounded-full blur-3xl animate-pulse delay-1000"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        ></div>
        <div 
          className="absolute -bottom-32 left-1/2 w-64 h-64 bg-gradient-to-br from-stone-400/45 to-stone-600/50 dark:from-stone-600/30 dark:to-stone-800/30 rounded-full blur-3xl animate-pulse delay-500"
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        ></div>

        {/* Ambient Lighting Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-emerald-400/25 dark:bg-emerald-500/10 rounded-full blur-2xl animate-pulse delay-300"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-amber-400/25 dark:bg-amber-500/10 rounded-full blur-2xl animate-pulse delay-700"></div>
          <div className="absolute top-3/4 left-3/4 w-32 h-32 bg-stone-500/25 dark:bg-stone-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Navigation Header */}
      <nav className="relative z-10 px-8 py-4 border-b border-stone-200/20 dark:border-stone-800/20 backdrop-blur-xl">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="flex-1">
            <Button
              variant="ghost"
              onClick={() => onNavigate('landing')}
              className="group text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Back
            </Button>
          </div>
          
          {/* Centered Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-600 dark:via-stone-600 dark:to-amber-700 rounded-xl flex items-center justify-center shadow-lg">
              <Feather className="w-5 h-5 text-emerald-800 dark:text-white" />
            </div>
            <span className="text-2xl font-black font-serif text-stone-900 dark:text-stone-50 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-wide">
              Fablecraft
            </span>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4 flex-1 justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  className="group gradient-primary text-white px-4 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:brightness-110 rounded-xl relative overflow-hidden flex items-center space-x-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center space-x-2">
                    <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span className="hidden sm:inline">{user?.username}</span>
                    <ChevronDown className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="icon"
              onClick={() => setIsEditMode(!isEditMode)}
              className="w-10 h-10 gradient-primary text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 hover:brightness-110 rounded-lg"
              title={isEditMode ? 'Lock Layout' : 'Customize Layout'}
            >
              {isEditMode ? (
                <Unlock className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-8">
        {/* Page Header */}
        <div className="relative bg-white/80 dark:bg-slate-800/40 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl border border-stone-300/30 dark:border-slate-700/20 mb-6 overflow-hidden">
          {/* Vignette gradient overlay - only visible in dark mode */}
          <div className="absolute inset-0 vignette-gradient opacity-0 dark:opacity-100 pointer-events-none rounded-[2rem]"></div>
          <div className="text-center">
            <div className="overflow-visible">
              <div className="mb-2">
                <p className="text-lg text-body-secondary font-medium">
                  Welcome back, {user?.username || 'Writer'}
                </p>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 dark:text-stone-50 leading-[1.3] tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] mb-2">
                Your Projects
              </h1>
            </div>
            
            <p className="text-lg text-body-primary leading-[1.6] font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] tracking-wide max-w-lg mx-auto">
              Organize, track, and bring your stories to life with intelligent project management.
            </p>
          </div>
        </div>

        {/* Draggable Sections */}
        {layoutSections.sort((a, b) => a.order - b.order).map((section) => {
          if (section.id === 'project-management') {
            return (
              <div
                key={section.id}
                draggable={isEditMode}
                onDragStart={(e) => handleSectionDragStart(e, section.id)}
                onDragOver={(e) => handleSectionDragOver(e, section.id)}
                onDrop={(e) => handleSectionDrop(e, section.id)}
                onDragLeave={() => setDragOverSection(null)}
                className={`transition-all duration-300 mb-8 ${
                  isEditMode ? 'cursor-move' : ''
                } ${
                  dragOverSection === section.id && draggedSection !== section.id
                    ? 'ring-2 ring-amber-400 ring-opacity-50 scale-[1.02]'
                    : ''
                } ${
                  draggedSection === section.id ? 'opacity-50' : ''
                }`}
              >
                {isEditMode && (
                  <div className="flex items-center justify-center mb-2 opacity-50">
                    <GripVertical className="w-5 h-5 text-stone-600 dark:text-stone-400" />
                    <span className="ml-2 text-sm font-medium text-stone-600 dark:text-stone-400">Project Management</span>
                  </div>
                )}
                <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl border border-stone-300/30 dark:border-slate-700/20">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/60 dark:bg-slate-700/40 rounded-xl p-4 border border-stone-200/30 dark:border-stone-700/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-black text-stone-900 dark:text-stone-50">
                    {totalProjects}
                  </p>
                  <p className="text-xs font-medium text-stone-600 dark:text-stone-400 mt-1">
                    Total Projects
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-600 dark:via-stone-600 dark:to-amber-700 rounded-lg flex items-center justify-center shadow-md">
                  <Library className="w-5 h-5 text-emerald-800 dark:text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/60 dark:bg-slate-700/40 rounded-xl p-4 border border-stone-200/30 dark:border-stone-700/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-black text-stone-900 dark:text-stone-50">
                    {activeProjects}
                  </p>
                  <p className="text-xs font-medium text-stone-600 dark:text-stone-400 mt-1">
                    Active This Week
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-600 dark:via-stone-600 dark:to-amber-700 rounded-lg flex items-center justify-center shadow-md">
                  <Activity className="w-5 h-5 text-emerald-800 dark:text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/60 dark:bg-slate-700/40 rounded-xl p-4 border border-stone-200/30 dark:border-stone-700/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-black text-stone-900 dark:text-stone-50">
                    {uniqueGenres}
                  </p>
                  <p className="text-xs font-medium text-stone-600 dark:text-stone-400 mt-1">
                    Genres Explored
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-600 dark:via-stone-600 dark:to-amber-700 rounded-lg flex items-center justify-center shadow-md">
                  <Sparkles className="w-5 h-5 text-emerald-800 dark:text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-600 dark:via-stone-600 dark:to-amber-700 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer" onClick={onNewProject}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-black text-emerald-800 dark:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                    New Project
                  </p>
                  <p className="text-xs font-medium text-emerald-700 dark:text-white/90 mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
                    Start your journey
                  </p>
                </div>
                <div className="w-10 h-10 bg-emerald-300/30 dark:bg-white/20 rounded-lg flex items-center justify-center">
                  <PlusCircle className="w-5 h-5 text-emerald-800 dark:text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center mb-6">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-600 dark:via-stone-600 dark:to-amber-700 rounded-lg flex items-center justify-center">
                <Search className="h-4 w-4 text-emerald-800 dark:text-white pointer-events-none" />
              </div>
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-14 pr-4 bg-white/80 dark:bg-stone-800/60 border-stone-300/30 dark:border-stone-700/30 rounded-2xl text-stone-900 dark:text-stone-100 placeholder:text-stone-500 dark:placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-300"
              />
            </div>

            {/* Sort Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-12 px-6 bg-gradient-to-r from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 dark:from-emerald-600 dark:via-stone-600 dark:to-amber-700 dark:hover:from-emerald-500 dark:hover:via-stone-500 dark:hover:to-amber-600 text-emerald-800 dark:text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {sortBy === 'updated' ? 'Recently Updated' : 
                   sortBy === 'created' ? 'Date Created' : 
                   sortBy === 'type' ? 'Type' :
                   'Name'}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                <DropdownMenuItem onClick={() => updateSortBy('name')}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateSortBy('updated')}>
                  <Clock className="w-4 h-4 mr-2" />
                  Recently Updated
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateSortBy('created')}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Date Created
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateSortBy('type')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Project Type
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Toggle */}
            <div className="flex items-center bg-white/80 dark:bg-stone-800/60 rounded-2xl p-1 border border-stone-300/30 dark:border-stone-700/30">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updateViewMode('grid')}
                className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-600 dark:via-stone-600 dark:to-amber-700 text-emerald-800 dark:text-white shadow-md' 
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updateViewMode('list')}
                className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-600 dark:via-stone-600 dark:to-amber-700 text-emerald-800 dark:text-white shadow-md' 
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Results Counter */}
          {searchTerm && (
            <div className="mb-4 text-center">
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Found <span className="font-semibold text-stone-900 dark:text-stone-100">{filteredProjects.length}</span> result{filteredProjects.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          {/* Projects Display */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-100/50 to-emerald-200/50 dark:from-emerald-600/20 dark:via-stone-600/20 dark:to-amber-700/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <PenTool className="w-12 h-12 text-stone-600 dark:text-stone-400" />
              </div>
              <h3 className="text-2xl font-black text-stone-900 dark:text-stone-50 mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-tight">
                {searchTerm ? 'No projects found' : 'Start Your First Story'}
              </h3>
              <p className="text-stone-800 dark:text-stone-200 mb-6 max-w-md mx-auto font-medium leading-[1.6] drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] tracking-wide">
                {searchTerm 
                  ? 'Try adjusting your search or create a new project.' 
                  : 'Every great story begins with a single idea. Start crafting your narrative today.'}
              </p>
              <Button 
                onClick={onNewProject}
                className="bg-gradient-to-r from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 dark:from-emerald-600 dark:via-stone-600 dark:to-amber-700 dark:hover:from-emerald-500 dark:hover:via-stone-500 dark:hover:to-amber-600 text-emerald-800 dark:text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Create New Project
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project: Project) => (
                <ProjectCard key={project.id} project={project} onSelect={onSelectProject} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProjects.map((project: Project) => (
                <ProjectListItem key={project.id} project={project} onSelect={onSelectProject} />
              ))}
            </div>
          )}
                </div>
              </div>
            );
          } else if (section.id === 'dashboard-widgets') {
            return (
              <div
                key={section.id}
                draggable={isEditMode}
                onDragStart={(e) => handleSectionDragStart(e, section.id)}
                onDragOver={(e) => handleSectionDragOver(e, section.id)}
                onDrop={(e) => handleSectionDrop(e, section.id)}
                onDragLeave={() => setDragOverSection(null)}
                className={`transition-all duration-300 mb-8 ${
                  isEditMode ? 'cursor-move' : ''
                } ${
                  dragOverSection === section.id && draggedSection !== section.id
                    ? 'ring-2 ring-amber-400 ring-opacity-50 scale-[1.02]'
                    : ''
                } ${
                  draggedSection === section.id ? 'opacity-50' : ''
                }`}
              >
                {isEditMode && (
                  <div className="flex items-center justify-center mb-2 opacity-50">
                    <GripVertical className="w-5 h-5 text-stone-600 dark:text-stone-400" />
                    <span className="ml-2 text-sm font-medium text-stone-600 dark:text-stone-400">Dashboard Widgets</span>
                  </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-6 lg:h-[600px]">
                  {dashboardWidgets.sort((a, b) => a.order - b.order).map((widget) => (
                    <div
                      key={widget.id}
                      draggable={isEditMode}
                      onDragStart={(e) => handleWidgetDragStart(e, widget.id)}
                      onDragOver={(e) => handleWidgetDragOver(e, widget.id)}
                      onDrop={(e) => handleWidgetDrop(e, widget.id)}
                      onDragLeave={() => setDragOverWidget(null)}
                      className={`transition-all duration-300 relative ${
                        isEditMode ? 'cursor-move' : ''
                      } ${
                        dragOverWidget === widget.id && draggedWidget !== widget.id
                          ? 'ring-2 ring-amber-400 ring-opacity-50 scale-[1.02]'
                          : ''
                      } ${
                        draggedWidget === widget.id ? 'opacity-50' : ''
                      }`}
                    >
                      {isEditMode && (
                        <div className="absolute top-2 right-2 z-10 bg-white/80 dark:bg-stone-800/80 rounded-lg p-1">
                          <GripVertical className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                        </div>
                      )}
                      {widget.id === 'daily-inspiration' && <MessageOfTheDay />}
                      {widget.id === 'recent-project' && (
                        projects.length > 0 ? (
            <Card className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-xl rounded-[2rem] shadow-xl border border-stone-300/30 dark:border-slate-700/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 h-full">
              <CardContent className="p-5 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-50 text-sm">Recent Project</h3>
                  <Badge className="bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-600 dark:via-stone-600 dark:to-amber-700 text-emerald-800 dark:text-white text-xs px-2 py-1 border-0">
                    Active
                  </Badge>
                </div>
                <div className="space-y-3 flex-grow">
                  <div>
                    <p className="font-semibold text-stone-900 dark:text-stone-100 text-sm truncate">{projects[0]?.name}</p>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">{projects[0]?.description || 'No description available'}</p>
                  </div>
                  
                  {/* Project Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500 dark:text-stone-400">Type:</span>
                      <span className="text-stone-700 dark:text-stone-300 font-medium">{projects[0]?.type || 'Creative Project'}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500 dark:text-stone-400">Genre:</span>
                      <span className="text-stone-700 dark:text-stone-300 font-medium">
                        {typeof projects[0]?.genre === 'string' ? projects[0].genre : 
                         (Array.isArray(projects[0]?.genre) && projects[0].genre[0]) || 'Unspecified'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500 dark:text-stone-400">Progress:</span>
                      <span className="text-emerald-600 font-medium">75% Complete</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                    <Clock className="w-3 h-3" />
                    <span>Updated {new Date(projects[0]?.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button 
                  size="sm"
                  onClick={() => onSelectProject(projects[0])}
                  className="brand-gradient-bg text-white hover:opacity-90 text-xs px-4 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg w-full mt-auto"
                >
                  Open Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-xl rounded-[2rem] shadow-xl border border-stone-300/30 dark:border-slate-700/20 h-full">
              <CardContent className="p-5 h-full flex flex-col justify-center">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 gradient-icon-container rounded-full flex items-center justify-center mx-auto">
                    <PlusCircle className="w-6 h-6 gradient-text" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 dark:text-stone-50 text-sm mb-2">No Projects Yet</h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mb-3">Create your first project to get started!</p>
                    <Button 
                      size="sm"
                      onClick={onNewProject}
                      className="brand-gradient-bg text-white hover:opacity-90 text-xs px-4 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg"
                    >
                      Create Project
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
                        )
                      )}
                      {widget.id === 'writing-progress' && (
                        <Card className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-xl rounded-[2rem] shadow-xl border border-stone-300/30 dark:border-slate-700/20 h-full">
            <CardContent className="p-5 h-full flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 gradient-icon-container rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 gradient-text" />
                  </div>
                  <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    Writing Progress
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={handleOpenGoalsModal}
                  className="brand-gradient-bg text-white hover:opacity-90 text-xs px-3 py-1 font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg"
                >
                  Set Goals
                </Button>
              </div>
              
              <div className="flex-grow space-y-3">
                {/* Daily Words */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-medium text-stone-700 dark:text-stone-300">Daily Words</p>
                    <p className="text-xs font-semibold">
                      <span className="icon-primary">{todayProgress.words}</span>
                      <span className="text-stone-500 dark:text-stone-400">/{actualGoals.dailyWords}</span>
                      <span className="text-stone-400 dark:text-stone-500 ml-1">({Math.round((todayProgress.words / actualGoals.dailyWords) * 100)}%)</span>
                    </p>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2">
                    <div className="gradient-progress h-2 rounded-full" style={{ width: `${Math.min((todayProgress.words / actualGoals.dailyWords) * 100, 100)}%` }}></div>
                  </div>
                </div>

                {/* Writing Time */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-medium text-stone-700 dark:text-stone-300">Writing Time</p>
                    <p className="text-xs font-semibold">
                      <span className="icon-primary">{todayProgress.minutes}</span>
                      <span className="text-stone-500 dark:text-stone-400">/{actualGoals.dailyMinutes} min</span>
                      <span className="text-stone-400 dark:text-stone-500 ml-1">({Math.round((todayProgress.minutes / actualGoals.dailyMinutes) * 100)}%)</span>
                    </p>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2">
                    <div className="gradient-progress h-2 rounded-full" style={{ width: `${Math.min((todayProgress.minutes / actualGoals.dailyMinutes) * 100, 100)}%` }}></div>
                  </div>
                </div>

                {/* Writing Streak */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-medium text-stone-700 dark:text-stone-300">Writing Streak</p>
                    <p className="text-xs font-semibold">
                      <span className="icon-primary">{todayProgress.currentStreak}</span>
                      <span className="text-stone-500 dark:text-stone-400">/{actualGoals.streakDays} days</span>
                      <span className="text-stone-400 dark:text-stone-500 ml-1">({Math.round((todayProgress.currentStreak / actualGoals.streakDays) * 100)}%)</span>
                    </p>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2">
                    <div className="gradient-progress h-2 rounded-full" style={{ width: `${Math.min((todayProgress.currentStreak / actualGoals.streakDays) * 100, 100)}%` }}></div>
                  </div>
                </div>

                {/* Divider line */}
                <div className="border-t border-stone-200/50 dark:border-stone-700/50 my-3"></div>

                {/* Compact Summary */}
                <div className="flex items-center justify-between text-[10px] text-stone-500 dark:text-stone-400">
                  <span>2 writing sessions today</span>
                  <span>Next milestone in {Math.max(0, actualGoals.dailyWords - todayProgress.words)} words</span>
                </div>
              </div>
            </CardContent>
          </Card>
                      )}
                      {widget.id === 'quick-tasks' && (
                        <Card className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-xl rounded-[2rem] shadow-xl border border-stone-300/30 dark:border-slate-700/20 h-full">
            <CardContent className="p-5 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <CheckCircle className="w-4 h-4 icon-primary" />
                <h3 className="font-bold text-stone-900 dark:text-stone-50 text-sm">
                  Quick Tasks
                </h3>
              </div>
              <div className="space-y-3 text-sm mb-5 flex-grow overflow-y-auto">
                {isLoadingTasks ? (
                  <div className="text-center text-stone-500 dark:text-stone-400 text-xs">Loading tasks...</div>
                ) : todayTasks.length === 0 ? (
                  <div className="text-center text-stone-500 dark:text-stone-400 text-xs">
                    <p className="mb-2">No tasks for today yet</p>
                    <Button
                      size="sm"
                      onClick={() => setShowTasksModal(true)}
                      className="brand-gradient-bg text-white hover:opacity-90 text-xs px-3 py-1"
                    >
                      Add Tasks
                    </Button>
                  </div>
                ) : (
                  todayTasks.slice(0, 3).map((task) => (
                    <div 
                      key={task.id} 
                      className="flex items-center gap-3 cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800 p-1 rounded-lg transition-colors duration-200"
                      onClick={() => toggleTaskCompletion(task)}
                    >
                      <Checkbox 
                        checked={task.status === 'completed'}
                        className="h-4 w-4"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className={`text-stone-700 dark:text-stone-300 ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                        {task.text}
                      </span>
                      {task.priority === 'high' && (
                        <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4">High</Badge>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="pt-3 border-t border-stone-200/50 dark:border-stone-700/50 mt-auto">
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
                  <span>Today's Progress</span>
                  <span>{todayTasks.filter(t => t.status === 'completed').length}/{todayTasks.length} completed</span>
                </div>
                <div className="w-full bg-stone-200 dark:bg-stone-600 rounded-full h-1.5 mb-3">
                  <div 
                    className="gradient-progress h-1.5 rounded-full" 
                    style={{ width: `${todayTasks.length > 0 ? (todayTasks.filter(t => t.status === 'completed').length / todayTasks.length * 100) : 0}%` }}
                  ></div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    onClick={() => setShowAddTaskModal(true)}
                    className="brand-gradient-bg text-white hover:opacity-90 text-xs px-4 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg flex-1"
                  >
                    Add Task
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => setShowTasksModal(true)}
                    className="brand-gradient-bg text-white hover:opacity-90 text-xs px-4 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg flex-1"
                  >
                    View All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Add Task Modal */}
      <Dialog open={showAddTaskModal} onOpenChange={setShowAddTaskModal}>
        <DialogContent className="max-w-md bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-[2rem] border border-stone-300/30 dark:border-slate-700/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 bg-clip-text text-transparent">
              Add New Task
            </DialogTitle>
            <DialogDescription className="text-stone-600 dark:text-stone-400">
              Create a task to track your writing progress
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Task Description
              </label>
              <Textarea
                placeholder="What do you need to do?"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="min-h-[100px] resize-none bg-stone-100/60 dark:bg-stone-900/40 border-stone-300 dark:border-stone-600 rounded-xl"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  Priority
                </label>
                <Select value={newTaskPriority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewTaskPriority(value)}>
                  <SelectTrigger className="bg-stone-100/60 dark:bg-stone-900/40 border-stone-300 dark:border-stone-600 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300 flex items-center justify-between">
                  <span>Estimated Time</span>
                  <span className="text-xs text-stone-500 dark:text-stone-400">{newTaskEstimatedTime} min</span>
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={newTaskEstimatedTime}
                    onChange={(e) => setNewTaskEstimatedTime(parseInt(e.target.value))}
                    className="w-full h-10 appearance-none bg-stone-200 dark:bg-stone-700 rounded-xl cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                      [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-emerald-600 [&::-webkit-slider-thumb]:to-amber-600 
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:border-0
                      [&::-moz-range-thumb]:bg-gradient-to-r [&::-moz-range-thumb]:from-emerald-600 [&::-moz-range-thumb]:to-amber-600 
                      [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleCreateTask}
                disabled={!newTaskText.trim()}
                className="flex-1 bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 hover:from-emerald-500 hover:via-stone-500 hover:to-amber-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
              >
                Add Task
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowAddTaskModal(false)}
                className="px-8 border-2 border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all duration-300 rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View All Tasks Modal */}
      <Dialog open={showTasksModal} onOpenChange={setShowTasksModal}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-[2rem] border border-stone-300/30 dark:border-slate-700/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 bg-clip-text text-transparent">
              Tasks & To-Do List
            </DialogTitle>
            <DialogDescription className="text-stone-600 dark:text-stone-400">
              Manage your writing tasks and track progress
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Today's Tasks */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-stone-700 dark:text-stone-300">Today's Tasks</h3>
                <span className="text-sm text-stone-500 dark:text-stone-400">
                  {todayTasks.filter(t => t.status === 'completed').length}/{todayTasks.length} completed
                </span>
              </div>
              
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {isLoadingTasks ? (
                  <div className="text-center py-8 text-sm text-stone-500">Loading tasks...</div>
                ) : todayTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-stone-500 dark:text-stone-400 mb-3">No tasks for today. Add one above!</p>
                    <Button
                      size="sm"
                      onClick={() => {
                        setShowTasksModal(false);
                        setShowAddTaskModal(true);
                      }}
                      className="bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 hover:from-emerald-500 hover:via-stone-500 hover:to-amber-600 text-white"
                    >
                      Add Your First Task
                    </Button>
                  </div>
                ) : (
                  todayTasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 p-4 bg-stone-100/60 dark:bg-stone-900/40 rounded-xl hover:bg-stone-100/80 dark:hover:bg-stone-900/60 transition-colors">
                      <Checkbox
                        checked={task.status === 'completed'}
                        onCheckedChange={() => toggleTaskCompletion(task)}
                        className="mt-0.5 h-5 w-5"
                      />
                      <div className="flex-grow">
                        <p className={`font-medium ${task.status === 'completed' ? 'line-through text-stone-400' : 'text-stone-700 dark:text-stone-300'}`}>
                          {task.text}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-stone-500 dark:text-stone-400">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {task.estimatedTime} min
                          </span>
                          {task.priority === 'high' && (
                            <Badge variant="destructive" className="text-xs">High Priority</Badge>
                          )}
                          {task.priority === 'medium' && (
                            <Badge variant="default" className="text-xs">Medium</Badge>
                          )}
                          {task.priority === 'low' && (
                            <Badge variant="secondary" className="text-xs">Low</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingTask(task);
                            setNewTaskText(task.text);
                            setNewTaskPriority(task.priority as 'low' | 'medium' | 'high');
                            setNewTaskEstimatedTime(task.estimatedTime || 30);
                            setShowTasksModal(false);
                            setShowAddTaskModal(true);
                          }}
                          className="h-8 w-8 p-0 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteTaskMutation.mutate(task.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Progress Summary */}
            <div className="bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-900/20 dark:to-amber-900/20 rounded-xl p-5">
              <h4 className="text-lg font-bold text-stone-700 dark:text-stone-300 mb-4">Weekly Progress</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-sm text-stone-600 dark:text-stone-400 mb-1">Tasks Completed</p>
                  <p className="text-3xl font-black text-emerald-600">{taskStats?.completedTasks || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-stone-600 dark:text-stone-400 mb-1">Completion Rate</p>
                  <p className="text-3xl font-black text-amber-600">{taskStats?.completionRate ? Math.round(taskStats.completionRate) : 0}%</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Goals Modal */}
      <Dialog open={showGoalsModal} onOpenChange={setShowGoalsModal}>
        <DialogContent className="max-w-md bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-[2rem] border border-stone-300/30 dark:border-slate-700/20">
          <DialogHeader>
            <DialogTitle className="text-lg font-black bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 bg-clip-text text-transparent">
              Set Writing Goals
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-600 dark:text-stone-400">
              Quick targets to keep you motivated
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-3">
            {/* Compact Goals Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/60 dark:bg-slate-700/40 rounded-xl">
                <label className="text-xs font-medium text-stone-700 dark:text-stone-300 block mb-1">
                  Daily Words
                </label>
                <Input 
                  type="number" 
                  placeholder="500" 
                  className="h-8 text-sm mb-2 bg-white/80 dark:bg-slate-800/60" 
                  value={tempGoals.dailyWords}
                  onChange={(e) => setTempGoals({...tempGoals, dailyWords: parseInt(e.target.value) || 0})}
                />
                <div className="w-full bg-stone-200 dark:bg-stone-600 rounded-full h-1.5">

                </div>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">{todayProgress.words}/{tempGoals.dailyWords} words</p>
              </div>
              
              <div className="p-3 bg-white/60 dark:bg-slate-700/40 rounded-xl">
                <label className="text-xs font-medium text-stone-700 dark:text-stone-300 block mb-1">
                  Daily Minutes
                </label>
                <Input 
                  type="number" 
                  placeholder="60" 
                  className="h-8 text-sm mb-2 bg-white/80 dark:bg-slate-800/60" 
                  value={tempGoals.dailyMinutes}
                  onChange={(e) => setTempGoals({...tempGoals, dailyMinutes: parseInt(e.target.value) || 0})}
                />
                <div className="w-full bg-stone-200 dark:bg-stone-600 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 h-1.5 rounded-full" style={{ width: `${Math.min((todayProgress.minutes / tempGoals.dailyMinutes) * 100, 100)}%` }}></div>
                </div>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">{todayProgress.minutes}/{tempGoals.dailyMinutes} mins</p>
              </div>
            </div>

            {/* Streak Goal Compact */}
            <div className="p-3 bg-white/60 dark:bg-slate-700/40 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                  Streak Goal
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-emerald-600">7</span>
                  <span className="text-xs text-stone-500">/</span>
                  <Input 
                    type="number" 
                    placeholder="30" 
                    className="w-14 h-7 text-center text-sm bg-white/80 dark:bg-slate-800/60" 
                    value={tempGoals.streakDays}
                    onChange={(e) => setTempGoals({...tempGoals, streakDays: parseInt(e.target.value) || 0})}
                  />
                  <span className="text-xs text-stone-500">days</span>
                </div>
              </div>
              <div className="w-full bg-stone-200 dark:bg-stone-600 rounded-full h-2">
                <div className="bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 h-2 rounded-full" style={{ width: `${Math.min((todayProgress.currentStreak / tempGoals.streakDays) * 100, 100)}%` }}></div>
              </div>
            </div>

            {/* Coming Soon Note */}
            <div className="p-3 bg-stone-100/60 dark:bg-stone-700/20 rounded-xl border border-dashed border-stone-300 dark:border-stone-600">
              <p className="text-xs text-stone-600 dark:text-stone-400 text-center">
                <span className="font-medium">Coming Soon:</span> Project-specific goals that sync with your stories
              </p>
            </div>

            {/* Compact Action Buttons */}
            <div className="flex gap-2 pt-3 border-t border-stone-200/50 dark:border-stone-700/50">
              <Button 
                size="sm"
                onClick={handleSaveGoals}
                className="flex-1 bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 hover:from-emerald-500 hover:via-stone-500 hover:to-amber-600 text-white text-xs font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg"
              >
                Save Goals
              </Button>
              <Button 
                size="sm"
                variant="outline"
                onClick={() => setShowGoalsModal(false)}
                className="px-4 border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all duration-300 text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Project Card Component
function ProjectCard({ project, onSelect }: { project: Project; onSelect: (project: Project) => void }) {
  const getProjectIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'novel': return BookOpen;
      case 'screenplay': return FileText;
      case 'graphic novel': return Image;
      default: return PenTool;
    }
  };

  const ProjectIcon = getProjectIcon(project.type || '');

  return (
    <Card 
      className="group bg-white/80 dark:bg-stone-900/40 backdrop-blur-xl border-stone-300/20 dark:border-stone-700/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 cursor-pointer overflow-hidden"
      onClick={() => onSelect(project)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 via-stone-600/5 to-amber-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardHeader className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 via-stone-600 to-amber-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <ProjectIcon className="w-7 h-7 text-white" />
          </div>
          <Badge className="bg-gradient-to-r from-emerald-100 to-amber-100 dark:from-emerald-600 dark:via-stone-600 dark:to-amber-700 text-stone-700 dark:text-white border-0">
            {typeof project.genre === 'string' ? project.genre : (Array.isArray(project.genre) && project.genre[0]) || 'Unspecified'}
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold text-stone-900 dark:text-stone-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
          {project.name}
        </CardTitle>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
          {project.type || 'Creative Project'}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-stone-700 dark:text-stone-300 text-sm mb-4 line-clamp-3">
          {project.description || 'No description available.'}
        </p>
        
        <div className="flex items-center text-xs text-stone-500 dark:text-stone-400">
          <Clock className="w-3 h-3 mr-1" />
          Updated {new Date(project.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}

// Project List Item Component
function ProjectListItem({ project, onSelect }: { project: Project; onSelect: (project: Project) => void }) {
  const getProjectIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'novel': return BookOpen;
      case 'screenplay': return FileText;
      case 'graphic novel': return Image;
      default: return PenTool;
    }
  };

  const ProjectIcon = getProjectIcon(project.type || '');

  return (
    <Card 
      className="group bg-white/80 dark:bg-stone-900/40 backdrop-blur-xl border-stone-300/20 dark:border-stone-700/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      onClick={() => onSelect(project)}
    >
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 via-stone-600 to-amber-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <ProjectIcon className="w-8 h-8 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
              {project.name}
            </h3>
            <p className="text-stone-600 dark:text-stone-400 text-sm">
              {project.type || 'Creative Project'}
            </p>
            <p className="text-stone-700 dark:text-stone-300 text-sm mt-1 line-clamp-1">
              {project.description || 'No description available.'}
            </p>
          </div>
          
          <div className="text-right space-y-2">
            <Badge className="bg-gradient-to-r from-emerald-100 to-amber-100 dark:from-emerald-600 dark:via-stone-600 dark:to-amber-700 text-stone-700 dark:text-white border-0">
              {typeof project.genre === 'string' ? project.genre : (Array.isArray(project.genre) && project.genre[0]) || 'Unspecified'}
            </Badge>
            <div className="flex items-center text-xs text-stone-500 dark:text-stone-400">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(project.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Global Application State
interface AppState {
  // UI State
  isLoading: boolean;
  guideMode: boolean;
  
  // User State
  user: {
    id?: string;
    username?: string;
    email?: string;
  } | null;
  
  // Current View
  currentView: 'landing' | 'auth' | 'projects' | 'dashboard';
  
  // Modal State
  modals: {
    projectCreation: boolean;
    projectEdit: boolean;
    confirmDelete: boolean;
    importManuscript: boolean;
    intelligentImport: boolean;
  };
  
  // Actions
  setLoading: (loading: boolean) => void;
  setGuideMode: (guide: boolean) => void;
  setUser: (user: AppState['user']) => void;
  setView: (view: AppState['currentView']) => void;
  openModal: (modal: keyof AppState['modals']) => void;
  closeModal: (modal: keyof AppState['modals']) => void;
  closeAllModals: () => void;
}

// Create the store with persistence
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      isLoading: false,
      guideMode: false,
      user: null,
      currentView: 'landing',
      modals: {
        projectCreation: false,
        projectEdit: false,
        confirmDelete: false,
        importManuscript: false,
        intelligentImport: false,
      },
      
      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setGuideMode: (guide) => set({ guideMode: guide }),
      setUser: (user) => set({ user }),
      setView: (view) => set({ currentView: view }),
      
      openModal: (modal) => set((state) => ({
        modals: { ...state.modals, [modal]: true }
      })),
      
      closeModal: (modal) => set((state) => ({
        modals: { ...state.modals, [modal]: false }
      })),
      
      closeAllModals: () => set({
        modals: {
          projectCreation: false,
          projectEdit: false,
          confirmDelete: false,
          importManuscript: false,
          intelligentImport: false,
        }
      }),
    }),
    {
      name: 'fablecraft-app-state',
      partialize: (state) => ({
        user: state.user,
        guideMode: state.guideMode,
      }),
    }
  )
);

// Project State Management
interface ProjectState {
  projects: any[];
  activeProject: any | null;
  projectToEdit: any | null;
  projectToDelete: any | null;
  
  // Loading states
  isLoadingProjects: boolean;
  
  // Actions
  setProjects: (projects: any[]) => void;
  addProject: (project: any) => void;
  updateProject: (project: any) => void;
  deleteProject: (projectId: string) => void;
  setActiveProject: (project: any) => void;
  setProjectToEdit: (project: any) => void;
  setProjectToDelete: (project: any) => void;
  setLoadingProjects: (loading: boolean) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      // Initial State
      projects: [],
      activeProject: null,
      projectToEdit: null,
      projectToDelete: null,
      isLoadingProjects: false,
      
      // Actions
      setProjects: (projects) => set({ projects }),
      
      addProject: (project) => set((state) => ({
        projects: [...state.projects, project]
      })),
      
      updateProject: (updatedProject) => set((state) => ({
        projects: state.projects.map(p => 
          p.id === updatedProject.id ? updatedProject : p
        ),
        activeProject: state.activeProject?.id === updatedProject.id 
          ? updatedProject 
          : state.activeProject
      })),
      
      deleteProject: (projectId) => set((state) => ({
        projects: state.projects.filter(p => p.id !== projectId),
        activeProject: state.activeProject?.id === projectId 
          ? null 
          : state.activeProject
      })),
      
      setActiveProject: (project) => set({ activeProject: project }),
      setProjectToEdit: (project) => set({ projectToEdit: project }),
      setProjectToDelete: (project) => set({ projectToDelete: project }),
      setLoadingProjects: (loading) => set({ isLoadingProjects: loading }),
    }),
    {
      name: 'fablecraft-project-state',
      partialize: (state) => ({
        projects: state.projects,
        activeProject: state.activeProject,
      }),
    }
  )
);

// Task & Goals State (if we want to centralize it)
interface TaskGoalsState {
  tasks: any[];
  goals: any;
  progress: any;
  
  // UI state
  showAddTaskModal: boolean;
  showTasksModal: boolean;
  showGoalsModal: boolean;
  
  // Actions
  setTasks: (tasks: any[]) => void;
  addTask: (task: any) => void;
  updateTask: (task: any) => void;
  deleteTask: (taskId: string) => void;
  setGoals: (goals: any) => void;
  setProgress: (progress: any) => void;
  setShowAddTaskModal: (show: boolean) => void;
  setShowTasksModal: (show: boolean) => void;
  setShowGoalsModal: (show: boolean) => void;
}

export const useTaskGoalsStore = create<TaskGoalsState>()(
  persist(
    (set, get) => ({
      // Initial State
      tasks: [],
      goals: {
        dailyWords: 500,
        dailyMinutes: 60,
        streakDays: 7,
      },
      progress: {
        words: 0,
        minutes: 0,
        currentStreak: 0,
      },
      showAddTaskModal: false,
      showTasksModal: false,
      showGoalsModal: false,
      
      // Actions
      setTasks: (tasks) => set({ tasks }),
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (updatedTask) => set((state) => ({
        tasks: state.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
      })),
      deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== taskId)
      })),
      setGoals: (goals) => set({ goals }),
      setProgress: (progress) => set({ progress }),
      setShowAddTaskModal: (show) => set({ showAddTaskModal: show }),
      setShowTasksModal: (show) => set({ showTasksModal: show }),
      setShowGoalsModal: (show) => set({ showGoalsModal: show }),
    }),
    {
      name: 'fablecraft-tasks-goals',
    }
  )
);

// Cache Management
interface CacheState {
  queryCache: Record<string, { data: any; timestamp: number; ttl: number }>;
  
  // Actions
  setCache: (key: string, data: any, ttl?: number) => void;
  getCache: (key: string) => any | null;
  clearCache: (key?: string) => void;
  clearExpiredCache: () => void;
}

export const useCacheStore = create<CacheState>((set, get) => ({
  queryCache: {},
  
  setCache: (key, data, ttl = 5 * 60 * 1000) => { // 5 minutes default
    set((state) => ({
      queryCache: {
        ...state.queryCache,
        [key]: {
          data,
          timestamp: Date.now(),
          ttl,
        },
      },
    }));
  },
  
  getCache: (key) => {
    const state = get();
    const cached = state.queryCache[key];
    
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      // Remove expired cache
      set((state) => {
        const newCache = { ...state.queryCache };
        delete newCache[key];
        return { queryCache: newCache };
      });
      return null;
    }
    
    return cached.data;
  },
  
  clearCache: (key) => {
    if (key) {
      set((state) => {
        const newCache = { ...state.queryCache };
        delete newCache[key];
        return { queryCache: newCache };
      });
    } else {
      set({ queryCache: {} });
    }
  },
  
  clearExpiredCache: () => {
    const state = get();
    const now = Date.now();
    const newCache: Record<string, any> = {};
    
    Object.entries(state.queryCache).forEach(([key, value]) => {
      if (now - value.timestamp <= value.ttl) {
        newCache[key] = value;
      }
    });
    
    set({ queryCache: newCache });
  },
}));

// Simple Performance Monitoring (Replit-Optimized)
interface PerformanceState {
  metrics: {
    pageLoadTime: number;
    errorCount: number;
    lastApiCall: { endpoint: string; time: number; timestamp: Date } | null;
  };
  
  // Actions
  recordPageLoad: (time: number) => void;
  recordApiCall: (endpoint: string, time: number) => void;
  recordError: (error?: string) => void;
  getMetrics: () => any;
  logPerformanceInfo: () => void;
}

export const usePerformanceStore = create<PerformanceState>((set, get) => ({
  metrics: {
    pageLoadTime: 0,
    errorCount: 0,
    lastApiCall: null,
  },
  
  recordPageLoad: (time) => {
    set((state) => ({
      metrics: { ...state.metrics, pageLoadTime: time }
    }));
    
    // Simple console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Page loaded in ${time}ms`);
    }
  },
  
  recordApiCall: (endpoint, time) => {
    const timestamp = new Date();
    set((state) => ({
      metrics: {
        ...state.metrics,
        lastApiCall: { endpoint, time, timestamp }
      }
    }));
    
    // Log slow API calls in development
    if (process.env.NODE_ENV === 'development' && time > 1000) {
      console.warn(`🐌 Slow API call: ${endpoint} took ${time}ms`);
    }
  },
  
  recordError: (error = 'Unknown error') => {
    set((state) => ({
      metrics: { ...state.metrics, errorCount: state.metrics.errorCount + 1 }
    }));
    
    // Simple error logging for development
    if (process.env.NODE_ENV === 'development') {
      console.error(`🚨 Error #${get().metrics.errorCount}: ${error}`);
    }
  },
  
  getMetrics: () => get().metrics,
  
  logPerformanceInfo: () => {
    const metrics = get().metrics;
    console.log('🎯 Fablecraft Performance Summary:', {
      'Page Load': `${metrics.pageLoadTime}ms`,
      'Errors': metrics.errorCount,
      'Last API Call': metrics.lastApiCall ? 
        `${metrics.lastApiCall.endpoint} (${metrics.lastApiCall.time}ms)` : 'None'
    });
  }
}));
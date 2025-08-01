import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * WIDGET TYPES
 * Define the structure for different widget types and their data
 */
export interface WidgetConfig {
  id: string
  type: 'recent-projects' | 'writing-goals' | 'todo-list' | 'ai-generations'
  title: string
  position: number
  isVisible: boolean
  data?: Record<string, unknown>
}

export interface Project {
  id: string
  title: string
  description?: string
  lastModified: string
  progress: number
  type: 'novel' | 'short-story' | 'screenplay' | 'poetry' | 'other'
}

export interface WritingGoal {
  id: string
  title: string
  targetWords: number
  currentWords: number
  deadline?: string
  isCompleted: boolean
}

export interface TodoItem {
  id: string
  text: string
  isCompleted: boolean
  createdAt: string
  priority: 'low' | 'medium' | 'high'
}

export interface AIGeneration {
  id: string
  prompt: string
  content: string
  createdAt: string
  type: 'character' | 'plot' | 'dialogue' | 'description'
}

/**
 * DASHBOARD STATE INTERFACE
 * Complete type definition for dashboard store state and actions
 */
interface DashboardState {
  // Widget Configuration
  widgets: WidgetConfig[]
  
  // Widget Data
  recentProjects: Project[]
  writingGoals: WritingGoal[]
  todoItems: TodoItem[]
  aiGenerations: AIGeneration[]
  
  // UI State
  isLoading: boolean
  error: string | null
  
  // Widget Actions
  updateWidgetVisibility: (widgetId: string, isVisible: boolean) => void
  reorderWidgets: (widgetIds: string[]) => void
  updateWidgetData: (widgetId: string, data: Record<string, unknown>) => void
  
  // Project Actions
  addProject: (project: Omit<Project, 'id'>) => void
  updateProject: (projectId: string, updates: Partial<Project>) => void
  removeProject: (projectId: string) => void
  
  // Writing Goal Actions
  addWritingGoal: (goal: Omit<WritingGoal, 'id'>) => void
  updateWritingGoal: (goalId: string, updates: Partial<WritingGoal>) => void
  removeWritingGoal: (goalId: string) => void
  
  // Todo Actions
  addTodoItem: (todo: Omit<TodoItem, 'id' | 'createdAt'>) => void
  toggleTodoItem: (todoId: string) => void
  removeTodoItem: (todoId: string) => void
  updateTodoItem: (todoId: string, updates: Partial<TodoItem>) => void
  
  // AI Generation Actions
  addAIGeneration: (generation: Omit<AIGeneration, 'id' | 'createdAt'>) => void
  removeAIGeneration: (generationId: string) => void
  
  // Utility Actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  resetDashboard: () => void
}

/**
 * DEFAULT WIDGET CONFIGURATION
 * Initial setup for dashboard widgets
 */
const defaultWidgets: WidgetConfig[] = [
  {
    id: 'recent-projects',
    type: 'recent-projects',
    title: 'Recent Projects',
    position: 0,
    isVisible: true,
  },
  {
    id: 'writing-goals',
    type: 'writing-goals',
    title: 'Writing Goals',
    position: 1,
    isVisible: true,
  },
  {
    id: 'todo-list',
    type: 'todo-list',
    title: 'To-Do List',
    position: 2,
    isVisible: true,
  },
  {
    id: 'ai-generations',
    type: 'ai-generations',
    title: 'AI Text Generations',
    position: 3,
    isVisible: true,
  },
]

/**
 * MOCK DATA GENERATORS
 * Generate realistic demo data for development and testing
 */
const generateMockProjects = (): Project[] => [
  {
    id: '1',
    title: 'The Enchanted Forest Chronicles',
    description: 'A fantasy epic about magical creatures and ancient prophecies',
    lastModified: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    progress: 65,
    type: 'novel',
  },
  {
    id: '2',
    title: 'Coffee Shop Conversations',
    description: 'Short stories inspired by overheard conversations',
    lastModified: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    progress: 30,
    type: 'short-story',
  },
  {
    id: '3',
    title: 'Midnight Reflections',
    description: 'A collection of poetry about late-night thoughts',
    lastModified: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
    progress: 80,
    type: 'poetry',
  },
]

const generateMockGoals = (): WritingGoal[] => [
  {
    id: '1',
    title: 'Daily Writing Streak',
    targetWords: 500,
    currentWords: 350,
    deadline: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    isCompleted: false,
  },
  {
    id: '2',
    title: 'Chapter 5 Draft',
    targetWords: 2500,
    currentWords: 1800,
    deadline: new Date(Date.now() + 604800000).toISOString(), // 1 week
    isCompleted: false,
  },
]

const generateMockTodos = (): TodoItem[] => [
  {
    id: '1',
    text: 'Research medieval architecture for world-building',
    isCompleted: false,
    createdAt: new Date().toISOString(),
    priority: 'high',
  },
  {
    id: '2',
    text: 'Edit chapter 3 dialogue',
    isCompleted: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    priority: 'medium',
  },
  {
    id: '3',
    text: 'Submit short story to literary magazine',
    isCompleted: false,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    priority: 'low',
  },
]

const generateMockAIGenerations = (): AIGeneration[] => [
  {
    id: '1',
    prompt: 'Describe a mysterious character entering a tavern',
    content: 'The hooded figure stepped through the tavern door, rain droplets cascading from their worn cloak. Every conversation ceased as boots clicked against the wooden floor, and the stranger\'s presence seemed to draw shadows closer...',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    type: 'character',
  },
  {
    id: '2',
    prompt: 'Create dialogue between two rivals meeting accidentally',
    content: '"Well, well. If it isn\'t my favorite failure." Sarah\'s voice dripped with mock sweetness.\n\n"Sarah." Marcus nodded curtly. "Still compensating for your lack of talent with that sharp tongue, I see."\n\n"At least I have something to compensate for."',
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    type: 'dialogue',
  },
]

/**
 * DASHBOARD STORE
 * 
 * Zustand store with localStorage persistence for managing dashboard state.
 * Features:
 * - Widget configuration and layout
 * - Project management
 * - Writing goals tracking
 * - Todo list functionality
 * - AI generation history
 * - Persistent user preferences
 */
export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      // Initial State
      widgets: defaultWidgets,
      recentProjects: generateMockProjects(),
      writingGoals: generateMockGoals(),
      todoItems: generateMockTodos(),
      aiGenerations: generateMockAIGenerations(),
      isLoading: false,
      error: null,

      // Widget Actions
      updateWidgetVisibility: (widgetId: string, isVisible: boolean) => {
        set((state) => ({
          widgets: state.widgets.map((widget) =>
            widget.id === widgetId ? { ...widget, isVisible } : widget
          ),
        }))
      },

      reorderWidgets: (widgetIds: string[]) => {
        set((state) => ({
          widgets: widgetIds.map((id, position) => {
            const widget = state.widgets.find((w) => w.id === id)
            return widget ? { ...widget, position } : widget
          }).filter(Boolean) as WidgetConfig[],
        }))
      },

      updateWidgetData: (widgetId: string, data: Record<string, unknown>) => {
        set((state) => ({
          widgets: state.widgets.map((widget) =>
            widget.id === widgetId ? { ...widget, data } : widget
          ),
        }))
      },

      // Project Actions
      addProject: (project: Omit<Project, 'id'>) => {
        const newProject: Project = {
          ...project,
          id: crypto.randomUUID(),
        }
        set((state) => ({
          recentProjects: [newProject, ...state.recentProjects],
        }))
      },

      updateProject: (projectId: string, updates: Partial<Project>) => {
        set((state) => ({
          recentProjects: state.recentProjects.map((project) =>
            project.id === projectId 
              ? { ...project, ...updates, lastModified: new Date().toISOString() }
              : project
          ),
        }))
      },

      removeProject: (projectId: string) => {
        set((state) => ({
          recentProjects: state.recentProjects.filter((project) => project.id !== projectId),
        }))
      },

      // Writing Goal Actions
      addWritingGoal: (goal: Omit<WritingGoal, 'id'>) => {
        const newGoal: WritingGoal = {
          ...goal,
          id: crypto.randomUUID(),
        }
        set((state) => ({
          writingGoals: [newGoal, ...state.writingGoals],
        }))
      },

      updateWritingGoal: (goalId: string, updates: Partial<WritingGoal>) => {
        set((state) => ({
          writingGoals: state.writingGoals.map((goal) =>
            goal.id === goalId ? { ...goal, ...updates } : goal
          ),
        }))
      },

      removeWritingGoal: (goalId: string) => {
        set((state) => ({
          writingGoals: state.writingGoals.filter((goal) => goal.id !== goalId),
        }))
      },

      // Todo Actions
      addTodoItem: (todo: Omit<TodoItem, 'id' | 'createdAt'>) => {
        const newTodo: TodoItem = {
          ...todo,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          todoItems: [newTodo, ...state.todoItems],
        }))
      },

      toggleTodoItem: (todoId: string) => {
        set((state) => ({
          todoItems: state.todoItems.map((todo) =>
            todo.id === todoId ? { ...todo, isCompleted: !todo.isCompleted } : todo
          ),
        }))
      },

      removeTodoItem: (todoId: string) => {
        set((state) => ({
          todoItems: state.todoItems.filter((todo) => todo.id !== todoId),
        }))
      },

      updateTodoItem: (todoId: string, updates: Partial<TodoItem>) => {
        set((state) => ({
          todoItems: state.todoItems.map((todo) =>
            todo.id === todoId ? { ...todo, ...updates } : todo
          ),
        }))
      },

      // AI Generation Actions
      addAIGeneration: (generation: Omit<AIGeneration, 'id' | 'createdAt'>) => {
        const newGeneration: AIGeneration = {
          ...generation,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          aiGenerations: [newGeneration, ...state.aiGenerations].slice(0, 20), // Keep only latest 20
        }))
      },

      removeAIGeneration: (generationId: string) => {
        set((state) => ({
          aiGenerations: state.aiGenerations.filter((gen) => gen.id !== generationId),
        }))
      },

      // Utility Actions
      setLoading: (isLoading: boolean) => {
        set({ isLoading })
      },

      setError: (error: string | null) => {
        set({ error, isLoading: false })
      },

      clearError: () => {
        set({ error: null })
      },

      resetDashboard: () => {
        set({
          widgets: defaultWidgets,
          recentProjects: generateMockProjects(),
          writingGoals: generateMockGoals(),
          todoItems: generateMockTodos(),
          aiGenerations: generateMockAIGenerations(),
          isLoading: false,
          error: null,
        })
      },
    }),
    {
      name: 'fablecraft-dashboard', // localStorage key
      storage: createJSONStorage(() => localStorage),
      
      // Only persist user preferences and data, exclude UI state
      partialize: (state) => ({
        widgets: state.widgets,
        recentProjects: state.recentProjects,
        writingGoals: state.writingGoals,
        todoItems: state.todoItems,
        aiGenerations: state.aiGenerations,
      }),

      // Handle state rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Clear any persisted loading or error states
          state.isLoading = false
          state.error = null
        }
      },
    }
  )
)

/**
 * DASHBOARD SELECTOR HOOKS
 * Convenient selectors for common dashboard state patterns
 */

// Get visible widgets sorted by position
export const useVisibleWidgets = () => 
  useDashboardStore((state) => 
    state.widgets
      .filter((widget) => widget.isVisible)
      .sort((a, b) => a.position - b.position)
  )

// Get recent projects
export const useRecentProjects = () => 
  useDashboardStore((state) => state.recentProjects)

// Get active writing goals
export const useActiveWritingGoals = () => 
  useDashboardStore((state) => 
    state.writingGoals.filter((goal) => !goal.isCompleted)
  )

// Get incomplete todos
export const useIncompleteTodos = () => 
  useDashboardStore((state) => 
    state.todoItems.filter((todo) => !todo.isCompleted)
  )

// Get recent AI generations
export const useRecentAIGenerations = () => 
  useDashboardStore((state) => 
    state.aiGenerations.slice(0, 6) // Latest 6 for rotation display
  )

// Get dashboard loading state
export const useDashboardLoading = () => 
  useDashboardStore((state) => state.isLoading)

// Get dashboard error state
export const useDashboardError = () => 
  useDashboardStore((state) => state.error)

/**
 * DASHBOARD UTILITIES
 * Helper functions for dashboard operations
 */

// Calculate overall writing progress
export const calculateOverallProgress = (projects: Project[]): number => {
  if (projects.length === 0) return 0
  const totalProgress = projects.reduce((sum, project) => sum + project.progress, 0)
  return Math.round(totalProgress / projects.length)
}

// Get writing streak data
export const getWritingStreak = (goals: WritingGoal[]): number => {
  // Simple implementation - in real app, this would be more sophisticated
  const completedGoals = goals.filter((goal) => goal.isCompleted)
  return completedGoals.length
}

// Export store actions for use outside components
export const dashboardActions = {
  updateWidgetVisibility: (widgetId: string, isVisible: boolean) => 
    useDashboardStore.getState().updateWidgetVisibility(widgetId, isVisible),
  reorderWidgets: (widgetIds: string[]) => 
    useDashboardStore.getState().reorderWidgets(widgetIds),
  addProject: (project: Omit<Project, 'id'>) => 
    useDashboardStore.getState().addProject(project),
  addWritingGoal: (goal: Omit<WritingGoal, 'id'>) => 
    useDashboardStore.getState().addWritingGoal(goal),
  addTodoItem: (todo: Omit<TodoItem, 'id' | 'createdAt'>) => 
    useDashboardStore.getState().addTodoItem(todo),
  addAIGeneration: (generation: Omit<AIGeneration, 'id' | 'createdAt'>) => 
    useDashboardStore.getState().addAIGeneration(generation),
  setLoading: (loading: boolean) => 
    useDashboardStore.getState().setLoading(loading),
  setError: (error: string | null) => 
    useDashboardStore.getState().setError(error),
  clearError: () => 
    useDashboardStore.getState().clearError(),
  resetDashboard: () => 
    useDashboardStore.getState().resetDashboard(),
}

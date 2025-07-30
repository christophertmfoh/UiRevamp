import { useState, useEffect, useCallback, useMemo } from 'react';

// Enhanced task interface with all smart features
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  estimatedMinutes: number;
  createdAt: string;
  completedAt?: string;
  category: 'writing' | 'editing' | 'research' | 'planning' | 'other';
  projectId?: string;
  dueDate?: string;
  recurring?: boolean;
  labels?: string[];
  location?: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface Goals {
  dailyWords: number;
  dailyMinutes: number;
  streakDays: number;
}

export interface Progress {
  words: number;
  minutes: number;
  currentStreak: number;
  lastUpdateDate: string;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  totalMinutes: number;
  averageCompletionTime: number;
  streak: number;
  todayFocus: string;
  weeklyTrend: number;
  productivityScore: number;
}

// Smart task suggestions based on writing context
const SMART_SUGGESTIONS = [
  { text: 'Write 500 words for current chapter', category: 'writing' as const, estimatedMinutes: 25, priority: 'high' as const },
  { text: 'Edit yesterday\'s writing', category: 'editing' as const, estimatedMinutes: 20, priority: 'medium' as const },
  { text: 'Research character background', category: 'research' as const, estimatedMinutes: 15, priority: 'medium' as const },
  { text: 'Outline next scene', category: 'planning' as const, estimatedMinutes: 10, priority: 'medium' as const },
  { text: 'Review plot consistency', category: 'editing' as const, estimatedMinutes: 30, priority: 'low' as const },
  { text: 'Develop character dialogue', category: 'writing' as const, estimatedMinutes: 20, priority: 'high' as const },
  { text: 'Research setting details', category: 'research' as const, estimatedMinutes: 25, priority: 'low' as const },
  { text: 'Plan chapter transitions', category: 'planning' as const, estimatedMinutes: 15, priority: 'medium' as const },
];

// Storage keys
const TASKS_STORAGE_KEY = 'unifiedTaskSystem_v1';
const GOALS_STORAGE_KEY = 'unifiedGoals_v1';
const PROGRESS_STORAGE_KEY = 'unifiedProgress_v1';
const PROJECTS_STORAGE_KEY = 'unifiedProjects_v1';

// Natural language parsing for smart task creation
const parseTaskInput = (input: string) => {
  const text = input.toLowerCase();
  
  // Priority detection
  let priority: 'low' | 'medium' | 'high' = 'medium';
  if (text.includes('urgent') || text.includes('important') || text.includes('asap')) priority = 'high';
  if (text.includes('low priority') || text.includes('when possible')) priority = 'low';
  
  // Time estimation
  let estimatedMinutes = 20; // default
  const timeMatch = text.match(/(\d+)\s*(min|minute|minutes|hour|hours|h)/);
  if (timeMatch) {
    const value = parseInt(timeMatch[1]!);
    const unit = timeMatch[2]!;
    estimatedMinutes = unit.startsWith('h') ? value * 60 : value;
  }
  
  // Category detection
  let category: Task['category'] = 'other';
  if (text.includes('write') || text.includes('draft') || text.includes('words')) category = 'writing';
  if (text.includes('edit') || text.includes('revise') || text.includes('review')) category = 'editing';
  if (text.includes('research') || text.includes('look up') || text.includes('study')) category = 'research';
  if (text.includes('plan') || text.includes('outline') || text.includes('organize')) category = 'planning';
  
  return { priority, estimatedMinutes, category };
};

// Utility functions
const isToday = (dateString: string) => {
  const today = new Date().toDateString();
  return new Date(dateString).toDateString() === today;
};

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
};

export function useTaskManagement() {
  // Core state
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goals>({ dailyWords: 500, dailyMinutes: 60, streakDays: 7 });
  const [progress, setProgress] = useState<Progress>({ words: 0, minutes: 0, currentStreak: 0, lastUpdateDate: '' });
  const [projects, setProjects] = useState<Project[]>([]);

  // UI state
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState('inbox');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Load data on mount
  useEffect(() => {
    setAllTasks(loadFromStorage(TASKS_STORAGE_KEY, []));
    setGoals(loadFromStorage(GOALS_STORAGE_KEY, { dailyWords: 500, dailyMinutes: 60, streakDays: 7 }));
    setProgress(loadFromStorage(PROGRESS_STORAGE_KEY, { words: 0, minutes: 0, currentStreak: 0, lastUpdateDate: '' }));
    setProjects(loadFromStorage(PROJECTS_STORAGE_KEY, [
      { id: 'inbox', name: 'Inbox', color: '#6B7280' },
      { id: 'writing', name: 'Writing', color: '#3B82F6' },
      { id: 'research', name: 'Research', color: '#10B981' }
    ]));
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    saveToStorage(TASKS_STORAGE_KEY, allTasks);
  }, [allTasks]);

  // Save goals whenever they change
  useEffect(() => {
    saveToStorage(GOALS_STORAGE_KEY, goals);
  }, [goals]);

  // Save progress whenever it changes
  useEffect(() => {
    saveToStorage(PROGRESS_STORAGE_KEY, progress);
  }, [progress]);

  // Save projects whenever they change
  useEffect(() => {
    saveToStorage(PROJECTS_STORAGE_KEY, projects);
  }, [projects]);

  // Computed values
  const todayTasks = useMemo(() => {
    return allTasks.filter(task => isToday(task.createdAt)).sort((a, b) => {
      // Sort by: incomplete first, then by priority, then by creation time
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [allTasks]);

  const overdueTasks = useMemo(() => {
    const today = new Date();
    return allTasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) < today && 
      !task.completed
    );
  }, [allTasks]);

  const upcomingTasks = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    return allTasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) >= today && 
      new Date(task.dueDate) <= nextWeek &&
      !task.completed
    ).sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
  }, [allTasks]);

  const taskStats: TaskStats = useMemo(() => {
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    const totalMinutes = allTasks
      .filter(t => t.completed)
      .reduce((sum, t) => sum + t.estimatedMinutes, 0);
    
    const averageCompletionTime = completedTasks > 0 ? totalMinutes / completedTasks : 0;
    
    // Calculate streak (consecutive days with completed tasks)
    const today = new Date().toDateString();
    const yesterdayCompleted = allTasks.some(t => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return new Date(t.createdAt).toDateString() === yesterday.toDateString() && t.completed;
    });
    const todayCompleted = allTasks.some(t => 
      new Date(t.createdAt).toDateString() === today && t.completed
    );
    
    const streak = todayCompleted ? (yesterdayCompleted ? 2 : 1) : 0;
    
    // Determine today's focus based on most common category
    const categoryCount = allTasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const todayFocus = Object.entries(categoryCount).sort(([,a], [,b]) => b - a)[0]?.[0] || 'writing';
    
    // Calculate weekly trend and productivity score
    const weeklyTrend = 0; // Simplified for now
    const productivityScore = Math.min(100, Math.round(completionRate + (streak * 5)));
    
    return {
      totalTasks,
      completedTasks,
      completionRate,
      totalMinutes,
      averageCompletionTime,
      streak,
      todayFocus,
      weeklyTrend,
      productivityScore
    };
  }, [allTasks]);

  const smartSuggestions = useMemo(() => {
    return SMART_SUGGESTIONS
      .filter(suggestion => !allTasks.some(task => 
        task.text.toLowerCase().includes(suggestion.text.toLowerCase().split(' ')[0]!)
      ))
      .slice(0, 3);
  }, [allTasks]);

  // Actions
  const createTask = useCallback((taskData: Partial<Task>) => {
    const parsed = taskData.text ? parseTaskInput(taskData.text) : { priority: 'medium' as const, estimatedMinutes: 20, category: 'other' as const };
    
    const newTask: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: taskData.text || '',
      completed: false,
      createdAt: new Date().toISOString(),
      priority: taskData.priority || parsed.priority,
      estimatedMinutes: taskData.estimatedMinutes || parsed.estimatedMinutes,
      category: taskData.category || parsed.category,
      projectId: taskData.projectId || selectedProject,
      ...taskData
    };

    setAllTasks(prev => [newTask, ...prev]);
    return newTask;
  }, [selectedProject]);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setAllTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setAllTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  const toggleTaskCompletion = useCallback((taskId: string) => {
    setAllTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const isCompleting = !task.completed;
        const updatedTask = {
          ...task,
          completed: isCompleting,
          completedAt: isCompleting ? new Date().toISOString() : undefined
        };

        // Update progress if task was completed
        if (isCompleting) {
          const estimatedMinutes = task.estimatedMinutes;
          setProgress(currentProgress => {
            const newProgress = {
              ...currentProgress,
              minutes: currentProgress.minutes + estimatedMinutes,
              lastUpdateDate: new Date().toDateString()
            };
            return newProgress;
          });
        }

        return updatedTask;
      }
      return task;
    }));
  }, []);

  const updateGoals = useCallback((newGoals: Goals) => {
    setGoals(newGoals);
  }, []);

  const updateProgress = useCallback((words: number = 0, minutes: number = 0) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        words: prev.words + words,
        minutes: prev.minutes + minutes,
        lastUpdateDate: new Date().toDateString()
      };
      return newProgress;
    });
  }, []);

  const createTaskFromSuggestion = useCallback((suggestion: typeof SMART_SUGGESTIONS[0]) => {
    return createTask({
      text: suggestion.text,
      priority: suggestion.priority,
      estimatedMinutes: suggestion.estimatedMinutes,
      category: suggestion.category
    });
  }, [createTask]);

  return {
    // Data
    allTasks,
    todayTasks,
    overdueTasks,
    upcomingTasks,
    goals,
    progress,
    projects,
    taskStats,
    smartSuggestions,
    
    // UI State
    showAddTaskModal,
    showTasksModal,
    showGoalsModal,
    selectedProject,
    editingTask,
    
    // Actions
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    updateGoals,
    updateProgress,
    createTaskFromSuggestion,
    
    // UI Actions
    setShowAddTaskModal,
    setShowTasksModal,
    setShowGoalsModal,
    setSelectedProject,
    setEditingTask,
    
    // Utilities
    parseTaskInput,
    isToday
  };
}
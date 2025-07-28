import { useState, useCallback, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

interface Task {
  id: string;
  text: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  estimatedTime: number;
  createdAt: string;
  completedAt?: string;
  projectId?: string;
}

interface Goals {
  dailyWords: number;
  dailyMinutes: number;
  streakDays: number;
}

interface Progress {
  words: number;
  minutes: number;
  currentStreak: number;
  lastUpdateDate: string;
}

interface TaskStats {
  completedTasks: number;
  totalTasks: number;
  completionRate: number;
  totalEstimatedTime: number;
  completedEstimatedTime: number;
}

// localStorage keys
const TASKS_STORAGE_KEY = 'fablecraft_tasks';
const GOALS_STORAGE_KEY = 'fablecraft_goals';
const PROGRESS_STORAGE_KEY = 'fablecraft_progress';

// Task persistence utilities
const loadTasksFromStorage = (): Task[] => {
  try {
    const saved = localStorage.getItem(TASKS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    return [];
  }
};

const saveTasksToStorage = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
};

const loadGoalsFromStorage = (): Goals => {
  try {
    const saved = localStorage.getItem(GOALS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      dailyWords: 500,
      dailyMinutes: 60,
      streakDays: 30
    };
  } catch (error) {
    console.error('Error loading goals from localStorage:', error);
    return {
      dailyWords: 500,
      dailyMinutes: 60,
      streakDays: 30
    };
  }
};

const saveGoalsToStorage = (goals: Goals): void => {
  try {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  } catch (error) {
    console.error('Error saving goals to localStorage:', error);
  }
};

const loadProgressFromStorage = (): Progress => {
  try {
    const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
    const today = new Date().toDateString();
    const defaultProgress = {
      words: 0,
      minutes: 0,
      currentStreak: 0,
      lastUpdateDate: today
    };
    
    if (!saved) return defaultProgress;
    
    const progress = JSON.parse(saved);
    
    // Reset daily progress if it's a new day
    if (progress.lastUpdateDate !== today) {
      return {
        ...progress,
        words: 0,
        minutes: 0,
        lastUpdateDate: today
      };
    }
    
    return progress;
  } catch (error) {
    console.error('Error loading progress from localStorage:', error);
    return {
      words: 0,
      minutes: 0,
      currentStreak: 0,
      lastUpdateDate: new Date().toDateString()
    };
  }
};

const saveProgressToStorage = (progress: Progress): void => {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress to localStorage:', error);
  }
};

// Utility functions
const isToday = (dateString: string): boolean => {
  const taskDate = new Date(dateString).toDateString();
  const today = new Date().toDateString();
  return taskDate === today;
};

const calculateTaskStats = (tasks: Task[]): TaskStats => {
  const todayTasks = tasks.filter(task => isToday(task.createdAt));
  const completedTasks = todayTasks.filter(task => task.status === 'completed');
  
  return {
    completedTasks: completedTasks.length,
    totalTasks: todayTasks.length,
    completionRate: todayTasks.length > 0 ? (completedTasks.length / todayTasks.length) * 100 : 0,
    totalEstimatedTime: todayTasks.reduce((sum, task) => sum + task.estimatedTime, 0),
    completedEstimatedTime: completedTasks.reduce((sum, task) => sum + task.estimatedTime, 0)
  };
};

interface UseTaskManagementReturn {
  // Modal states
  showAddTaskModal: boolean;
  showTasksModal: boolean;
  showGoalsModal: boolean;
  
  // Task form states
  newTaskText: string;
  newTaskPriority: 'low' | 'medium' | 'high';
  newTaskEstimatedTime: number;
  editingTask: Task | null;
  
  // Goals states
  tempGoals: Goals;
  todayProgress: Progress;
  
  // Data
  todayTasks: Task[];
  allTasks: Task[];
  isLoadingTasks: boolean;
  taskStats: TaskStats;
  
  // Actions
  setShowAddTaskModal: (show: boolean) => void;
  setShowTasksModal: (show: boolean) => void;
  setShowGoalsModal: (show: boolean) => void;
  setNewTaskText: (text: string) => void;
  setNewTaskPriority: (priority: 'low' | 'medium' | 'high') => void;
  setNewTaskEstimatedTime: (time: number) => void;
  setTempGoals: (goals: Goals) => void;
  
  // Handlers
  handleOpenGoalsModal: () => void;
  handleCreateTask: () => Promise<void>;
  handleEditTask: (task: Task) => void;
  handleSaveGoals: () => Promise<void>;
  handleToggleTaskCompletion: (task: Task) => Promise<void>;
  handleDeleteTask: (taskId: string) => Promise<void>;
  handleCloseAddTaskModal: () => void;
  handleCloseTasksModal: () => void;
  handleCloseGoalsModal: () => void;
  
  // Progress tracking
  updateProgress: (words?: number, minutes?: number) => void;
}

export function useTaskManagement(): UseTaskManagementReturn {
  // Modal states
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);

  // Task form states
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskEstimatedTime, setNewTaskEstimatedTime] = useState(30);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Data states
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  
  // Goals and progress states
  const [tempGoals, setTempGoals] = useState<Goals>(loadGoalsFromStorage);
  const [todayProgress, setTodayProgress] = useState<Progress>(loadProgressFromStorage);

  // Load tasks on mount
  useEffect(() => {
    const loadTasks = async () => {
      setIsLoadingTasks(true);
      try {
        const tasks = loadTasksFromStorage();
        setAllTasks(tasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setIsLoadingTasks(false);
      }
    };
    
    loadTasks();
  }, []);

  // Computed values
  const todayTasks = allTasks.filter(task => isToday(task.createdAt));
  const taskStats = calculateTaskStats(allTasks);

  // Task handlers
  const handleCreateTask = useCallback(async (): Promise<void> => {
    if (!newTaskText.trim()) return;

    if (editingTask) {
      // Update existing task
      const updatedTask: Task = {
        ...editingTask,
        text: newTaskText.trim(),
        priority: newTaskPriority,
        estimatedTime: newTaskEstimatedTime
      };

      const updatedTasks = allTasks.map(task => 
        task.id === editingTask.id ? updatedTask : task
      );
      setAllTasks(updatedTasks);
      saveTasksToStorage(updatedTasks);
    } else {
      // Create new task
      const newTask: Task = {
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: newTaskText.trim(),
        status: 'pending',
        priority: newTaskPriority,
        estimatedTime: newTaskEstimatedTime,
        createdAt: new Date().toISOString()
      };

      const updatedTasks = [...allTasks, newTask];
      setAllTasks(updatedTasks);
      saveTasksToStorage(updatedTasks);
    }

    // Reset form
    setNewTaskText('');
    setNewTaskPriority('medium');
    setNewTaskEstimatedTime(30);
    setEditingTask(null);
  }, [newTaskText, newTaskPriority, newTaskEstimatedTime, allTasks, editingTask]);

  const handleToggleTaskCompletion = useCallback(async (task: Task): Promise<void> => {
    const updatedTask: Task = {
      ...task,
      status: task.status === 'completed' ? 'pending' : 'completed',
      completedAt: task.status === 'completed' ? undefined : new Date().toISOString()
    };

    const updatedTasks = allTasks.map(t => t.id === task.id ? updatedTask : t);
    setAllTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);

    // Update progress if task was completed
    if (updatedTask.status === 'completed') {
      const estimatedMinutes = Math.round(updatedTask.estimatedTime);
      updateProgress(0, estimatedMinutes);
      
      // Update streak if completing a task for the first time today
      const todayCompletedTasks = updatedTasks.filter(t => 
        isToday(t.createdAt) && t.status === 'completed'
      );
      
      if (todayCompletedTasks.length === 1) {
        // First task completed today, potentially update streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();
        
        const yesterdayHadCompletedTasks = allTasks.some(t => 
          new Date(t.createdAt).toDateString() === yesterdayString && t.status === 'completed'
        );
        
        if (yesterdayHadCompletedTasks || todayProgress.currentStreak === 0) {
          const newProgress = {
            ...todayProgress,
            currentStreak: todayProgress.currentStreak + 1,
            lastUpdateDate: new Date().toDateString()
          };
          setTodayProgress(newProgress);
          saveProgressToStorage(newProgress);
        }
      }
    }
  }, [allTasks, todayProgress, updateProgress]);

  const handleDeleteTask = useCallback(async (taskId: string): Promise<void> => {
    const updatedTasks = allTasks.filter(task => task.id !== taskId);
    setAllTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  }, [allTasks]);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setNewTaskText(task.text);
    setNewTaskPriority(task.priority);
    setNewTaskEstimatedTime(task.estimatedTime);
    setShowAddTaskModal(true);
  }, []);

  const handleSaveGoals = useCallback(async (): Promise<void> => {
    saveGoalsToStorage(tempGoals);
  }, [tempGoals]);

  const handleOpenGoalsModal = useCallback(() => {
    setTempGoals(loadGoalsFromStorage());
    setShowGoalsModal(true);
  }, []);

  // Modal close handlers
  const handleCloseAddTaskModal = useCallback(() => {
    setShowAddTaskModal(false);
    setEditingTask(null);
    setNewTaskText('');
    setNewTaskPriority('medium');
    setNewTaskEstimatedTime(30);
  }, []);

  const handleCloseTasksModal = useCallback(() => {
    setShowTasksModal(false);
  }, []);

  const handleCloseGoalsModal = useCallback(() => {
    setShowGoalsModal(false);
    setTempGoals(loadGoalsFromStorage());
  }, []);

  // Progress tracking with smart insights
  const updateProgress = useCallback((words: number = 0, minutes: number = 0) => {
    const newProgress: Progress = {
      ...todayProgress,
      words: todayProgress.words + words,
      minutes: todayProgress.minutes + minutes,
      lastUpdateDate: new Date().toDateString()
    };

    setTodayProgress(newProgress);
    saveProgressToStorage(newProgress);
    
    // Check for milestone achievements
    const currentGoals = loadGoalsFromStorage();
    
    // Word milestone achieved
    if (todayProgress.words < currentGoals.dailyWords && newProgress.words >= currentGoals.dailyWords) {
      // This would trigger a celebration notification in a real app
      console.log('🎉 Daily word goal achieved!');
    }
    
    // Time milestone achieved
    if (todayProgress.minutes < currentGoals.dailyMinutes && newProgress.minutes >= currentGoals.dailyMinutes) {
      // This would trigger a celebration notification in a real app
      console.log('⏰ Daily time goal achieved!');
    }
  }, [todayProgress]);

  // Smart task suggestions based on completion patterns
  const getTaskSuggestions = useCallback((): string[] => {
    const commonTasks = [
      "Write opening scene for new chapter",
      "Edit previous chapter",
      "Research character background",
      "Outline next plot point",
      "Develop character dialogue",
      "Write character description",
      "Plan story arc",
      "Review and revise draft",
      "Create chapter outline",
      "Develop setting details"
    ];
    
    // Get tasks that haven't been used recently
    const recentTaskTexts = allTasks
      .filter(task => isToday(task.createdAt) || 
        new Date(task.createdAt).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000)) // Last 7 days
      .map(task => task.text.toLowerCase());
    
    return commonTasks.filter(task => 
      !recentTaskTexts.some(recent => recent.includes(task.toLowerCase().split(' ')[0]))
    ).slice(0, 3);
  }, [allTasks]);

  // Enhanced stats with insights
  const getTaskInsights = useCallback(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      
      const dayTasks = allTasks.filter(task => 
        new Date(task.createdAt).toDateString() === dateString
      );
      
      last7Days.push({
        date: dateString,
        total: dayTasks.length,
        completed: dayTasks.filter(t => t.status === 'completed').length,
        completionRate: dayTasks.length > 0 ? (dayTasks.filter(t => t.status === 'completed').length / dayTasks.length) * 100 : 0
      });
    }
    
    const avgCompletionRate = last7Days.reduce((sum, day) => sum + day.completionRate, 0) / 7;
    const totalTasksThisWeek = last7Days.reduce((sum, day) => sum + day.total, 0);
    const totalCompletedThisWeek = last7Days.reduce((sum, day) => sum + day.completed, 0);
    
    return {
      last7Days,
      avgCompletionRate,
      totalTasksThisWeek,
      totalCompletedThisWeek,
      streak: todayProgress.currentStreak,
      isImproving: last7Days.slice(-3).reduce((sum, day) => sum + day.completionRate, 0) / 3 > 
                   last7Days.slice(0, 3).reduce((sum, day) => sum + day.completionRate, 0) / 3
    };
  }, [allTasks, todayProgress]);

  return {
    // Modal states
    showAddTaskModal,
    showTasksModal,
    showGoalsModal,
    
    // Task form states
    newTaskText,
    newTaskPriority,
    newTaskEstimatedTime,
    editingTask,
    
    // Goals states
    tempGoals,
    todayProgress,
    
    // Data
    todayTasks,
    allTasks,
    isLoadingTasks,
    taskStats,
    
    // Actions
    setShowAddTaskModal,
    setShowTasksModal,
    setShowGoalsModal,
    setNewTaskText,
    setNewTaskPriority,
    setNewTaskEstimatedTime,
    setTempGoals,
    
    // Handlers
    handleOpenGoalsModal,
    handleCreateTask,
    handleEditTask,
    handleSaveGoals,
    handleToggleTaskCompletion,
    handleDeleteTask,
    handleCloseAddTaskModal,
    handleCloseTasksModal,
    handleCloseGoalsModal,
    
    // Progress tracking
    updateProgress,
    
    // Smart features
    getTaskSuggestions,
    getTaskInsights
  };
}
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
  dueDate?: string;
  recurring?: 'daily' | 'weekly' | 'monthly' | null;
  labels?: string[];
  location?: string;
}

interface Project {
  id: string;
  name: string;
  color: string;
  createdAt: string;
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
  weeklyTrend: number;
  productivityScore: number;
}

// localStorage keys
const TASKS_STORAGE_KEY = 'fablecraft_tasks';
const PROJECTS_STORAGE_KEY = 'fablecraft_projects';
const GOALS_STORAGE_KEY = 'fablecraft_goals';
const PROGRESS_STORAGE_KEY = 'fablecraft_progress';

// Natural Language Processing for task creation
const parseNaturalLanguage = (input: string): { text: string; dueDate?: string; priority?: 'low' | 'medium' | 'high'; estimatedTime?: number } => {
  let text = input.trim();
  let dueDate: string | undefined;
  let priority: 'low' | 'medium' | 'high' | undefined;
  let estimatedTime: number | undefined;

  // Parse due dates
  const datePatterns = [
    { pattern: /\btomorrow\b/i, offset: 1 },
    { pattern: /\btoday\b/i, offset: 0 },
    { pattern: /\bin (\d+) days?\b/i, offset: (match: RegExpMatchArray) => parseInt(match[1]) },
    { pattern: /\bin (\d+) weeks?\b/i, offset: (match: RegExpMatchArray) => parseInt(match[1]) * 7 },
    { pattern: /\bnext week\b/i, offset: 7 },
    { pattern: /\bmonda?y\b/i, offset: (today: Date) => (1 - today.getDay() + 7) % 7 || 7 },
    { pattern: /\btuesda?y\b/i, offset: (today: Date) => (2 - today.getDay() + 7) % 7 || 7 },
    { pattern: /\bwednesda?y\b/i, offset: (today: Date) => (3 - today.getDay() + 7) % 7 || 7 },
    { pattern: /\bthursda?y\b/i, offset: (today: Date) => (4 - today.getDay() + 7) % 7 || 7 },
    { pattern: /\bfrida?y\b/i, offset: (today: Date) => (5 - today.getDay() + 7) % 7 || 7 },
    { pattern: /\bsaturda?y\b/i, offset: (today: Date) => (6 - today.getDay() + 7) % 7 || 7 },
    { pattern: /\bsunda?y\b/i, offset: (today: Date) => (0 - today.getDay() + 7) % 7 || 7 },
  ];

  for (const { pattern, offset } of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      const today = new Date();
      const offsetDays = typeof offset === 'function' ? offset(today) : offset;
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + offsetDays);
      dueDate = targetDate.toISOString();
      text = text.replace(pattern, '').trim();
      break;
    }
  }

  // Parse priority
  if (/\b(urgent|important|high|!!)\b/i.test(text)) {
    priority = 'high';
    text = text.replace(/\b(urgent|important|high|!!)\b/i, '').trim();
  } else if (/\b(medium|normal|!)\b/i.test(text)) {
    priority = 'medium';
    text = text.replace(/\b(medium|normal|!)\b/i, '').trim();
  } else if (/\b(low|later)\b/i.test(text)) {
    priority = 'low';
    text = text.replace(/\b(low|later)\b/i, '').trim();
  }

  // Parse estimated time
  const timeMatch = text.match(/\b(\d+)\s*(min|minutes?|hrs?|hours?)\b/i);
  if (timeMatch) {
    const num = parseInt(timeMatch[1]);
    const unit = timeMatch[2].toLowerCase();
    estimatedTime = unit.startsWith('h') ? num * 60 : num;
    text = text.replace(timeMatch[0], '').trim();
  }

  // Clean up extra spaces
  text = text.replace(/\s+/g, ' ').trim();

  return { text, dueDate, priority, estimatedTime };
};

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

const loadProjectsFromStorage = (): Project[] => {
  try {
    const saved = localStorage.getItem(PROJECTS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [
      { id: 'inbox', name: 'Inbox', color: '#666666', createdAt: new Date().toISOString() },
      { id: 'writing', name: 'Writing', color: '#3b82f6', createdAt: new Date().toISOString() },
      { id: 'research', name: 'Research', color: '#10b981', createdAt: new Date().toISOString() }
    ];
  } catch (error) {
    console.error('Error loading projects from localStorage:', error);
    return [
      { id: 'inbox', name: 'Inbox', color: '#666666', createdAt: new Date().toISOString() },
      { id: 'writing', name: 'Writing', color: '#3b82f6', createdAt: new Date().toISOString() },
      { id: 'research', name: 'Research', color: '#10b981', createdAt: new Date().toISOString() }
    ];
  }
};

const saveProjectsToStorage = (projects: Project[]): void => {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving projects to localStorage:', error);
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

const isOverdue = (task: Task): boolean => {
  if (!task.dueDate) return false;
  return new Date(task.dueDate) < new Date() && task.status === 'pending';
};

const calculateTaskStats = (tasks: Task[]): TaskStats => {
  const todayTasks = tasks.filter(task => isToday(task.createdAt));
  const completedTasks = todayTasks.filter(task => task.status === 'completed');
  const overdueTasks = tasks.filter(isOverdue);
  
  // Calculate weekly trend
  const lastWeek = tasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return taskDate >= weekAgo && task.status === 'completed';
  });
  
  const weekBefore = tasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return taskDate >= twoWeeksAgo && taskDate < weekAgo && task.status === 'completed';
  });
  
  const weeklyTrend = weekBefore.length > 0 ? ((lastWeek.length - weekBefore.length) / weekBefore.length) * 100 : 0;
  
  // Calculate productivity score (0-100)
  const completionRate = todayTasks.length > 0 ? (completedTasks.length / todayTasks.length) * 100 : 0;
  const overduesPenalty = overdueTasks.length * 10;
  const productivityScore = Math.max(0, Math.min(100, completionRate - overduesPenalty));
  
  return {
    completedTasks: completedTasks.length,
    totalTasks: todayTasks.length,
    completionRate: todayTasks.length > 0 ? (completedTasks.length / todayTasks.length) * 100 : 0,
    totalEstimatedTime: todayTasks.reduce((sum, task) => sum + task.estimatedTime, 0),
    completedEstimatedTime: completedTasks.reduce((sum, task) => sum + task.estimatedTime, 0),
    weeklyTrend,
    productivityScore
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
  selectedProject: string;
  
  // Goals states
  tempGoals: Goals;
  todayProgress: Progress;
  
  // Data
  todayTasks: Task[];
  allTasks: Task[];
  projects: Project[];
  isLoadingTasks: boolean;
  taskStats: TaskStats;
  overdueTasks: Task[];
  upcomingTasks: Task[];
  
  // Actions
  setShowAddTaskModal: (show: boolean) => void;
  setShowTasksModal: (show: boolean) => void;
  setShowGoalsModal: (show: boolean) => void;
  setNewTaskText: (text: string) => void;
  setNewTaskPriority: (priority: 'low' | 'medium' | 'high') => void;
  setNewTaskEstimatedTime: (time: number) => void;
  setSelectedProject: (projectId: string) => void;
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
  handleCreateProject: (name: string, color: string) => Promise<void>;
  
  // Progress tracking
  updateProgress: (words?: number, minutes?: number) => void;
  
  // Smart features
  getTaskSuggestions: () => string[];
  getTaskInsights: () => any;
  parseTaskInput: (input: string) => { text: string; dueDate?: string; priority?: 'low' | 'medium' | 'high'; estimatedTime?: number };
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
  const [selectedProject, setSelectedProject] = useState('inbox');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Data states
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  
  // Goals and progress states
  const [tempGoals, setTempGoals] = useState<Goals>(loadGoalsFromStorage);
  const [todayProgress, setTodayProgress] = useState<Progress>(loadProgressFromStorage);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingTasks(true);
      try {
        const tasks = loadTasksFromStorage();
        const projectsData = loadProjectsFromStorage();
        setAllTasks(tasks);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoadingTasks(false);
      }
    };
    
    loadData();
  }, []);

  // Computed values
  const todayTasks = allTasks.filter(task => isToday(task.createdAt));
  const overdueTasks = allTasks.filter(isOverdue);
  const upcomingTasks = allTasks.filter(task => 
    task.dueDate && new Date(task.dueDate) > new Date() && task.status === 'pending'
  ).sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
  const taskStats = calculateTaskStats(allTasks);

  // Enhanced task creation with natural language processing
  const handleCreateTask = useCallback(async (): Promise<void> => {
    if (!newTaskText.trim()) return;

    if (editingTask) {
      // Update existing task
      const updatedTask: Task = {
        ...editingTask,
        text: newTaskText.trim(),
        priority: newTaskPriority,
        estimatedTime: newTaskEstimatedTime,
        projectId: selectedProject
      };

      const updatedTasks = allTasks.map(task => 
        task.id === editingTask.id ? updatedTask : task
      );
      setAllTasks(updatedTasks);
      saveTasksToStorage(updatedTasks);
    } else {
      // Parse natural language input
      const parsed = parseNaturalLanguage(newTaskText);
      
      // Create new task
      const newTask: Task = {
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: parsed.text,
        status: 'pending',
        priority: parsed.priority || newTaskPriority,
        estimatedTime: parsed.estimatedTime || newTaskEstimatedTime,
        createdAt: new Date().toISOString(),
        projectId: selectedProject,
        dueDate: parsed.dueDate,
      };

      const updatedTasks = [...allTasks, newTask];
      setAllTasks(updatedTasks);
      saveTasksToStorage(updatedTasks);
    }

    // Reset form
    setNewTaskText('');
    setNewTaskPriority('medium');
    setNewTaskEstimatedTime(30);
    setSelectedProject('inbox');
    setEditingTask(null);
  }, [newTaskText, newTaskPriority, newTaskEstimatedTime, selectedProject, allTasks, editingTask]);

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
    setSelectedProject(task.projectId || 'inbox');
    setShowAddTaskModal(true);
  }, []);

  const handleCreateProject = useCallback(async (name: string, color: string): Promise<void> => {
    const newProject: Project = {
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      color,
      createdAt: new Date().toISOString()
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    saveProjectsToStorage(updatedProjects);
  }, [projects]);

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
    setSelectedProject('inbox');
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
      console.log('🎉 Daily word goal achieved!');
    }
    
    // Time milestone achieved
    if (todayProgress.minutes < currentGoals.dailyMinutes && newProgress.minutes >= currentGoals.dailyMinutes) {
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

  const parseTaskInput = useCallback((input: string) => {
    return parseNaturalLanguage(input);
  }, []);

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
    selectedProject,
    
    // Goals states
    tempGoals,
    todayProgress,
    
    // Data
    todayTasks,
    allTasks,
    projects,
    isLoadingTasks,
    taskStats,
    overdueTasks,
    upcomingTasks,
    
    // Actions
    setShowAddTaskModal,
    setShowTasksModal,
    setShowGoalsModal,
    setNewTaskText,
    setNewTaskPriority,
    setNewTaskEstimatedTime,
    setSelectedProject,
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
    handleCreateProject,
    
    // Progress tracking
    updateProgress,
    
    // Smart features
    getTaskSuggestions,
    getTaskInsights,
    parseTaskInput
  };
}
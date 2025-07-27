import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

interface Task {
  id: string;
  text: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  estimatedTime: number;
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
}

interface TaskStats {
  completedTasks: number;
  completionRate: number;
}

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
  isLoadingTasks: boolean;
  taskStats: TaskStats | null;
  
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
  handleCreateTask: () => void;
  handleEditTask: (task: Task) => void;
  handleSaveGoals: () => void;
  handleToggleTaskCompletion: (task: Task) => void;
  handleDeleteTask: (taskId: string) => void;
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

  // Goals states - Load from localStorage with defaults
  const [tempGoals, setTempGoals] = useState<Goals>(() => {
    const saved = localStorage.getItem('writingGoals');
    return saved ? JSON.parse(saved) : {
      dailyWords: 500,
      dailyMinutes: 60,
      streakDays: 30
    };
  });

  // Mock progress data - replace with actual tracking
  const todayProgress: Progress = {
    words: 150,
    minutes: 25,
    currentStreak: 7
  };

  // Fetch tasks data
  const { data: todayTasks = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks', 'today'],
    queryFn: async () => {
      // Replace with actual API call
      return [] as Task[];
    },
  });

  // Fetch task stats
  const { data: taskStats = null } = useQuery({
    queryKey: ['tasks', 'stats'],
    queryFn: async () => {
      // Replace with actual API call
      return {
        completedTasks: 12,
        completionRate: 85
      } as TaskStats;
    },
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
      // Replace with actual API call
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      return newTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setNewTaskText('');
      setNewTaskPriority('medium');
      setNewTaskEstimatedTime(30);
      setEditingTask(null);
      setShowAddTaskModal(false);
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async (task: Task) => {
      // Replace with actual API call
      return task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      // Replace with actual API call
      return taskId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Handlers
  const handleOpenGoalsModal = useCallback(() => {
    const saved = localStorage.getItem('writingGoals');
    if (saved) {
      setTempGoals(JSON.parse(saved));
    }
    setShowGoalsModal(true);
  }, []);

  const handleCreateTask = useCallback(() => {
    if (!newTaskText.trim()) return;

    if (editingTask) {
      // Update existing task
      updateTaskMutation.mutate({
        ...editingTask,
        text: newTaskText,
        priority: newTaskPriority,
        estimatedTime: newTaskEstimatedTime
      });
    } else {
      // Create new task
      createTaskMutation.mutate({
        text: newTaskText,
        status: 'pending',
        priority: newTaskPriority,
        estimatedTime: newTaskEstimatedTime
      });
    }
  }, [newTaskText, newTaskPriority, newTaskEstimatedTime, editingTask, createTaskMutation, updateTaskMutation]);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setNewTaskText(task.text);
    setNewTaskPriority(task.priority);
    setNewTaskEstimatedTime(task.estimatedTime);
    setShowTasksModal(false);
    setShowAddTaskModal(true);
  }, []);

  const handleSaveGoals = useCallback(() => {
    localStorage.setItem('writingGoals', JSON.stringify(tempGoals));
    setShowGoalsModal(false);
  }, [tempGoals]);

  const handleToggleTaskCompletion = useCallback((task: Task) => {
    updateTaskMutation.mutate({
      ...task,
      status: task.status === 'completed' ? 'pending' : 'completed'
    });
  }, [updateTaskMutation]);

  const handleDeleteTask = useCallback((taskId: string) => {
    deleteTaskMutation.mutate(taskId);
  }, [deleteTaskMutation]);

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
  };
}
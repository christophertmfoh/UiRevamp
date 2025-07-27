import { apiRequest } from '@/lib/queryClient';
import type { Task, InsertTask, WritingGoal } from '@shared/schema';

// Task CRUD operations
export const taskService = {
  // Get all tasks for the current user
  async getTasks(): Promise<Task[]> {
    // Get token from localStorage
    const authState = localStorage.getItem('fablecraft-auth');
    const token = authState ? JSON.parse(authState).state.token : null;
    
    const response = await fetch('/api/tasks', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    
    return response.json();
  },

  // Get today's tasks
  async getTodayTasks(): Promise<Task[]> {
    // Get token from localStorage
    const authState = localStorage.getItem('fablecraft-auth');
    const token = authState ? JSON.parse(authState).state.token : null;
    
    const response = await fetch('/api/tasks/today', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch today tasks');
    }
    
    return response.json();
  },

  // Create a new task
  async createTask(task: Omit<InsertTask, 'userId'>): Promise<Task> {
    const response = await apiRequest('POST', '/api/tasks', task);
    return response.json();
  },

  // Update a task
  async updateTask(id: string, updates: Partial<InsertTask>): Promise<Task> {
    const response = await apiRequest('PATCH', `/api/tasks/${id}`, updates);
    return response.json();
  },

  // Delete a task
  async deleteTask(id: string): Promise<void> {
    await apiRequest('DELETE', `/api/tasks/${id}`);
  },

  // Get task statistics
  async getTaskStats(): Promise<{
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    completionRate: number;
  }> {
    // Get token from localStorage
    const authState = localStorage.getItem('fablecraft-auth');
    const token = authState ? JSON.parse(authState).state.token : null;
    
    const response = await fetch('/api/tasks/stats', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch task stats');
    }
    
    return response.json();
  },
};

// Writing goals operations
export const goalsService = {
  // Get writing goals
  async getGoals(): Promise<WritingGoal> {
    // Get token from localStorage
    const authState = localStorage.getItem('fablecraft-auth');
    const token = authState ? JSON.parse(authState).state.token : null;
    
    const response = await fetch('/api/tasks/goals', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch goals');
    }
    
    return response.json();
  },

  // Update writing goals
  async updateGoals(goals: {
    dailyWords: number;
    dailyMinutes: number;
    streakDays: number;
  }): Promise<WritingGoal> {
    const response = await apiRequest('POST', '/api/tasks/goals', goals);
    return response.json();
  },
};
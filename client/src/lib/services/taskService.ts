import { apiRequest } from '@/lib/queryClient';
import type { Task, InsertTask, WritingGoal } from '@shared/schema';
import { useAuth } from '@/hooks/useAuth';

// Helper to get auth token
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('auth_token');
  const headers: HeadersInit = new Headers();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
};

// Task CRUD operations
export const taskService = {
  // Get all tasks for the current user
  async getTasks(): Promise<Task[]> {
    const response = await fetch('/api/tasks', {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    
    return response.json();
  },

  // Get today's tasks
  async getTodayTasks(): Promise<Task[]> {
    const response = await fetch('/api/tasks/today', {
      headers: getAuthHeaders(),
      credentials: 'include',
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
    const response = await fetch('/api/tasks/stats', {
      headers: getAuthHeaders(),
      credentials: 'include',
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
    const response = await fetch('/api/tasks/goals', {
      headers: getAuthHeaders(),
      credentials: 'include',
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
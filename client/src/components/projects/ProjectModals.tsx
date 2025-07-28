import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToastActions } from '@/components/ui/Toast';
import { useFocusManagement, useScreenReader, useAriaAttributes, useTouchTargets } from '@/hooks/useAccessibility';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, Pencil, Trash2 } from 'lucide-react';

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

interface ProjectModalsProps {
  // Add Task Modal
  showAddTaskModal: boolean;
  onCloseAddTaskModal: () => void;
  newTaskText: string;
  setNewTaskText: (text: string) => void;
  newTaskPriority: 'low' | 'medium' | 'high';
  setNewTaskPriority: (priority: 'low' | 'medium' | 'high') => void;
  newTaskEstimatedTime: number;
  setNewTaskEstimatedTime: (time: number) => void;
  onCreateTask: () => void;
  editingTask: Task | null;

  // Tasks Modal
  showTasksModal: boolean;
  onCloseTasksModal: () => void;
  todayTasks: Task[];
  isLoadingTasks: boolean;
  taskStats: TaskStats | null;
  onToggleTaskCompletion: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;

  // Goals Modal
  showGoalsModal: boolean;
  onCloseGoalsModal: () => void;
  tempGoals: Goals;
  setTempGoals: (goals: Goals) => void;
  todayProgress: Progress;
  onSaveGoals: () => void;
}

export const ProjectModals = React.memo(function ProjectModals({
  // Add Task Modal props
  showAddTaskModal,
  onCloseAddTaskModal,
  newTaskText,
  setNewTaskText,
  newTaskPriority,
  setNewTaskPriority,
  newTaskEstimatedTime,
  setNewTaskEstimatedTime,
  onCreateTask,
  editingTask,

  // Tasks Modal props
  showTasksModal,
  onCloseTasksModal,
  todayTasks,
  isLoadingTasks,
  taskStats,
  onToggleTaskCompletion,
  onEditTask,
  onDeleteTask,

  // Goals Modal props
  showGoalsModal,
  onCloseGoalsModal,
  tempGoals,
  setTempGoals,
  todayProgress,
  onSaveGoals,
}: ProjectModalsProps) {
  const toast = useToastActions();
  const { trapFocus, restoreFocus } = useFocusManagement();
  const { announce } = useScreenReader();
  const { setAriaExpanded, setAriaLabel } = useAriaAttributes();
  const { validateTouchTargets } = useTouchTargets();

  // Enhanced handlers with toast notifications and optimistic updates
  const handleCreateTask = async () => {
    if (!newTaskText.trim()) return;

    try {
      // Optimistic update - immediately show task as created
      const optimisticTask = {
        id: `temp-${Date.now()}`,
        text: newTaskText,
        priority: newTaskPriority,
        estimatedTime: newTaskEstimatedTime,
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      };

      // Show loading toast
      const promise = onCreateTask();
      
      // Use toast promise wrapper for automatic loading/success/error handling
      await toast.promise(promise, {
        loading: editingTask ? 'Updating task...' : 'Creating task...',
        success: editingTask ? 'Task updated successfully!' : 'Task created successfully!',
        error: editingTask ? 'Failed to update task' : 'Failed to create task'
      });

      // Screen reader announcement
      announce(editingTask ? 'Task updated' : 'New task created', 'polite');
      onCloseAddTaskModal();
    } catch (error) {
      // Error is automatically handled by toast.promise
      console.error('Task creation failed:', error);
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      const isCompleting = newStatus === 'completed';
      
      // Optimistic update
      await toast.promise(onToggleTaskCompletion(taskId), {
        loading: isCompleting ? 'Completing task...' : 'Reopening task...',
        success: isCompleting ? '🎉 Task completed!' : 'Task reopened',
        error: isCompleting ? 'Failed to complete task' : 'Failed to reopen task'
      });

      // Screen reader announcement
      announce(isCompleting ? 'Task completed' : 'Task reopened', 'polite');
    } catch (error) {
      console.error('Task toggle failed:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await toast.promise(onDeleteTask(taskId), {
        loading: 'Deleting task...',
        success: 'Task deleted successfully',
        error: 'Failed to delete task'
      });
    } catch (error) {
      console.error('Task deletion failed:', error);
    }
  };

  const handleSaveGoals = async () => {
    try {
      await toast.promise(onSaveGoals(), {
        loading: 'Saving goals...',
        success: '🎯 Goals updated successfully!',
        error: 'Failed to save goals'
      });
      onCloseGoalsModal();
    } catch (error) {
      console.error('Goals save failed:', error);
    }
  };

  return (
    <>
      {/* Add Task Modal */}
      <ErrorBoundary isolate>
        <Dialog open={showAddTaskModal} onOpenChange={onCloseAddTaskModal}>
        <DialogContent className="max-w-md glass-card backdrop-blur-xl rounded-[2rem] border border-border/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-foreground">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </DialogTitle>
            <DialogDescription className="text-foreground">
              {editingTask ? 'Update your task details' : 'Create a task to track your writing progress'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">
                Task Description
              </label>
              <Textarea
                placeholder="What do you need to do?"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="min-h-[100px] resize-none surface-elevated border-border rounded-xl"
                aria-label="Task description"
                aria-describedby="task-description-help"
                required
              />
              <p id="task-description-help" className="text-xs text-muted-foreground mt-1">
                Enter a clear description of what you want to accomplish
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">
                  Priority
                </label>
                <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
                  <SelectTrigger className="surface-elevated border-border rounded-xl">
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
                <label className="text-sm font-medium text-foreground/80 flex items-center justify-between">
                  <span>Estimated Time</span>
                  <span className="text-xs text-black dark:text-white">{newTaskEstimatedTime} min</span>
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={newTaskEstimatedTime}
                    onChange={(e) => setNewTaskEstimatedTime(parseInt(e.target.value))}
                    className="w-full h-10 appearance-none bg-muted rounded-xl cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                      [&::-webkit-slider-thumb]:gradient-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:border-0
                      [&::-moz-range-thumb]:gradient-primary [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleCreateTask}
                disabled={!newTaskText.trim()}
                className="flex-1 gradient-primary hover:opacity-90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
              >
                {editingTask ? 'Update Task' : 'Add Task'}
              </Button>
              <Button 
                variant="outline"
                onClick={onCloseAddTaskModal}
                className="px-8 border-2 border-border text-foreground/80 hover:bg-accent/10 transition-all duration-300 rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </ErrorBoundary>

      {/* View All Tasks Modal */}
      <ErrorBoundary isolate>
        <Dialog open={showTasksModal} onOpenChange={onCloseTasksModal}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto glass-card backdrop-blur-xl rounded-[2rem] border border-border/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-foreground">
              Tasks & To-Do List
            </DialogTitle>
            <DialogDescription className="text-foreground">
              Manage your writing tasks and track progress
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Today's Tasks */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground/80">Today's Tasks</h3>
                <span className="text-sm text-muted-foreground">
                  {todayTasks.filter(t => t.status === 'completed').length}/{todayTasks.length} completed
                </span>
              </div>
              
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {isLoadingTasks ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">Loading tasks...</div>
                ) : todayTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground mb-3">No tasks for today. Add one above!</p>
                    <Button
                      size="sm"
                      onClick={() => {
                        onCloseTasksModal();
                        // This should trigger opening the add task modal from parent
                      }}
                      className="gradient-primary hover:opacity-90 text-primary-foreground"
                    >
                      Add Your First Task
                    </Button>
                  </div>
                ) : (
                  todayTasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 p-4 surface-muted rounded-xl hover:bg-accent/20 transition-colors">
                      <Checkbox
                        checked={task.status === 'completed'}
                        onCheckedChange={() => handleToggleTask(task.id, task.status)}
                        className="mt-0.5 h-5 w-5"
                      />
                      <div className="flex-grow">
                        <p className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground/70' : 'text-foreground/80'}`}>
                          {task.text}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-muted-foreground">
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
                          onClick={() => onEditTask(task)}
                          className="h-8 w-8 p-0 hover:bg-accent/20 rounded-lg"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteTask(task.id)}
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
            <div className="gradient-primary p-5 rounded-xl bg-opacity-10">
              <h4 className="text-lg font-bold text-foreground/80 mb-4">Weekly Progress</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-sm text-foreground mb-1">Tasks Completed</p>
                  <p className="text-3xl font-black text-primary">{taskStats?.completedTasks || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-foreground mb-1">Completion Rate</p>
                  <p className="text-3xl font-black text-black dark:text-white">{taskStats?.completionRate ? Math.round(taskStats.completionRate) : 0}%</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </ErrorBoundary>

      {/* Goals Modal */}
      <ErrorBoundary isolate>
        <Dialog open={showGoalsModal} onOpenChange={onCloseGoalsModal}>
        <DialogContent className="max-w-md glass-card backdrop-blur-xl rounded-[2rem] border border-border/30">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-foreground">
              Set Writing Goals
            </DialogTitle>
            <DialogDescription className="text-xs text-foreground">
              Quick targets to keep you motivated
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-3">
            {/* Compact Goals Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 surface-elevated rounded-xl">
                <label className="text-xs font-medium text-foreground/80 block mb-1">
                  Daily Words
                </label>
                <Input 
                  type="number" 
                  placeholder="500" 
                  className="h-8 text-sm mb-2 surface-elevated" 
                  value={tempGoals.dailyWords}
                  onChange={(e) => setTempGoals({...tempGoals, dailyWords: parseInt(e.target.value) || 0})}
                />
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className="gradient-primary h-1.5 rounded-full" style={{ width: `${Math.min((todayProgress.words / tempGoals.dailyWords) * 100, 100)}%` }}></div>
                </div>
                <p className="text-[10px] text-black dark:text-white mt-1">{todayProgress.words}/{tempGoals.dailyWords} words</p>
              </div>
              
              <div className="p-3 surface-elevated rounded-xl">
                <label className="text-xs font-medium text-foreground/80 block mb-1">
                  Daily Minutes
                </label>
                <Input 
                  type="number" 
                  placeholder="60" 
                  className="h-8 text-sm mb-2 surface-elevated" 
                  value={tempGoals.dailyMinutes}
                  onChange={(e) => setTempGoals({...tempGoals, dailyMinutes: parseInt(e.target.value) || 0})}
                />
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className="gradient-primary h-1.5 rounded-full" style={{ width: `${Math.min((todayProgress.minutes / tempGoals.dailyMinutes) * 100, 100)}%` }}></div>
                </div>
                <p className="text-[10px] text-black dark:text-white mt-1">{todayProgress.minutes}/{tempGoals.dailyMinutes} mins</p>
              </div>
            </div>

            {/* Streak Goal Compact */}
            <div className="p-3 surface-elevated rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-foreground/80">
                  Streak Goal
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-black dark:text-white">{todayProgress.currentStreak}</span>
                  <span className="text-xs text-black dark:text-white">/</span>
                  <Input 
                    type="number" 
                    placeholder="30" 
                    className="w-14 h-7 text-center text-sm surface-elevated" 
                    value={tempGoals.streakDays}
                    onChange={(e) => setTempGoals({...tempGoals, streakDays: parseInt(e.target.value) || 0})}
                  />
                  <span className="text-xs text-black dark:text-white">days</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="gradient-primary h-2 rounded-full" style={{ width: `${Math.min((todayProgress.currentStreak / tempGoals.streakDays) * 100, 100)}%` }}></div>
              </div>
            </div>

            {/* Coming Soon Note */}
            <div className="p-3 surface-muted rounded-xl border border-dashed border-border">
              <p className="text-xs text-foreground text-center">
                <span className="font-medium">Coming Soon:</span> Project-specific goals that sync with your stories
              </p>
            </div>

            {/* Compact Action Buttons */}
            <div className="flex gap-2 pt-3 border-t border-border/30">
              <Button 
                size="sm"
                onClick={handleSaveGoals}
                className="flex-1 gradient-primary hover:opacity-90 text-primary-foreground text-xs font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg"
              >
                Save Goals
              </Button>
              <Button 
                size="sm"
                variant="outline"
                onClick={onCloseGoalsModal}
                className="px-4 border border-border text-foreground/80 hover:bg-accent/10 transition-all duration-300 text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </ErrorBoundary>
    </>
  );
});
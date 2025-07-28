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
import { Clock, Pencil, Trash2, Plus, Calendar, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  estimatedTime: number;
  createdAt: string;
  dueDate?: string;
  projectId?: string;
}

interface Project {
  id: string;
  name: string;
  color: string;
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
  weeklyTrend: number;
  productivityScore: number;
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
  selectedProject: string;
  setSelectedProject: (projectId: string) => void;
  onCreateTask: () => Promise<void>;
  editingTask: Task | null;
  projects: Project[];

  // Tasks Modal
  showTasksModal: boolean;
  onCloseTasksModal: () => void;
  todayTasks: Task[];
  overdueTasks: Task[];
  upcomingTasks: Task[];
  isLoadingTasks: boolean;
  taskStats: TaskStats;
  onToggleTaskCompletion: (task: Task) => Promise<void>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => Promise<void>;

  // Goals Modal
  showGoalsModal: boolean;
  onCloseGoalsModal: () => void;
  tempGoals: Goals;
  setTempGoals: (goals: Goals) => void;
  todayProgress: Progress;
  onSaveGoals: () => Promise<void>;
  
  // Additional handlers
  onShowAddTaskModal: () => void;
  parseTaskInput: (input: string) => { text: string; dueDate?: string; priority?: 'low' | 'medium' | 'high'; estimatedTime?: number };
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
  selectedProject,
  setSelectedProject,
  onCreateTask,
  editingTask,
  projects,

  // Tasks Modal props
  showTasksModal,
  onCloseTasksModal,
  todayTasks,
  overdueTasks,
  upcomingTasks,
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
  
  // Additional handlers
  onShowAddTaskModal,
  parseTaskInput,
}: ProjectModalsProps) {
  const { toast, announce } = useToastActions();
  const { focusFirstElement } = useFocusManagement();
  const { addAriaAttributes } = useAriaAttributes();
  const { validateTouchTargets } = useTouchTargets();

  // Natural language preview state
  const [nlpPreview, setNlpPreview] = useState<{ text: string; dueDate?: string; priority?: 'low' | 'medium' | 'high'; estimatedTime?: number } | null>(null);

  // Update NLP preview when task text changes
  React.useEffect(() => {
    if (newTaskText.trim()) {
      const preview = parseTaskInput(newTaskText);
      setNlpPreview(preview);
    } else {
      setNlpPreview(null);
    }
  }, [newTaskText, parseTaskInput]);

  // Enhanced task creation handler with proper feedback
  const handleCreateTask = async () => {
    if (!newTaskText.trim()) {
      toast.error('Please enter a task description');
      return;
    }

    try {
      await onCreateTask();
      
      if (editingTask) {
        toast.success('Task updated successfully!');
        announce('Task updated');
      } else {
        toast.success('Task added successfully!');
        announce('New task added');
      }
      
      onCloseAddTaskModal();
    } catch (error) {
      console.error('Error creating/updating task:', error);
      toast.error('Failed to save task. Please try again.');
    }
  };

  // Enhanced task toggle handler with proper feedback
  const handleToggleTask = async (task: Task) => {
    try {
      await onToggleTaskCompletion(task);
      
      const action = task.status === 'completed' ? 'uncompleted' : 'completed';
      
      if (action === 'completed') {
        // Celebration for task completion
        const celebrations = [
          '🎉 Task completed! Great work!',
          '✅ Another one done! Keep it up!',
          '🚀 Task finished! You\'re on fire!',
          '⭐ Excellent! Task completed!',
          '💪 Well done! Task checked off!'
        ];
        const celebration = celebrations[Math.floor(Math.random() * celebrations.length)];
        toast.success(celebration);
        announce(`Task completed: ${task.text}`);
        
        // Check if this completes a milestone
        const remainingTasks = todayTasks.filter(t => t.id !== task.id && t.status === 'pending');
        if (remainingTasks.length === 0 && todayTasks.length > 1) {
          setTimeout(() => {
            toast.success('🏆 All tasks completed for today! Amazing work!', { duration: 5000 });
            announce('All daily tasks completed');
          }, 1000);
        }
      } else {
        toast.success('Task reopened');
        announce(`Task reopened: ${task.text}`);
      }
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update task. Please try again.');
    }
  };

  // Enhanced task deletion handler with confirmation
  const handleDeleteTask = async (taskId: string, taskText: string) => {
    if (!confirm(`Are you sure you want to delete "${taskText}"?`)) {
      return;
    }

    try {
      await onDeleteTask(taskId);
      toast.success('Task deleted successfully!');
      announce('Task deleted');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task. Please try again.');
    }
  };

  // Enhanced goals saving handler
  const handleSaveGoals = async () => {
    try {
      await onSaveGoals();
      toast.success('Goals updated successfully!');
      announce('Writing goals updated');
      onCloseGoalsModal();
    } catch (error) {
      console.error('Error saving goals:', error);
      toast.error('Failed to save goals. Please try again.');
    }
  };

  // Add task from empty state
  const handleAddTaskFromEmpty = () => {
    onCloseTasksModal();
    onShowAddTaskModal();
  };

  // Quick start with sample tasks
  const handleQuickStart = async () => {
    const sampleTasks = [
      {
        text: "Write opening paragraph for Chapter 1",
        priority: 'high' as const,
        estimatedTime: 25
      },
      {
        text: "Research character backstory",
        priority: 'medium' as const,
        estimatedTime: 15
      },
      {
        text: "Outline next scene",
        priority: 'low' as const,
        estimatedTime: 10
      }
    ];

    try {
      for (const taskData of sampleTasks) {
        setNewTaskText(taskData.text);
        setNewTaskPriority(taskData.priority);
        setNewTaskEstimatedTime(taskData.estimatedTime);
        await onCreateTask();
      }
      
      toast.success('Sample tasks created! Start completing them to track your progress.');
      announce('Sample writing tasks created');
      
      // Reset form after all tasks are created
      setNewTaskText('');
      setNewTaskPriority('medium');
      setNewTaskEstimatedTime(30);
      setSelectedProject('inbox');
    } catch (error) {
      console.error('Error creating sample tasks:', error);
      toast.error('Failed to create sample tasks. Please try again.');
    }
  };

  // Get priority badge variant
  const getPriorityBadge = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">High Priority</Badge>;
      case 'medium':
        return <Badge variant="default" className="text-xs">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary" className="text-xs">Low Priority</Badge>;
      default:
        return null;
    }
  };

  // Format due date for display
  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Check if task is overdue
  const isOverdue = (task: Task) => {
    return task.dueDate && new Date(task.dueDate) < new Date() && task.status === 'pending';
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
                placeholder="e.g., 'Write chapter outline tomorrow urgent 30 min'"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="min-h-[100px] resize-none surface-elevated border-border rounded-xl"
                aria-label="Task description"
                aria-describedby="task-description-help"
                required
              />
              <p id="task-description-help" className="text-xs text-muted-foreground mt-1">
                Use natural language: Try "tomorrow", "urgent", "30 min", etc.
              </p>
              
              {/* Natural Language Preview */}
              {nlpPreview && (nlpPreview.dueDate || nlpPreview.priority || nlpPreview.estimatedTime) && (
                <div className="p-3 bg-accent/10 rounded-lg border border-border/30">
                  <p className="text-xs font-medium text-foreground/80 mb-2">Smart Detection:</p>
                  <div className="flex flex-wrap gap-2">
                    {nlpPreview.dueDate && (
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDueDate(nlpPreview.dueDate)}
                      </Badge>
                    )}
                    {nlpPreview.priority && (
                      <Badge variant="outline" className="text-xs">
                        Priority: {nlpPreview.priority}
                      </Badge>
                    )}
                    {nlpPreview.estimatedTime && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {nlpPreview.estimatedTime} min
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">
                  Project
                </label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="surface-elevated border-border rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: project.color }}
                          />
                          {project.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">
                  Priority
                </label>
                <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
                  <SelectTrigger className="surface-elevated border-border rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto glass-card backdrop-blur-xl rounded-[2rem] border border-border/30">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-black text-foreground">
                  Tasks & To-Do List
                </DialogTitle>
                <DialogDescription className="text-foreground">
                  Manage your writing tasks and track progress
                </DialogDescription>
              </div>
              <Button
                onClick={onShowAddTaskModal}
                className="gradient-primary text-primary-foreground hover:opacity-90 text-sm px-4 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Productivity Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 surface-elevated rounded-xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground/80">Productivity Score</p>
                  <Badge variant={taskStats.productivityScore >= 80 ? "default" : taskStats.productivityScore >= 60 ? "secondary" : "destructive"} className="text-xs">
                    {Math.round(taskStats.productivityScore)}%
                  </Badge>
                </div>
              </div>
              <div className="p-4 surface-elevated rounded-xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground/80">Weekly Trend</p>
                  <div className="flex items-center gap-1">
                    {taskStats.weeklyTrend > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-xs text-foreground/80">
                      {taskStats.weeklyTrend > 0 ? '+' : ''}{Math.round(taskStats.weeklyTrend)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 surface-elevated rounded-xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground/80">Completion Rate</p>
                  <span className="text-sm font-bold text-black dark:text-white">
                    {Math.round(taskStats.completionRate)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Overdue Tasks Warning */}
            {overdueTasks.length > 0 && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <h4 className="font-medium text-destructive">Overdue Tasks ({overdueTasks.length})</h4>
                </div>
                <div className="space-y-2">
                  {overdueTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-2 bg-background/50 rounded-lg">
                      <Checkbox
                        checked={false}
                        onCheckedChange={() => handleToggleTask(task)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm text-foreground/80 flex-1">{task.text}</span>
                      <Badge variant="destructive" className="text-xs">
                        Due {formatDueDate(task.dueDate!)}
                      </Badge>
                    </div>
                  ))}
                  {overdueTasks.length > 3 && (
                    <p className="text-xs text-muted-foreground">+{overdueTasks.length - 3} more overdue tasks</p>
                  )}
                </div>
              </div>
            )}

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
                    <p className="text-sm text-muted-foreground mb-3">No tasks for today. Add one to get started!</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={handleAddTaskFromEmpty}
                        className="gradient-primary hover:opacity-90 text-primary-foreground text-sm px-6 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-xl"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Task
                      </Button>
                      <Button
                        onClick={handleQuickStart}
                        variant="outline"
                        className="border-border text-foreground hover:bg-accent/10 text-sm px-6 py-2 font-medium transition-all duration-300 rounded-xl"
                      >
                        🚀 Quick Start (3 sample tasks)
                      </Button>
                    </div>
                  </div>
                ) : (
                  todayTasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 p-4 surface-muted rounded-xl hover:bg-accent/20 transition-colors">
                      <Checkbox
                        checked={task.status === 'completed'}
                        onCheckedChange={() => handleToggleTask(task)}
                        className="mt-0.5 h-5 w-5"
                      />
                      <div className="flex-grow">
                        <p className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground/70' : 'text-foreground/80'}`}>
                          {task.text}
                        </p>
                        <div className="flex items-center gap-4 mt-2 flex-wrap">
                          <span className="text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {task.estimatedTime} min
                          </span>
                          {task.dueDate && (
                            <Badge variant={isOverdue(task) ? "destructive" : "outline"} className="text-xs">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDueDate(task.dueDate)}
                            </Badge>
                          )}
                          {getPriorityBadge(task.priority)}
                          {task.projectId && task.projectId !== 'inbox' && (
                            <Badge variant="outline" className="text-xs">
                              {projects.find(p => p.id === task.projectId)?.name || 'Unknown'}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEditTask(task)}
                          className="h-8 w-8 p-0 hover:bg-accent/20 rounded-lg"
                          title="Edit task"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteTask(task.id, task.text)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          title="Delete task"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Upcoming Tasks */}
            {upcomingTasks.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-foreground/80">Upcoming Tasks</h3>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {upcomingTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 surface-muted rounded-lg">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground/80 flex-1">{task.text}</span>
                      <Badge variant="outline" className="text-xs">
                        {formatDueDate(task.dueDate!)}
                      </Badge>
                    </div>
                  ))}
                  {upcomingTasks.length > 5 && (
                    <p className="text-xs text-muted-foreground text-center">+{upcomingTasks.length - 5} more upcoming tasks</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      </ErrorBoundary>

      {/* Goals Modal - keeping existing implementation */}
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
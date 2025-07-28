import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToastActions } from '@/components/ui/Toast';
import { useFocusManagement, useScreenReader, useAriaAttributes, useTouchTargets } from '@/hooks/useAccessibility';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useTaskManagement, type Task, type Project } from '@/hooks/useTaskManagement';
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

interface ProjectModalsProps {
  // Simplified props - only UI control needed
  projects: Project[];
}

export const ProjectModals = React.memo(function ProjectModals({
  projects
}: ProjectModalsProps) {
  
  // Use centralized task management
  const {
    // Data
    allTasks,
    todayTasks,
    overdueTasks,
    upcomingTasks,
    goals,
    progress,
    taskStats,
    
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
    
    // UI Actions
    setShowAddTaskModal,
    setShowTasksModal,
    setShowGoalsModal,
    setSelectedProject,
    setEditingTask,
    
    // Utilities
    parseTaskInput
  } = useTaskManagement();

  // Local UI state for form inputs
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskEstimatedTime, setNewTaskEstimatedTime] = useState(30);
  const [tempGoals, setTempGoals] = useState(goals);
  const [nlpPreview, setNlpPreview] = useState<any>(null);

  // Toast for user feedback
  const toast = useToastActions();

  // Accessibility hooks
  const { trapFocus } = useFocusManagement();
  const { announce } = useScreenReader();
  const { setAriaLabel, setAriaDescribedBy } = useAriaAttributes();
  const { validateTouchTarget } = useTouchTargets();

  // Update tempGoals when goals change
  React.useEffect(() => {
    setTempGoals(goals);
  }, [goals]);

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
      if (editingTask) {
        // Update existing task
        updateTask(editingTask.id, {
          text: newTaskText.trim(),
          priority: newTaskPriority,
          estimatedMinutes: newTaskEstimatedTime,
          projectId: selectedProject
        });
        announce('Task updated successfully');
        toast.success('Task updated successfully');
      } else {
        // Create new task
        createTask({
          text: newTaskText.trim(),
          priority: newTaskPriority,
          estimatedMinutes: newTaskEstimatedTime,
          projectId: selectedProject
        });
        announce('Task created successfully');
        toast.success('Task created successfully');
      }

      // Reset form
      setNewTaskText('');
      setNewTaskPriority('medium');
      setNewTaskEstimatedTime(30);
      setEditingTask(null);
      setShowAddTaskModal(false);
    } catch (error) {
      const message = editingTask ? 'Failed to update task' : 'Failed to create task';
      toast.error(message);
      console.error(message, error);
    }
  };

  // Enhanced task toggle with feedback
  const handleToggleTask = async (task: Task) => {
    try {
      toggleTaskCompletion(task.id);
      const message = task.completed ? 'Task marked as incomplete' : 'Task completed';
      announce(message);
    } catch (error) {
      toast.error('Failed to update task');
      console.error('Failed to toggle task:', error);
    }
  };

  // Enhanced task deletion with confirmation
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      deleteTask(taskId);
      announce('Task deleted');
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
      console.error('Failed to delete task:', error);
    }
  };

  // Enhanced goals saving with feedback
  const handleSaveGoals = async () => {
    try {
      updateGoals(tempGoals);
      announce('Goals updated successfully');
      toast.success('Goals updated successfully');
      setShowGoalsModal(false);
    } catch (error) {
      toast.error('Failed to save goals');
      console.error('Failed to save goals:', error);
    }
  };

  // Handle opening Add Task Modal
  const handleOpenAddTaskModal = () => {
    setNewTaskText('');
    setNewTaskPriority('medium');
    setNewTaskEstimatedTime(30);
    setEditingTask(null);
    setSelectedProject('inbox');
    setShowAddTaskModal(true);
  };

  // Handle editing a task
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTaskText(task.text);
    setNewTaskPriority(task.priority);
    setNewTaskEstimatedTime(task.estimatedMinutes);
    setSelectedProject(task.projectId || 'inbox');
    setShowAddTaskModal(true);
  };

  // Close modal handlers
  const handleCloseAddTaskModal = () => {
    setShowAddTaskModal(false);
    setEditingTask(null);
    setNewTaskText('');
    setNewTaskPriority('medium');
    setNewTaskEstimatedTime(30);
    setNlpPreview(null);
  };

  const handleCloseTasksModal = () => {
    setShowTasksModal(false);
  };

  const handleCloseGoalsModal = () => {
    setShowGoalsModal(false);
    setTempGoals(goals); // Reset to current goals
  };

  // Utility functions
  const formatDueDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isOverdue = (task: Task) => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date() && !task.completed;
  };

  return (
    <>
      {/* Add Task Modal */}
      <ErrorBoundary isolate>
        <Dialog open={showAddTaskModal} onOpenChange={setShowAddTaskModal}>
          <DialogContent className="glass-card border-border/30 max-w-md mx-auto shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-foreground text-lg font-bold">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                {editingTask ? 'Update your task details' : 'Create a new task to track your progress'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Task Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Task Description</label>
                <Textarea
                  placeholder="What needs to be done? (e.g., 'Write 500 words - 30 min')"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="resize-none min-h-[80px] bg-background/80 border-border/50 focus:border-primary/50"
                  aria-label="Task description"
                  aria-describedby="task-description-help"
                  required
                />
              </div>

              {/* Smart Detection Preview */}
              {nlpPreview && (
                <div className="bg-accent/5 border border-border/30 rounded-lg p-3 space-y-2">
                  <p className="text-xs font-medium text-foreground/80">Smart Detection:</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Priority: {nlpPreview.priority}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Time: {nlpPreview.estimatedMinutes}min
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Category: {nlpPreview.category}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Project Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Project</label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="bg-background/80 border-border/50">
                    <SelectValue placeholder="Select a project" />
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

              {/* Priority and Time Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Priority</label>
                  <Select value={newTaskPriority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewTaskPriority(value)}>
                    <SelectTrigger className="bg-background/80 border-border/50">
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
                  <label className="text-sm font-medium text-foreground">Estimated Time (min)</label>
                  <Input
                    type="number"
                    min="5"
                    max="480"
                    step="5"
                    value={newTaskEstimatedTime}
                    onChange={(e) => setNewTaskEstimatedTime(parseInt(e.target.value) || 30)}
                    className="bg-background/80 border-border/50"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleCreateTask}
                disabled={!newTaskText?.trim()}
                className="flex-1 gradient-primary hover:opacity-90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
              >
                {editingTask ? 'Update Task' : 'Add Task'}
              </Button>
              <Button 
                variant="outline"
                onClick={handleCloseAddTaskModal}
                className="border-border text-foreground hover:bg-accent/10"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </ErrorBoundary>

      {/* View All Tasks Modal */}
      <ErrorBoundary isolate>
        <Dialog open={showTasksModal} onOpenChange={setShowTasksModal}>
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
                  onClick={handleOpenAddTaskModal}
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
                          checked={task.completed}
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
                    {todayTasks.filter(t => t.completed).length}/{todayTasks.length} completed
                  </span>
                </div>
                
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {/* Assuming isLoadingTasks is no longer needed or handled by useTaskManagement */}
                  {todayTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground mb-3">No tasks for today. Add one to get started!</p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                          onClick={handleOpenAddTaskModal}
                          className="gradient-primary hover:opacity-90 text-primary-foreground text-sm px-6 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-xl"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Task
                        </Button>
                        <Button
                          onClick={() => {
                            // This button is for quick start, but the newTaskText state is removed.
                            // For now, it will just open the add task modal with default values.
                            handleOpenAddTaskModal();
                            setNewTaskText('Write 500 words - 30 min'); // Set a default for quick start
                            setNewTaskPriority('medium');
                            setNewTaskEstimatedTime(30);
                          }}
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
                          checked={task.completed}
                          onCheckedChange={() => handleToggleTask(task)}
                          className="mt-0.5 h-5 w-5"
                        />
                        <div className="flex-grow">
                          <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground/70' : 'text-foreground/80'}`}>
                            {task.text}
                          </p>
                          <div className="flex items-center gap-4 mt-2 flex-wrap">
                            <span className="text-xs text-muted-foreground">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {task.estimatedMinutes} min
                            </span>
                            {task.dueDate && (
                              <Badge variant={isOverdue(task) ? "destructive" : "outline"} className="text-xs">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDueDate(task.dueDate)}
                              </Badge>
                            )}
                            <Badge variant={
                              task.priority === 'high' ? 'destructive' : 
                              task.priority === 'medium' ? 'default' : 
                              'secondary'
                            }>
                              {task.priority}
                            </Badge>
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
                            onClick={() => handleEditTask(task)}
                            className="h-8 w-8 p-0 hover:bg-accent/20 rounded-lg"
                            title="Edit task"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteTask(task.id)}
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
        <Dialog open={showGoalsModal} onOpenChange={setShowGoalsModal}>
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
                    <div className="gradient-primary h-1.5 rounded-full" style={{ width: `${Math.min((progress.words / tempGoals.dailyWords) * 100, 100)}%` }}></div>
                  </div>
                  <p className="text-[10px] text-black dark:text-white mt-1">{progress.words}/{tempGoals.dailyWords} words</p>
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
                    <div className="gradient-primary h-1.5 rounded-full" style={{ width: `${Math.min((progress.minutes / tempGoals.dailyMinutes) * 100, 100)}%` }}></div>
                  </div>
                  <p className="text-[10px] text-black dark:text-white mt-1">{progress.minutes}/{tempGoals.dailyMinutes} mins</p>
                </div>
              </div>

              {/* Streak Goal Compact */}
              <div className="p-3 surface-elevated rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-foreground/80">
                    Streak Goal
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-black dark:text-white">{progress.currentStreak}</span>
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
                  <div className="gradient-primary h-2 rounded-full" style={{ width: `${Math.min((progress.currentStreak / tempGoals.streakDays) * 100, 100)}%` }}></div>
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
                  onClick={handleCloseGoalsModal}
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
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { MessageOfTheDay } from '@/components/ui/MessageOfTheDay';
import { 
    Sparkles, 
    CheckCircle, 
    GripVertical,
    Clock,
    Plus,
    X
  } from 'lucide-react';

// Simple task interface for the Quick Tasks widget
interface QuickTask {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

type WidgetType = 'daily-inspiration' | 'recent-project' | 'writing-progress' | 'quick-tasks';

interface DashboardWidget {
  id: WidgetType;
  name: string;
  order: number;
}

interface Project {
  id: string;
  name: string;
  type?: string;
  genre?: string | string[];
  description?: string;
  createdAt: string;
  [key: string]: any;
}

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

interface DashboardWidgetsProps {
  widgets: DashboardWidget[];
  projects: Project[];
  todayTasks: Task[];
  isLoadingTasks: boolean;
  actualGoals: Goals;
  todayProgress: Progress;
  isEditMode: boolean;
  draggedWidget: WidgetType | null;
  dragOverWidget: WidgetType | null;
  onWidgetDragStart: (e: React.DragEvent, widgetId: WidgetType) => void;
  onWidgetDragOver: (e: React.DragEvent, widgetId: WidgetType) => void;
  onWidgetDrop: (e: React.DragEvent, targetWidgetId: WidgetType) => void;
  onWidgetDragLeave: () => void;
  onOpenGoalsModal: () => void;
  onShowTasksModal: () => void;
  onShowAddTaskModal: () => void;
  onToggleTaskCompletion: (task: Task) => void;
}

export const DashboardWidgets = React.memo(function DashboardWidgets({
  widgets,
  projects,
  todayTasks,
  isLoadingTasks,
  actualGoals,
  todayProgress,
  isEditMode,
  draggedWidget,
  dragOverWidget,
  onWidgetDragStart,
  onWidgetDragOver,
  onWidgetDrop,
  onWidgetDragLeave,
  onOpenGoalsModal,
  onShowTasksModal,
  onShowAddTaskModal,
  onToggleTaskCompletion,
}: DashboardWidgetsProps) {

  // Local state for Quick Tasks widget
  const [quickTasks, setQuickTasks] = useState<QuickTask[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('quickTasks');
    if (savedTasks) {
      try {
        setQuickTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Error loading quick tasks:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('quickTasks', JSON.stringify(quickTasks));
  }, [quickTasks]);

  // Add a new task
  const handleAddTask = () => {
    if (!newTaskText.trim()) return;

    const newTask: QuickTask = {
      id: `task_${Date.now()}`,
      text: newTaskText.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    setQuickTasks(prev => [...prev, newTask]);
    setNewTaskText('');
    setShowAddTask(false);
  };

  // Toggle task completion
  const handleToggleTask = (taskId: string) => {
    setQuickTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Delete a task
  const handleDeleteTask = (taskId: string) => {
    setQuickTasks(prev => prev.filter(task => task.id !== taskId));
  };

  // Create sample tasks for demonstration
  const handleCreateSampleTasks = () => {
    const sampleTasks: QuickTask[] = [
      {
        id: `sample_1_${Date.now()}`,
        text: 'Write opening paragraph for Chapter 1',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: `sample_2_${Date.now()}`,
        text: 'Edit previous chapter',
        completed: true,
        createdAt: new Date().toISOString()
      },
      {
        id: `sample_3_${Date.now()}`,
        text: 'Research character background',
        completed: false,
        createdAt: new Date().toISOString()
      }
    ];

    setQuickTasks(prev => [...prev, ...sampleTasks]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {widgets.map((widget) => (
        <div
          key={widget.id}
          className={`relative ${isEditMode ? 'cursor-move' : ''} ${
            draggedWidget === widget.id ? 'opacity-50' : ''
          } ${dragOverWidget === widget.id ? 'ring-2 ring-primary' : ''}`}
          draggable={isEditMode}
          onDragStart={(e) => onWidgetDragStart(e, widget.id)}
          onDragOver={(e) => onWidgetDragOver(e, widget.id)}
          onDrop={(e) => onWidgetDrop(e, widget.id)}
          onDragLeave={onWidgetDragLeave}
        >
          {isEditMode && (
            <div className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm rounded-lg p-1">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>
          )}

          {/* Daily Inspiration Widget */}
          {widget.id === 'daily-inspiration' && <MessageOfTheDay />}

          {/* Recent Project Widget */}
          {widget.id === 'recent-project' && (
            projects.length > 0 ? (
              <Card className="glass-card backdrop-blur-xl rounded-[2rem] shadow-xl border border-border/30 h-full">
                <CardContent className="p-5 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-foreground text-sm">
                      Recent Project
                    </h3>
                  </div>
                  <div className="flex-grow mb-4">
                    <h4 className="font-semibold text-foreground text-base mb-2">
                      {projects[0]?.name || 'Untitled Project'}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {projects[0]?.description || 'No description available'}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="text-foreground/80 font-medium">
                          {projects[0]?.type || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span className="text-foreground/80 font-medium">
                          {new Date(projects[0]?.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 mt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress:</span>
                        <span className="text-foreground/80 font-medium">23%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div className="gradient-primary h-1.5 rounded-full" style={{ width: '23%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/30 mt-auto">
                    <Button 
                      size="sm"
                      onClick={() => {
                        alert(`Opening "${projects[0]?.name || 'Recent Project'}" for editing!\n\nThis would typically navigate to the project's writing interface.`);
                      }}
                      className="w-full gradient-primary text-primary-foreground hover:opacity-90 text-xs font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg"
                    >
                      Continue Writing
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-card backdrop-blur-xl rounded-[2rem] shadow-xl border border-border/30 h-full">
                <CardContent className="p-5 h-full flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 gradient-primary-br rounded-2xl flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-foreground text-sm mb-2">No Recent Projects</h3>
                  <p className="text-xs text-muted-foreground mb-4">Create your first project to see it here</p>
                  <Button 
                    size="sm"
                    onClick={() => {
                      alert('Opening Project Creation Wizard!\n\nThis would typically open the project creation modal or navigate to a project setup page.');
                    }}
                    className="gradient-primary text-primary-foreground hover:opacity-90 text-xs px-4 py-2"
                  >
                    Create Project
                  </Button>
                </CardContent>
              </Card>
            )
          )}

          {/* Writing Progress Widget */}
          {widget.id === 'writing-progress' && (
            <Card className="glass-card backdrop-blur-xl rounded-[2rem] shadow-xl border border-border/30 h-full">
              <CardContent className="p-5 h-full flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 gradient-primary-br rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      Writing Progress
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={onOpenGoalsModal}
                    className="gradient-primary text-primary-foreground hover:opacity-90 text-xs px-3 py-1 font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg"
                  >
                    Set Goals
                  </Button>
                </div>
                
                <div className="flex-grow space-y-3">
                  {/* Daily Words */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-medium text-foreground/80">Daily Words</p>
                      <p className="text-xs font-semibold">
                        <span className="text-primary">{todayProgress.words}</span>
                        <span className="text-muted-foreground">/{actualGoals.dailyWords}</span>
                        <span className="text-muted-foreground/70 ml-1">({Math.round((todayProgress.words / actualGoals.dailyWords) * 100)}%)</span>
                      </p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="gradient-primary h-2 rounded-full" style={{ width: `${Math.min((todayProgress.words / actualGoals.dailyWords) * 100, 100)}%` }}></div>
                    </div>
                  </div>

                  {/* Writing Time */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-medium text-foreground/80">Writing Time</p>
                      <p className="text-xs font-semibold">
                        <span className="text-primary">{todayProgress.minutes}</span>
                        <span className="text-muted-foreground">/{actualGoals.dailyMinutes} min</span>
                        <span className="text-muted-foreground/70 ml-1">({Math.round((todayProgress.minutes / actualGoals.dailyMinutes) * 100)}%)</span>
                      </p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="gradient-primary h-2 rounded-full" style={{ width: `${Math.min((todayProgress.minutes / actualGoals.dailyMinutes) * 100, 100)}%` }}></div>
                    </div>
                  </div>

                  {/* Writing Streak */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-medium text-foreground/80">Writing Streak</p>
                      <p className="text-xs font-semibold">
                        <span className="text-primary">{todayProgress.currentStreak}</span>
                        <span className="text-muted-foreground">/{actualGoals.streakDays} days</span>
                        <span className="text-muted-foreground/70 ml-1">({Math.round((todayProgress.currentStreak / actualGoals.streakDays) * 100)}%)</span>
                      </p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="gradient-primary h-2 rounded-full" style={{ width: `${Math.min((todayProgress.currentStreak / actualGoals.streakDays) * 100, 100)}%` }}></div>
                    </div>
                  </div>

                  {/* Divider line */}
                  <div className="border-t border-border/30 my-3"></div>

                  {/* Compact Summary */}
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>2 writing sessions today</span>
                    <span>Next milestone in {Math.max(0, actualGoals.dailyWords - todayProgress.words)} words</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Tasks Widget - WORKING VERSION */}
          {widget.id === 'quick-tasks' && (
            <Card className="glass-card backdrop-blur-xl rounded-[2rem] shadow-xl border border-border/30 h-full">
              <CardContent className="p-5 h-full flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-foreground text-sm">
                      Quick Tasks
                    </h3>
                  </div>
                  {quickTasks.length > 0 && (
                    <Button
                      size="sm"
                      onClick={() => setShowAddTask(true)}
                      className="gradient-primary text-primary-foreground hover:opacity-90 text-xs px-2 py-1 font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
                
                <div className="space-y-3 text-sm mb-5 flex-grow overflow-y-auto">
                  {quickTasks.length === 0 ? (
                    <div className="text-center text-muted-foreground text-xs space-y-3">
                      <p className="mb-2">No tasks for today yet</p>
                      
                      <Button
                        size="sm"
                        onClick={handleCreateSampleTasks}
                        className="gradient-primary text-primary-foreground hover:opacity-90 text-xs px-3 py-1 mb-2"
                      >
                        🚀 Add Sample Tasks
                      </Button>
                      
                      <Button
                        size="sm"
                        onClick={() => setShowAddTask(true)}
                        className="gradient-primary text-primary-foreground hover:opacity-90 text-xs px-3 py-1"
                      >
                        Add Your First Task
                      </Button>
                    </div>
                  ) : (
                    <>
                      {showAddTask && (
                        <div className="p-3 bg-accent/10 rounded-lg border border-border/30 space-y-2">
                          <Input
                            placeholder="Add a quick task..."
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                            className="text-xs"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleAddTask}
                              disabled={!newTaskText.trim()}
                              className="text-xs gradient-primary text-primary-foreground hover:opacity-90"
                            >
                              Add
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setShowAddTask(false);
                                setNewTaskText('');
                              }}
                              className="text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {quickTasks.slice(0, 4).map((task) => (
                        <div 
                          key={task.id} 
                          className="flex items-center gap-3 hover:bg-accent/10 p-2 rounded-lg transition-colors duration-200 group"
                        >
                          <Checkbox 
                            checked={task.completed}
                            onCheckedChange={() => handleToggleTask(task.id)}
                            className="h-4 w-4 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className={`text-foreground/80 text-xs leading-tight block ${task.completed ? 'line-through opacity-60' : ''}`}>
                              {task.text}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteTask(task.id)}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      
                      {quickTasks.length > 4 && (
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">
                            +{quickTasks.length - 4} more tasks
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                <div className="pt-3 border-t border-border/30 mt-auto">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>Today's Progress</span>
                    <span>{quickTasks.filter(t => t.completed).length}/{quickTasks.length} completed</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 mb-3">
                    <div 
                      className="gradient-primary h-1.5 rounded-full transition-all duration-300" 
                      style={{ width: `${quickTasks.length > 0 ? (quickTasks.filter(t => t.completed).length / quickTasks.length * 100) : 0}%` }}
                    ></div>
                  </div>
                  
                  {quickTasks.length === 0 ? (
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-2">
                        Create tasks to track your writing progress
                      </p>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      {!showAddTask && (
                        <Button 
                          size="sm"
                          onClick={() => setShowAddTask(true)}
                          className="gradient-primary text-primary-foreground hover:opacity-90 text-xs px-4 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg flex-1"
                        >
                          Add Task
                        </Button>
                      )}
                      <Button 
                        size="sm"
                        onClick={onShowTasksModal}
                        className="gradient-primary text-primary-foreground hover:opacity-90 text-xs px-4 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg flex-1"
                      >
                        View All
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ))}
    </div>
  );
});
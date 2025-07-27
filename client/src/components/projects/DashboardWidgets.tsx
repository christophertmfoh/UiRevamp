import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { MessageOfTheDay } from '@/components/ui/MessageOfTheDay';
import { 
  Sparkles, 
  CheckCircle, 
  GripVertical,
  Clock
} from 'lucide-react';

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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-6 lg:h-[600px]">
      {widgets.sort((a, b) => a.order - b.order).map((widget) => (
        <div
          key={widget.id}
          draggable={isEditMode}
          onDragStart={(e) => onWidgetDragStart(e, widget.id)}
          onDragOver={(e) => onWidgetDragOver(e, widget.id)}
          onDrop={(e) => onWidgetDrop(e, widget.id)}
          onDragLeave={onWidgetDragLeave}
          className={`transition-all duration-300 relative ${
            isEditMode ? 'cursor-move' : ''
          } ${
            dragOverWidget === widget.id && draggedWidget !== widget.id
              ? 'ring-2 ring-amber-400 ring-opacity-50 scale-[1.02]'
              : ''
          } ${
            draggedWidget === widget.id ? 'opacity-50' : ''
          }`}
        >
          {isEditMode && (
            <div className="absolute top-2 right-2 z-10 bg-card/80 rounded-lg p-1">
              <GripVertical className="w-4 h-4 text-foreground" />
            </div>
          )}

          {/* Daily Inspiration Widget */}
          {widget.id === 'daily-inspiration' && <MessageOfTheDay />}

          {/* Recent Project Widget */}
          {widget.id === 'recent-project' && (
            projects.length > 0 ? (
              <Card className="glass-card backdrop-blur-xl rounded-[2rem] shadow-xl border border-border/30 hover:shadow-2xl transition-all duration-300 hover:scale-105 h-full">
                <CardContent className="p-5 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-foreground text-sm">Recent Project</h3>
                    <Badge className="gradient-primary text-primary-foreground text-xs px-2 py-1 border-0">
                      Active
                    </Badge>
                  </div>
                  <div className="space-y-3 flex-grow">
                    <div>
                      <p className="font-semibold text-foreground text-sm truncate">{projects[0]?.name}</p>
                      <p className="text-xs text-foreground mt-1 line-clamp-2 leading-relaxed">{projects[0]?.description || 'No description available'}</p>
                    </div>
                    
                    {/* Project Details */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="text-foreground/80 font-medium">{projects[0]?.type || 'Creative Project'}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Genre:</span>
                        <span className="text-foreground/80 font-medium">
                          {typeof projects[0]?.genre === 'string' ? projects[0].genre : 
                           (Array.isArray(projects[0]?.genre) && projects[0].genre[0]) || 'Unspecified'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span className="text-foreground/80 font-medium">
                          {new Date(projects[0]?.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
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

          {/* Quick Tasks Widget */}
          {widget.id === 'quick-tasks' && (
            <Card className="glass-card backdrop-blur-xl rounded-[2rem] shadow-xl border border-border/30 h-full">
              <CardContent className="p-5 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-foreground text-sm">
                    Quick Tasks
                  </h3>
                </div>
                <div className="space-y-3 text-sm mb-5 flex-grow overflow-y-auto">
                  {isLoadingTasks ? (
                    <div className="text-center text-muted-foreground text-xs">Loading tasks...</div>
                  ) : todayTasks.length === 0 ? (
                    <div className="text-center text-muted-foreground text-xs">
                      <p className="mb-2">No tasks for today yet</p>
                      <Button
                        size="sm"
                        onClick={onShowTasksModal}
                        className="gradient-primary text-primary-foreground hover:opacity-90 text-xs px-3 py-1"
                      >
                        Add Tasks
                      </Button>
                    </div>
                  ) : (
                    todayTasks.slice(0, 3).map((task) => (
                      <div 
                        key={task.id} 
                        className="flex items-center gap-3 cursor-pointer hover:bg-accent/10 p-1 rounded-lg transition-colors duration-200"
                        onClick={() => onToggleTaskCompletion(task)}
                      >
                        <Checkbox 
                          checked={task.status === 'completed'}
                          className="h-4 w-4"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className={`text-foreground/80 flex-1 ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                          {task.text}
                        </span>
                        {task.priority === 'high' && (
                          <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4">High</Badge>
                        )}
                      </div>
                    ))
                  )}
                </div>
                <div className="pt-3 border-t border-border/30 mt-auto">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>Today's Progress</span>
                    <span>{todayTasks.filter(t => t.status === 'completed').length}/{todayTasks.length} completed</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 mb-3">
                    <div 
                      className="gradient-primary h-1.5 rounded-full" 
                      style={{ width: `${todayTasks.length > 0 ? (todayTasks.filter(t => t.status === 'completed').length / todayTasks.length * 100) : 0}%` }}
                    ></div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={onShowAddTaskModal}
                      className="gradient-primary text-primary-foreground hover:opacity-90 text-xs px-4 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg flex-1"
                    >
                      Add Task
                    </Button>
                    <Button 
                      size="sm"
                      onClick={onShowTasksModal}
                      className="gradient-primary text-primary-foreground hover:opacity-90 text-xs px-4 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg flex-1"
                    >
                      View All
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ))}
    </div>
  );
});
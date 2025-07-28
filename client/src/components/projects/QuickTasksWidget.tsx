import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CheckCircle, 
  Plus, 
  X, 
  Clock, 
  Calendar,
  Star,
  Zap,
  TrendingUp,
  Target,
  MoreVertical,
  Edit3,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Enhanced task interface with proper typing
interface QuickTask {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  estimatedMinutes: number;
  createdAt: string;
  completedAt?: string;
  category: 'writing' | 'editing' | 'research' | 'planning' | 'other';
  streak?: number;
}

interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  totalMinutes: number;
  averageCompletionTime: number;
  streak: number;
  todayFocus: string;
}

// Smart task suggestions based on writing context
const SMART_SUGGESTIONS = [
  { text: 'Write 500 words for current chapter', category: 'writing' as const, estimatedMinutes: 25, priority: 'high' as const },
  { text: 'Edit yesterday\'s writing', category: 'editing' as const, estimatedMinutes: 20, priority: 'medium' as const },
  { text: 'Research character background', category: 'research' as const, estimatedMinutes: 15, priority: 'medium' as const },
  { text: 'Outline next scene', category: 'planning' as const, estimatedMinutes: 10, priority: 'medium' as const },
  { text: 'Review plot consistency', category: 'editing' as const, estimatedMinutes: 30, priority: 'low' as const },
  { text: 'Develop character dialogue', category: 'writing' as const, estimatedMinutes: 20, priority: 'high' as const },
  { text: 'Research setting details', category: 'research' as const, estimatedMinutes: 25, priority: 'low' as const },
  { text: 'Plan chapter transitions', category: 'planning' as const, estimatedMinutes: 15, priority: 'medium' as const },
];

const STORAGE_KEY = 'quickTasksWidget_v2';

interface QuickTasksWidgetProps {
  onShowTasksModal: () => void;
}

// Natural language parsing for smart task creation
const parseTaskInput = (input: string) => {
  const text = input.toLowerCase();
  
  // Priority detection
  let priority: 'low' | 'medium' | 'high' = 'medium';
  if (text.includes('urgent') || text.includes('important') || text.includes('asap')) priority = 'high';
  if (text.includes('low priority') || text.includes('when possible')) priority = 'low';
  
  // Time estimation
  let estimatedMinutes = 20; // default
  const timeMatch = text.match(/(\d+)\s*(min|minute|minutes|hour|hours|h)/);
  if (timeMatch) {
    const value = parseInt(timeMatch[1]);
    const unit = timeMatch[2];
    estimatedMinutes = unit.startsWith('h') ? value * 60 : value;
  }
  
  // Category detection
  let category: QuickTask['category'] = 'other';
  if (text.includes('write') || text.includes('draft') || text.includes('words')) category = 'writing';
  if (text.includes('edit') || text.includes('revise') || text.includes('review')) category = 'editing';
  if (text.includes('research') || text.includes('look up') || text.includes('study')) category = 'research';
  if (text.includes('plan') || text.includes('outline') || text.includes('organize')) category = 'planning';
  
  return { priority, estimatedMinutes, category };
};

export const QuickTasksWidget = React.memo(function QuickTasksWidget({ 
  onShowTasksModal 
}: QuickTasksWidgetProps) {
  const [tasks, setTasks] = useState<QuickTask[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [expandedView, setExpandedView] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // Load tasks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTasks(parsed);
      } catch (error) {
        console.error('Error loading quick tasks:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Calculate smart statistics
  const stats: TaskStats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    const totalMinutes = tasks
      .filter(t => t.completed)
      .reduce((sum, t) => sum + t.estimatedMinutes, 0);
    
    const averageCompletionTime = completedTasks > 0 ? totalMinutes / completedTasks : 0;
    
    // Calculate streak (consecutive days with completed tasks)
    const today = new Date().toDateString();
    const yesterdayCompleted = tasks.some(t => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return new Date(t.createdAt).toDateString() === yesterday.toDateString() && t.completed;
    });
    const todayCompleted = tasks.some(t => 
      new Date(t.createdAt).toDateString() === today && t.completed
    );
    
    const streak = todayCompleted ? (yesterdayCompleted ? 2 : 1) : 0;
    
    // Determine today's focus based on most common category
    const categoryCount = tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const todayFocus = Object.entries(categoryCount).sort(([,a], [,b]) => b - a)[0]?.[0] || 'writing';
    
    return {
      totalTasks,
      completedTasks,
      completionRate,
      totalMinutes,
      averageCompletionTime,
      streak,
      todayFocus
    };
  }, [tasks]);

  // Today's tasks for main display
  const todayTasks = useMemo(() => {
    const today = new Date().toDateString();
    return tasks.filter(task => 
      new Date(task.createdAt).toDateString() === today
    ).sort((a, b) => {
      // Sort by: incomplete first, then by priority, then by creation time
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [tasks]);

  // Smart task suggestions based on user patterns
  const smartSuggestions = useMemo(() => {
    return SMART_SUGGESTIONS
      .filter(suggestion => !tasks.some(task => 
        task.text.toLowerCase().includes(suggestion.text.toLowerCase().split(' ')[0])
      ))
      .slice(0, 3);
  }, [tasks]);

  const handleAddTask = useCallback(() => {
    if (!newTaskText.trim()) return;

    const parsed = parseTaskInput(newTaskText);
    const newTask: QuickTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: newTaskText.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      ...parsed
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskText('');
    setShowAddTask(false);
    setShowSuggestions(false);
  }, [newTaskText]);

  const handleToggleTask = useCallback((taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : undefined
          }
        : task
    ));
  }, []);

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  const handleEditTask = useCallback((taskId: string, newText: string) => {
    if (!newText.trim()) return;
    
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, text: newText.trim() } : task
    ));
    setEditingTaskId(null);
    setEditText('');
  }, []);

  const handleSuggestionClick = useCallback((suggestion: typeof SMART_SUGGESTIONS[0]) => {
    const newTask: QuickTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: suggestion.text,
      completed: false,
      createdAt: new Date().toISOString(),
      priority: suggestion.priority,
      estimatedMinutes: suggestion.estimatedMinutes,
      category: suggestion.category
    };

    setTasks(prev => [newTask, ...prev]);
    setShowSuggestions(false);
  }, []);

  const getPriorityColor = (priority: QuickTask['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500 dark:text-red-400';
      case 'medium': return 'text-yellow-500 dark:text-yellow-400';
      case 'low': return 'text-green-500 dark:text-green-400';
    }
  };

  const getCategoryIcon = (category: QuickTask['category']) => {
    switch (category) {
      case 'writing': return <Edit3 className="w-3 h-3" />;
      case 'editing': return <CheckCircle className="w-3 h-3" />;
      case 'research': return <Target className="w-3 h-3" />;
      case 'planning': return <Calendar className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const displayTasks = expandedView ? todayTasks : todayTasks.slice(0, 4);

  return (
    <Card className="glass-card backdrop-blur-xl rounded-[2rem] shadow-xl border border-border/30 h-full">
      <CardContent className="p-5 h-full flex flex-col">
        {/* Header with smart stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <CheckCircle className="w-4 h-4 text-primary" />
              {stats.streak > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold">{stats.streak}</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm">Quick Tasks</h3>
              {stats.totalTasks > 0 && (
                <p className="text-[10px] text-muted-foreground">
                  {Math.round(stats.completionRate)}% done • {stats.totalMinutes}min total
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {todayTasks.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setExpandedView(!expandedView)}
                className="h-6 w-6 p-0 hover:bg-accent/10"
                title={expandedView ? "Show less" : "Show all"}
              >
                {expandedView ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => setShowAddTask(true)}
              className="gradient-primary text-primary-foreground hover:opacity-90 text-xs px-2 py-1 h-6"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add
            </Button>
          </div>
        </div>

        {/* Progress overview */}
        {stats.totalTasks > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Today's Progress</span>
              <span>{stats.completedTasks}/{todayTasks.length}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 mb-2">
              <div 
                className="gradient-primary h-1.5 rounded-full transition-all duration-500 ease-out" 
                style={{ 
                  width: `${todayTasks.length > 0 ? (stats.completedTasks / todayTasks.length * 100) : 0}%` 
                }}
              />
            </div>
            {stats.completionRate >= 80 && (
              <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <TrendingUp className="w-3 h-3" />
                <span>Great momentum!</span>
              </div>
            )}
          </div>
        )}

        {/* Task input */}
        {showAddTask && (
          <div className="mb-4 p-3 bg-accent/5 rounded-lg border border-border/30 space-y-3">
            <Input
              placeholder="What needs to be done? (e.g., 'Write 500 words - 30 min')"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleAddTask();
                if (e.key === 'Escape') {
                  setShowAddTask(false);
                  setNewTaskText('');
                }
              }}
              className="text-xs border-0 bg-background/50 focus:bg-background/80"
              autoFocus
            />
            
            {/* Smart suggestions */}
            {!showSuggestions ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowSuggestions(true)}
                className="text-xs text-muted-foreground hover:text-foreground h-6"
              >
                <Zap className="w-3 h-3 mr-1" />
                Smart suggestions
              </Button>
            ) : (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground mb-2">Suggested for you:</p>
                {smartSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full justify-start text-xs h-auto p-2 hover:bg-accent/10"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {getCategoryIcon(suggestion.category)}
                      <span className="flex-1 text-left">{suggestion.text}</span>
                      <Badge variant="secondary" className="text-[10px] px-1 py-0">
                        {suggestion.estimatedMinutes}m
                      </Badge>
                    </div>
                  </Button>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAddTask}
                disabled={!newTaskText.trim()}
                className="text-xs gradient-primary text-primary-foreground hover:opacity-90 flex-1"
              >
                Add Task
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowAddTask(false);
                  setNewTaskText('');
                  setShowSuggestions(false);
                }}
                className="text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Tasks list */}
        <div className="space-y-2 flex-grow overflow-y-auto">
          {todayTasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                No tasks for today. What's your writing goal?
              </p>
              <Button
                size="sm"
                onClick={() => setShowAddTask(true)}
                className="gradient-primary text-primary-foreground hover:opacity-90 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Create your first task
              </Button>
            </div>
          ) : (
            <>
              {displayTasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-200 group hover:bg-accent/5 ${
                    task.completed ? 'opacity-75' : ''
                  }`}
                >
                  <Checkbox 
                    checked={task.completed}
                    onCheckedChange={() => handleToggleTask(task.id)}
                    className="h-4 w-4 flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    {editingTaskId === task.id ? (
                      <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleEditTask(task.id, editText);
                          if (e.key === 'Escape') {
                            setEditingTaskId(null);
                            setEditText('');
                          }
                        }}
                        className="text-xs h-6 border-0 bg-background/50"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`text-xs leading-tight flex-1 ${
                          task.completed ? 'line-through opacity-60' : 'text-foreground/90'
                        }`}>
                          {task.text}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center gap-1">
                            <Star className={`w-3 h-3 ${getPriorityColor(task.priority)}`} />
                            {getCategoryIcon(task.category)}
                            <span className="text-[10px] text-muted-foreground">
                              {task.estimatedMinutes}m
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingTaskId(task.id);
                        setEditText(task.text);
                      }}
                      className="h-5 w-5 p-0 hover:bg-accent/20"
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTask(task.id)}
                      className="h-5 w-5 p-0 hover:bg-destructive/20 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {todayTasks.length > 4 && !expandedView && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setExpandedView(true)}
                  className="w-full text-xs text-muted-foreground hover:text-foreground h-6"
                >
                  +{todayTasks.length - 4} more tasks
                </Button>
              )}
            </>
          )}
        </div>

        {/* Footer actions */}
        {todayTasks.length > 0 && (
          <div className="pt-3 border-t border-border/30 mt-4">
            <div className="flex gap-2">
              {!showAddTask && (
                <Button 
                  size="sm"
                  onClick={() => setShowAddTask(true)}
                  className="gradient-primary text-primary-foreground hover:opacity-90 text-xs px-3 py-1 flex-1"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Task
                </Button>
              )}
              <Button 
                size="sm"
                variant="outline"
                onClick={onShowTasksModal}
                className="text-xs px-3 py-1 flex-1 border-border/50 hover:bg-accent/10"
              >
                View All
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
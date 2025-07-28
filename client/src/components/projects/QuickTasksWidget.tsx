import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useTaskManagement, type Task } from '@/hooks/useTaskManagement';
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



interface QuickTasksWidgetProps {
  onShowTasksModal: () => void;
}

export const QuickTasksWidget = React.memo(function QuickTasksWidget({ 
  onShowTasksModal 
}: QuickTasksWidgetProps) {
  // Use centralized task management
  const {
    todayTasks,
    taskStats,
    smartSuggestions,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    createTaskFromSuggestion
  } = useTaskManagement();

  // Local UI state only
  const [newTaskText, setNewTaskText] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [expandedView, setExpandedView] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleAddTask = useCallback(() => {
    if (!newTaskText.trim()) return;

    createTask({ text: newTaskText.trim() });
    setNewTaskText('');
    setShowAddTask(false);
    setShowSuggestions(false);
  }, [newTaskText, createTask]);

  const handleToggleTask = useCallback((taskId: string) => {
    toggleTaskCompletion(taskId);
  }, [toggleTaskCompletion]);

  const handleDeleteTask = useCallback((taskId: string) => {
    deleteTask(taskId);
  }, [deleteTask]);

  const handleEditTask = useCallback((taskId: string, newText: string) => {
    if (!newText.trim()) return;
    
    updateTask(taskId, { text: newText.trim() });
    setEditingTaskId(null);
    setEditText('');
  }, [updateTask]);

  const handleSuggestionClick = useCallback((suggestion: any) => {
    createTaskFromSuggestion(suggestion);
    setShowSuggestions(false);
  }, [createTaskFromSuggestion]);

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500 dark:text-red-400';
      case 'medium': return 'text-yellow-500 dark:text-yellow-400';
      case 'low': return 'text-green-500 dark:text-green-400';
    }
  };

  const getCategoryIcon = (category: Task['category']) => {
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
              {taskStats.streak > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold">{taskStats.streak}</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm">Quick Tasks</h3>
              {taskStats.totalTasks > 0 && (
                <p className="text-[10px] text-muted-foreground">
                  {Math.round(taskStats.completionRate)}% done • {taskStats.totalMinutes}min total
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
        {taskStats.totalTasks > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Today's Progress</span>
              <span>{taskStats.completedTasks}/{todayTasks.length}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 mb-2">
              <div 
                className="gradient-primary h-1.5 rounded-full transition-all duration-500 ease-out" 
                style={{ 
                  width: `${todayTasks.length > 0 ? (taskStats.completedTasks / todayTasks.length * 100) : 0}%` 
                }}
              />
            </div>
            {taskStats.completionRate >= 80 && (
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
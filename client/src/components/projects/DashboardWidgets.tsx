import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageOfTheDay } from '@/components/ui/MessageOfTheDay';
import { QuickTasksWidget } from './QuickTasksWidget';
import { useTaskManagement } from '@/hooks/useTaskManagement';
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

interface DashboardWidgetsProps {
  widgets: DashboardWidget[];
  projects: Project[];
  isEditMode: boolean;
  draggedWidget: WidgetType | null;
  dragOverWidget: WidgetType | null;
  onWidgetDragStart: (e: React.DragEvent, widgetId: WidgetType) => void;
  onWidgetDragOver: (e: React.DragEvent, widgetId: WidgetType) => void;
  onWidgetDrop: (e: React.DragEvent, targetWidgetId: WidgetType) => void;
  onWidgetDragLeave: () => void;
}

export const DashboardWidgets = React.memo(function DashboardWidgets({
  widgets,
  projects,
  isEditMode,
  draggedWidget,
  dragOverWidget,
  onWidgetDragStart,
  onWidgetDragOver,
  onWidgetDrop,
  onWidgetDragLeave,
}: DashboardWidgetsProps) {
  
  // Use centralized task management
  const {
    goals,
    progress,
    setShowGoalsModal,
    setShowTasksModal
  } = useTaskManagement();

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
                    onClick={() => setShowGoalsModal(true)}
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
                        <span className="text-primary">{progress.words}</span>
                        <span className="text-muted-foreground">/{goals.dailyWords}</span>
                        <span className="text-muted-foreground/70 ml-1">({Math.round((progress.words / goals.dailyWords) * 100)}%)</span>
                      </p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="gradient-primary h-2 rounded-full" style={{ width: `${Math.min((progress.words / goals.dailyWords) * 100, 100)}%` }}></div>
                    </div>
                  </div>

                  {/* Writing Time */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-medium text-foreground/80">Writing Time</p>
                      <p className="text-xs font-semibold">
                        <span className="text-primary">{progress.minutes}</span>
                        <span className="text-muted-foreground">/{goals.dailyMinutes} min</span>
                        <span className="text-muted-foreground/70 ml-1">({Math.round((progress.minutes / goals.dailyMinutes) * 100)}%)</span>
                      </p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="gradient-primary h-2 rounded-full" style={{ width: `${Math.min((progress.minutes / goals.dailyMinutes) * 100, 100)}%` }}></div>
                    </div>
                  </div>

                  {/* Writing Streak */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-medium text-foreground/80">Writing Streak</p>
                      <p className="text-xs font-semibold">
                        <span className="text-primary">{progress.currentStreak}</span>
                        <span className="text-muted-foreground">/{goals.streakDays} days</span>
                        <span className="text-muted-foreground/70 ml-1">({Math.round((progress.currentStreak / goals.streakDays) * 100)}%)</span>
                      </p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="gradient-primary h-2 rounded-full" style={{ width: `${Math.min((progress.currentStreak / goals.streakDays) * 100, 100)}%` }}></div>
                    </div>
                  </div>

                  {/* Divider line */}
                  <div className="border-t border-border/30 my-3"></div>

                  {/* Compact Summary */}
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>2 writing sessions today</span>
                    <span>Next milestone in {Math.max(0, goals.dailyWords - progress.words)} words</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Tasks Widget - OPTIMIZED VERSION */}
          {widget.id === 'quick-tasks' && (
            <QuickTasksWidget onShowTasksModal={() => setShowTasksModal(true)} />
          )}
        </div>
      ))}
    </div>
  );
});
import { useState, useCallback } from 'react';
import { useDragAndDrop } from './useDragAndDrop';

type WidgetType = 'daily-inspiration' | 'recent-project' | 'writing-progress' | 'quick-tasks';

interface DashboardWidget {
  id: WidgetType;
  name: string;
  order: number;
}

const DEFAULT_WIDGETS: DashboardWidget[] = [
  { id: 'daily-inspiration', name: 'Daily Inspiration', order: 0 },
  { id: 'recent-project', name: 'Recent Project', order: 1 },
  { id: 'writing-progress', name: 'Writing Progress', order: 2 },
  { id: 'quick-tasks', name: 'Quick Tasks', order: 3 }
];

interface UseWidgetManagementReturn {
  // State
  widgets: DashboardWidget[];
  draggedWidget: WidgetType | null;
  dragOverWidget: WidgetType | null;
  
  // Actions
  setWidgets: (widgets: DashboardWidget[]) => void;
  
  // Drag & Drop handlers
  handleWidgetDragStart: (e: React.DragEvent, widgetId: WidgetType) => void;
  handleWidgetDragOver: (e: React.DragEvent, widgetId: WidgetType) => void;
  handleWidgetDrop: (e: React.DragEvent, targetWidgetId: WidgetType) => void;
  handleWidgetDragLeave: () => void;
  
  // Utility methods
  resetWidgets: () => void;
  getWidgetById: (id: WidgetType) => DashboardWidget | undefined;
}

export function useWidgetManagement(): UseWidgetManagementReturn {
  // Load widgets from localStorage with fallback to defaults
  const [widgets, setWidgetsState] = useState<DashboardWidget[]>(() => {
    const saved = localStorage.getItem('projectsDashboardWidgets');
    return saved ? JSON.parse(saved) : DEFAULT_WIDGETS;
  });

  // Persist widgets to localStorage when they change
  const setWidgets = useCallback((newWidgets: DashboardWidget[]) => {
    setWidgetsState(newWidgets);
    localStorage.setItem('projectsDashboardWidgets', JSON.stringify(newWidgets));
  }, []);

  // Use the generic drag & drop hook
  const {
    draggedItem: draggedWidget,
    dragOverItem: dragOverWidget,
    handleDragStart: handleDragStart,
    handleDragOver: handleDragOver,
    handleDrop: handleDrop,
    handleDragLeave: handleDragLeave
  } = useDragAndDrop({
    items: widgets,
    onReorder: setWidgets,
    storageKey: 'projectsDashboardWidgets'
  });

  // Widget-specific drag handlers
  const handleWidgetDragStart = useCallback((e: React.DragEvent, widgetId: WidgetType) => {
    handleDragStart(e, widgetId);
  }, [handleDragStart]);

  const handleWidgetDragOver = useCallback((e: React.DragEvent, widgetId: WidgetType) => {
    handleDragOver(e, widgetId);
  }, [handleDragOver]);

  const handleWidgetDrop = useCallback((e: React.DragEvent, targetWidgetId: WidgetType) => {
    handleDrop(e, targetWidgetId);
  }, [handleDrop]);

  const handleWidgetDragLeave = useCallback(() => {
    handleDragLeave();
  }, [handleDragLeave]);

  // Utility methods
  const resetWidgets = useCallback(() => {
    setWidgets(DEFAULT_WIDGETS);
  }, [setWidgets]);

  const getWidgetById = useCallback((id: WidgetType) => {
    return widgets.find(widget => widget.id === id);
  }, [widgets]);

  return {
    // State
    widgets,
    draggedWidget: draggedWidget as WidgetType | null,
    dragOverWidget: dragOverWidget as WidgetType | null,
    
    // Actions
    setWidgets,
    
    // Drag & Drop handlers
    handleWidgetDragStart,
    handleWidgetDragOver,
    handleWidgetDrop,
    handleWidgetDragLeave,
    
    // Utility methods
    resetWidgets,
    getWidgetById,
  };
}
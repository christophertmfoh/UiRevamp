import { useState, useCallback } from 'react';

interface DragAndDropItem {
  id: string;
  order: number;
}

interface UseDragAndDropProps<T extends DragAndDropItem> {
  items: T[];
  onReorder: (reorderedItems: T[]) => void;
  storageKey?: string;
}

interface UseDragAndDropReturn<T> {
  // State
  draggedItem: string | null;
  dragOverItem: string | null;
  
  // Actions
  handleDragStart: (e: React.DragEvent, itemId: string) => void;
  handleDragOver: (e: React.DragEvent, itemId: string) => void;
  handleDrop: (e: React.DragEvent, targetItemId: string) => void;
  handleDragLeave: () => void;
}

export function useDragAndDrop<T extends DragAndDropItem>({
  items,
  onReorder,
  storageKey
}: UseDragAndDropProps<T>): UseDragAndDropReturn<T> {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', itemId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(itemId);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetItemId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetItemId) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const draggedIndex = items.findIndex(item => item.id === draggedItem);
    const targetIndex = items.findIndex(item => item.id === targetItemId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const reorderedItems = [...items];
    const [draggedItemData] = reorderedItems.splice(draggedIndex, 1);
    reorderedItems.splice(targetIndex, 0, draggedItemData!);

    // Update order values
    const updatedItems = reorderedItems.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    onReorder(updatedItems);

    // Persist to localStorage if storageKey provided
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(updatedItems));
    }

    setDraggedItem(null);
    setDragOverItem(null);
  }, [items, draggedItem, onReorder, storageKey]);

  const handleDragLeave = useCallback(() => {
    setDragOverItem(null);
  }, []);

  return {
    // State
    draggedItem,
    dragOverItem,
    
    // Actions
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragLeave,
  };
}
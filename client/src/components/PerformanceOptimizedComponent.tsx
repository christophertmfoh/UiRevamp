import React, { memo, useMemo, useCallback, useState } from 'react';
import { debounce } from 'lodash-es';

interface PerformanceOptimizedComponentProps {
  data: any[];
  onUpdate: (id: string, value: any) => void;
  filterText: string;
  isLoading?: boolean;
}

/**
 * Template for Performance-Optimized React Components
 * 
 * Key optimizations:
 * 1. React.memo for component memoization
 * 2. useMemo for expensive computations
 * 3. useCallback for stable function references
 * 4. Debounced actions for frequent updates
 * 5. Virtual scrolling for large lists (when needed)
 */
const PerformanceOptimizedComponent = memo<PerformanceOptimizedComponentProps>(({
  data,
  onUpdate,
  filterText,
  isLoading = false
}) => {
  const [localState, setLocalState] = useState<Map<string, any>>(new Map());

  // Memoize filtered data to avoid recomputation on every render
  const filteredData = useMemo(() => {
    if (!filterText) return data;
    
    return data.filter(item => 
      item.name?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.description?.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [data, filterText]);

  // Memoize expensive calculations
  const dataStats = useMemo(() => {
    return {
      total: data.length,
      filtered: filteredData.length,
      hasFilter: Boolean(filterText),
    };
  }, [data.length, filteredData.length, filterText]);

  // Debounced update function to prevent excessive API calls
  const debouncedUpdate = useMemo(
    () => debounce((id: string, value: any) => {
      onUpdate(id, value);
    }, 500),
    [onUpdate]
  );

  // Stable callback references using useCallback
  const handleItemUpdate = useCallback((id: string, value: any) => {
    // Update local state immediately for responsive UI
    setLocalState(prev => new Map(prev.set(id, value)));
    
    // Debounced update to backend
    debouncedUpdate(id, value);
  }, [debouncedUpdate]);

  const handleItemClick = useCallback((item: any) => {
    console.log('Item clicked:', item.id);
    // Handle item selection
  }, []);

  // Cleanup debounced function on unmount
  React.useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="performance-optimized-component">
      <div className="stats mb-4">
        Showing {dataStats.filtered} of {dataStats.total} items
        {dataStats.hasFilter && (
          <span className="text-sm text-gray-500 ml-2">
            (filtered by "{filterText}")
          </span>
        )}
      </div>

      <div className="items-container">
        {filteredData.map((item) => (
          <OptimizedListItem
            key={item.id}
            item={item}
            localValue={localState.get(item.id)}
            onUpdate={handleItemUpdate}
            onClick={handleItemClick}
          />
        ))}
      </div>
    </div>
  );
});

// Memoized list item component to prevent unnecessary re-renders
const OptimizedListItem = memo<{
  item: any;
  localValue?: any;
  onUpdate: (id: string, value: any) => void;
  onClick: (item: any) => void;
}>(({ item, localValue, onUpdate, onClick }) => {
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(item.id, e.target.value);
  }, [item.id, onUpdate]);

  const handleClick = useCallback(() => {
    onClick(item);
  }, [item, onClick]);

  // Use local value if available, otherwise fall back to item value
  const displayValue = localValue !== undefined ? localValue : item.value;

  return (
    <div 
      className="list-item p-4 border-b cursor-pointer hover:bg-gray-50"
      onClick={handleClick}
    >
      <h3 className="font-medium">{item.name}</h3>
      <input
        type="text"
        value={displayValue || ''}
        onChange={handleInputChange}
        onClick={(e) => e.stopPropagation()} // Prevent item click when editing
        className="mt-2 w-full border rounded px-2 py-1"
        placeholder="Enter value..."
      />
    </div>
  );
});

// Set display names for debugging
PerformanceOptimizedComponent.displayName = 'PerformanceOptimizedComponent';
OptimizedListItem.displayName = 'OptimizedListItem';

export default PerformanceOptimizedComponent;

/**
 * Usage Guidelines:
 * 
 * 1. Always wrap components with React.memo when appropriate
 * 2. Use useMemo for expensive calculations and filtered/sorted data
 * 3. Use useCallback for event handlers and functions passed as props
 * 4. Implement debouncing for frequent user interactions
 * 5. Consider virtual scrolling for lists with 100+ items
 * 6. Lift state up only when necessary - keep local state for UI-only changes
 * 7. Use React DevTools Profiler to identify performance bottlenecks
 */
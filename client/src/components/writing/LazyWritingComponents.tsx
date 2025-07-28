import React, { Suspense, lazy } from 'react';
import { LoadingSkeleton } from '@/components/ui/LoadingStates';
import { useComponentPreloader } from '@/hooks/useComponentPreloader';

/**
 * Phase 5: Intelligent Writing Component Preloading
 * Optimized for sub-100ms creative workflow iteration
 */

// Lazy load writing-specific components with intelligent preloading
const WritingEditor = lazy(() => 
  import('./WritingEditor').then(module => ({ 
    default: module.WritingEditor 
  })).catch(() => ({ 
    default: () => <div className="p-4 text-gray-500">Writing Editor temporarily unavailable</div>
  }))
);

const StoryOutlineEditor = lazy(() => 
  import('./StoryOutlineEditor').then(module => ({ 
    default: module.StoryOutlineEditor 
  })).catch(() => ({ 
    default: () => <div className="p-4 text-gray-500">Story Outline Editor temporarily unavailable</div>
  }))
);

const WritingMetrics = lazy(() => 
  import('../dev/WritingMetrics').then(module => ({ 
    default: module.WritingMetrics 
  })).catch(() => ({ 
    default: () => <div className="p-2 text-sm text-gray-400">Metrics unavailable</div>
  }))
);

// Performance monitoring for lazy loaded components
const withPerformanceTracking = (Component: React.ComponentType<any>, componentName: string) => {
  return React.forwardRef((props: any, ref: any) => {
    const startTime = React.useRef<number>(Date.now());
    
    React.useEffect(() => {
      const renderTime = Date.now() - startTime.current;
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ ${componentName} rendered in ${renderTime}ms`);
      }
    }, []);
    
    return <Component {...props} ref={ref} />;
  });
};

// Enhanced lazy writing editor with preloading
interface LazyWritingEditorProps {
  projectId: string;
  documentId?: string;
  onSave?: (content: string) => void;
  placeholder?: string;
}

export const LazyWritingEditor = React.memo(function LazyWritingEditor(props: LazyWritingEditorProps) {
  const { preloadComponent } = useComponentPreloader();
  
  React.useEffect(() => {
    // Preload related components that might be needed
    preloadComponent('../dev/WritingMetrics').catch(() => {});
    preloadComponent('./StoryOutlineEditor').catch(() => {});
  }, [preloadComponent]);
  
  const TrackedEditor = withPerformanceTracking(WritingEditor, 'WritingEditor');
  
  return (
    <Suspense fallback={
      <LoadingSkeleton 
        className="w-full h-96 rounded-lg" 
        aria-label="Loading writing editor..."
      />
    }>
      <TrackedEditor {...props} />
    </Suspense>
  );
});

// Enhanced lazy story outline editor
interface LazyStoryOutlineEditorProps {
  projectId: string;
  outlineId?: string;
  onStructureChange?: (structure: any) => void;
}

export const LazyStoryOutlineEditor = React.memo(function LazyStoryOutlineEditor(props: LazyStoryOutlineEditorProps) {
  const { preloadComponent } = useComponentPreloader();
  
  React.useEffect(() => {
    // Preload writing editor as it's commonly used together
    preloadComponent('./WritingEditor').catch(() => {});
  }, [preloadComponent]);
  
  const TrackedOutlineEditor = withPerformanceTracking(StoryOutlineEditor, 'StoryOutlineEditor');
  
  return (
    <Suspense fallback={
      <LoadingSkeleton 
        className="w-full h-64 rounded-lg" 
        aria-label="Loading story outline editor..."
      />
    }>
      <TrackedOutlineEditor {...props} />
    </Suspense>
  );
});

// Writing metrics with intelligent loading
interface LazyWritingMetricsProps {
  sessionId?: string;
  showRealTime?: boolean;
}

export const LazyWritingMetrics = React.memo(function LazyWritingMetrics(props: LazyWritingMetricsProps) {
  const TrackedMetrics = withPerformanceTracking(WritingMetrics, 'WritingMetrics');
  
  return (
    <Suspense fallback={
      <div className="w-full h-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
    }>
      <TrackedMetrics {...props} />
    </Suspense>
  );
});

// Hook for preloading writing components
export const useWritingComponentPreloading = () => {
  const { preloadComponent, getPreloadStatus } = useComponentPreloader();
  
  const preloadWritingEditor = React.useCallback(() => {
    return preloadComponent('./WritingEditor');
  }, [preloadComponent]);
  
  const preloadStoryOutlineEditor = React.useCallback(() => {
    return preloadComponent('./StoryOutlineEditor');
  }, [preloadComponent]);
  
  const preloadWritingMetrics = React.useCallback(() => {
    return preloadComponent('../dev/WritingMetrics');
  }, [preloadComponent]);
  
  const preloadAllWritingComponents = React.useCallback(async () => {
    const components = [
      './WritingEditor',
      './StoryOutlineEditor', 
      '../dev/WritingMetrics'
    ];
    
    const results = await Promise.allSettled(
      components.map(comp => preloadComponent(comp))
    );
    
    if (process.env.NODE_ENV === 'development') {
      const successful = results.filter(r => r.status === 'fulfilled').length;
      console.log(`⚡ Preloaded ${successful}/${components.length} writing components`);
    }
    
    return results;
  }, [preloadComponent]);
  
  return {
    preloadWritingEditor,
    preloadStoryOutlineEditor, 
    preloadWritingMetrics,
    preloadAllWritingComponents,
    getWritingEditorStatus: () => getPreloadStatus('./WritingEditor'),
    getStoryOutlineStatus: () => getPreloadStatus('./StoryOutlineEditor'),
    getWritingMetricsStatus: () => getPreloadStatus('../dev/WritingMetrics')
  };
};

// Performance metrics for writing components
export const getWritingComponentMetrics = () => {
  const metrics = {
    totalComponents: 3,
    loadedComponents: 0,
    averageLoadTime: 0,
    lastUpdate: new Date().toISOString()
  };
  
  // This would be enhanced with actual performance tracking
  return metrics;
};
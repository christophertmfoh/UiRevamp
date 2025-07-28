import { useEffect, useCallback, useRef } from 'react';

/**
 * Phase 5: Intelligent Component Preloader
 * Preloads writing components for instant creative workflow
 */

interface PreloadTarget {
  path: string;
  priority: 'high' | 'medium' | 'low';
  trigger?: 'hover' | 'immediate' | 'interaction';
}

const WRITING_COMPONENTS: PreloadTarget[] = [
  { path: '../components/characters/CharacterForm', priority: 'high', trigger: 'immediate' },
  { path: '../components/writing/WritingEditor', priority: 'high', trigger: 'immediate' },
  { path: '../components/projects/ProjectModals', priority: 'medium', trigger: 'hover' },
  { path: '../components/dev/PerformanceDashboard', priority: 'low', trigger: 'interaction' }
];

export const useComponentPreloader = () => {
  const preloadedComponents = useRef<Set<string>>(new Set());
  const preloadPromises = useRef<Map<string, Promise<any>>>(new Map());

  const preloadComponent = useCallback(async (path: string): Promise<any> => {
    if (preloadedComponents.current.has(path)) {
      return preloadPromises.current.get(path);
    }

    const startTime = performance.now();
    
    try {
      const promise = import(path);
      preloadPromises.current.set(path, promise);
      preloadedComponents.current.add(path);
      
      const component = await promise;
      const duration = performance.now() - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ Preloaded ${path} in ${duration.toFixed(2)}ms`);
      }
      
      return component;
    } catch (error) {
      preloadedComponents.current.delete(path);
      preloadPromises.current.delete(path);
      console.warn(`Failed to preload ${path}:`, error);
      throw error;
    }
  }, []);

  const preloadHighPriorityComponents = useCallback(async () => {
    const highPriorityComponents = WRITING_COMPONENTS
      .filter(comp => comp.priority === 'high' && comp.trigger === 'immediate');
    
    const preloadPromises = highPriorityComponents.map(comp => 
      preloadComponent(comp.path).catch(() => null) // Don't fail if one component fails
    );
    
    await Promise.allSettled(preloadPromises);
  }, [preloadComponent]);

  const preloadOnHover = useCallback((path: string) => {
    return () => {
      if (!preloadedComponents.current.has(path)) {
        preloadComponent(path).catch(() => {});
      }
    };
  }, [preloadComponent]);

  const preloadOnInteraction = useCallback((path: string) => {
    return () => {
      if (!preloadedComponents.current.has(path)) {
        preloadComponent(path).catch(() => {});
      }
    };
  }, [preloadComponent]);

  // Preload high priority components immediately
  useEffect(() => {
    const timer = setTimeout(() => {
      preloadHighPriorityComponents();
    }, 100); // Small delay to not block initial render

    return () => clearTimeout(timer);
  }, [preloadHighPriorityComponents]);

  return {
    preloadComponent,
    preloadOnHover,
    preloadOnInteraction,
    preloadedComponents: preloadedComponents.current,
    getPreloadStatus: (path: string) => ({
      isPreloaded: preloadedComponents.current.has(path),
      promise: preloadPromises.current.get(path)
    })
  };
};

/**
 * Hook for preloading writing-specific components
 */
export const useWritingComponentPreloader = () => {
  const { preloadOnHover, preloadOnInteraction } = useComponentPreloader();

  return {
    onCharacterFormHover: preloadOnHover('../components/characters/CharacterForm'),
    onWritingEditorHover: preloadOnHover('../components/writing/WritingEditor'),
    onProjectModalsInteraction: preloadOnInteraction('../components/projects/ProjectModals'),
    onPerformanceDashboardInteraction: preloadOnInteraction('../components/dev/PerformanceDashboard')
  };
};
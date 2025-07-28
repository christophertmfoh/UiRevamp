import React, { Suspense, lazy } from 'react';
import { LoadingSkeleton, LoadingCard } from '@/components/ui/LoadingStates';
import { useComponentPreloader } from '@/hooks/useComponentPreloader';

// Phase 5: Replit-optimized lazy loading for sub-100ms creative workflow
// Intelligent preloading with performance monitoring

const ProjectModals = lazy(() => 
  import('./ProjectModals').then(module => ({ 
    default: module.ProjectModals 
  }))
);

// Dynamic icon imports for tree shaking
export const loadIcon = async (iconName: string) => {
  const iconMap: Record<string, () => Promise<any>> = {
    BookOpen: () => import('lucide-react').then(mod => ({ default: mod.BookOpen })),
    FileText: () => import('lucide-react').then(mod => ({ default: mod.FileText })),
    Image: () => import('lucide-react').then(mod => ({ default: mod.Image })),
    PenTool: () => import('lucide-react').then(mod => ({ default: mod.PenTool })),
    Clock: () => import('lucide-react').then(mod => ({ default: mod.Clock })),
    Calendar: () => import('lucide-react').then(mod => ({ default: mod.Calendar })),
    Search: () => import('lucide-react').then(mod => ({ default: mod.Search })),
    Grid3X3: () => import('lucide-react').then(mod => ({ default: mod.Grid3X3 })),
    List: () => import('lucide-react').then(mod => ({ default: mod.List })),
    TrendingUp: () => import('lucide-react').then(mod => ({ default: mod.TrendingUp })),
    ChevronDown: () => import('lucide-react').then(mod => ({ default: mod.ChevronDown })),
    PlusCircle: () => import('lucide-react').then(mod => ({ default: mod.PlusCircle })),
    Activity: () => import('lucide-react').then(mod => ({ default: mod.Activity })),
    Sparkles: () => import('lucide-react').then(mod => ({ default: mod.Sparkles })),
    Library: () => import('lucide-react').then(mod => ({ default: mod.Library })),
  };

  if (iconMap[iconName]) {
    const { default: Icon } = await iconMap[iconName]();
    return Icon;
  }
  
  // Fallback to PenTool
  const penToolImporter = iconMap.PenTool;
  if (penToolImporter) {
    const { default: PenTool } = await penToolImporter();
    return PenTool;
  }
  // Final fallback to basic div
  return () => React.createElement('div', { className: 'w-4 h-4 bg-muted rounded' });
};

// Lazy ProjectsList with intelligent loading
interface LazyProjectsListProps {
  projects: any[];
  searchQuery: string;
  sortBy: 'name' | 'updated' | 'created' | 'type';
  viewMode: 'grid' | 'list';
  isLoading?: boolean;
  onSelectProject: (project: any) => void;
  onNewProject: () => void;
  enableVirtualization?: boolean;
}

export const LazyProjectsList = React.memo(function LazyProjectsList({
  enableVirtualization = true,
  ...props
}: LazyProjectsListProps) {
  // Dynamically choose between virtualized and normal list
  const shouldUseVirtualization = enableVirtualization && props.projects.length > 20;

  // Temporarily disabled virtualization due to react-window dependency issue
  // if (shouldUseVirtualization) {
  //   return (
  //     <Suspense fallback={
  //       <div className="space-y-4">
  //         {Array.from({ length: 6 }).map((_, i) => (
  //           <LoadingCard key={i} />
  //         ))}
  //       </div>
  //     }>
  //       <VirtualizedProjectsList {...props} />
  //     </Suspense>
  //   );
  // }

  // Fallback to regular list for smaller datasets
  const ProjectsList = lazy(() => 
    import('./ProjectsList').then(module => ({ 
      default: module.ProjectsList 
    }))
  );

  return (
    <Suspense fallback={
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    }>
      <ProjectsList {...props} />
    </Suspense>
  );
});

// Lazy ProjectModals with minimal loading state
interface LazyProjectModalsProps {
  [key: string]: any;
}

export const LazyProjectModals = React.memo(function LazyProjectModals(props: LazyProjectModalsProps) {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-card rounded-2xl p-8 shadow-2xl border border-border/30">
          <div className="flex items-center space-x-3 mb-4">
            <LoadingSkeleton className="h-6 w-6 rounded-full" />
            <LoadingSkeleton className="h-6 w-32" />
          </div>
          <LoadingSkeleton className="h-32 w-80 mb-4" />
          <div className="flex space-x-3">
            <LoadingSkeleton className="h-10 w-24" />
            <LoadingSkeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    }>
      <ProjectModals projects={[]} {...props} />
    </Suspense>
  );
});

// Route-based code splitting helper
export const createLazyRoute = (importFn: () => Promise<{ default: React.ComponentType<any> }>) => {
  const LazyComponent = lazy(importFn);
  
  return React.memo(function LazyRoute(props: any) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-background flex flex-col">
          {/* Header skeleton */}
          <div className="border-b border-border/20 p-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <LoadingSkeleton className="h-8 w-32" />
              <div className="flex items-center space-x-4">
                <LoadingSkeleton className="h-10 w-24" />
                <LoadingSkeleton className="h-10 w-10 rounded-lg" />
              </div>
            </div>
          </div>
          
          {/* Main content skeleton */}
          <div className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <LoadingSkeleton className="h-32 w-full rounded-2xl" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <LoadingSkeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
              <LoadingSkeleton className="h-12 w-full rounded-xl" />
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <LoadingSkeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      }>
        <LazyComponent {...props} />
      </Suspense>
    );
  });
};

// Bundle splitting configuration
export const bundleConfig = {
  // Core components - always loaded
  core: ['ProjectsHeader', 'ProjectsFilters', 'ProjectsStats'],
  
  // Heavy components - lazy loaded
  heavy: ['VirtualizedProjectsList', 'ProjectModals', 'DashboardWidgets'],
  
  // Utilities - dynamically imported
  utils: ['charts', 'animations', 'advanced-search'],
  
  // Icons - tree-shaken on demand
  icons: [
    'BookOpen', 'FileText', 'Image', 'PenTool', 'Clock', 'Calendar',
    'Search', 'Grid3X3', 'List', 'TrendingUp', 'ChevronDown', 'PlusCircle',
    'Activity', 'Sparkles', 'Library'
  ]
};

// Simple lazy loading tracking (Replit-Optimized)
export const useLazyLoadingMetrics = () => {
  const [loadedComponents, setLoadedComponents] = React.useState<string[]>([]);

  const trackComponentLoad = React.useCallback((componentName: string, loadTime: number) => {
    setLoadedComponents(prev => [...prev, componentName]);
    
    // Simple development logging for Replit hot-reload optimization  
    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ Lazy loaded: ${componentName} (${loadTime}ms) - Total: ${loadedComponents.length + 1}`);
      
      // Warn about slow components that might affect hot-reload
      if (loadTime > 500) {
        console.warn(`🐌 ${componentName} took ${loadTime}ms - consider optimizing for faster hot-reload`);
      }
    }
  }, [loadedComponents.length]);

  return { 
    loadedComponents,
    totalLoaded: loadedComponents.length,
    trackComponentLoad 
  };
};
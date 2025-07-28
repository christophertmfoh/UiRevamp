/**
 * Modern React 2025 App Component
 * Replaces old App.tsx with modern patterns, concurrent features, and enhanced UX
 */

import React, { Suspense, useTransition, useDeferredValue } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { TooltipProvider } from '@/components/ui/tooltip';

// Modern components
import { ModernErrorBoundary } from './ModernErrorBoundary';
import { ModernSuspense, ModernSpinner } from './ModernLoadingStates';
import { AccessibilityProvider, SkipToMainContent } from './ModernAccessibility';
import { useModernState } from '@/hooks/useModernState';

// Enhanced theme provider with concurrent features
import { ThemeProvider } from '@/components/theme-provider';
import { ToastProvider } from '@/components/ui/Toast';

// Lazy load heavy components for better performance  
const LandingPage = React.lazy(() => import('@/pages/landing').then(m => ({ default: m.LandingPage })));
const ProjectsPage = React.lazy(() => import('@/components/projects/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const CharacterManager = React.lazy(() => import('@/components/character/CharacterManager').then(m => ({ default: m.CharacterManager })));
const WorldBible = React.lazy(() => import('@/components/world/WorldBible').then(m => ({ default: m.WorldBible })));
const ProjectDashboard = React.lazy(() => import('@/components/project/ProjectDashboard').then(m => ({ default: m.ProjectDashboard })));
const AuthPageRedesign = React.lazy(() => import('@/pages/AuthPageRedesign').then(m => ({ default: m.AuthPageRedesign })));

// Modern routing with concurrent features
import { useLocation } from 'wouter';

interface ModernAppProps {
  enableConcurrentFeatures?: boolean;
  enableOptimisticUpdates?: boolean;
}

export function ModernApp({ 
  enableConcurrentFeatures = true,
  enableOptimisticUpdates = true 
}: ModernAppProps = {}) {
  const [isPending, startTransition] = useTransition();
  const [location] = useLocation();
  
  // Modern state management with React 18 features
  const { 
    deferredUser, 
    deferredAuthState, 
    handleAsyncUpdate,
    isStateReady 
  } = useModernState({
    enableConcurrentFeatures,
    enableOptimisticUpdates
  });

  // Defer location changes for smoother transitions
  const deferredLocation = useDeferredValue(location);

  // Enhanced performance measurement
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@/utils/webVitals').then(({ measurePerformance }) => {
        measurePerformance();
      });
    }
  }, []);

  return (
    <ModernErrorBoundary>
      <AccessibilityProvider>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem
          themes={[
            'light', 
            'dark',
            'system',
            'arctic-focus',
            'golden-hour',
            'midnight-ink',
            'forest-manuscript',
            'starlit-prose',
            'coffee-house'
          ]}
        >
          <QueryClientProvider client={queryClient}>
            <ToastProvider>
              <TooltipProvider>
                <SkipToMainContent />
                
                <div className="min-h-screen bg-background text-foreground">
                  {/* Loading indicator for concurrent transitions */}
                  {isPending && (
                    <div className="fixed top-4 right-4 z-50">
                      <ModernSpinner size="sm" message="Loading..." />
                    </div>
                  )}

                  <main id="main-content" className="focus:outline-none" tabIndex={-1}>
                    <ModernSuspense 
                      fallback={<ModernSpinner context="general" size="lg" />}
                      context="general"
                    >
                      {/* Route content based on deferred location - simplified for now */}
                      {deferredLocation === '/' && <div>Modern Landing Coming Soon</div>}
                      {deferredLocation === '/auth' && <div>Modern Auth Coming Soon</div>}
                      {isStateReady && deferredAuthState && (
                        <>
                          {deferredLocation === '/projects' && <ProjectsPage />}
                          {deferredLocation.startsWith('/dashboard') && <ProjectDashboard />}
                          {deferredLocation.startsWith('/characters') && <CharacterManager />}
                          {deferredLocation.startsWith('/world') && <WorldBible />}
                        </>
                      )}
                      
                      {/* Fallback for unknown routes */}
                      {!['/', '/auth', '/projects'].includes(deferredLocation) && 
                       !deferredLocation.startsWith('/dashboard') &&
                       !deferredLocation.startsWith('/characters') &&
                       !deferredLocation.startsWith('/world') && (
                        <div className="min-h-screen flex items-center justify-center">
                          <div className="text-center">
                            <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
                            <p className="text-muted-foreground mb-4">
                              The page you're looking for doesn't exist.
                            </p>
                            <button 
                              onClick={() => window.history.back()}
                              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                            >
                              Go Back
                            </button>
                          </div>
                        </div>
                      )}
                    </ModernSuspense>
                  </main>
                </div>
              </TooltipProvider>
            </ToastProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </AccessibilityProvider>
    </ModernErrorBoundary>
  );
}

// Enhanced development wrapper with modern features
export function ModernAppWithDevTools() {
  if (process.env.NODE_ENV === 'development') {
    return (
      <>
        <ModernApp />
        <Suspense fallback={null}>
          {React.lazy(() => import('@/components/dev/PerformanceDashboard').then(m => ({ default: m.PerformanceDashboard })))}
        </Suspense>
      </>
    );
  }

  return <ModernApp />;
}

export default ModernApp;
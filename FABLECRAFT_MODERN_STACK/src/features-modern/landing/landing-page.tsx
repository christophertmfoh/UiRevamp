'use client';

import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/shared/components/error-boundary';
import { NavigationHeader } from '@/components/layout/navigation-header';
import { HeroSection } from './components/hero-section';
import { CTASection } from './components/cta-section';
import { TestimonialsSection } from './components/testimonials-section';
import { PricingSection } from './components/pricing-section';
import { FooterSection } from './components/footer-section';
import { cn } from '@/lib/utils';

// Lazy load non-critical components for better performance
const FeatureCards = React.lazy(() =>
  import('./components/feature-cards').then(module => ({
    default: module.FeatureCards,
  }))
);

const ProcessSteps = React.lazy(() =>
  import('./components/process-steps').then(module => ({
    default: module.ProcessSteps,
  }))
);

/**
 * Enhanced TypeScript interfaces for Landing Page
 */
interface LandingPageProps {
  onNavigate: (_view: string) => void;
  onNewProject: () => void;
  onAuth: () => void;
  onLogout: () => Promise<void>;
  user?: {
    username?: string;
    email?: string;
    id?: string;
  } | null;
  isAuthenticated: boolean;
  className?: string;
  variant?: 'default' | 'compact';
}

/**
 * Loading fallback component for lazy-loaded sections
 */
function LoadingFallback({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center py-20', className)}>
      <div className='space-y-4 text-center'>
        <div className='w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto' />
        <p className='text-sm text-muted-foreground'>Loading content...</p>
      </div>
    </div>
  );
}



/**
 * Enhanced Landing Page Component
 *
 * CRITICAL OPTIMIZATIONS IMPLEMENTED:
 * - Component splitting for better maintainability
 * - Implemented lazy loading for performance (FeatureCards, ProcessSteps)
 * - Added error boundaries for graceful error handling
 * - Integrated with modern routing (React Router compatible)
 * - Enhanced accessibility with proper ARIA labels
 * - Theme-aware styling throughout
 * - Responsive design with mobile-first approach
 * - Performance optimized with Suspense boundaries
 * - Added missing sections: Testimonials, Pricing, Footer
 *
 * @param props - Landing page configuration
 * @returns JSX element for the complete landing page
 */
export function LandingPage({
  onNavigate,
  onNewProject,
  onAuth,
  onLogout,
  user,
  isAuthenticated,
  className,
  variant = 'default',
}: LandingPageProps) {
  // Error handler for component-level error reporting
  const handleComponentError = React.useCallback(
    (_error: Error, _errorInfo: React.ErrorInfo) => {
      // Log errors in development, send to error tracking service in production
      if (process.env.NODE_ENV === 'development') {
        // Development error logging would go here
      }
      // In production, you might want to send this to an error tracking service
    },
    []
  );

  return (
    <div
      className={cn('min-h-screen bg-background text-foreground', className)}
      role='main'
      aria-label='Fablecraft landing page'
    >
      {/* Firefly Atmosphere - Natural Floating Effect */}
      <div className='idea-sparks' aria-hidden='true'>
        {/* Primary firefly wave - spread across screen */}
        <div className='spark' style={{ left: '8%', animationDelay: '0s' }} />
        <div
          className='spark spark-small'
          style={{ left: '16%', animationDelay: '3.2s' }}
        />
        <div
          className='spark spark-bright'
          style={{ left: '28%', animationDelay: '1.8s' }}
        />
        <div
          className='spark spark-small'
          style={{ left: '37%', animationDelay: '7.1s' }}
        />
        <div
          className='spark'
          style={{ left: '49%', animationDelay: '2.5s' }}
        />
        <div
          className='spark spark-bright'
          style={{ left: '62%', animationDelay: '5.7s' }}
        />
        <div
          className='spark spark-small'
          style={{ left: '73%', animationDelay: '8.9s' }}
        />
        <div
          className='spark'
          style={{ left: '84%', animationDelay: '4.3s' }}
        />
        <div
          className='spark spark-small'
          style={{ left: '93%', animationDelay: '9.6s' }}
        />

        {/* Secondary wave for natural depth */}
        <div
          className='spark spark-small'
          style={{ left: '12%', animationDelay: '11.2s' }}
        />
        <div
          className='spark'
          style={{ left: '23%', animationDelay: '13.8s' }}
        />
        <div
          className='spark spark-small'
          style={{ left: '41%', animationDelay: '12.5s' }}
        />
        <div
          className='spark spark-bright'
          style={{ left: '58%', animationDelay: '14.7s' }}
        />
        <div
          className='spark spark-small'
          style={{ left: '71%', animationDelay: '16.1s' }}
        />
        <div
          className='spark'
          style={{ left: '89%', animationDelay: '15.4s' }}
        />

        {/* Third wave - gentle fill */}
        <div
          className='spark spark-small'
          style={{ left: '4%', animationDelay: '18.2s' }}
        />
        <div
          className='spark spark-small'
          style={{ left: '19%', animationDelay: '22.4s' }}
        />
        <div
          className='spark spark-small'
          style={{ left: '33%', animationDelay: '19.8s' }}
        />
        <div
          className='spark'
          style={{ left: '46%', animationDelay: '24.1s' }}
        />
        <div
          className='spark spark-small'
          style={{ left: '54%', animationDelay: '23.7s' }}
        />
        <div
          className='spark spark-small'
          style={{ left: '67%', animationDelay: '20.5s' }}
        />
        <div
          className='spark spark-bright'
          style={{ left: '77%', animationDelay: '25.3s' }}
        />
        <div
          className='spark spark-small'
          style={{ left: '85%', animationDelay: '26.8s' }}
        />
        <div
          className='spark spark-small'
          style={{ left: '96%', animationDelay: '21.3s' }}
        />

        {/* Fourth wave - sparse accents */}
        <div
          className='spark spark-small'
          style={{ left: '6%', animationDelay: '28.5s' }}
        />
        <div
          className='spark spark-small'
          style={{ left: '14%', animationDelay: '31.2s' }}
        />
        <div
          className='spark spark-small'
          style={{ left: '26%', animationDelay: '29.7s' }}
        />
        <div
          className='spark spark-small'
          style={{ left: '35%', animationDelay: '32.9s' }}
        />
        <div
          className='spark spark-small'
          style={{ left: '44%', animationDelay: '30.1s' }}
        />
        <div
          className='spark spark-small'
          style={{ left: '56%', animationDelay: '33.6s' }}
        />
        <div
          className='spark spark-small'
          style={{ left: '65%', animationDelay: '34.8s' }}
        />
        <div
          className='spark spark-small'
          style={{ left: '76%', animationDelay: '31.5s' }}
        />
        <div
          className='spark spark-small'
          style={{ left: '87%', animationDelay: '35.2s' }}
        />
        <div
          className='spark spark-small'
          style={{ left: '98%', animationDelay: '36.1s' }}
        />
      </div>
      {/* Navigation Header */}
      <ErrorBoundary onError={handleComponentError}>
        <NavigationHeader
          isAuthenticated={isAuthenticated}
          user={user}
          onAuthClick={onAuth}
          onLogout={onLogout}
          onNavigate={onNavigate}
        />
      </ErrorBoundary>

      {/* Hero Section */}
      <ErrorBoundary onError={handleComponentError}>
        <HeroSection
          onNewProject={onNewProject}
          onNavigateToProjects={() => onNavigate('projects')}
          variant={variant}
        />
      </ErrorBoundary>

      {/* Feature Cards */}
      <ErrorBoundary onError={handleComponentError}>
        <Suspense fallback={<LoadingFallback />}>
          <FeatureCards variant={variant} />
        </Suspense>
      </ErrorBoundary>

      {/* Process Steps */}
      <ErrorBoundary onError={handleComponentError}>
        <Suspense fallback={<LoadingFallback />}>
          <ProcessSteps variant={variant} />
        </Suspense>
      </ErrorBoundary>

      {/* Testimonials Section */}
      <ErrorBoundary onError={handleComponentError}>
        <TestimonialsSection />
      </ErrorBoundary>

      {/* Pricing Section */}
      <ErrorBoundary onError={handleComponentError}>
        <PricingSection
          isAuthenticated={isAuthenticated}
          onAuth={onAuth}
          onNavigate={onNavigate}
        />
      </ErrorBoundary>

      {/* Call-to-Action Section */}
      <ErrorBoundary onError={handleComponentError}>
        <CTASection
          onNewProject={onNewProject}
          onNavigateToProjects={() => onNavigate('projects')}
          variant={variant}
        />
      </ErrorBoundary>

      {/* Footer */}
      <ErrorBoundary onError={handleComponentError}>
        <FooterSection />
      </ErrorBoundary>
    </div>
  );
}

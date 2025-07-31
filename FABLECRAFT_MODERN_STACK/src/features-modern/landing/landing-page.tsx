'use client';

import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/shared/components/error-boundary';
import { ThemeToggle } from '@/features-modern/theme/components/theme-toggle';
import { HeroSection } from './components/hero-section';
import { CTASection } from './components/cta-section';
import { TestimonialsSection } from './components/testimonials-section';
import { PricingSection } from './components/pricing-section';
import { FooterSection } from './components/footer-section';
import { Button } from '@/components/ui/button';
import {
  Feather,
  BookOpen,
  Users,
  ChevronDown,
  User,
  LogOut,
  UserCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
 * Navigation Header Component
 */
function NavigationHeader({
  isAuthenticated,
  user,
  onAuth,
  onLogout,
  onNavigate,
}: Pick<
  LandingPageProps,
  'isAuthenticated' | 'user' | 'onAuth' | 'onLogout' | 'onNavigate'
>) {
  return (
    <nav
      className='relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'
      role='navigation'
      aria-label='Main navigation'
    >
      <div className='flex items-center justify-between'>
        {/* Brand Logo */}
        <div
          className='flex items-center space-x-3 group cursor-pointer'
          onClick={() => onNavigate('home')}
        >
          <div className='w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300'>
            <Feather className='w-5 h-5 text-primary' aria-hidden='true' />
          </div>
          <span className='text-xl font-black text-foreground tracking-wide'>
            Fablecraft
          </span>
        </div>

        {/* Navigation Actions */}
        <div className='flex items-center space-x-4'>
          {/* Authentication Section */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className={cn(
                    'group bg-primary hover:bg-primary/90 text-primary-foreground',
                    'px-4 py-2 font-semibold shadow-md hover:shadow-lg',
                    'transition-all duration-300 hover:scale-105 rounded-xl'
                  )}
                  aria-label={`User menu for ${user?.username || 'User'}`}
                >
                  <span className='flex items-center'>
                    <UserCircle className='mr-2 h-4 w-4' aria-hidden='true' />
                    Welcome {user?.username || 'User'}
                    <ChevronDown
                      className='ml-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-300'
                      aria-hidden='true'
                    />
                  </span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align='end'
                className='w-64 bg-card/95 backdrop-blur-xl border border-border shadow-xl rounded-xl mt-2'
              >
                {/* Workspace Section */}
                <div className='p-2 border-b border-border/20'>
                  <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2'>
                    Workspace
                  </div>
                  <DropdownMenuItem
                    onClick={() => onNavigate('projects')}
                    className='cursor-pointer hover:bg-accent/10 py-3 px-4 rounded-lg transition-colors'
                  >
                    <BookOpen
                      className='mr-3 h-4 w-4 text-primary'
                      aria-hidden='true'
                    />
                    <div>
                      <div className='font-medium'>Creative Workspace</div>
                      <div className='text-xs text-muted-foreground'>
                        Projects, characters & world bible
                      </div>
                    </div>
                  </DropdownMenuItem>
                </div>

                {/* Account Section */}
                <div className='p-2 border-b border-border/20'>
                  <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2'>
                    Account
                  </div>
                  <DropdownMenuItem
                    onClick={() => {
                      /* Profile functionality not implemented yet */
                    }}
                    className='cursor-pointer hover:bg-accent/10 py-3 px-4 rounded-lg transition-colors'
                  >
                    <User
                      className='mr-3 h-4 w-4 text-primary'
                      aria-hidden='true'
                    />
                    <div>
                      <div className='font-medium'>Profile & Settings</div>
                      <div className='text-xs text-muted-foreground'>
                        Manage your account
                      </div>
                    </div>
                  </DropdownMenuItem>
                </div>

                {/* Community Section */}
                <div className='p-2 border-b border-border/20'>
                  <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2'>
                    Community
                  </div>
                  <DropdownMenuItem
                    onClick={() => {
                      /* Community functionality not implemented yet */
                    }}
                    className='cursor-pointer hover:bg-accent/10 py-3 px-4 rounded-lg transition-colors'
                  >
                    <Users
                      className='mr-3 h-4 w-4 text-primary'
                      aria-hidden='true'
                    />
                    <div>
                      <div className='font-medium'>Writer Community</div>
                      <div className='text-xs text-muted-foreground'>
                        Connect with other writers
                      </div>
                    </div>
                  </DropdownMenuItem>
                </div>

                {/* Sign Out */}
                <div className='p-2'>
                  <DropdownMenuItem
                    onClick={onLogout}
                    className='cursor-pointer hover:bg-destructive/10 py-3 px-4 rounded-lg transition-colors'
                  >
                    <LogOut
                      className='mr-3 h-4 w-4 text-destructive'
                      aria-hidden='true'
                    />
                    <span className='font-medium text-destructive'>
                      Sign Out
                    </span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={onAuth}
              className={cn(
                'group bg-primary hover:bg-primary/90 text-primary-foreground',
                'px-4 py-2 font-semibold shadow-md hover:shadow-lg',
                'transition-all duration-300 hover:scale-105 rounded-xl'
              )}
              aria-label='Sign up or sign in to your account'
            >
              <span className='flex items-center'>
                <Users className='mr-2 h-4 w-4' aria-hidden='true' />
                Sign Up / Sign In
              </span>
            </Button>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
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
      {/* Navigation Header */}
      <ErrorBoundary onError={handleComponentError}>
        <NavigationHeader
          isAuthenticated={isAuthenticated}
          user={user}
          onAuth={onAuth}
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

      {/* Feature Cards - Lazy Loaded */}
      <ErrorBoundary onError={handleComponentError}>
        <Suspense fallback={<LoadingFallback />}>
          <FeatureCards variant={variant} />
        </Suspense>
      </ErrorBoundary>

      {/* Process Steps - Lazy Loaded */}
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

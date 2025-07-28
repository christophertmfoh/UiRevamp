/**
 * Modern React 2025 Loading States
 * Enhanced with Suspense, concurrent features, and skeleton loaders
 */

import React, { Suspense, useDeferredValue, useTransition } from 'react';
import { Loader2, FileText, Users, Globe, BookOpen, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

// Enhanced skeleton components for different content types
export function ProjectCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-4 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="h-5 bg-muted rounded w-32"></div>
        <div className="h-4 w-4 bg-muted rounded"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-muted rounded w-full"></div>
        <div className="h-3 bg-muted rounded w-2/3"></div>
      </div>
      <div className="flex items-center justify-between">
        <div className="h-4 bg-muted rounded w-16"></div>
        <div className="h-4 bg-muted rounded w-20"></div>
      </div>
    </div>
  );
}

export function CharacterFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-8 bg-muted rounded-full"></div>
        <div className="h-6 bg-muted rounded w-48"></div>
      </div>
      
      {/* Form fields */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-muted rounded w-24"></div>
          <div className="h-10 bg-muted rounded w-full"></div>
        </div>
      ))}
      
      {/* Action buttons */}
      <div className="flex gap-3 pt-4">
        <div className="h-10 bg-muted rounded w-24"></div>
        <div className="h-10 bg-muted rounded w-20"></div>
      </div>
    </div>
  );
}

export function WorldBibleSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Navigation tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 bg-muted rounded w-20"></div>
        ))}
      </div>
      
      {/* Content sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-5 bg-muted rounded w-32"></div>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded w-full"></div>
              <div className="h-3 bg-muted rounded w-4/5"></div>
              <div className="h-3 bg-muted rounded w-3/5"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Modern loading spinner with context
interface ModernSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  context?: 'projects' | 'characters' | 'world' | 'general';
  message?: string;
  className?: string;
}

export function ModernSpinner({ 
  size = 'md', 
  context = 'general',
  message,
  className 
}: ModernSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  };

  const contextIcons = {
    projects: FileText,
    characters: Users,
    world: Globe,
    general: Loader2
  };

  const contextMessages = {
    projects: 'Loading your creative projects...',
    characters: 'Preparing character profiles...',
    world: 'Building your world...',
    general: 'Loading...'
  };

  const Icon = contextIcons[context];
  const defaultMessage = contextMessages[context];

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Icon className={cn(sizeClasses[size], "animate-spin text-primary")} />
      {(message || defaultMessage) && (
        <p className="text-sm text-muted-foreground text-center">
          {message || defaultMessage}
        </p>
      )}
    </div>
  );
}

// Enhanced loading states with deferred values
interface ModernLoadingStateProps {
  isLoading: boolean;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
  context?: 'projects' | 'characters' | 'world' | 'general';
  fallbackDelay?: number;
}

export function ModernLoadingState({
  isLoading,
  children,
  skeleton,
  context = 'general',
  fallbackDelay = 200
}: ModernLoadingStateProps) {
  const deferredLoading = useDeferredValue(isLoading);
  const [isPending, startTransition] = useTransition();

  // Show skeleton immediately for better UX
  if (isLoading && skeleton) {
    return <>{skeleton}</>;
  }

  // Show spinner for deferred loading
  if (deferredLoading || isPending) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <ModernSpinner context={context} size="md" />
      </div>
    );
  }

  return <>{children}</>;
}

// Suspense wrapper with modern error handling
interface ModernSuspenseProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  context?: 'projects' | 'characters' | 'world' | 'general';
}

export function ModernSuspense({ 
  children, 
  fallback,
  context = 'general' 
}: ModernSuspenseProps) {
  const defaultFallback = (
    <div className="flex items-center justify-center min-h-[300px]">
      <ModernSpinner context={context} size="lg" />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
}

// Grid skeleton for project listings
export function ProjectGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Loading state for character manager with 164+ fields
export function CharacterManagerSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header with character avatar */}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 bg-muted rounded-full"></div>
        <div className="space-y-2">
          <div className="h-6 bg-muted rounded w-32"></div>
          <div className="h-4 bg-muted rounded w-48"></div>
        </div>
      </div>

      {/* Character form sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <CharacterFormSkeleton />
        </div>
        <div className="space-y-6">
          <CharacterFormSkeleton />
        </div>
      </div>
    </div>
  );
}
import React from 'react';

export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`loading-skeleton rounded-md ${className}`} 
         style={{ height: '1em', width: '100%' }} />
  );
}

export function LoadingSpinner({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };
  
  return (
    <div className={`loading-spinner ${sizeClasses[size]}`} />
  );
}

export function LoadingDots() {
  return <div className="loading-dots" />;
}

export function LoadingCard() {
  return (
    <div className="card-enhanced p-lg space-y-md">
      <LoadingSkeleton className="h-8 w-3/4" />
      <LoadingSkeleton className="h-4 w-full" />
      <LoadingSkeleton className="h-4 w-2/3" />
      <div className="flex gap-sm pt-md">
        <LoadingSkeleton className="h-10 w-24" />
        <LoadingSkeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

export function LoadingButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="btn-enhanced gradient-primary text-primary-foreground px-10 py-5 rounded-2xl opacity-50 cursor-not-allowed" disabled>
      <div className="flex items-center gap-sm">
        <LoadingSpinner size="sm" />
        {children}
      </div>
    </button>
  );
}
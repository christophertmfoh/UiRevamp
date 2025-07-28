import React from 'react';

export function LoadingSkeleton({ 
  className = '', 
  width = '100%', 
  height = '1em',
  rounded = 'md' 
}: { 
  className?: string;
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}) {
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  };

  return (
    <div 
      className={`loading-skeleton ${roundedClasses[rounded]} ${className}`} 
      style={{ height, width }}
      role="status"
      aria-label="Loading content"
    />
  );
}

export function LoadingSpinner({ 
  size = 'sm',
  className = ''
}: { 
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };
  
  return (
    <div 
      className={`loading-spinner ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function LoadingDots({ className = '' }: { className?: string }) {
  return (
    <div 
      className={`loading-dots ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

// Enhanced skeleton components for specific use cases
export function LoadingCard({ className = '' }: { className?: string }) {
  return (
    <div className={`surface-elevated rounded-xl p-6 border border-border/30 space-y-4 ${className}`}>
      <div className="flex items-center space-x-4">
        <LoadingSkeleton width="48px" height="48px" rounded="xl" />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton height="20px" width="60%" />
          <LoadingSkeleton height="16px" width="40%" />
        </div>
      </div>
      <div className="space-y-2">
        <LoadingSkeleton height="16px" width="100%" />
        <LoadingSkeleton height="16px" width="80%" />
        <LoadingSkeleton height="16px" width="60%" />
      </div>
      <div className="flex gap-2 pt-2">
        <LoadingSkeleton height="32px" width="80px" rounded="lg" />
        <LoadingSkeleton height="32px" width="80px" rounded="lg" />
      </div>
    </div>
  );
}

export function LoadingProjectCard({ className = '' }: { className?: string }) {
  return (
    <div className={`surface-elevated rounded-xl p-6 border border-border/30 space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <LoadingSkeleton height="24px" width="70%" />
          <LoadingSkeleton height="16px" width="40%" />
        </div>
        <LoadingSkeleton width="24px" height="24px" rounded="md" />
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <LoadingSkeleton height="16px" width="100%" />
        <LoadingSkeleton height="16px" width="85%" />
      </div>
      
      {/* Genre badges */}
      <div className="flex gap-2">
        <LoadingSkeleton height="24px" width="60px" rounded="full" />
        <LoadingSkeleton height="24px" width="80px" rounded="full" />
        <LoadingSkeleton height="24px" width="70px" rounded="full" />
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-2">
        <LoadingSkeleton height="16px" width="30%" />
        <LoadingSkeleton height="16px" width="25%" />
      </div>
    </div>
  );
}

export function LoadingStatsCard({ className = '' }: { className?: string }) {
  return (
    <div className={`surface-elevated rounded-xl p-6 border border-border/30 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <LoadingSkeleton height="32px" width="60px" />
          <LoadingSkeleton height="16px" width="100px" />
        </div>
        <LoadingSkeleton width="48px" height="48px" rounded="xl" />
      </div>
    </div>
  );
}

export function LoadingHeader({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center space-y-2">
        <LoadingSkeleton height="20px" width="200px" className="mx-auto" />
        <LoadingSkeleton height="40px" width="300px" className="mx-auto" />
        <LoadingSkeleton height="18px" width="400px" className="mx-auto" />
      </div>
    </div>
  );
}

export function LoadingTable({ rows = 5, className = '' }: { rows?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Table header */}
      <div className="flex gap-4 p-4 border-b border-border/30">
        <LoadingSkeleton height="16px" width="20%" />
        <LoadingSkeleton height="16px" width="30%" />
        <LoadingSkeleton height="16px" width="25%" />
        <LoadingSkeleton height="16px" width="25%" />
      </div>
      
      {/* Table rows */}
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex gap-4 p-4">
          <LoadingSkeleton height="16px" width="20%" />
          <LoadingSkeleton height="16px" width="30%" />
          <LoadingSkeleton height="16px" width="25%" />
          <LoadingSkeleton height="16px" width="25%" />
        </div>
      ))}
    </div>
  );
}

export function LoadingButton({ 
  children, 
  variant = 'primary',
  size = 'md',
  className = ''
}: { 
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "gradient-primary text-primary-foreground",
    secondary: "surface-elevated text-foreground border border-border",
    outline: "border border-border text-foreground hover:bg-accent/10"
  };
  
  const sizeClasses = {
    sm: "px-3 py-2 text-sm rounded-lg",
    md: "px-4 py-2 rounded-xl",
    lg: "px-6 py-3 text-lg rounded-2xl"
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled
      aria-label="Loading"
    >
      <LoadingSpinner size="sm" />
      {children}
    </button>
  );
}

export function LoadingGrid({ 
  items = 6, 
  cardType = 'default',
  className = '' 
}: { 
  items?: number;
  cardType?: 'default' | 'project' | 'stats';
  className?: string;
}) {
  const CardComponent = {
    default: LoadingCard,
    project: LoadingProjectCard,
    stats: LoadingStatsCard
  }[cardType];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <CardComponent key={index} />
      ))}
    </div>
  );
}
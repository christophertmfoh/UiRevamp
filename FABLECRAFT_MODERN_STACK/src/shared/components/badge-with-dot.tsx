import { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BadgeWithDotProps {
  children: ReactNode;
  className?: string;
  dotClassName?: string;
  badgeClassName?: string;
  'aria-label'?: string;
}

/**
 * Reusable Badge with Pulsing Dot Component
 * Used across multiple landing page sections for consistency
 */
export function BadgeWithDot({
  children,
  className,
  dotClassName,
  badgeClassName,
  'aria-label': ariaLabel,
}: BadgeWithDotProps) {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <div
        className={cn(
          'w-4 h-4 rounded-full animate-pulse bg-primary',
          dotClassName
        )}
        aria-hidden='true'
      />
      <Badge
        className={cn(
          'bg-card/95 text-foreground border-border font-semibold backdrop-blur-md shadow-md hover:shadow-lg transition-shadow duration-300 text-base px-4 py-2',
          badgeClassName
        )}
        aria-label={ariaLabel}
      >
        {children}
      </Badge>
    </div>
  );
}

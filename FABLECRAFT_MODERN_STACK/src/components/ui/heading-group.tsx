'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Heading group size variants
 */
const headingVariants = cva(
  'font-black text-foreground leading-[1.2] tracking-tight drop-shadow-sm',
  {
    variants: {
      size: {
        default: 'text-golden-3xl sm:text-golden-4xl lg:text-golden-5xl xl:text-6xl',
        large: 'text-golden-4xl sm:text-golden-5xl lg:text-6xl xl:text-7xl',
        medium: 'text-golden-2xl sm:text-golden-3xl lg:text-golden-4xl',
        small: 'text-golden-xl sm:text-golden-2xl lg:text-golden-3xl',
        compact: 'text-2xl sm:text-3xl lg:text-4xl',
      }
    },
    defaultVariants: {
      size: 'default'
    }
  }
);

const descriptionVariants = cva(
  'text-muted-foreground leading-relaxed font-medium',
  {
    variants: {
      size: {
        default: 'text-golden-lg sm:text-golden-xl lg:text-golden-2xl',
        large: 'text-golden-xl sm:text-golden-2xl lg:text-golden-3xl',
        medium: 'text-golden-md sm:text-golden-lg lg:text-golden-xl',
        small: 'text-golden-sm sm:text-golden-md lg:text-golden-lg',
        compact: 'text-base sm:text-lg',
      }
    },
    defaultVariants: {
      size: 'default'
    }
  }
);

export interface HeadingGroupProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof headingVariants> {
  /**
   * Badge text to display above the title
   */
  badge?: string;
  /**
   * Main heading text
   */
  title: string;
  /**
   * Optional description text
   */
  description?: string;
  /**
   * Whether to center align the content
   * @default true
   */
  centered?: boolean;
  /**
   * Size variant for the heading and description
   * @default 'default'
   */
  size?: 'default' | 'large' | 'medium' | 'small' | 'compact';
  /**
   * Whether to show the decorative animated dot
   * @default false
   */
  showDot?: boolean;
  /**
   * Custom badge props
   */
  badgeProps?: React.ComponentProps<typeof Badge>;
  /**
   * Heading level for semantic HTML
   * @default 'h2'
   */
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /**
   * Additional class names
   */
  className?: string;
  /**
   * Class name for the heading element
   */
  headingClassName?: string;
  /**
   * Class name for the description element
   */
  descriptionClassName?: string;
  /**
   * Maximum width for the description
   */
  descriptionMaxWidth?: string;
}

/**
 * HeadingGroup Component
 * 
 * A reusable component for the badge+title+description pattern
 * commonly used in section headers throughout the application.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <HeadingGroup
 *   badge="Revolutionary Creative Technology"
 *   title="The Creative Industry's First Complete Multimedia Suite"
 *   description="Break free from scattered tools..."
 * />
 * 
 * // With custom size and dot
 * <HeadingGroup
 *   badge="Features"
 *   title="Powerful Tools for Writers"
 *   size="medium"
 *   showDot
 * />
 * 
 * // As main page heading
 * <HeadingGroup
 *   badge="Welcome"
 *   title="Start Your Creative Journey"
 *   description="Everything you need to bring stories to life"
 *   headingLevel="h1"
 *   size="large"
 * />
 * ```
 * 
 * @accessibility
 * - Uses semantic heading elements
 * - Badge is decorative and doesn't interfere with heading hierarchy
 * - Maintains proper text contrast ratios
 * - Animated dot is marked as decorative (aria-hidden)
 */
export function HeadingGroup({
  badge,
  title,
  description,
  centered = true,
  size = 'default',
  showDot = false,
  badgeProps,
  headingLevel = 'h2',
  className,
  headingClassName,
  descriptionClassName,
  descriptionMaxWidth = 'max-w-4xl',
  ...props
}: HeadingGroupProps) {
  const Heading = headingLevel;

  return (
    <div
      className={cn(
        'heading-group',
        centered && 'text-center',
        className
      )}
      {...props}
    >
      {/* Badge Section */}
      {badge && (
        <div className='flex items-center justify-center gap-2'>
          {showDot && (
            <div
              className='w-4 h-4 rounded-full animate-pulse bg-primary'
              aria-hidden='true'
            />
          )}
          <Badge
            className={cn(
              'bg-card/95 text-foreground border-border font-semibold',
              'backdrop-blur-md shadow-md hover:shadow-lg',
              'transition-shadow duration-300 text-base px-4 py-2'
            )}
            {...badgeProps}
          >
            {badge}
          </Badge>
        </div>
      )}

      {/* Title */}
      <Heading
        className={cn(
          headingVariants({ size }),
          badge ? 'mt-best-friends' : '',
          headingClassName
        )}
      >
        {title}
      </Heading>

      {/* Description */}
      {description && (
        <p
          className={cn(
            descriptionVariants({ size }),
            descriptionMaxWidth,
            centered && 'mx-auto',
            'mt-friends',
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

// Named export
export default HeadingGroup;
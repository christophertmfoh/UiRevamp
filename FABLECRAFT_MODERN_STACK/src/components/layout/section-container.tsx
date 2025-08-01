'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Section container variants
 * Based on existing section-spacing classes from design system
 */
const sectionVariants = cva(
  'relative z-10',
  {
    variants: {
      spacing: {
        default: 'section-spacing',      // 128px (standard sections)
        hero: 'section-spacing-hero',    // 96px (hero sections)
        compact: 'section-spacing-compact', // 64px (compact sections)
        custom: '',                      // For custom padding
      },
      width: {
        default: 'max-w-7xl',
        narrow: 'max-w-5xl',
        wide: 'max-w-screen-2xl',
        full: 'w-full',
      },
      padding: {
        default: 'px-4 sm:px-6 lg:px-8',
        loose: 'px-6 sm:px-8 lg:px-12',
        tight: 'px-4',
        none: '',
      }
    },
    defaultVariants: {
      spacing: 'default',
      width: 'default',
      padding: 'default',
    }
  }
);

export interface SectionContainerProps 
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  /**
   * The HTML element to render
   * @default 'section'
   */
  as?: 'section' | 'div' | 'article' | 'main';
  /**
   * Section spacing variant
   * @default 'default'
   */
  spacing?: 'default' | 'hero' | 'compact' | 'custom';
  /**
   * Max width constraint
   * @default 'default'
   */
  width?: 'default' | 'narrow' | 'wide' | 'full';
  /**
   * Horizontal padding
   * @default 'default'
   */
  padding?: 'default' | 'loose' | 'tight' | 'none';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Section content
   */
  children?: React.ReactNode;
}

/**
 * SectionContainer Component
 * 
 * Provides consistent section spacing and layout based on the design system.
 * Uses mathematical spacing system with section-spacing CSS variables.
 * 
 * @example
 * ```tsx
 * // Standard section
 * <SectionContainer>
 *   <h2>Section Title</h2>
 *   <p>Section content</p>
 * </SectionContainer>
 * 
 * // Hero section with custom spacing
 * <SectionContainer spacing="hero" width="narrow">
 *   <HeroContent />
 * </SectionContainer>
 * 
 * // Compact section with loose padding
 * <SectionContainer spacing="compact" padding="loose">
 *   <FeatureCards />
 * </SectionContainer>
 * 
 * // Custom element type
 * <SectionContainer as="article" spacing="default">
 *   <ArticleContent />
 * </SectionContainer>
 * ```
 * 
 * @accessibility
 * - Uses semantic HTML elements (section by default)
 * - Maintains proper document outline
 * - Responsive spacing adapts to viewport
 */
export function SectionContainer({
  as: Component = 'section',
  spacing = 'default',
  width = 'default',
  padding = 'default',
  className,
  children,
  ...props
}: SectionContainerProps) {
  return (
    <Component
      className={cn(
        sectionVariants({ spacing, width, padding }),
        'mx-auto', // Center the container
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * SectionContent Component
 * 
 * Optional inner wrapper for section content with common patterns
 */
export interface SectionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Content alignment
   * @default 'center'
   */
  align?: 'left' | 'center' | 'right';
  /**
   * Vertical spacing between content items
   * @default 'default'
   */
  spacing?: 'tight' | 'default' | 'loose';
  /**
   * Maximum width for content
   */
  maxWidth?: string;
}

export function SectionContent({
  align = 'center',
  spacing = 'default',
  maxWidth,
  className,
  children,
  ...props
}: SectionContentProps) {
  const spacingClasses = {
    tight: 'space-y-8',
    default: 'space-y-12 lg:space-y-16',
    loose: 'space-y-16 lg:space-y-20',
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div
      className={cn(
        alignClasses[align],
        spacingClasses[spacing],
        maxWidth && 'mx-auto',
        className
      )}
      style={{ maxWidth }}
      {...props}
    >
      {children}
    </div>
  );
}

// Named exports
export default SectionContainer;
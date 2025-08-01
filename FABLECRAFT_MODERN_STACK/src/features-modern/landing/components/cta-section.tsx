'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Enhanced TypeScript interfaces for CTA Section
 */
interface CTASectionProps {
  onNewProject: () => void;
  onNavigateToProjects: () => void;
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
  theme?: 'gradient' | 'solid' | 'outline';
}

/**
 * INTEGRATED CTA SECTION - MATCHING EXISTING DESIGN SYSTEM
 *
 * DESIGN SYSTEM INTEGRATION:
 * - Uses Card/CardContent components like other sections
 * - Matches hover effects (hover:shadow-lg hover:scale-105)
 * - Same background patterns (bg-card, border-border)
 * - Consistent spacing system (section-spacing-compact, mt-acquaintances)
 * - Same icon container styling (bg-primary/10, rounded-xl)
 * - Matches existing visual language and patterns
 *
 * @param props - CTA section configuration
 * @returns JSX element that integrates seamlessly with existing design
 */
export function CTASection({
  onNewProject,
  onNavigateToProjects,
  className,
  variant = 'default',
  theme = 'gradient',
}: CTASectionProps) {
  const isMinimal = variant === 'minimal';

  return (
    <section
      className={cn(
        'relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-spacing-compact',
        className
      )}
      aria-labelledby='cta-heading'
    >
      {/* Status Badge - Matching existing badge styling */}
      <div className='flex justify-center mb-8'>
        <div className='flex items-center justify-center gap-2'>
          <div
            className='w-4 h-4 rounded-full animate-pulse bg-primary'
            aria-hidden='true'
          />
          <Badge className='bg-card/95 text-foreground border-border font-semibold backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow duration-300 text-base px-4 py-2'>
            <Sparkles className='w-4 h-4 mr-2' />
            Join the Creative Revolution
          </Badge>
        </div>
      </div>

      {/* Main CTA Card - Simplified single column layout */}
      <Card
        className={cn(
          'bg-card border-border',
          theme === 'gradient' &&
            'bg-gradient-to-br from-card via-card/95 to-accent/30'
        )}
      >
        <CardContent className='p-8 sm:p-12 lg:p-16 text-center max-w-4xl mx-auto'>
          {/* Icon Container - Centered */}
          {!isMinimal && (
            <div
              className={cn(
                'w-20 h-20 bg-primary/10 hover:bg-primary/20 rounded-2xl',
                'flex items-center justify-center mx-auto mb-6 transition-all duration-500',
                'hover:scale-110 hover:rotate-3 hover:shadow-lg'
              )}
            >
              <Zap
                className='w-10 h-10 text-primary hover:scale-110 transition-transform duration-300'
                aria-hidden='true'
              />
            </div>
          )}

          {/* Main Headline - Centered */}
          <h2
            id='cta-heading'
            className='text-golden-3xl sm:text-golden-4xl lg:text-golden-5xl xl:text-6xl font-black leading-[1.1] tracking-tight mb-6'
          >
            <span className='bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent'>
              Ready to Revolutionize Creative Production?
            </span>
          </h2>

          {/* Supporting Copy - Centered */}
          <p className='text-golden-lg sm:text-golden-xl lg:text-golden-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium mt-friends mb-8'>
            Join thousands of creators who've replaced entire creative workflows
            with one intelligent platform. From concept to publication, from
            script to screen, from silence to symphony — all in one
            revolutionary suite.
          </p>

          {/* CTA Buttons - Centered */}
          <div className='flex flex-col sm:flex-row gap-6 justify-center mt-acquaintances mb-8'>
            <Button
              onClick={onNewProject}
              size='lg'
              className='group relative bg-primary hover:bg-primary/90 text-primary-foreground px-8 lg:px-12 py-4 lg:py-6 text-golden-lg font-semibold shadow-lg hover:shadow-xl rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1'
            >
              <div className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl' />
              <span className='relative flex items-center'>
                Start Creating Free
                <ArrowRight className='ml-3 h-5 w-5 lg:h-6 lg:w-6 group-hover:translate-x-1 transition-transform duration-300' />
              </span>
            </Button>

            <Button
              onClick={onNavigateToProjects}
              variant='outline'
              size='lg'
              className='group border-border hover:bg-accent hover:text-accent-foreground px-8 lg:px-12 py-4 lg:py-6 text-golden-lg font-semibold shadow-md hover:shadow-lg rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1'
            >
              <span className='flex items-center'>
                Watch Demo
                <Zap className='ml-3 h-5 w-5 lg:h-6 lg:w-6 group-hover:scale-110 transition-transform duration-300' />
              </span>
            </Button>
          </div>

          {/* Trust Signal - Centered */}
          <p className='text-sm text-muted-foreground text-center'>
            <span className='font-medium text-foreground'>Free to start</span> •
            Complete multimedia suite •
            <span className='font-medium text-foreground'>
              No vendor lock-in
            </span>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

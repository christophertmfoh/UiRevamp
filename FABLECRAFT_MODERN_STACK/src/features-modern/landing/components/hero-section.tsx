'use client'

import { Button } from '@/components/ui/button';
import { Zap, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

/**
 * Enhanced TypeScript interfaces for Hero Section
 * Following enterprise-grade component architecture
 */
interface HeroSectionProps {
  onNewProject: () => void;
  onNavigateToProjects: () => void;
  className?: string;
  variant?: 'default' | 'compact';
}

/**
 * Enhanced Hero Section Component
 * 
 * ENHANCEMENTS FROM ORIGINAL:
 * - Removed hardcoded animations and colors
 * - Integrated with theme system using CSS custom properties
 * - Added proper TypeScript interfaces
 * - Improved responsive design with better breakpoints
 * - Enhanced accessibility with proper ARIA labels
 * - Scalable component variants
 * - Theme-aware animations and colors
 * 
 * @param props - Hero section configuration
 * @returns JSX element for the hero section
 */
export function HeroSection({ 
  onNewProject, 
  onNavigateToProjects, 
  className,
  variant = 'default'
}: HeroSectionProps) {
  const isCompact = variant === 'compact';
  
  return (
    <section 
      className={cn(
        "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        isCompact ? "py-8 sm:py-12 lg:py-16" : "section-spacing-hero",
        className
      )}
      aria-labelledby="hero-heading"
      role="banner"
    >
      {/* Centered Hero Content */}
      <div className="text-center heading-group max-w-5xl mx-auto">
        <div className="heading-group flex flex-col items-center">
          
          {/* Enhanced Badge with Theme Integration */}
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full animate-pulse bg-primary"
              aria-hidden="true"
            />
            <Badge className="bg-card/95 text-foreground border-border font-semibold backdrop-blur-md shadow-md hover:shadow-lg transition-shadow duration-300 text-base px-4 py-2">
              End-to-End Creative Production Suite
            </Badge>
          </div>
          
          {/* Enhanced Main Heading with Theme-Aware Typography */}
          <h1 
            id="hero-heading"
            className={cn(
              "font-black text-foreground leading-[1.1] tracking-tight drop-shadow-sm mt-best-friends",
              isCompact 
                ? "text-3xl sm:text-4xl lg:text-5xl" 
                : "text-golden-4xl sm:text-golden-5xl lg:text-6xl xl:text-7xl"
            )}
          >
            Where Creative{' '}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Visions Become Reality
            </span>
          </h1>
          
          {/* Enhanced Description with Better Typography */}
          <p className={cn(
            "text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium mt-friends",
            isCompact ? "text-base sm:text-lg" : "text-golden-lg sm:text-golden-xl lg:text-golden-2xl"
          )}>
            The world's first complete multimedia creative suite. Transform ideas into novels, screenplays, 
            graphic novels, and D&D campaigns. Generate storyboards, create videos, compose scores, and build 
            communities. From concept to publication, from script to screen — all powered by AI that 
            understands your creative universe.
          </p>

          {/* Enhanced Action Buttons with Improved Responsive Design */}
          <div className="action-group gap-friends flex-col sm:flex-row justify-center items-center max-w-lg mx-auto sm:max-w-none mt-acquaintances">
            <Button 
              size="lg"
              onClick={onNewProject}
              className={cn(
                "group relative w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground",
                "p-neighbors text-golden-lg font-semibold shadow-lg hover:shadow-xl",
                "rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              )}
              aria-label="Start creating your first multimedia project"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <span className="relative z-10 flex items-center justify-center">
                <Zap className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                Start Creating Free
              </span>
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              onClick={onNavigateToProjects}
              className={cn(
                "group relative w-full sm:w-auto border-border hover:bg-accent hover:text-accent-foreground",
                "p-neighbors text-golden-lg font-semibold shadow-md hover:shadow-lg",
                "rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              )}
              aria-label="Explore multimedia creative examples and templates"
            >
              <span className="relative z-10 flex items-center justify-center">
                <Sparkles className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                Explore Examples
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
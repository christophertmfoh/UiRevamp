'use client'

import { Button } from '@/components/ui/button';
import { PenTool, Library } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        <div className="heading-group">
          
          {/* Enhanced Badge with Theme Integration */}
          <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl transition-all duration-300">
            <div 
              className="w-2 h-2 rounded-full animate-pulse bg-primary"
              aria-hidden="true"
            />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wide leading-tight">
              End-to-End Creative Production Suite
            </span>
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
            Where Stories{' '}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Come to Life
            </span>
          </h1>
          
          {/* Enhanced Description with Better Typography */}
          <p className={cn(
            "text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium mt-friends",
            isCompact ? "text-base sm:text-lg" : "text-golden-lg sm:text-golden-xl lg:text-golden-2xl"
          )}>
            From the first spark of an idea to the final polished manuscript. Craft novels, screenplays, 
            and graphic novels with AI that understands the art of storytelling. Your imagination, 
            amplified by intelligence.
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
              aria-label="Start creating your first story project"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <span className="relative z-10 flex items-center justify-center">
                <PenTool className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                Begin Your Story
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
              aria-label="Browse existing story projects and examples"
            >
              <span className="relative z-10 flex items-center justify-center">
                <Library className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                Browse Stories
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
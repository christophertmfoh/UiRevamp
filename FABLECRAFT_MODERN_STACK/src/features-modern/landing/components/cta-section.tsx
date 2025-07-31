'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Lightbulb, Globe } from 'lucide-react';
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
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
}

/**
 * Enhanced CTA Section Component
 * 
 * ENHANCEMENTS FROM ORIGINAL:
 * - Theme-aware color scheme using CSS custom properties
 * - Improved button components from shared/ui with proper variants
 * - Better mobile responsiveness with improved breakpoints
 * - Removed hardcoded background images and inline styles
 * - Enhanced accessibility with proper ARIA labels and focus management
 * - Added component variants and customization options
 * - Improved TypeScript interfaces with flexible configuration
 * - Better semantic HTML structure
 * 
 * @param props - CTA section configuration
 * @returns JSX element for the CTA section
 */
export function CTASection({ 
  onNewProject, 
  onNavigateToProjects,
  className,
  variant = 'default',
  theme = 'gradient',
  title = "Start Your Creative Revolution",
  subtitle = "Ready to transform any creative idea into complete multimedia production? Join the first true end-to-end AI creative suite that replaces 15+ scattered tools.",
  primaryButtonText = "Create Your First Project",
  secondaryButtonText = "Explore Examples"
}: CTASectionProps) {
  const isCompact = variant === 'compact';
  const isMinimal = variant === 'minimal';
  
  // Theme-aware background classes
  const backgroundClasses = cn(
    "relative overflow-hidden rounded-2xl lg:rounded-3xl border border-border shadow-xl",
    {
      'bg-gradient-to-br from-card via-card/95 to-accent/30': theme === 'gradient',
      'bg-card': theme === 'solid',
      'bg-transparent border-2': theme === 'outline'
    }
  );

  return (
    <section 
      className={cn(
        "relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8",
        isCompact ? "py-12 sm:py-16" : "py-16 sm:py-20 lg:py-32",
        className
      )}
      aria-labelledby="cta-heading"
      role="region"
    >
      <div className={backgroundClasses}>
        
        {/* Theme-aware background effects */}
        {!isMinimal && (
          <>
            {/* Subtle background pattern using CSS custom properties */}
            <div 
              className="absolute inset-0 opacity-10 bg-repeat"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.1) 0%, transparent 50%), 
                                radial-gradient(circle at 80% 50%, hsl(var(--accent) / 0.1) 0%, transparent 50%)`
              }}
              aria-hidden="true"
            />
            
            {/* Floating theme-aware elements */}
            <div className="absolute top-6 right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl" aria-hidden="true" />
            <div className="absolute bottom-6 left-6 w-20 h-20 bg-accent/10 rounded-full blur-xl" aria-hidden="true" />
          </>
        )}
        
        <div className={cn(
          "relative z-10 text-center space-y-6 lg:space-y-8",
          isCompact ? "p-6 sm:p-8 lg:p-12" : "p-8 sm:p-12 lg:p-16"
        )}>
          
          {/* Enhanced Header Section */}
          <div className="space-y-6 lg:space-y-8">
            
            {/* Icon with theme-aware styling */}
            {!isMinimal && (
              <div className={cn(
                "w-20 h-20 bg-primary/10 hover:bg-primary/20 rounded-2xl",
                "flex items-center justify-center mx-auto transition-all duration-500",
                "hover:scale-110 hover:rotate-6 hover:shadow-lg",
                "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
              )}>
                <Zap 
                  className="w-10 h-10 text-primary" 
                  aria-hidden="true"
                />
              </div>
            )}
            
            {/* Enhanced heading with theme integration */}
            <h2 
              id="cta-heading"
              className={cn(
                "font-black leading-[1.1] tracking-tight",
                "bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent",
                isCompact ? "text-2xl sm:text-3xl lg:text-4xl" : "text-3xl sm:text-4xl lg:text-5xl xl:text-6xl"
              )}
            >
              {title}
            </h2>
            
            {/* Enhanced subtitle */}
            <p className={cn(
              "text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium",
              isCompact ? "text-base sm:text-lg" : "text-lg sm:text-xl"
            )}>
              {subtitle}
            </p>
          </div>
          
          {/* Enhanced Button Section with Better Mobile Responsiveness */}
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center max-w-2xl mx-auto">
            
            {/* Primary CTA Button */}
            <Button 
              onClick={onNewProject}
              size="lg"
              className={cn(
                "group relative w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground",
                "px-8 lg:px-12 py-4 lg:py-6 text-base lg:text-lg font-semibold",
                "shadow-lg hover:shadow-xl rounded-xl transition-all duration-300",
                "hover:scale-105 hover:-translate-y-1",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              )}
              aria-label={`${primaryButtonText} - Start creating your story project`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <span className="relative z-10 flex items-center justify-center">
                <Lightbulb 
                  className="mr-3 h-5 w-5 lg:h-6 lg:w-6 group-hover:scale-110 transition-transform duration-300" 
                  aria-hidden="true"
                />
                {primaryButtonText}
              </span>
            </Button>
            
            {/* Secondary CTA Button */}
            <Button 
              onClick={onNavigateToProjects}
              size="lg"
              variant="outline"
              className={cn(
                "group relative w-full sm:w-auto border-border hover:bg-accent hover:text-accent-foreground",
                "px-8 lg:px-12 py-4 lg:py-6 text-base lg:text-lg font-semibold",
                "shadow-md hover:shadow-lg rounded-xl transition-all duration-300",
                "hover:scale-105 hover:-translate-y-1",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              )}
              aria-label={`${secondaryButtonText} - Browse existing story projects`}
            >
              <span className="relative z-10 flex items-center justify-center">
                <Globe 
                  className="mr-3 h-5 w-5 lg:h-6 lg:w-6 group-hover:scale-110 transition-transform duration-300" 
                  aria-hidden="true"
                />
                {secondaryButtonText}
              </span>
            </Button>
          </div>
          
          {/* Optional additional info for detailed variant */}
          {variant === 'default' && (
            <div className="pt-6 border-t border-border/50 mt-8">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Free to start</span> • No credit card required • 
                <span className="font-medium"> Full access</span> to core features
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
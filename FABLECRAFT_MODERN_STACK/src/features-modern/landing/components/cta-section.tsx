'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, ArrowRight, Users, Star, Sparkles } from 'lucide-react';
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
  theme = 'gradient'
}: CTASectionProps) {
  const isMinimal = variant === 'minimal';

  return (
    <section 
      className={cn(
        "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-spacing-compact",
        className
      )}
      aria-labelledby="cta-heading"
    >
      
      {/* Status Badge - Matching existing badge styling */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 rounded-full animate-pulse bg-primary" aria-hidden="true" />
          <Badge 
            className="bg-card/95 text-foreground border-border font-semibold backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow duration-300 text-base px-4 py-2"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Start Your Creative Revolution
          </Badge>
        </div>
      </div>

             {/* Main CTA Card - Using same Card component as other sections */}
       <Card className={cn(
         "bg-card border-border",
         theme === 'gradient' && "bg-gradient-to-br from-card via-card/95 to-accent/30"
       )}>
        <CardContent className="p-8 sm:p-12 lg:p-16">
          
          {/* Content Grid - Same structure as feature cards */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Content Column */}
            <div className="text-center lg:text-left">
              
                             {/* Icon Container - Matching feature cards styling */}
               {!isMinimal && (
                 <div className={cn(
                   "w-20 h-20 bg-primary/10 hover:bg-primary/20 rounded-2xl",
                   "flex items-center justify-center mx-auto lg:mx-0 mb-6 transition-all duration-500",
                   "hover:scale-110 hover:rotate-3 hover:shadow-lg"
                 )}>
                                     <Zap 
                     className="w-10 h-10 text-primary hover:scale-110 transition-transform duration-300" 
                     aria-hidden="true"
                   />
                </div>
              )}
              
              {/* Main Headline - Same typography patterns */}
              <h2 
                id="cta-heading"
                className="text-golden-3xl sm:text-golden-4xl lg:text-golden-5xl xl:text-6xl font-black leading-[1.1] tracking-tight mb-6"
              >
                <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                  Ready to Transform Your Creative Process?
                </span>
              </h2>
              
              {/* Supporting Copy */}
              <p className="text-golden-lg sm:text-golden-xl lg:text-golden-2xl text-muted-foreground max-w-3xl mx-auto lg:mx-0 leading-relaxed font-medium mt-friends mb-8">
                Join thousands of creators who've revolutionized their storytelling workflow. 
                From concept to completion in minutes, not months.
              </p>
              
              {/* CTA Buttons - Same styling as other sections */}
              <div className="flex flex-col sm:flex-row gap-6 lg:justify-start justify-center mt-acquaintances">
                <Button 
                  onClick={onNewProject}
                  size="lg"
                  className="group relative bg-primary hover:bg-primary/90 text-primary-foreground px-8 lg:px-12 py-4 lg:py-6 text-golden-lg font-semibold shadow-lg hover:shadow-xl rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  <span className="relative flex items-center">
                    Start Creating Free
                    <ArrowRight className="ml-3 h-5 w-5 lg:h-6 lg:w-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
                
                <Button 
                  onClick={onNavigateToProjects}
                  variant="outline"
                  size="lg"
                  className="group border-border hover:bg-accent hover:text-accent-foreground px-8 lg:px-12 py-4 lg:py-6 text-golden-lg font-semibold shadow-md hover:shadow-lg rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                >
                  <span className="flex items-center">
                    Watch Demo
                    <Zap className="ml-3 h-5 w-5 lg:h-6 lg:w-6 group-hover:scale-110 transition-transform duration-300" />
                  </span>
                </Button>
              </div>
              
              {/* Trust Signal */}
              <p className="text-sm text-muted-foreground mt-8 lg:text-left text-center">
                <span className="font-medium text-foreground">Free to start</span> • No credit card required • 
                <span className="font-medium text-foreground">Cancel anytime</span>
              </p>
            </div>
            
            {/* Visual Column - Using same card patterns */}
            <div className="relative">
              
              {/* Stats Grid - Matching trust indicator styling */}
              <div className="grid grid-cols-2 gap-6">
                
                {/* Stat Card 1 - Same styling as trust indicator cards */}
                <Card className={cn(
                  "group bg-card hover:bg-accent/50 border-border transition-all duration-500",
                  "hover:shadow-lg hover:scale-105 hover:-translate-y-1"
                )}>
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={cn(
                      "w-12 h-12 bg-primary/10 hover:bg-primary/20 rounded-xl",
                      "flex items-center justify-center mx-auto transition-all duration-300",
                      "group-hover:scale-110 group-hover:rotate-3"
                    )}>
                      <Users className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="mt-best-friends space-y-1">
                      <div className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        50K+
                      </div>
                      <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        Active Creators
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Stat Card 2 */}
                <Card className={cn(
                  "group bg-card hover:bg-accent/50 border-border transition-all duration-500",
                  "hover:shadow-lg hover:scale-105 hover:-translate-y-1"
                )}>
                  <CardContent className="p-6 text-center space-y-4">
                                         <div className={cn(
                       "w-12 h-12 bg-primary/10 hover:bg-primary/20 rounded-xl",
                       "flex items-center justify-center mx-auto transition-all duration-300",
                       "group-hover:scale-110 group-hover:rotate-3"
                     )}>
                       <Star className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                     </div>
                     <div className="mt-best-friends space-y-1">
                       <div className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        4.9★
                      </div>
                      <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        Creator Rating
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Large Feature Card - Matching key benefit styling */}
                <div className="col-span-2">
                  <div className={cn(
                    "group bg-card hover:bg-accent/30 rounded-2xl p-comfortable space-y-6",
                    "border border-border hover:border-primary/50 transition-all duration-500",
                    "hover:shadow-lg hover:scale-105"
                  )}>
                    <div className={cn(
                      "w-16 h-16 bg-primary/10 hover:bg-primary/20 rounded-2xl",
                      "flex items-center justify-center mx-auto transition-all duration-500",
                      "group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg"
                    )}>
                      <Zap className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-golden-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                        Launch Your Story Universe
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
                        Complete creative control with AI assistance. Build worlds, craft characters, and tell stories like never before.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </section>
  );
}
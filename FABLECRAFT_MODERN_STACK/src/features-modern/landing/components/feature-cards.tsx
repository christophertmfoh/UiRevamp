'use client'

import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Lightbulb, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Enhanced TypeScript interfaces for Feature Cards
 */
interface TrustIndicator {
  number: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

interface KeyBenefit {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  category?: string;
}

interface FeatureCardsProps {
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
  showTrustIndicators?: boolean;
  showKeyBenefits?: boolean;
  customTrustIndicators?: TrustIndicator[];
  customKeyBenefits?: KeyBenefit[];
}

/**
 * Default trust indicators data with enhanced structure
 */
const defaultTrustIndicators: TrustIndicator[] = [
  { 
    number: "500M+", 
    label: "Words Generated", 
    icon: CheckCircle,
    description: "Words created by our AI writing assistant"
  },
  { 
    number: "50K+", 
    label: "Stories Created", 
    icon: Lightbulb,
    description: "Complete stories written on our platform"
  },
  { 
    number: "99%", 
    label: "Uptime Guarantee", 
    icon: Zap,
    description: "Reliable service availability"
  },
  { 
    number: "100%", 
    label: "Workflow Integration", 
    icon: CheckCircle,
    description: "Seamless integration with your creative process"
  }
];

/**
 * Default key benefits data with enhanced structure
 */
const defaultKeyBenefits: KeyBenefit[] = [
  {
    icon: CheckCircle,
    title: 'World Bible Intelligence',
    description: 'Create interconnected characters, locations, cultures, and factions with AI that understands your entire creative universe.',
    category: 'World Building'
  },
  {
    icon: Lightbulb,
    title: 'Contextual Story AI',
    description: 'Get intelligent suggestions that respect your established lore, character arcs, and narrative consistency across all projects.',
    category: 'AI Assistance'
  },
  {
    icon: Zap,
    title: 'Visual Production Ready',
    description: 'From concept art to final graphics, transform your written stories into visual masterpieces with integrated design tools.',
    category: 'Visual Design'
  }
];

/**
 * Enhanced Feature Cards Component
 * 
 * ENHANCEMENTS FROM ORIGINAL:
 * - Standardized component props with TypeScript interfaces
 * - Integrated with shared UI components (proper Card, Badge usage)
 * - Added comprehensive accessibility improvements (ARIA labels, descriptions)
 * - Theme-aware styling using CSS custom properties
 * - Removed hardcoded colors and inline styles
 * - Enhanced responsive design
 * - Added component variants and customization options
 * - Improved keyboard navigation and focus management
 * 
 * @param props - Feature cards configuration
 * @returns JSX element for the feature cards section
 */
export const FeatureCards = memo(function FeatureCards({ 
  className = '',
  variant = 'default',
  showTrustIndicators = true,
  showKeyBenefits = true,
  customTrustIndicators,
  customKeyBenefits
}: FeatureCardsProps) {
  const isCompact = variant === 'compact';
  const isDetailed = variant === 'detailed';
  
  const trustIndicators = customTrustIndicators || defaultTrustIndicators;
  const keyBenefits = customKeyBenefits || defaultKeyBenefits;

  return (
    <section 
      className={cn(
        "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        isCompact ? "py-12" : "section-spacing",
        className
      )}
      aria-labelledby="features-heading"
    >
      <div className="text-center space-y-12 lg:space-y-16">
        
        {/* Enhanced Header Section */}
        <div className="heading-group">
          <Badge className="bg-card/95 text-foreground border-border font-semibold backdrop-blur-md shadow-md hover:shadow-lg transition-shadow duration-300 inline-block">
            Revolutionary Creative Technology
          </Badge>
          
          <h2 
            id="features-heading"
            className={cn(
              "font-black text-foreground leading-[1.2] tracking-tight drop-shadow-sm",
              isCompact ? "text-2xl sm:text-3xl lg:text-4xl" : "text-golden-3xl sm:text-golden-4xl lg:text-golden-5xl xl:text-6xl"
            )}
          >
            The Creative Industry's First True End-to-End Suite
          </h2>
          
          <p className={cn(
            "text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium",
            isCompact ? "text-base sm:text-lg" : "text-golden-lg sm:text-golden-xl lg:text-golden-2xl"
          )}>
            Break free from scattered tools. Fablecraft replaces 15+ applications with one intelligent 
            platform that understands your entire creative process from world-building to visual production.
          </p>
        </div>

        {/* Enhanced Trust Indicators Section */}
        {showTrustIndicators && (
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-normal"
            role="region"
            aria-labelledby="trust-indicators-heading"
          >
            <h3 id="trust-indicators-heading" className="sr-only">
              Platform Statistics and Trust Indicators
            </h3>
            
            {trustIndicators.map((indicator, index) => {
              const IconComponent = indicator.icon;
              return (
                <Card 
                  key={index}
                  className={cn(
                    "group bg-card hover:bg-accent/50 border-border transition-all duration-500",
                    "hover:shadow-lg hover:scale-105 hover:-translate-y-1",
                    "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                  )}
                  role="article"
                  aria-label={`${indicator.number} ${indicator.label}`}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={cn(
                      "w-12 h-12 bg-primary/10 hover:bg-primary/20 rounded-xl",
                      "flex items-center justify-center mx-auto transition-all duration-300",
                      "group-hover:scale-110 group-hover:rotate-3"
                    )}>
                      <IconComponent 
                        className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" 
                        aria-hidden="true"
                      />
                    </div>
                    
                    <div className="mt-best-friends space-y-1">
                      <div className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {indicator.number}
                      </div>
                      <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        {indicator.label}
                      </div>
                      {isDetailed && indicator.description && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {indicator.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Enhanced Key Benefits Section */}
        {showKeyBenefits && (
          <div 
            className="grid grid-cols-1 md:grid-cols-3 grid-normal mt-friends"
            role="region"
            aria-labelledby="key-benefits-heading"
          >
            <h3 id="key-benefits-heading" className="sr-only">
              Key Platform Benefits and Features
            </h3>
            
            {keyBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div 
                  key={index}
                  className={cn(
                    "group bg-card hover:bg-accent/30 rounded-2xl p-comfortable space-y-6",
                    "border border-border hover:border-primary/50 transition-all duration-500",
                    "hover:shadow-lg hover:scale-105 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                  )}
                  role="article"
                  tabIndex={0}
                  aria-labelledby={`benefit-title-${index}`}
                  aria-describedby={`benefit-description-${index}`}
                >
                  <div className={cn(
                    "w-16 h-16 bg-primary/10 hover:bg-primary/20 rounded-2xl",
                    "flex items-center justify-center mx-auto transition-all duration-500",
                    "group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg"
                  )}>
                    <IconComponent 
                      className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" 
                      aria-hidden="true"
                    />
                  </div>
                  
                  <div className="mt-best-friends space-y-4 text-center">
                                          <h4 
                        id={`benefit-title-${index}`}
                        className="text-golden-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300"
                      >
                      {benefit.title}
                    </h4>
                    
                                          {isDetailed && benefit.category && (
                        <Badge variant="secondary">
                          {benefit.category}
                        </Badge>
                      )}
                    
                    <p 
                      id={`benefit-description-${index}`}
                      className="text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-relaxed"
                    >
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
});
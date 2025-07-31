'use client'

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Lightbulb, 
  PenTool, 
  Palette, 
  Camera, 
  Music, 
  Share2
} from 'lucide-react';

/**
 * Process step interface
 */
interface ProcessStep {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  detail: string;
  category?: string;
}

/**
 * Process Steps component props
 */
interface ProcessStepsProps {
  className?: string;
  variant?: 'default' | 'compact';
  steps?: ProcessStep[];
}

/**
 * Default process steps data with strategic multimedia pipeline focus (reduced to 6 core steps)
 */
const defaultProcessSteps: ProcessStep[] = [
  { 
    icon: Lightbulb, 
    title: "Ideation & World Building", 
    description: "From concept to living universes",
    detail: "Transform inspiration into rich creative concepts with AI-guided brainstorming and interconnected world creation",
    category: "Foundation"
  },
  { 
    icon: PenTool, 
    title: "Content Creation", 
    description: "Write across multiple formats",
    detail: "Craft novels, screenplays, poetry, and D&D campaigns with AI that understands your world's context",
    category: "Writing & Scripting"
  },
  { 
    icon: Palette, 
    title: "Visual Development", 
    description: "From words to visual concepts",
    detail: "Generate storyboards, concept art, and character designs from your written content",
    category: "Visual Design"
  },
  { 
    icon: Camera, 
    title: "Video Production", 
    description: "Bring storyboards to life",
    detail: "Create professional pre-vis sequences and generate image-to-video content for demos and productions",
    category: "Video Production"
  },
  { 
    icon: Music, 
    title: "Audio & Post-Production", 
    description: "Complete with sound and polish",
    detail: "Generate voices, compose scores, and finalize your multimedia projects with professional editing tools",
    category: "Audio & Finishing"
  },
  { 
    icon: Share2, 
    title: "Publishing & Community", 
    description: "Share and collaborate globally",
    detail: "Publish across platforms, build communities, and collaborate with creators worldwide",
    category: "Distribution"
  }
];

/**
 * Enhanced Process Steps Component
 * 
 * FEATURES:
 * - Theme-aware styling with CSS custom properties
 * - Responsive grid layout that adapts to screen size
 * - Enhanced accessibility with proper ARIA labels
 * - Smooth animations and transitions
 * - Component variants for different use cases
 * 
 * @param props - Process steps configuration
 * @returns JSX element for the process steps section
 */
export function ProcessSteps({ 
  className,
  variant = 'default',
  steps = defaultProcessSteps
}: ProcessStepsProps) {
  const isCompact = variant === 'compact';

  return (
    <section 
      className={cn(
        "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        isCompact ? "py-12" : "section-spacing-compact",
        className
      )}
      aria-labelledby="process-heading"
    >
      <div className="text-center">
        
        {/* Header Section with Mathematical Spacing */}
        <div className="flex flex-col items-center">
          {/* Badge with Pulsing Dot */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 rounded-full animate-pulse bg-primary" />
            <Badge 
              className="bg-card/95 text-foreground border-border font-semibold backdrop-blur-md shadow-md text-base px-4 py-2"
              aria-label="Process workflow indicator"
            >
              How It Works
            </Badge>
          </div>
          
          <h2 
            id="process-heading"
            className={cn(
              "font-black text-foreground leading-[1.2] tracking-tight drop-shadow-sm mt-best-friends",
              isCompact ? "text-2xl sm:text-3xl lg:text-4xl" : "text-3xl sm:text-4xl lg:text-5xl"
            )}
          >
            Your Complete Creative Production Pipeline
          </h2>
          
          <p className={cn(
            "text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium mt-friends",
            isCompact ? "text-base sm:text-lg" : "text-lg sm:text-xl"
          )}>
            Follow our proven 6-stage multimedia production process used by creative professionals worldwide. 
            Each stage builds seamlessly into the next, ensuring your creative vision stays consistent from 
            initial concept to final publication.
          </p>
        </div>

        {/* Process Flow with Mathematical Grid */}
        <div className="relative mt-acquaintances" role="list" aria-label="Writing process steps">
          
          {/* Connection line for desktop */}
          <div 
            className="absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 hidden lg:block rounded-full"
            aria-hidden="true"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 grid-normal">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div 
                  key={index}
                  className="text-center relative group"
                  role="listitem"
                  tabIndex={0}
                  aria-labelledby={`step-title-${index}`}
                  aria-describedby={`step-description-${index} step-detail-${index}`}
                >
                  {/* Step number indicator */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold z-20">
                    {index + 1}
                  </div>
                  
                  {/* Icon container */}
                  <div className={cn(
                    "w-24 h-24 lg:w-28 lg:h-28 bg-card/90 backdrop-blur-sm rounded-2xl lg:rounded-3xl",
                    "flex items-center justify-center mx-auto shadow-lg border border-border",
                    "transition-all duration-500 cursor-pointer relative z-10",
                    "group-hover:shadow-xl group-hover:scale-105 group-hover:-translate-y-2 group-hover:rotate-3",
                    "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                  )}>
                    
                    {/* Hover background effect */}
                    <div className="absolute inset-0 rounded-2xl lg:rounded-3xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Icon */}
                    <div className={cn(
                      "w-12 h-12 lg:w-16 lg:h-16 bg-primary/10 hover:bg-primary/20 rounded-xl lg:rounded-2xl",
                      "flex items-center justify-center shadow-md transition-all duration-500",
                      "group-hover:shadow-lg group-hover:scale-110"
                    )}>
                      <IconComponent 
                        className="w-6 h-6 lg:w-8 lg:h-8 text-primary group-hover:scale-110 transition-transform duration-300" 
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  
                  {/* Content with Mathematical Friendship Spacing */}
                  <div className="group-hover:-translate-y-1 transition-transform duration-300">
                    <h3 
                      id={`step-title-${index}`}
                      className="font-bold text-base lg:text-lg text-foreground group-hover:text-primary transition-colors duration-300 leading-tight mt-best-friends"
                    >
                      {step.title}
                    </h3>
                    
                    <p 
                      id={`step-description-${index}`}
                      className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300 font-medium leading-relaxed mt-best-friends"
                    >
                      {step.description}
                    </p>
                    
                    <p 
                      id={`step-detail-${index}`}
                      className={cn(
                        "text-xs text-muted-foreground transition-all duration-500 font-medium leading-relaxed mt-friends",
                        "opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                      )}
                    >
                      {step.detail}
                    </p>
                    
                    {/* Category badge for detailed view */}
                    {step.category && !isCompact && (
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500 mt-best-friends"
                        )}
                      >
                        {step.category}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
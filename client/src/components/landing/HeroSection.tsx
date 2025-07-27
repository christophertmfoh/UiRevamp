import React from 'react';
import { Button } from '@/components/ui/button';
import { PenTool, Library } from 'lucide-react';

interface HeroSectionProps {
  onNewProject: () => void;
  onNavigateToProjects: () => void;
}

export function HeroSection({ onNewProject, onNavigateToProjects }: HeroSectionProps) {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-20 lg:py-24">
      {/* Centered Hero Content */}
      <div className="text-center space-y-8 lg:space-y-12 max-w-5xl mx-auto">
        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
          {/* Badge */}
          <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-md">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'hsl(var(--orb-primary))' }}></div>
            <span className="text-sm font-bold text-heading-secondary uppercase tracking-[0.15em] leading-tight">
              End-to-End Creative Production Suite
            </span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-heading-primary leading-[1.1] tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
            Where Stories{' '}
            <span className="brand-gradient-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
              Come to Life
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-lg sm:text-xl text-body-primary max-w-3xl mx-auto leading-[1.7] font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
            From the first spark of an idea to the final polished manuscript. Craft novels, screenplays, 
            and graphic novels with AI that understands the art of storytelling. Your imagination, 
            amplified by intelligence.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4 sm:pt-6 justify-center">
            <Button 
              size="lg"
              onClick={onNewProject}
              className="group gradient-primary text-primary-foreground px-10 py-5 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-1 hover:brightness-110 rounded-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 flex items-center">
                <PenTool className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                Begin Your Story
              </span>
            </Button>
            <Button 
              size="lg"
              onClick={onNavigateToProjects}
              className="group gradient-primary text-primary-foreground px-10 py-5 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-1 hover:brightness-110 rounded-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 flex items-center">
                <Library className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                Browse Stories
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
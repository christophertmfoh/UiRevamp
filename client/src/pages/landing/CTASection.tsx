import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Lightbulb, Globe } from 'lucide-react';

interface CTASectionProps {
  onNewProject: () => void;
  onNavigateToProjects: () => void;
}

export function CTASection({ onNewProject, onNavigateToProjects }: CTASectionProps) {
  return (
    <section className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-24 lg:py-32">
      <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-stone-50 via-emerald-50/80 to-amber-50/60 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 border border-stone-300/50 dark:border-slate-600/50 shadow-2xl">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-20 bg-repeat bg-center" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a574' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Floating elements */}
        <div className="absolute top-8 right-8 w-32 h-32 bg-gradient-to-br from-emerald-300/20 to-stone-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-8 left-8 w-24 h-24 bg-gradient-to-br from-stone-300/20 to-amber-400/10 rounded-full blur-xl"></div>
        
        <div className="relative z-10 text-center space-y-8 sm:space-y-12 p-8 sm:p-12 lg:p-16">
          <div className="space-y-8">
            <div className="w-24 h-24 gradient-primary-br rounded-full flex items-center justify-center mx-auto shadow-2xl hover:shadow-3xl hover:scale-110 hover:rotate-6 transition-all duration-500 cursor-pointer">
              <Zap className="w-12 h-12 text-primary-foreground" />
            </div>
            <h2 className="text-display-2 gradient-primary-text">
              Start Your Creative Revolution
            </h2>
            <p className="text-body-large text-muted-foreground max-w-3xl mx-auto">
              Ready to transform any creative idea into complete multimedia production? 
              Join the first true end-to-end AI creative suite that replaces 15+ scattered tools.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center">
            <Button 
              onClick={onNewProject}
              size="lg"
              className="group gradient-primary hover:opacity-80 dark:hover:from-emerald-600 dark:hover:via-stone-600 dark:hover:to-amber-700 text-primary-foreground px-16 py-6 text-xl font-bold shadow-2xl hover:shadow-3xl hover:scale-110 hover:-translate-y-2 transition-all duration-500 rounded-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 flex items-center">
                <Lightbulb className="mr-4 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                Create Your First Project
              </span>
            </Button>
            <Button 
              onClick={onNavigateToProjects}
              size="lg"
              className="group gradient-primary hover:opacity-80 dark:hover:from-emerald-600 dark:hover:via-stone-600 dark:hover:to-amber-700 text-primary-foreground px-16 py-6 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-1 rounded-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 flex items-center">
                <Globe className="mr-4 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                Explore Examples
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
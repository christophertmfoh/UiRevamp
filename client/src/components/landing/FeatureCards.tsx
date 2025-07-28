import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Lightbulb, Zap } from 'lucide-react';

const keyBenefits = [
  {
    icon: CheckCircle,
    title: 'World Bible Intelligence',
    description: 'Create interconnected characters, locations, cultures, and factions with AI that understands your entire creative universe.'
  },
  {
    icon: Lightbulb,
    title: 'Contextual Story AI',
    description: 'Get intelligent suggestions that respect your established lore, character arcs, and narrative consistency across all projects.'
  },
  {
    icon: Zap,
    title: 'Visual Production Ready',
    description: 'From concept art to final graphics, transform your written stories into visual masterpieces with integrated design tools.'
  }
];

const trustIndicators = [
  { number: "500M+", label: "Words Generated", icon: CheckCircle },
  { number: "50K+", label: "Stories Created", icon: Lightbulb },
  { number: "99%", label: "Uptime Guarantee", icon: Zap },
  { number: "100%", label: "Workflow Integration", icon: CheckCircle }
];

interface FeatureCardsProps {
  className?: string;
}

export const FeatureCards = React.memo(function FeatureCards({ className = '' }: FeatureCardsProps) {
  return (
    <section className={`relative z-10 max-w-7xl mx-auto px-8 py-24 ${className}`}>
      <div className="text-center space-y-16">
        <div className="space-y-6">
          <Badge className="bg-card/95 text-foreground border-border font-bold backdrop-blur-md shadow-md">
            Revolutionary Creative Technology
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-heading-primary drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)] leading-[1.2] tracking-tight">
            The Creative Industry's First True End-to-End Suite
          </h2>
          <p className="text-xl text-foreground max-w-3xl mx-auto font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] leading-[1.75] tracking-normal">
            Break free from scattered tools. Fablecraft replaces 15+ applications with one intelligent 
            platform that understands your entire creative process from world-building to visual production.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-4 gap-8">
          {trustIndicators.map((indicator, index) => {
            const IconComponent = indicator.icon;
            return (
              <Card 
                key={index} 
                className="group surface-elevated backdrop-blur-lg border-border hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden relative"
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700" 
                     style={{ background: 'linear-gradient(135deg, hsl(var(--orb-primary) / 0.05) 0%, hsl(var(--orb-secondary) / 0.03) 50%, hsl(var(--orb-primary) / 0.02) 100%)' }}></div>
                
                <CardContent className="relative z-10 p-8 text-center space-y-6">
                  <div className="w-16 h-16 gradient-primary-br rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <IconComponent className="w-8 h-8 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent group-hover:from-primary group-hover:to-foreground transition-all duration-500">
                      {indicator.number}
                    </div>
                    <div className="text-muted-foreground font-semibold group-hover:text-foreground transition-colors duration-300">
                      {indicator.label}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Key Benefits */}
        <div className="desktop-grid-3 gap-xl pt-3xl stagger-children" style={{'--stagger-delay': '150ms'} as React.CSSProperties}>
          {keyBenefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div key={index} className="card-enhanced space-y-lg p-xl rounded-3xl fade-in-up group">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-50/0 to-emerald-50/0 dark:from-stone-900/0 dark:to-emerald-900/0 group-hover:from-stone-50/50 group-hover:to-emerald-50/30 dark:group-hover:from-stone-900/20 dark:group-hover:to-emerald-900/10 transition-all duration-700"></div>
                
                <div className="relative z-10 space-y-6">
                  <div className="w-20 h-20 gradient-primary-br rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <IconComponent className="w-10 h-10 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-heading-2 text-foreground group-hover:text-primary transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-foreground/70 group-hover:text-foreground transition-colors duration-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});
'use client'

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, ArrowRight, CheckCircle, Users, Star, Sparkles } from 'lucide-react';
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
 * MODERN PROFESSIONAL CTA SECTION - COMPLETELY REDESIGNED
 * 
 * MODERN BEST PRACTICES IMPLEMENTED:
 * - Clean, spacious layout with proper visual hierarchy
 * - Compelling value proposition with benefit-driven copy
 * - Social proof integration (stats, testimonials)
 * - Modern grid layout with visual elements
 * - Professional spacing using mathematical progression
 * - Clear information architecture
 * - Engaging visual elements and icons
 * - Mobile-first responsive design
 * 
 * INSPIRED BY: Stripe, Linear, Vercel, and other industry leaders
 * 
 * @param props - CTA section configuration
 * @returns JSX element for the modern CTA section
 */
export function CTASection({ 
  onNewProject, 
  onNavigateToProjects,
  className,
  variant = 'default',
  theme = 'gradient'
}: CTASectionProps) {
  const isMinimal = variant === 'minimal';
  
  // Modern theme-aware background classes
  const backgroundClasses = cn(
    "relative overflow-hidden",
    {
      'bg-gradient-to-br from-primary/5 via-background to-accent/5': theme === 'gradient',
      'bg-card border border-border': theme === 'solid',
      'bg-transparent': theme === 'outline'
    }
  );

  return (
    <section 
      className={cn(
        "relative z-10 w-full py-24 sm:py-32",
        className
      )}
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className={backgroundClasses}>
          
          {/* Modern Background Elements */}
          {!isMinimal && (
            <>
              {/* Subtle grid pattern */}
              <div 
                className="absolute inset-0 opacity-[0.02]"
                style={{
                  backgroundImage: `linear-gradient(hsl(var(--muted-foreground)) 1px, transparent 1px),
                                  linear-gradient(90deg, hsl(var(--muted-foreground)) 1px, transparent 1px)`,
                  backgroundSize: '32px 32px'
                }}
                aria-hidden="true"
              />
              
              {/* Modern floating elements */}
              <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" aria-hidden="true" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" aria-hidden="true" />
            </>
          )}
          
          <div className="relative z-10 py-24 sm:py-32">
            
            {/* Status Badge */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
                <Badge 
                  variant="secondary" 
                  className="bg-background/95 text-foreground border-border font-medium backdrop-blur-sm shadow-sm"
                >
                  <Sparkles className="w-3 h-3 mr-1.5" />
                  Now Available: AI-Powered Story Creation
                </Badge>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Content Column */}
              <div className="text-center lg:text-left">
                
                {/* Main Headline */}
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6">
                  <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                    Ready to Transform
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent">
                    Your Creative Process?
                  </span>
                </h2>
                
                {/* Supporting Copy */}
                <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl lg:max-w-none">
                  Join thousands of creators who've revolutionized their storytelling workflow. 
                  From concept to completion in minutes, not months.
                </p>
                
                {/* Key Benefits */}
                <div className="grid sm:grid-cols-2 gap-4 mb-10">
                  {[
                    'AI-powered world building',
                    '15+ tools in one platform',
                    'Export to any format',
                    'Collaborative workflows'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 lg:justify-start justify-center">
                  <Button 
                    onClick={onNewProject}
                    size="lg"
                    className="group relative bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                    <span className="relative flex items-center">
                      Start Creating Free
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                  
                  <Button 
                    onClick={onNavigateToProjects}
                    variant="outline"
                    size="lg"
                    className="group px-8 py-4 text-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                  >
                    <span className="flex items-center">
                      Watch Demo
                      <Zap className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    </span>
                  </Button>
                </div>
                
                {/* Trust Signal */}
                <p className="text-sm text-muted-foreground mt-6">
                  <span className="font-medium text-foreground">Free to start</span> • No credit card required • 
                  <span className="font-medium text-foreground">Cancel anytime</span>
                </p>
              </div>
              
              {/* Visual Column */}
              <div className="relative">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6">
                  
                  {/* Stat Card 1 */}
                  <div className="bg-background/60 backdrop-blur-sm border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">50K+</div>
                        <div className="text-sm text-muted-foreground">Active Creators</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stat Card 2 */}
                  <div className="bg-background/60 backdrop-blur-sm border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                        <Star className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">4.9★</div>
                        <div className="text-sm text-muted-foreground">Creator Rating</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Large Feature Card */}
                  <div className="col-span-2 bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-border rounded-xl p-8 shadow-sm">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-lg font-semibold mb-2">
                        Launch Your Story Universe
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Complete creative control with AI assistance
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating testimonial */}
                <div className="absolute -bottom-6 -left-6 bg-background border border-border rounded-lg p-4 shadow-lg max-w-xs hidden lg:block">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium">Sarah Chen</div>
                      <div className="text-xs text-muted-foreground">Fantasy Author</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    "Fablecraft helped me complete my trilogy in 6 months instead of 3 years."
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Social Proof */}
            <div className="mt-20 pt-8 border-t border-border/50">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-6">
                  Trusted by creators at leading companies
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                  {['Netflix', 'Disney', 'HBO', 'Amazon Studios', 'Pixar'].map((company, index) => (
                    <div key={index} className="text-sm font-medium text-muted-foreground">
                      {company}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
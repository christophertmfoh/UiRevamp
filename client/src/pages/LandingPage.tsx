import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  PenTool, Sparkles, FolderPlus, Lightbulb, Users, BookOpen, 
  FileText, Bot, Feather, ArrowRight, CheckCircle, Brain,
  Target, Palette, Compass, Edit3, Library, TrendingUp, Award, Star
} from 'lucide-react';
import { Button } from "../shared/components/ui/button";
import { Card, CardContent } from "../shared/components/ui/card";
import { Badge } from "../shared/components/ui/badge";
import { FloatingOrbs } from "../shared/components/FloatingOrbs";

const processSteps = [
  { 
    icon: Lightbulb, 
    title: "Ideation", 
    description: "From spark to story seed",
    detail: "Transform fleeting inspiration into rich narrative foundations with AI guidance"
  },
  { 
    icon: Library, 
    title: "World Crafting", 
    description: "Build living story universes",
    detail: "Characters, places, cultures - all interconnected in your digital story bible"
  },
  { 
    icon: BookOpen, 
    title: "Manuscript Import", 
    description: "Breathe life into existing work",
    detail: "Upload character sheets and documents - AI extracts deep story insights"
  },
  { 
    icon: Compass, 
    title: "Story Architecture", 
    description: "Blueprint your narrative",
    detail: "AI-assisted plotting that weaves through your carefully crafted world"
  },
  { 
    icon: PenTool, 
    title: "Contextual Writing", 
    description: "Write within living worlds",
    detail: "Every word informed by your story bible - characters, places, history at your fingertips"
  },
  { 
    icon: Palette, 
    title: "Visual Storytelling", 
    description: "Pictures worth a thousand words",
    detail: "Generate consistent artwork, storyboards, and multimedia from your narrative"
  }
];

const trustIndicators = [
  { number: "15+", label: "Tools Replaced", icon: Target },
  { number: "50+", label: "AI-Extracted Attributes", icon: Brain },
  { number: "3", label: "Media Formats", icon: Palette },
  { number: "100%", label: "Workflow Integration", icon: CheckCircle }
];

export function LandingPage() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isHoveringSteps, setIsHoveringSteps] = useState(false);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const handleNavigate = (path: string) => {
    setLocation(path);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHoveringSteps) {
        setCurrentStep(prev => (prev + 1) % processSteps.length);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isHoveringSteps]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative transition-all duration-300 overflow-hidden bg-background">
      
      {/* Theme-aware floating orbs */}
      <FloatingOrbs />

      {/* Modern Abstract Background System */}
      <div className="absolute inset-0">
        {/* Theme-aware background orbs */}
        <div className="absolute top-0 -left-4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" 
             style={{ backgroundColor: 'hsl(var(--orb-primary) / 0.3)' }}></div>
        <div className="absolute top-0 -right-4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
             style={{ backgroundColor: 'hsl(var(--orb-secondary) / 0.3)' }}></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"
             style={{ backgroundColor: 'hsl(var(--orb-primary) / 0.2)' }}></div>

        {/* Noise Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            transform: `translateY(${scrollY * 0.05}px)`
          }}
        />

        {/* Animated Geometric Patterns */}
        <svg className="absolute inset-0 w-full h-full opacity-5 dark:opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="0.5" fill="currentColor" className="text-foreground/20"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" style={{ transform: `translateY(${scrollY * 0.1}px)` }}/>
        </svg>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between p-6 lg:p-8 backdrop-blur-sm bg-background/80">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="w-12 h-12 gradient-primary-br rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
            <Feather className="w-6 h-6 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
          </div>
          <span className="text-2xl font-bold font-serif text-foreground drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            Fablecraft
          </span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-20 lg:py-24">
        <div className="text-center space-y-8 lg:space-y-12 max-w-5xl mx-auto">
          <div className="space-y-8 lg:space-y-12">
            {/* Badge */}
            <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-md">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'hsl(var(--orb-primary))' }}></div>
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-[0.15em]">
                End-to-End Creative Production Suite
              </span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 text-foreground drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
              Where Stories{' '}
              <span className="brand-gradient-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                Come to Life
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] leading-relaxed">
              From the first spark of an idea to the final polished manuscript. Craft novels, screenplays, 
              and graphic novels with AI that understands the art of storytelling. Your imagination, 
              amplified by intelligence.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 pt-8 justify-center">
              <Button 
                size="lg"
                onClick={() => handleNavigate('/workspace')}
                className="group relative gradient-primary text-primary-foreground px-10 py-5 text-lg font-semibold shadow-xl hover:shadow-2xl rounded-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                <span className="relative z-10 flex items-center">
                  <PenTool className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  Begin Your Story
                </span>
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="group px-10 py-5 text-lg font-semibold border-2 border-border hover:border-primary/50 rounded-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center">
                  <Library className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  Browse Stories
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {trustIndicators.map((indicator, index) => (
            <div key={index} className="text-center group">
              <div className="mb-4 mx-auto w-16 h-16 gradient-primary-br rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500">
                <indicator.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{indicator.number}</div>
              <div className="text-sm text-muted-foreground font-medium">{indicator.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Process Steps */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Your Creative Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From inspiration to publication, every step enhanced by intelligent assistance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {processSteps.map((step, index) => (
            <Card 
              key={index}
              className={`group transition-all duration-500 cursor-pointer border-2 hover:border-primary/50 hover:shadow-xl hover:scale-105 hover:-translate-y-2 ${
                currentStep === index ? 'border-primary shadow-lg scale-105' : 'border-border'
              }`}
              onMouseEnter={() => {
                setIsHoveringSteps(true);
                setHoveredStep(index);
              }}
              onMouseLeave={() => {
                setIsHoveringSteps(false);
                setHoveredStep(null);
              }}
            >
              <CardContent className="p-8">
                <div className="mb-6 w-16 h-16 gradient-primary-br rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500">
                  <step.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground mb-4">{step.description}</p>
                <p className="text-sm text-muted-foreground/80">{step.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-20 px-8 bg-gradient-to-t from-muted/30 to-transparent">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center space-x-4 group cursor-pointer">
            <div className="w-14 h-14 gradient-primary-br rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <Feather className="w-7 h-7 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-3xl font-bold gradient-primary-text group-hover:text-primary transition-all duration-300">
              Fablecraft
            </span>
          </div>
          <p className="text-xl text-foreground/80 font-medium">
            Where every story finds its voice
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <div className="w-4 h-4 rounded-full animate-pulse" style={{ background: 'linear-gradient(to right, hsl(var(--orb-primary)), hsl(var(--orb-secondary)))' }}></div>
            <span>for storytellers everywhere</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '../../components/theme-toggle';
import { FloatingOrbs } from '../../components/FloatingOrbs';
import { HeroSection } from './HeroSection';
import { CTASection } from './CTASection';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Feather, 
  BookOpen, 
  Users,
  Edit3, 
  ArrowRight,
  Sparkles,
  Brain,
  CheckCircle,
  TrendingUp,
  Award,
  Star,
  Target,
  Compass,
  Palette,
  Moon,
  Sun,
  Lightbulb,
  FileText,
  Image,
  Bookmark,
  Library,
  PenTool,
  ChevronDown,
  User,
  Settings,
  LogOut,
  UserCircle
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onNewProject: () => void;
  onUploadManuscript: () => void;
  onAuth: () => void;
  onLogout: () => Promise<void>;
  user: any;
  isAuthenticated: boolean;
  guideMode: boolean;
  setGuideMode: (mode: boolean) => void;
}





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

export function LandingPage({ 
  onNavigate, 
  onNewProject, 
  onUploadManuscript, 
  onAuth,
  onLogout,
  user,
  isAuthenticated,
  guideMode, 
  setGuideMode 
}: LandingPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isHoveringSteps, setIsHoveringSteps] = useState(false);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Only auto-cycle if not hovering
      if (!isHoveringSteps) {
        setCurrentStep(prev => (prev + 1) % processSteps.length);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isHoveringSteps]);

  // Parallax scrolling effect
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

      {/* Floating Orbs with Parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(var(--orb-primary) / 0.1) 0%, transparent 70%)',
            transform: `translate(${scrollY * 0.02}px, ${scrollY * 0.15}px) scale(${1 + scrollY * 0.0001})`,
            filter: 'blur(40px)'
          }}
        />
        <div 
          className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(var(--orb-secondary) / 0.1) 0%, transparent 70%)',
            transform: `translate(${-scrollY * 0.03}px, ${-scrollY * 0.1}px) scale(${1 + scrollY * 0.0001})`,
            filter: 'blur(30px)'
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 sm:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 gradient-primary-br rounded-2xl flex items-center justify-center shadow-lg">
              <Feather className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-black font-serif text-heading-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-wide">
              Fablecraft
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Authentication Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      className="group gradient-primary text-primary-foreground px-6 py-2 font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-1 rounded-2xl relative overflow-hidden hover:opacity-90"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <span className="relative z-10 flex items-center">
                        <UserCircle className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                        Welcome {user?.username || 'User'}
                        <ChevronDown className="ml-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 bg-card/95 backdrop-blur-xl border border-border/30 shadow-2xl rounded-xl mt-2">
                    {/* Workspace Section */}
                    <div className="p-2 border-b border-border/20">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Workspace</div>
                      <DropdownMenuItem 
                        onClick={() => onNavigate('projects')}
                        className="cursor-pointer hover:bg-accent/10 py-3 px-4 rounded-lg transition-colors text-foreground hover:text-foreground focus:text-foreground"
                      >
                        <BookOpen className="mr-3 h-4 w-4 text-primary" />
                        <div>
                          <div className="font-medium">Creative Workspace</div>
                          <div className="text-xs text-muted-foreground">Projects, characters & world bible</div>
                        </div>
                      </DropdownMenuItem>
                    </div>

                    {/* Account Section */}
                    <div className="p-2 border-b border-border/20">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Account</div>
                      <DropdownMenuItem 
                        onClick={() => console.log('Profile clicked - not implemented yet')}
                        className="cursor-pointer hover:bg-accent/10 py-3 px-4 rounded-lg transition-colors text-foreground hover:text-foreground focus:text-foreground"
                      >
                        <User className="mr-3 h-4 w-4 text-primary" />
                        <div>
                          <div className="font-medium">Profile & Settings</div>
                          <div className="text-xs text-muted-foreground">Manage your account</div>
                        </div>
                      </DropdownMenuItem>
                    </div>

                    {/* Community Section */}
                    <div className="p-2 border-b border-border/20">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Community</div>
                      <DropdownMenuItem 
                        onClick={() => console.log('Community clicked - not implemented yet')}
                        className="cursor-pointer hover:bg-accent/10 py-3 px-4 rounded-lg transition-colors text-foreground hover:text-foreground focus:text-foreground"
                      >
                        <Users className="mr-3 h-4 w-4 text-primary" />
                        <div>
                          <div className="font-medium">Writer Community</div>
                          <div className="text-xs text-muted-foreground">Connect with other writers</div>
                        </div>
                      </DropdownMenuItem>
                    </div>

                    {/* Sign Out */}
                    <div className="p-2">
                      <DropdownMenuItem 
                        onClick={onLogout}
                        className="cursor-pointer hover:bg-destructive/10 py-3 px-4 rounded-lg transition-colors"
                      >
                        <LogOut className="mr-3 h-4 w-4 text-destructive" />
                        <span className="font-medium text-destructive">Sign Out</span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button 
                onClick={onAuth}
                className="group gradient-primary text-primary-foreground px-6 py-2 font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-1 rounded-2xl relative overflow-hidden hover:opacity-90"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 flex items-center">
                  <Users className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  Sign Up / Sign In
                </span>
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section - Value Proposition */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-20 lg:py-24">
        <div className="text-center space-y-8 lg:space-y-12 max-w-5xl mx-auto">
          {/* Business Badge */}
          <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-md">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'hsl(var(--orb-primary))' }}></div>
            <span className="text-sm font-bold text-heading-secondary uppercase tracking-[0.15em] leading-tight">Professional Creative Writing Platform</span>
          </div>
          
          {/* Main Value Proposition */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-heading-primary leading-[1.1] tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
            Replace 15+ Tools with{' '}
            <span className="brand-gradient-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
              One Platform
            </span>
          </h1>
          
          {/* Business Benefit Statement */}
          <p className="text-lg sm:text-xl text-body-primary max-w-3xl mx-auto leading-[1.7] font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
            Professional writers choose FableCraft to streamline their entire creative workflow. 
            From character development to final manuscripts - everything you need in one intelligent platform.
          </p>

          {/* Primary Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4 sm:pt-6 justify-center">
            <Button 
              size="lg"
              onClick={() => onNewProject()}
              className="group gradient-primary text-primary-foreground px-10 py-5 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-1 hover:brightness-110 rounded-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 flex items-center">
                <PenTool className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                Start Free Trial
              </span>
            </Button>
            <Button 
              size="lg"
              onClick={() => onNavigate('projects')}
              className="group gradient-primary text-primary-foreground px-10 py-5 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-1 hover:brightness-110 rounded-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 flex items-center">
                <Library className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                View Demo
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works - Process */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-24">
        <div className="text-center space-y-16">
          <div className="space-y-6">
            <Badge className="bg-card/95 text-foreground border-border font-bold backdrop-blur-md shadow-md">
              How It Works
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-heading-primary drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)] leading-[1.2] tracking-tight">
              Your Complete Writing Workflow
            </h2>
            <p className="text-xl text-foreground max-w-3xl mx-auto font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] leading-[1.75] tracking-normal">
              Follow our proven 6-step process used by professional writers worldwide. Each stage builds 
              seamlessly into the next, ensuring your creative vision stays consistent from start to finish.
            </p>
          </div>

          {/* Process Flow */}
          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-16 left-0 right-0 h-1 gradient-primary dark:from-emerald-600/30 dark:via-stone-600/30 dark:to-amber-600/30 hidden lg:block rounded-full"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {processSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="text-center space-y-4 relative group">

                    
                    <div className="w-28 h-28 bg-card/90 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto shadow-lg border border-border group-hover:shadow-2xl group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 cursor-pointer relative z-10 group-hover:rotate-3">
                      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                           style={{ background: 'linear-gradient(135deg, hsl(var(--orb-primary) / 0.05) 0%, hsl(var(--orb-secondary) / 0.03) 100%)' }}></div>
                      <div className="w-16 h-16 gradient-primary-br rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500">
                        <IconComponent className="w-8 h-8 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                    
                    <div className="space-y-3 group-hover:-translate-y-1 transition-transform duration-300">
                      <h4 className="font-black text-lg text-foreground group-hover:text-primary transition-colors duration-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] leading-[1.3] tracking-tight">{step.title}</h4>
                      <p className="text-sm text-foreground/70 group-hover:text-foreground transition-colors duration-300 font-medium leading-[1.6] tracking-normal">{step.description}</p>
                      <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 font-semibold leading-[1.5] tracking-wide">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>





      {/* Proof & Trust Indicators */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-24">
        <div className="text-center space-y-16">
          <div className="space-y-6">
            <Badge className="bg-card/95 text-foreground border-border font-bold backdrop-blur-md shadow-md">
              Proven Results
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-heading-primary drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)] leading-[1.2] tracking-tight">
              Why Professional Writers Choose FableCraft
            </h2>
            <p className="text-xl text-foreground max-w-3xl mx-auto font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] leading-[1.75] tracking-normal">
              Stop juggling multiple subscriptions and scattered files. Our platform consolidates your entire 
              creative workflow into one powerful, AI-enhanced writing environment.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {trustIndicators.map((indicator, index) => {
              const IconComponent = indicator.icon;
              return (
                <Card key={index} className="group bg-card/90 backdrop-blur-lg border-border hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden relative" 
                      style={{ '--card-hover-shadow': 'hsl(var(--orb-primary) / 0.15)' } as React.CSSProperties}>
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700" 
                       style={{ background: 'linear-gradient(135deg, hsl(var(--orb-primary) / 0.05) 0%, hsl(var(--orb-secondary) / 0.03) 50%, hsl(var(--orb-primary) / 0.02) 100%)' }}></div>
                  
                  <CardContent className="relative z-10 p-8 text-center space-y-6">
                    <div className="w-16 h-16 gradient-primary-br rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <IconComponent className="w-8 h-8 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent group-hover:from-primary group-hover:to-foreground transition-all duration-500">{indicator.number}</div>
                      <div className="text-muted-foreground font-semibold group-hover:text-foreground transition-colors duration-300">{indicator.label}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

        </div>
      </section>

      {/* Testimonials Section - Moved up for better business flow */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-24">
        <div className="text-center space-y-16">
          <div className="space-y-6">
            <Badge className="bg-card/95 text-foreground border-border font-bold backdrop-blur-md shadow-md">
              Trusted by Professional Writers
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-heading-primary drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)] leading-[1.2] tracking-tight">
              What Our Users Are Saying
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group surface-elevated backdrop-blur-lg border-border hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden relative">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700" 
                   style={{ background: 'linear-gradient(135deg, hsl(var(--orb-primary) / 0.05) 0%, hsl(var(--orb-secondary) / 0.03) 50%, hsl(var(--orb-primary) / 0.02) 100%)' }}></div>
              
              <CardContent className="relative z-10 p-8 space-y-6">
                <div className="flex space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground italic leading-relaxed">
                  "FableCraft transformed how I develop characters. The AI understands nuance in ways I never expected, and the 164+ fields capture every detail that matters to my stories."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">SL</span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Sarah Chen</div>
                    <div className="text-sm text-muted-foreground">Fantasy Novelist</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group surface-elevated backdrop-blur-lg border-border hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden relative">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700" 
                   style={{ background: 'linear-gradient(135deg, hsl(var(--orb-primary) / 0.05) 0%, hsl(var(--orb-secondary) / 0.03) 50%, hsl(var(--orb-primary) / 0.02) 100%)' }}></div>
              
              <CardContent className="relative z-10 p-8 space-y-6">
                <div className="flex space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground italic leading-relaxed">
                  "Finally, a platform that gets the creative process. The world bible feature keeps all my storylines consistent, and the collaboration tools let my writing partner contribute seamlessly."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">MR</span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Marcus Rivera</div>
                    <div className="text-sm text-muted-foreground">Screenwriter</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group surface-elevated backdrop-blur-lg border-border hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden relative">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700" 
                   style={{ background: 'linear-gradient(135deg, hsl(var(--orb-primary) / 0.05) 0%, hsl(var(--orb-secondary) / 0.03) 50%, hsl(var(--orb-primary) / 0.02) 100%)' }}></div>
              
              <CardContent className="relative z-10 p-8 space-y-6">
                <div className="flex space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground italic leading-relaxed">
                  "The visual storytelling features are incredible. I can generate consistent character art and storyboards that perfectly match my written descriptions. It's like having a whole creative team."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">AT</span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Alex Thompson</div>
                    <div className="text-sm text-muted-foreground">Graphic Novelist</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section - Moved up for better business flow */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-24">
        <div className="text-center space-y-16">
          <div className="space-y-6">
            <Badge className="bg-card/95 text-foreground border-border font-bold backdrop-blur-md shadow-md">
              Simple, Transparent Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-heading-primary drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)] leading-[1.2] tracking-tight">
              Start Free, Scale with Your Stories
            </h2>
            <p className="text-xl text-foreground max-w-3xl mx-auto font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] leading-[1.75] tracking-normal">
              Whether you're writing your first novel or managing an entire creative universe, we have a plan that grows with your ambition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <Card className="group surface-elevated backdrop-blur-lg border-border hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden relative">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700" 
                   style={{ background: 'linear-gradient(135deg, hsl(var(--orb-primary) / 0.05) 0%, hsl(var(--orb-secondary) / 0.03) 50%, hsl(var(--orb-primary) / 0.02) 100%)' }}></div>
              
              <CardContent className="relative z-10 p-8 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-heading-primary">Storyteller</h3>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-heading-primary">Free</div>
                    <p className="text-muted-foreground">Perfect for getting started</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-foreground">3 Projects</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Character Generation (164+ fields)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-foreground">World Bible</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-foreground">AI Story Assistance</span>
                  </div>
                </div>
                
                <Button 
                  onClick={isAuthenticated ? () => onNavigate('projects') : onAuth}
                  className="w-full btn-enhanced gradient-primary text-primary-foreground px-6 py-3 text-lg font-semibold shadow-xl hover:shadow-2xl rounded-2xl focus-ring"
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Professional Tier */}
            <Card className="group surface-elevated backdrop-blur-lg border-border hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden relative border-primary">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700" 
                   style={{ background: 'linear-gradient(135deg, hsl(var(--orb-primary) / 0.05) 0%, hsl(var(--orb-secondary) / 0.03) 50%, hsl(var(--orb-primary) / 0.02) 100%)' }}></div>
              
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 rounded-bl-lg text-sm font-semibold">
                Most Popular
              </div>
              
              <CardContent className="relative z-10 p-8 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-heading-primary">Professional</h3>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-heading-primary">$19<span className="text-lg text-muted-foreground">/month</span></div>
                    <p className="text-muted-foreground">For serious storytellers</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Unlimited Projects</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Advanced Character AI</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Real-time Collaboration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Export & Publishing Tools</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Priority Support</span>
                  </div>
                </div>
                
                <Button 
                  onClick={isAuthenticated ? () => onNavigate('projects') : onAuth}
                  className="w-full btn-enhanced gradient-primary text-primary-foreground px-6 py-3 text-lg font-semibold shadow-xl hover:shadow-2xl rounded-2xl focus-ring"
                >
                  Start Professional Trial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA - Positioned at the end */}
      <CTASection 
        onNewProject={onNewProject}
        onNavigateToProjects={() => onNavigate('projects')}
      />

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
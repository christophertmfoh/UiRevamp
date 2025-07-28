import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useOptimizedScroll } from '../shared/hooks/useOptimizedScroll';
import { useStableMount } from '../shared/hooks/useStableMount';
import { Button } from '../shared/components/ui/button';
import { Card, CardContent } from '../shared/components/ui/card';
import { ThemeToggle } from '../shared/components/theme-toggle';
import { FloatingOrbs } from '../shared/components/FloatingOrbs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../shared/components/ui/dropdown-menu';
import { 
  Feather, 
  BookOpen, 
  Users,
  Sparkles,
  Brain,
  CheckCircle,
  Target,
  Compass,
  Palette,
  Lightbulb,
  Image,
  Library,
  PenTool,
  ChevronDown,
  User,
  Settings,
  LogOut,
  UserCircle,
  Upload,
  Zap
} from 'lucide-react';

interface LandingPageProps {
  onNavigate?: (view: string) => void;
  onNewProject?: () => void;
  onUploadManuscript?: () => void;
  onAuth?: () => void;
  onLogout?: () => Promise<void>;
  user?: any;
  isAuthenticated?: boolean;
  guideMode?: boolean;
  setGuideMode?: (mode: boolean) => void;
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
    detail: "From scene cards to chapter outlines - structure that serves your vision"
  },
  { 
    icon: Palette, 
    title: "Visual Development", 
    description: "See your story world",
    detail: "Character portraits, mood boards, and scene visualizations powered by AI"
  },
  { 
    icon: PenTool, 
    title: "Writing & Refinement", 
    description: "Craft your masterpiece",
    detail: "Smart suggestions that understand your voice, style, and story needs"
  }
];

const trustIndicators = [
  { icon: Target, number: "10K+", label: "Words Generated Daily" },
  { icon: Brain, number: "50+", label: "Character Attributes" },
  { icon: CheckCircle, number: "99.9%", label: "Uptime Reliability" },
  { icon: Users, number: "5K+", label: "Active Writers" }
];

const features = [
  {
    icon: Brain,
    title: "AI-Powered Character Development",
    description: "Import manuscripts and watch AI extract 50+ character attributes automatically",
    benefit: "Save 15+ hours per character"
  },
  {
    icon: Library,
    title: "Unified Creative Workspace",
    description: "Characters, outlines, prose, and visual assets in one interconnected system",
    benefit: "Replace 5+ scattered tools"
  },
  {
    icon: Zap,
    title: "Context-Aware Writing Assistant",
    description: "AI suggestions based on your story bible, characters, and world-building",
    benefit: "Maintain consistency effortlessly"
  },
  {
    icon: Image,
    title: "Visual Storytelling Suite",
    description: "Generate character portraits, scene artwork, and storyboards from your narrative",
    benefit: "Professional visuals without design skills"
  }
];

export function LandingPage({ 
  onNavigate = () => {}, 
  onNewProject = () => {}, 
  onUploadManuscript = () => {}, 
  onAuth = () => {},
  onLogout = async () => {},
  user = null,
  isAuthenticated = false,
  guideMode = false,
  setGuideMode = () => {}
}: LandingPageProps = {}) {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isHoveringSteps, setIsHoveringSteps] = useState(false);
  
  // Senior-level performance optimizations
  const isMounted = useStableMount(150);
  const scrollY = useOptimizedScroll();

  // Parallax effect calculations with proper performance optimization
  const parallaxStyles = useMemo(() => {
    const factor = scrollY * 0.5;
    const slowFactor = scrollY * 0.3;
    const fastFactor = scrollY * 0.8;
    
    return {
      heroTransform: `translateY(${factor}px)`,
      noiseTransform: `translateY(${slowFactor}px) rotate(${scrollY * 0.01}deg)`,
      gridTransform: `translateY(${scrollY * 0.1}px)`,
      orb1Transform: `translate(${scrollY * 0.02}px, ${scrollY * 0.15}px) scale(${1 + scrollY * 0.0001})`,
      orb2Transform: `translate(${-scrollY * 0.03}px, ${-scrollY * 0.1}px) scale(${1 + scrollY * 0.0001})`,
      backgroundShift: `translateY(${scrollY * 0.2}px)`
    };
  }, [scrollY]);

  useEffect(() => {
    if (!isHoveringSteps) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % processSteps.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isHoveringSteps]);

  const handleNewProject = () => {
    console.log('Creating new project...');
    onNewProject();
  };

  const handleNavigateToProjects = () => {
    console.log('Navigating to projects...');
    setLocation('/workspace');
    onNavigate('projects');
  };

  const handleNavigate = (view: string) => {
    onNavigate(view);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative transition-all duration-300 overflow-hidden bg-gradient-to-br from-stone-50 via-amber-50/20 to-emerald-50/10 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">

      {/* Theme-aware floating orbs */}
      <FloatingOrbs />

      {/* Advanced Background System with Mesh Gradients */}
      <div className="absolute inset-0">
        {/* Light Mode Mesh Gradient */}
        <div className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/80 via-amber-100/40 to-stone-100/60"></div>
          <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-stone-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>
        </div>

        {/* Dark Mode Mesh Gradient */}
        <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-amber-950/20 to-stone-950/80"></div>
          <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-800/30 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-amber-800/20 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-stone-800/25 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        {/* Noise Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            transform: parallaxStyles.noiseTransform
          }}
        />

        {/* Animated Geometric Patterns */}
        <svg className="absolute inset-0 w-full h-full opacity-5 dark:opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="0.5" fill="currentColor" className="text-foreground/20"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" style={{ transform: parallaxStyles.gridTransform }}/>
        </svg>
      </div>

      {/* Floating Orbs with Parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(var(--orb-primary) / 0.1) 0%, transparent 70%)',
            transform: parallaxStyles.orb1Transform,
            filter: 'blur(40px)'
          }}
        />
        <div 
          className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(var(--orb-secondary) / 0.1) 0%, transparent 70%)',
            transform: parallaxStyles.orb2Transform,
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
            <span className="text-2xl font-black font-serif text-foreground drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-wide">
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
                  <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border border-border/30 shadow-2xl rounded-xl mt-2">
                    <DropdownMenuItem 
                      onClick={() => handleNavigate('projects')}
                      className="cursor-pointer hover:bg-accent/10 py-3 px-4 rounded-lg transition-colors text-foreground hover:text-foreground focus:text-foreground"
                    >
                      <BookOpen className="mr-3 h-4 w-4 text-primary" />
                      <span className="font-medium">Your Projects</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => console.log('Account clicked - not implemented yet')}
                      className="cursor-pointer hover:bg-accent/10 py-3 px-4 rounded-lg transition-colors text-foreground hover:text-foreground focus:text-foreground"
                    >
                      <User className="mr-3 h-4 w-4 text-primary" />
                      <span className="font-medium">Account</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => console.log('Community clicked - not implemented yet')}
                      className="cursor-pointer hover:bg-accent/10 py-3 px-4 rounded-lg transition-colors text-foreground hover:text-foreground focus:text-foreground"
                    >
                      <Users className="mr-3 h-4 w-4 text-primary" />
                      <span className="font-medium">Community</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => console.log('Settings clicked - not implemented yet')}
                      className="cursor-pointer hover:bg-accent/10 py-3 px-4 rounded-lg transition-colors text-foreground hover:text-foreground focus:text-foreground"
                    >
                      <Settings className="mr-3 h-4 w-4 text-primary" />
                      <span className="font-medium">Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2 border-border/30" />
                    <DropdownMenuItem 
                      onClick={onLogout}
                      className="cursor-pointer hover:bg-destructive/10 py-3 px-4 rounded-lg transition-colors"
                    >
                      <LogOut className="mr-3 h-4 w-4 text-destructive" />
                      <span className="font-medium text-destructive">Sign Out</span>
                    </DropdownMenuItem>
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
            
            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section with Parallax */}
      <section className="relative z-10 min-h-[90vh] flex items-center justify-center px-6 sm:px-8" style={{ transform: parallaxStyles.heroTransform }}>
        <div className="max-w-6xl mx-auto text-center">
          {/* Hero Badge */}
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">Revolutionary AI Writing Platform</span>
          </div>

          {/* Main Hero Text */}
          <h1 className="text-display-1 mb-8 text-foreground font-black tracking-tight">
            Where Stories 
            <span className="gradient-primary-text"> Come to Life</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            From the first spark of an idea to the final polished manuscript. Build worlds, develop characters, 
            and craft narratives with AI that understands the art of storytelling.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg"
              onClick={handleNewProject}
              className="group gradient-primary text-primary-foreground px-8 py-4 font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-1 rounded-2xl relative overflow-hidden text-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 flex items-center">
                <PenTool className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                Begin Your Story
              </span>
            </Button>
            <Button 
              size="lg"
              onClick={onUploadManuscript}
              variant="outline"
              className="group border-2 border-primary/50 text-foreground hover:bg-primary/10 px-8 py-4 font-semibold transition-all duration-300 hover:scale-105 rounded-2xl text-lg"
            >
              <Upload className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              Upload Manuscript
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="text-center group">
                <div className="flex items-center justify-center mb-3">
                  <indicator.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{indicator.number}</div>
                <div className="text-sm text-muted-foreground">{indicator.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creative Process Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-heading-1 mb-6 text-foreground font-bold">
            Your Creative Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the evolution of storytelling through our integrated workflow
          </p>
        </div>

        <div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          onMouseEnter={() => setIsHoveringSteps(true)}
          onMouseLeave={() => setIsHoveringSteps(false)}
        >
          {/* Process Steps */}
          <div className="space-y-6">
            {processSteps.map((step, index) => (
              <Card
                key={index}
                className={`group cursor-pointer transition-all duration-500 hover:scale-105 glass-card ${
                  currentStep === index 
                    ? 'ring-2 ring-primary shadow-2xl shadow-primary/20' 
                    : 'hover:shadow-xl'
                }`}
                onClick={() => setCurrentStep(index)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      currentStep === index 
                        ? 'bg-primary text-primary-foreground shadow-lg' 
                        : 'bg-muted group-hover:bg-primary group-hover:text-primary-foreground'
                    }`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground mb-3">{step.description}</p>
                      <p className="text-sm text-muted-foreground/80">{step.detail}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Visual Preview */}
          <div className="relative">
            <div className="aspect-square rounded-3xl glass-card p-8 flex items-center justify-center">
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <processSteps[currentStep].icon className="w-24 h-24 text-primary animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-heading-1 mb-6 text-foreground font-bold">
            Everything You Need to Write
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Replace scattered tools and fragmented workflows with one powerful, integrated platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:scale-105 transition-all duration-500 glass-card hover:shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      <span>{feature.benefit}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 py-24 text-center">
        <div className="glass-card rounded-3xl p-12">
          <h2 className="text-heading-1 mb-6 text-foreground font-bold">
            Ready to Transform Your Writing?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Join thousands of writers who've discovered the future of storytelling
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={handleNewProject}
              className="group gradient-primary text-primary-foreground px-8 py-4 font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-1 rounded-2xl relative overflow-hidden text-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 flex items-center">
                <PenTool className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                Start Creating Now
              </span>
            </Button>
            <Button 
              size="lg"
              onClick={handleNavigateToProjects}
              variant="outline"
              className="group border-2 border-primary/50 text-foreground hover:bg-primary/10 px-8 py-4 font-semibold transition-all duration-300 hover:scale-105 rounded-2xl text-lg"
            >
              <BookOpen className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              Explore Features
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Spacer */}
      <div className="h-24"></div>
    </div>
  );
}
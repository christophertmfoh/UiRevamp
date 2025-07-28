import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useOptimizedScroll } from '../shared/hooks/useOptimizedScroll';
import { useStableMount } from '../shared/hooks/useStableMount';
import { Button } from '../shared/components/ui/button';
import { Card, CardContent } from '../shared/components/ui/card';
import { ThemeToggle } from '../shared/components/theme-toggle';
import { FloatingOrbs } from '../shared/components/FloatingOrbs';
import { HeroSection } from './landing/HeroSection';
import { CTASection } from './landing/CTASection';
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
  isAuthenticated = false
}: LandingPageProps = {}) {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isHoveringSteps, setIsHoveringSteps] = useState(false);
  
  // Senior-level performance optimizations
  const isMounted = useStableMount(150);
  const scrollY = useOptimizedScroll();

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      setLocation(path);
    }
  };

  const handleNewProject = () => {
    if (onNewProject) {
      onNewProject();
    } else {
      setLocation('/workspace');
    }
  };

  const handleNavigateToProjects = () => {
    if (onNavigate) {
      onNavigate('projects');
    } else {
      setLocation('/projects');
    }
  };

  const handleUploadManuscript = () => {
    if (onUploadManuscript) {
      onUploadManuscript();
    } else {
      console.log('Upload manuscript functionality');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Only auto-cycle if not hovering
      if (!isHoveringSteps) {
        setCurrentStep(prev => (prev + 1) % processSteps.length);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isHoveringSteps]);

  // Memoized style calculations for performance
  const parallaxStyles = useMemo(() => ({
    noiseTransform: `translateY(${scrollY * 0.05}px)`,
    gridTransform: `translateY(${scrollY * 0.1}px)`,
    orb1Transform: `translate(${scrollY * 0.02}px, ${scrollY * 0.15}px) scale(${1 + scrollY * 0.0001})`,
    orb2Transform: `translate(${-scrollY * 0.03}px, ${-scrollY * 0.1}px) scale(${1 + scrollY * 0.0001})`
  }), [scrollY]);

  // Prevent render until stable mount to avoid ResizeObserver issues
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
            {/* Theme Toggle */}
            <ThemeToggle />
            
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
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection 
        onNewProject={handleNewProject}
        onNavigateToProjects={handleNavigateToProjects}
      />

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

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything You Need to Tell Your Story
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools that work together seamlessly, powered by AI that understands storytelling
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group transition-all duration-500 cursor-pointer border-2 hover:border-primary/50 hover:shadow-xl hover:scale-105 hover:-translate-y-2"
            >
              <CardContent className="p-8">
                <div className="mb-6 w-16 h-16 gradient-primary-br rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <Sparkles className="w-4 h-4 text-primary mr-2" />
                  <span className="text-sm text-primary font-medium">{feature.benefit}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Start Your Journey Today
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you're starting fresh or importing existing work
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="group hover:shadow-xl transition-all duration-500 hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="mb-6 w-20 h-20 gradient-primary-br rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500">
                <PenTool className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Start From Scratch</h3>
              <p className="text-muted-foreground mb-6">
                Begin with a blank canvas and let AI guide you through character creation, world-building, and story structure
              </p>
              <Button 
                onClick={handleNewProject}
                className="group gradient-primary text-primary-foreground px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 rounded-xl"
              >
                <span className="relative z-10 flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  Create New Project
                </span>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-500 hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="mb-6 w-20 h-20 gradient-primary-br rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500">
                <Upload className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Import Existing Work</h3>
              <p className="text-muted-foreground mb-6">
                Upload manuscripts, character sheets, or documents and watch AI extract rich story insights automatically
              </p>
              <Button 
                onClick={handleUploadManuscript}
                variant="outline"
                className="px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 rounded-xl border-2 hover:border-primary/50"
              >
                <span className="flex items-center">
                  <Upload className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  Upload Manuscript
                </span>
              </Button>
            </CardContent>
          </Card>
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
              onMouseEnter={() => setIsHoveringSteps(true)}
              onMouseLeave={() => setIsHoveringSteps(false)}
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

      {/* CTA Section */}
      <CTASection 
        onNewProject={handleNewProject}
        onNavigateToProjects={handleNavigateToProjects}
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
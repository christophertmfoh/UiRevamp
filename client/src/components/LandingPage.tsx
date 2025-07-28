import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from './theme-toggle';
import { FloatingOrbs } from './FloatingOrbs';
import { HeroSection } from './landing/HeroSection';
import { CTASection } from './landing/CTASection';
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
                  <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border border-border/30 shadow-2xl rounded-xl mt-2">
                    <DropdownMenuItem 
                      onClick={() => onNavigate('projects')}
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
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-20 lg:py-24">
        {/* Centered Hero Content */}
        <div className="text-center space-y-8 lg:space-y-12 max-w-5xl mx-auto">
          <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-md">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'hsl(var(--orb-primary))' }}></div>
              <span className="text-sm font-bold text-heading-secondary uppercase tracking-[0.15em] leading-tight">End-to-End Creative Production Suite</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-heading-primary leading-[1.1] tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
              Where Stories{' '}
              <span className="brand-gradient-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                Come to Life
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-body-primary max-w-3xl mx-auto leading-[1.7] font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
              From the first spark of an idea to the final polished manuscript. Craft novels, screenplays, 
              and graphic novels with AI that understands the art of storytelling. Your imagination, 
              amplified by intelligence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4 sm:pt-6 justify-center">
              <Button 
                size="lg"
                onClick={() => onNewProject()}
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
                onClick={() => onNavigate('projects')}
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

      {/* Complete Process Pipeline */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-24">
        <div className="text-center space-y-16">
          <div className="space-y-6">
            <Badge className="bg-card/95 text-foreground border-border font-bold backdrop-blur-md shadow-md">
              End-to-End Creative Production
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-heading-primary drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)] leading-[1.2] tracking-tight">
              From Idea to Final Media
            </h2>
            <p className="text-xl text-foreground max-w-3xl mx-auto font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] leading-[1.75] tracking-normal">
              Our intelligent 6-stage pipeline replaces 15+ scattered tools. Create novels, screenplays, 
              graphic novels with generated visuals, audio, and video - all in one unified workflow.
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





      {/* Trust & Social Proof */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-24">
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

          {/* Key Benefits */}
          <div className="desktop-grid-3 gap-xl pt-3xl stagger-children" style={{'--stagger-delay': '150ms'}}>
            <div className="card-enhanced space-y-lg p-xl rounded-3xl fade-in-up">
              <div className="absolute inset-0 bg-gradient-to-br from-stone-50/0 to-emerald-50/0 dark:from-stone-900/0 dark:to-emerald-900/0 group-hover:from-stone-50/50 group-hover:to-emerald-50/30 dark:group-hover:from-stone-900/20 dark:group-hover:to-emerald-900/10 transition-all duration-700"></div>
              
              <div className="relative z-10 space-y-6">
                <div className="w-20 h-20 gradient-primary-br rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <CheckCircle className="w-10 h-10 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-heading-2 text-foreground group-hover:text-primary transition-colors duration-300">World Bible Intelligence</h3>
                <p className="text-foreground/70 group-hover:text-foreground transition-colors duration-300 leading-relaxed">
                  Create interconnected characters, locations, cultures, and factions with AI that understands your entire creative universe.
                </p>
              </div>
            </div>
            
            <div className="card-enhanced space-y-lg p-xl rounded-3xl fade-in-up">
              <div className="absolute inset-0 bg-gradient-to-br from-stone-50/0 to-emerald-50/0 dark:from-stone-900/0 dark:to-emerald-900/0 group-hover:from-stone-50/50 group-hover:to-emerald-50/30 dark:group-hover:from-stone-900/20 dark:group-hover:to-emerald-900/10 transition-all duration-700"></div>
              
              <div className="relative z-10 space-y-6">
                <div className="w-20 h-20 gradient-primary-br dark:from-stone-600 dark:via-emerald-700 dark:to-amber-800 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <TrendingUp className="w-10 h-10 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-heading-2 text-foreground group-hover:text-primary transition-colors duration-300">Document AI Extraction</h3>
                <p className="text-foreground/70 group-hover:text-foreground transition-colors duration-300 leading-relaxed">
                  Upload character sheets and documents - our AI extracts 50+ attributes automatically with intelligent field mapping.
                </p>
              </div>
            </div>
            
            <div className="card-enhanced space-y-lg p-xl rounded-3xl fade-in-up">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 to-stone-50/0 dark:from-amber-900/0 dark:to-stone-900/0 group-hover:from-amber-50/50 group-hover:to-stone-50/30 dark:group-hover:from-amber-900/20 dark:group-hover:to-stone-900/10 transition-all duration-700"></div>
              
              <div className="relative z-10 space-y-6">
                <div className="w-20 h-20 gradient-primary-br dark:from-amber-700 dark:via-stone-700 dark:to-emerald-800 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Award className="w-10 h-10 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-heading-2 text-stone-800 dark:text-stone-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300">Visual Production Ready</h3>
                <p className="text-stone-600 dark:text-stone-300 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors duration-300 leading-relaxed">
                  Generate consistent character visuals, storyboards, and multimedia content for novels, screenplays, and graphic novels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
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
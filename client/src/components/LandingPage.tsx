import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from './theme-toggle';
import { 
  Feather, 
  BookOpen, 
  Users,
  Edit3, 
  ArrowRight,
  Globe,
  Sparkles,
  Brain,
  CheckCircle,
  TrendingUp,
  Award,
  Star,
  Zap,
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
  PenTool
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onNewProject: () => void;
  onUploadManuscript: () => void;
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
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-emerald-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative transition-all duration-500 overflow-hidden">

      {/* Top to middle gradient overlay */}
      <div className="absolute inset-x-0 top-0 h-[70vh] bg-gradient-to-b from-stone-900/20 via-stone-900/10 to-transparent dark:from-slate-900/40 dark:via-slate-900/20 dark:to-transparent pointer-events-none z-[1]"></div>
      
      {/* Enhanced HD Fantasy/Novel Background with Multi-layer Parallax */}
      <div className="absolute inset-0" style={{ transform: 'translateZ(0)' }}>
        {/* Far Background - Mountain Peaks */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70 dark:opacity-50"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80')`,
            transform: `translateY(${scrollY * 0.05}px) scale(1.2)`,
            filter: 'brightness(1.1) contrast(1.2) saturate(1.2)'
          }}
        />
        
        {/* Mid Background - Forest Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-bottom bg-no-repeat opacity-60 dark:opacity-40"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80')`,
            transform: `translateY(${scrollY * 0.15}px) scale(1.15)`,
            filter: 'brightness(1.05) contrast(1.15) saturate(1.15)',
          }}
        />
        
        {/* Foreground - Misty Forest Floor */}
        <div 
          className="absolute inset-0 bg-cover bg-bottom bg-no-repeat opacity-50 dark:opacity-35"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80')`,
            transform: `translateY(${scrollY * 0.25}px) scale(1.1)`,
            filter: 'brightness(1.0) contrast(1.1) saturate(1.1) blur(0.5px)',
          }}
        />
        
        {/* Earth tone overlay matching forest palette */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-stone-900/10 via-emerald-900/5 to-amber-900/8 dark:from-stone-900/20 dark:via-emerald-900/10 dark:to-amber-900/15"
          style={{ transform: `translateY(${scrollY * 0.08}px)` }}
        />
        
        {/* Paper texture overlay with parallax */}
        <div 
          className="absolute inset-0 opacity-15 dark:opacity-8"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a574' fill-opacity='0.05'%3E%3Cpath d='M20 20h160v160H20V20zm10 10v140h140V30H30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '120px 120px',
            transform: `translateY(${scrollY * 0.08}px)`
          }}
        />
        
        {/* Floating earth tone elements with enhanced parallax */}
        <div 
          className="absolute top-1/4 left-1/3 w-40 h-40 bg-emerald-700/8 dark:bg-emerald-600/5 rounded-full blur-3xl"
          style={{ 
            transform: `translateY(${scrollY * 0.3}px) rotate(${scrollY * 0.02}deg)`
          }}
        ></div>
        <div 
          className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-stone-600/10 dark:bg-stone-500/8 rounded-full blur-2xl"
          style={{ 
            transform: `translateY(${scrollY * -0.25}px) rotate(${scrollY * -0.03}deg)`
          }}
        ></div>
        <div 
          className="absolute top-2/3 left-1/6 w-24 h-24 bg-amber-700/8 dark:bg-amber-600/6 rounded-full blur-xl"
          style={{ 
            transform: `translateY(${scrollY * 0.35}px) rotate(${scrollY * 0.04}deg)`
          }}
        ></div>
        

        
        {/* Ancient scroll decorations */}
        <div 
          className="absolute top-20 right-20 w-6 h-40 opacity-25 dark:opacity-15"
          style={{ 
            transform: `translateY(${scrollY * 0.35}px) rotate(15deg)`,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='120' viewBox='0 0 24 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 0v120M6 12l12-6M6 36l12-6M6 60l12-6M6 84l12-6M6 108l12-6' stroke='%23d4a574' stroke-width='0.8' fill='none'/%3E%3C/svg%3E")`
          }}
        ></div>
        
        {/* Additional mystical elements */}
        <div 
          className="absolute bottom-20 left-20 w-8 h-60 opacity-20 dark:opacity-12"
          style={{ 
            transform: `translateY(${scrollY * -0.25}px) rotate(-10deg)`,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='180' viewBox='0 0 32 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16 0v180M8 20l16-8M8 50l16-8M8 80l16-8M8 110l16-8M8 140l16-8M8 170l16-8' stroke='%23d4a574' stroke-width='1' fill='none'/%3E%3C/svg%3E")`
          }}
        ></div>
      </div>
      
      {/* Ambient story-themed lighting with parallax */}
      <div 
        className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-amber-200/20 to-orange-300/15 dark:from-amber-500/8 dark:to-orange-600/4 rounded-full blur-3xl animate-pulse"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      ></div>
      <div 
        className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-br from-orange-200/15 to-red-300/10 dark:from-orange-500/4 dark:to-red-600/2 rounded-full blur-2xl animate-pulse" 
        style={{ 
          animationDelay: '1s',
          transform: `translateY(${scrollY * -0.08}px)`
        }}
      ></div>
      <div 
        className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-yellow-200/10 to-amber-300/8 dark:from-yellow-400/3 dark:to-amber-500/2 rounded-full blur-3xl animate-pulse" 
        style={{ 
          animationDelay: '2s',
          transform: `translate(-50%, -50%) translateY(${scrollY * 0.15}px)`
        }}
      ></div>

      {/* Navigation */}
      <nav className="relative z-10 px-8 py-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-stone-600 to-emerald-700 dark:from-stone-500 dark:to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Feather className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black font-serif text-stone-900 dark:text-stone-50 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-wide">
              Fablecraft
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button 
              onClick={() => onNavigate('projects')}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-stone-300/60 dark:border-stone-600/30 text-stone-700 dark:text-stone-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-400 dark:hover:border-emerald-600 px-6 py-2 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Your Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-24">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Main Content */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-10">
              <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-stone-100/80 dark:bg-stone-900/30 border border-stone-300 dark:border-stone-700/50">
                <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-[0.15em] leading-tight">End-to-End Creative Production Suite</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-stone-900 dark:text-stone-50 leading-[1.1] tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
                Where Stories{' '}
                <span className="bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 dark:from-emerald-500 dark:via-stone-500 dark:to-amber-600 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                  Come to Life
                </span>
              </h1>
              
              <p className="text-xl text-stone-800 dark:text-stone-200 max-w-2xl leading-[1.8] font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] tracking-wide">
                From the first spark of an idea to the final polished manuscript. Craft novels, screenplays, 
                and graphic novels with AI that understands the art of storytelling. Your imagination, 
                amplified by intelligence.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 pt-6">
                <Button 
                  size="lg"
                  onClick={() => onNewProject()}
                  className="group bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 hover:from-emerald-700 hover:via-stone-700 hover:to-amber-800 dark:from-emerald-500 dark:via-stone-500 dark:to-amber-600 dark:hover:from-emerald-600 dark:hover:via-stone-600 dark:hover:to-amber-700 text-white px-10 py-5 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-1 rounded-2xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10 flex items-center">
                    <BookOpen className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    Begin Your Story
                    <Feather className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  </span>
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => onNavigate('projects')}
                  className="group border-2 border-stone-400 dark:border-stone-500/40 text-stone-700 dark:text-stone-200 bg-white/80 dark:bg-slate-800/50 hover:bg-gradient-to-r hover:from-stone-50 hover:to-emerald-50 dark:hover:from-stone-900/20 dark:hover:to-emerald-900/20 hover:border-emerald-600 dark:hover:border-emerald-500 px-10 py-5 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-0.5 rounded-2xl backdrop-blur-sm"
                >
                  <span className="flex items-center">
                    <BookOpen className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    Browse Stories
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Process Preview */}
          <div className="lg:col-span-5">
            <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden border border-white/20 dark:border-slate-700/20">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-stone-50/20 via-transparent to-emerald-50/10 dark:from-stone-900/10 dark:via-transparent dark:to-emerald-900/5 rounded-[2rem]"></div>
              
              <div className="relative z-10 text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-stone-600 to-amber-700 dark:from-emerald-600 dark:via-stone-700 dark:to-amber-800 rounded-3xl flex items-center justify-center mx-auto shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:rotate-3">
                  <PenTool className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-stone-900 dark:text-stone-50 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] tracking-tight">Your Writing Journey</h3>
                
                <div 
                  className="grid grid-cols-2 gap-4"
                  onMouseEnter={() => setIsHoveringSteps(true)}
                  onMouseLeave={() => {
                    setIsHoveringSteps(false);
                    setHoveredStep(null);
                  }}
                >
                  {processSteps.map((step, index) => {
                    const IconComponent = step.icon;
                    // Use hoveredStep if hovering, otherwise use currentStep
                    const isActive = isHoveringSteps ? index === hoveredStep : index === currentStep;
                    
                    return (
                      <div
                        key={index}
                        onMouseEnter={() => setHoveredStep(index)}
                        className={`p-5 rounded-2xl transition-all duration-700 cursor-pointer group ${
                          isActive 
                            ? 'bg-gradient-to-br from-emerald-50/80 to-stone-50/60 dark:from-emerald-900/40 dark:to-stone-900/30 scale-110 shadow-2xl shadow-emerald-200/30 dark:shadow-emerald-900/20 -translate-y-1 border border-emerald-400/30 dark:border-emerald-600/30' 
                            : 'bg-white/40 dark:bg-slate-700/30 border border-stone-200/30 dark:border-slate-600/30 hover:bg-gradient-to-br hover:from-stone-50/60 hover:to-emerald-50/40 dark:hover:from-stone-900/30 dark:hover:to-emerald-900/20 hover:border-stone-300/40 dark:hover:border-stone-600/40 hover:scale-105 hover:shadow-lg'
                        }`}
                      >
                        <IconComponent className={`w-6 h-6 mb-3 transition-all duration-500 ${
                          isActive 
                            ? 'text-emerald-600 dark:text-emerald-400 scale-110' 
                            : 'text-stone-500 dark:text-stone-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:scale-110'
                        }`} />
                        <h4 className={`font-bold text-sm transition-all duration-300 ${
                          isActive 
                            ? 'text-stone-900 dark:text-stone-50 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]' 
                            : 'text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-100'
                        }`}>
                          {step.title}
                        </h4>
                        {isActive && (
                          <p className="text-xs text-stone-700 dark:text-stone-200 mt-2 animate-in fade-in duration-500 font-medium leading-[1.5] tracking-normal">
                            {step.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Process Pipeline */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-24">
        <div className="text-center space-y-16">
          <div className="space-y-6">
            <Badge className="bg-stone-100/90 dark:bg-stone-900/50 text-stone-900 dark:text-stone-100 border-stone-400 dark:border-stone-600 font-bold backdrop-blur-md shadow-lg">
              End-to-End Creative Production
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-50 drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)] leading-[1.2] tracking-tight">
              From Idea to Final Media
            </h2>
            <p className="text-xl text-stone-800 dark:text-stone-200 max-w-3xl mx-auto font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] leading-[1.75] tracking-normal">
              Our intelligent 6-stage pipeline replaces 15+ scattered tools. Create novels, screenplays, 
              graphic novels with generated visuals, audio, and video - all in one unified workflow.
            </p>
          </div>

          {/* Process Flow */}
          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-emerald-300 via-stone-300 to-amber-300 dark:from-emerald-600/30 dark:via-stone-600/30 dark:to-amber-600/30 hidden lg:block rounded-full"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {processSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="text-center space-y-4 relative group">
                    {/* Step number */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-emerald-500 via-stone-600 to-amber-700 dark:from-emerald-600 dark:via-stone-700 dark:to-amber-800 rounded-full flex items-center justify-center text-sm font-bold text-white lg:block hidden z-20 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {index + 1}
                    </div>
                    
                    <div className="w-28 h-28 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto shadow-xl border border-stone-300/60 dark:border-slate-600/50 group-hover:shadow-2xl group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 cursor-pointer relative z-10 group-hover:rotate-3">
                      <div className="absolute inset-0 bg-gradient-to-br from-stone-50/50 to-emerald-50/30 dark:from-stone-900/20 dark:to-emerald-900/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <IconComponent className="w-10 h-10 text-emerald-600 dark:text-emerald-400 group-hover:text-stone-600 dark:group-hover:text-stone-400 transition-all duration-500 relative z-10 group-hover:scale-110" />
                    </div>
                    
                    <div className="space-y-3 group-hover:-translate-y-1 transition-transform duration-300">
                      <h4 className="font-black text-lg text-stone-900 dark:text-stone-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] leading-[1.3] tracking-tight">{step.title}</h4>
                      <p className="text-sm text-stone-700 dark:text-stone-200 group-hover:text-stone-800 dark:group-hover:text-stone-100 transition-colors duration-300 font-medium leading-[1.6] tracking-normal">{step.description}</p>
                      <p className="text-xs text-stone-600 dark:text-stone-300 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 font-semibold leading-[1.5] tracking-wide">
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
            <Badge className="bg-stone-100/90 dark:bg-stone-900/50 text-stone-900 dark:text-stone-100 border-stone-400 dark:border-stone-600 font-bold backdrop-blur-md shadow-lg">
              Revolutionary Creative Technology
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-50 drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)] leading-[1.2] tracking-tight">
              The Creative Industry's First True End-to-End Suite
            </h2>
            <p className="text-xl text-stone-800 dark:text-stone-200 max-w-3xl mx-auto font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] leading-[1.75] tracking-normal">
              Break free from scattered tools. Fablecraft replaces 15+ applications with one intelligent 
              platform that understands your entire creative process from world-building to visual production.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {trustIndicators.map((indicator, index) => {
              const IconComponent = indicator.icon;
              return (
                <Card key={index} className="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border-stone-300/60 dark:border-slate-600/50 hover:shadow-2xl hover:shadow-emerald-200/20 dark:hover:shadow-emerald-900/10 transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden relative">
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-stone-50/0 via-emerald-50/0 to-amber-50/0 dark:from-stone-900/0 dark:via-emerald-900/0 dark:to-amber-900/0 group-hover:from-stone-50/50 group-hover:via-emerald-50/30 group-hover:to-amber-50/20 dark:group-hover:from-stone-900/20 dark:group-hover:via-emerald-900/10 dark:group-hover:to-amber-900/5 transition-all duration-700"></div>
                  
                  <CardContent className="relative z-10 p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-stone-600 to-amber-700 dark:from-emerald-600 dark:via-stone-700 dark:to-amber-800 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <IconComponent className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold bg-gradient-to-r from-stone-800 to-stone-600 dark:from-stone-200 dark:to-stone-400 bg-clip-text text-transparent group-hover:from-emerald-600 group-hover:to-stone-600 dark:group-hover:from-emerald-300 dark:group-hover:to-stone-300 transition-all duration-500">{indicator.number}</div>
                      <div className="text-stone-600 dark:text-stone-300 font-semibold group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors duration-300">{indicator.label}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-3 gap-8 pt-16">
            <div className="group text-center space-y-6 p-8 rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-stone-300/50 dark:border-stone-600/20 hover:shadow-2xl hover:shadow-emerald-200/20 dark:hover:shadow-emerald-900/10 transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-stone-50/0 to-emerald-50/0 dark:from-stone-900/0 dark:to-emerald-900/0 group-hover:from-stone-50/50 group-hover:to-emerald-50/30 dark:group-hover:from-stone-900/20 dark:group-hover:to-emerald-900/10 transition-all duration-700"></div>
              
              <div className="relative z-10 space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-stone-600 to-amber-700 dark:from-emerald-600 dark:via-stone-700 dark:to-amber-800 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <CheckCircle className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300">World Bible Intelligence</h3>
                <p className="text-stone-600 dark:text-stone-300 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors duration-300 leading-relaxed">
                  Create interconnected characters, locations, cultures, and factions with AI that understands your entire creative universe.
                </p>
              </div>
            </div>
            
            <div className="group text-center space-y-6 p-8 rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-stone-300/50 dark:border-stone-600/20 hover:shadow-2xl hover:shadow-emerald-200/20 dark:hover:shadow-emerald-900/10 transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-stone-50/0 to-emerald-50/0 dark:from-stone-900/0 dark:to-emerald-900/0 group-hover:from-stone-50/50 group-hover:to-emerald-50/30 dark:group-hover:from-stone-900/20 dark:group-hover:to-emerald-900/10 transition-all duration-700"></div>
              
              <div className="relative z-10 space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-stone-500 via-emerald-600 to-amber-700 dark:from-stone-600 dark:via-emerald-700 dark:to-amber-800 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <TrendingUp className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300">Document AI Extraction</h3>
                <p className="text-stone-600 dark:text-stone-300 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors duration-300 leading-relaxed">
                  Upload character sheets and documents - our AI extracts 50+ attributes automatically with intelligent field mapping.
                </p>
              </div>
            </div>
            
            <div className="group text-center space-y-6 p-8 rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-stone-300/50 dark:border-stone-600/20 hover:shadow-2xl hover:shadow-emerald-200/20 dark:hover:shadow-emerald-900/10 transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 to-stone-50/0 dark:from-amber-900/0 dark:to-stone-900/0 group-hover:from-amber-50/50 group-hover:to-stone-50/30 dark:group-hover:from-amber-900/20 dark:group-hover:to-stone-900/10 transition-all duration-700"></div>
              
              <div className="relative z-10 space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-600 via-stone-600 to-emerald-700 dark:from-amber-700 dark:via-stone-700 dark:to-emerald-800 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Award className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300">Visual Production Ready</h3>
                <p className="text-stone-600 dark:text-stone-300 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors duration-300 leading-relaxed">
                  Generate consistent character visuals, storyboards, and multimedia content for novels, screenplays, and graphic novels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 py-32">
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-stone-50 via-emerald-50/80 to-amber-50/60 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 border border-stone-300/50 dark:border-slate-600/50 shadow-2xl">
          {/* Background texture */}
          <div className="absolute inset-0 opacity-20 bg-repeat bg-center" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a574' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          
          {/* Floating elements */}
          <div className="absolute top-8 right-8 w-32 h-32 bg-gradient-to-br from-emerald-300/20 to-stone-400/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-8 left-8 w-24 h-24 bg-gradient-to-br from-stone-300/20 to-amber-400/10 rounded-full blur-xl"></div>
          
          <div className="relative z-10 text-center space-y-12 p-16">
            <div className="space-y-8">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 via-stone-600 to-amber-700 dark:from-emerald-600 dark:via-stone-700 dark:to-amber-800 rounded-full flex items-center justify-center mx-auto shadow-2xl hover:shadow-3xl hover:scale-110 hover:rotate-6 transition-all duration-500 cursor-pointer">
                <Zap className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-stone-800 via-emerald-700 to-amber-700 dark:from-stone-200 dark:via-emerald-300 dark:to-amber-300 bg-clip-text text-transparent leading-tight">
                Start Your Creative Revolution
              </h2>
              <p className="text-xl text-stone-600 dark:text-stone-300 max-w-3xl mx-auto leading-relaxed">
                Ready to transform any creative idea into complete multimedia production? 
                Join the first true end-to-end AI creative suite that replaces 15+ scattered tools.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <Button 
                onClick={() => onNewProject()}
                size="lg"
                className="group bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 hover:from-emerald-700 hover:via-stone-700 hover:to-amber-800 dark:from-emerald-500 dark:via-stone-500 dark:to-amber-600 dark:hover:from-emerald-600 dark:hover:via-stone-600 dark:hover:to-amber-700 text-white px-16 py-6 text-xl font-bold shadow-2xl hover:shadow-3xl hover:scale-110 hover:-translate-y-2 transition-all duration-500 rounded-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 flex items-center">
                  Create Your First Project
                  <Sparkles className="ml-4 h-6 w-6 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
                </span>
              </Button>
              <Button 
                onClick={() => onNavigate('projects')}
                variant="outline"
                size="lg"
                className="group border-2 border-stone-400 dark:border-stone-500/60 text-stone-700 dark:text-stone-200 bg-white dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-600 dark:hover:border-emerald-500 px-16 py-6 text-xl font-semibold shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-500 rounded-2xl backdrop-blur-sm"
              >
                <span className="flex items-center">
                  Explore Examples
                  <ArrowRight className="ml-4 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-stone-300/50 dark:border-slate-700/50 py-20 px-8 bg-gradient-to-t from-stone-50/30 to-transparent dark:from-slate-900/50 dark:to-transparent">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center space-x-4 group cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 via-stone-600 to-amber-700 dark:from-emerald-600 dark:via-stone-700 dark:to-amber-800 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <Feather className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-stone-800 to-emerald-700 dark:from-stone-200 dark:to-emerald-300 bg-clip-text text-transparent group-hover:from-emerald-600 group-hover:to-stone-600 dark:group-hover:from-emerald-200 dark:group-hover:to-stone-200 transition-all duration-300">
              Fablecraft
            </span>
          </div>
          <p className="text-xl text-stone-600 dark:text-stone-300 font-medium">
            Where every story finds its voice
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-stone-500 dark:text-stone-400">
            <span>Made with</span>
            <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-amber-600 rounded-full animate-pulse"></div>
            <span>for storytellers everywhere</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
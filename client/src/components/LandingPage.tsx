import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
  Sun
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
    icon: Sparkles, 
    title: "Ideate", 
    description: "Generate story concepts with AI assistance",
    detail: "Transform a single spark into rich narrative possibilities"
  },
  { 
    icon: Users, 
    title: "Characters", 
    description: "Create compelling, multi-dimensional characters",
    detail: "Build personas that drive authentic storytelling"
  },
  { 
    icon: Globe, 
    title: "World Build", 
    description: "Design immersive settings and environments",
    detail: "Craft worlds that feel lived-in and believable"
  },
  { 
    icon: Compass, 
    title: "Structure", 
    description: "Organize plot points and narrative arcs",
    detail: "Map your story's journey from beginning to end"
  },
  { 
    icon: Edit3, 
    title: "Draft", 
    description: "Write with AI-powered assistance and feedback",
    detail: "Transform your vision into polished prose"
  },
  { 
    icon: Target, 
    title: "Refine", 
    description: "Polish and perfect your final manuscript",
    detail: "Elevate your work to publication-ready quality"
  }
];

const trustIndicators = [
  { number: "50,000+", label: "Characters Created", icon: Users },
  { number: "12,000+", label: "Stories in Progress", icon: BookOpen },
  { number: "2,500+", label: "Published Works", icon: Award },
  { number: "98%", label: "Writer Satisfaction", icon: Star }
];

export function LandingPage({ 
  onNavigate, 
  onNewProject, 
  onUploadManuscript, 
  guideMode, 
  setGuideMode 
}: LandingPageProps) {
  const [isDark, setIsDark] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % processSteps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/50 to-red-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative transition-all duration-500">
      {/* Warm texture overlay */}
      <div className="absolute inset-0 opacity-30 bg-repeat bg-center" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a574' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      <div className="absolute inset-0 opacity-30 bg-repeat bg-center dark:block hidden" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.01'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Ambient lighting */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-amber-200/30 to-orange-300/20 dark:from-amber-500/10 dark:to-orange-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-br from-orange-200/20 to-red-300/15 dark:from-orange-500/5 dark:to-red-600/3 rounded-full blur-2xl"></div>

      {/* Navigation */}
      <nav className="relative z-10 px-8 py-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Feather className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-stone-800 dark:text-amber-100">
              Fablecraft
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDark(!isDark)}
              className="w-10 h-10 p-0 rounded-xl text-stone-600 dark:text-amber-200 hover:bg-amber-100/70 dark:hover:bg-amber-900/30 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-amber-600 dark:text-amber-300" />
              ) : (
                <Moon className="h-5 w-5 text-stone-600" />
              )}
            </Button>
            <Button 
              onClick={() => onNavigate('projects')}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-amber-200/60 dark:border-amber-500/30 text-amber-700 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:border-amber-300 dark:hover:border-amber-400 px-6 py-2 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
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
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-amber-100/80 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50">
                <div className="w-2 h-2 bg-orange-500 dark:bg-orange-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-amber-800 dark:text-amber-200">AI-Powered Writing Companion</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-stone-800 dark:text-amber-50 leading-[0.95] tracking-tight">
                Craft Stories That
                <span className="block bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 dark:from-amber-400 dark:via-orange-400 dark:to-red-400 bg-clip-text text-transparent">
                  Captivate Worlds
                </span>
              </h1>
              
              <p className="text-xl text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
                The complete storytelling platform trusted by thousands of writers. 
                From initial spark to published masterpiece, we guide your creative journey.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 pt-6">
                <Button 
                  size="lg"
                  onClick={() => onNewProject()}
                  className="group bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 dark:from-amber-400 dark:via-orange-400 dark:to-red-400 dark:hover:from-amber-500 dark:hover:via-orange-500 dark:hover:to-red-500 text-white px-10 py-5 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-1 rounded-2xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10 flex items-center">
                    Begin Your Story
                    <Sparkles className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  </span>
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => onNavigate('projects')}
                  className="group border-2 border-amber-400 dark:border-amber-500/40 text-amber-700 dark:text-amber-200 bg-white/80 dark:bg-slate-800/50 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 hover:border-amber-500 dark:hover:border-amber-400 px-10 py-5 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-0.5 rounded-2xl backdrop-blur-sm"
                >
                  <span className="flex items-center">
                    See Examples
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Process Preview */}
          <div className="lg:col-span-5">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg rounded-3xl p-8 border border-amber-200/60 dark:border-slate-600/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-orange-50/30 dark:from-amber-900/10 dark:via-transparent dark:to-orange-900/5 rounded-3xl"></div>
              
              <div className="relative z-10 text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 dark:from-amber-500 dark:via-orange-600 dark:to-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:rotate-3">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-stone-800 dark:text-amber-50">Your Writing Journey</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {processSteps.map((step, index) => {
                    const IconComponent = step.icon;
                    const isActive = index === currentStep;
                    
                    return (
                      <div
                        key={index}
                        className={`p-5 rounded-2xl border transition-all duration-700 cursor-pointer group ${
                          isActive 
                            ? 'bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-900/30 dark:to-orange-900/20 border-amber-300 dark:border-amber-600 scale-110 shadow-xl shadow-amber-200/50 dark:shadow-amber-900/20 -translate-y-1' 
                            : 'bg-white/60 dark:bg-slate-700/40 border-stone-200/60 dark:border-slate-600/40 hover:bg-gradient-to-br hover:from-amber-50/50 hover:to-orange-50/30 dark:hover:from-amber-900/20 dark:hover:to-orange-900/10 hover:border-amber-200 dark:hover:border-amber-700/50 hover:scale-105 hover:shadow-lg'
                        }`}
                      >
                        <IconComponent className={`w-6 h-6 mb-3 transition-all duration-500 ${
                          isActive 
                            ? 'text-amber-600 dark:text-amber-400 scale-110' 
                            : 'text-stone-500 dark:text-stone-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:scale-110'
                        }`} />
                        <h4 className={`font-semibold text-sm transition-all duration-300 ${
                          isActive 
                            ? 'text-stone-800 dark:text-amber-50' 
                            : 'text-stone-600 dark:text-stone-300 group-hover:text-stone-800 dark:group-hover:text-stone-100'
                        }`}>
                          {step.title}
                        </h4>
                        {isActive && (
                          <p className="text-xs text-stone-600 dark:text-amber-200/80 mt-2 animate-in fade-in duration-500">
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
            <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-700">
              Your Complete Writing Pipeline
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-800 dark:text-stone-100">
              From Spark to Masterpiece
            </h2>
            <p className="text-xl text-stone-600 dark:text-stone-300 max-w-3xl mx-auto">
              Our proven 6-step process guides you through every stage of storytelling, 
              with AI assistance that adapts to your unique creative style.
            </p>
          </div>

          {/* Process Flow */}
          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-amber-200 via-orange-300 to-red-300 dark:from-amber-600/30 dark:via-orange-600/30 dark:to-red-600/30 hidden lg:block rounded-full"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {processSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="text-center space-y-4 relative group">
                    {/* Step number */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 dark:from-amber-500 dark:via-orange-600 dark:to-red-600 rounded-full flex items-center justify-center text-sm font-bold text-white lg:block hidden z-20 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {index + 1}
                    </div>
                    
                    <div className="w-28 h-28 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto shadow-xl border border-amber-200/60 dark:border-slate-600/50 group-hover:shadow-2xl group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 cursor-pointer relative z-10 group-hover:rotate-3">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-900/20 dark:to-orange-900/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <IconComponent className="w-10 h-10 text-amber-600 dark:text-amber-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-all duration-500 relative z-10 group-hover:scale-110" />
                    </div>
                    
                    <div className="space-y-3 group-hover:-translate-y-1 transition-transform duration-300">
                      <h4 className="font-bold text-lg text-stone-800 dark:text-amber-50 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">{step.title}</h4>
                      <p className="text-sm text-stone-600 dark:text-stone-300 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors duration-300">{step.description}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 font-medium">
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
            <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-700">
              Trusted by Writers Worldwide
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-800 dark:text-stone-100">
              Join Thousands of Successful Writers
            </h2>
            <p className="text-xl text-stone-600 dark:text-stone-300 max-w-3xl mx-auto">
              Writers choose Fablecraft because it delivers results. Our platform has powered 
              countless success stories from first-time authors to bestselling novelists.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {trustIndicators.map((indicator, index) => {
              const IconComponent = indicator.icon;
              return (
                <Card key={index} className="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border-amber-200/60 dark:border-slate-600/50 hover:shadow-2xl hover:shadow-amber-200/20 dark:hover:shadow-amber-900/10 transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden relative">
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 via-orange-50/0 to-rose-50/0 dark:from-amber-900/0 dark:via-orange-900/0 dark:to-rose-900/0 group-hover:from-amber-50/50 group-hover:via-orange-50/30 group-hover:to-rose-50/20 dark:group-hover:from-amber-900/20 dark:group-hover:via-orange-900/10 dark:group-hover:to-rose-900/5 transition-all duration-700"></div>
                  
                  <CardContent className="relative z-10 p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 dark:from-amber-500 dark:via-orange-600 dark:to-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <IconComponent className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold bg-gradient-to-r from-stone-800 to-stone-600 dark:from-amber-200 dark:to-amber-400 bg-clip-text text-transparent group-hover:from-amber-600 group-hover:to-orange-600 dark:group-hover:from-amber-100 dark:group-hover:to-orange-200 transition-all duration-500">{indicator.number}</div>
                      <div className="text-stone-600 dark:text-stone-300 font-semibold group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors duration-300">{indicator.label}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-3 gap-8 pt-16">
            <div className="group text-center space-y-6 p-8 rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-200/50 dark:border-amber-600/20 hover:shadow-2xl hover:shadow-amber-200/20 dark:hover:shadow-amber-900/10 transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 to-orange-50/0 dark:from-amber-900/0 dark:to-orange-900/0 group-hover:from-amber-50/50 group-hover:to-orange-50/30 dark:group-hover:from-amber-900/20 dark:group-hover:to-orange-900/10 transition-all duration-700"></div>
              
              <div className="relative z-10 space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 dark:from-yellow-500 dark:via-amber-600 dark:to-orange-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <CheckCircle className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-stone-800 dark:text-amber-50 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">Proven Results</h3>
                <p className="text-stone-600 dark:text-stone-300 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors duration-300 leading-relaxed">
                  98% of writers report improved productivity and story quality within their first month using our platform.
                </p>
              </div>
            </div>
            
            <div className="group text-center space-y-6 p-8 rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-200/50 dark:border-amber-600/20 hover:shadow-2xl hover:shadow-amber-200/20 dark:hover:shadow-amber-900/10 transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 to-orange-50/0 dark:from-amber-900/0 dark:to-orange-900/0 group-hover:from-amber-50/50 group-hover:to-orange-50/30 dark:group-hover:from-amber-900/20 dark:group-hover:to-orange-900/10 transition-all duration-700"></div>
              
              <div className="relative z-10 space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 dark:from-amber-500 dark:via-orange-600 dark:to-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <TrendingUp className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-stone-800 dark:text-amber-50 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">Accelerated Growth</h3>
                <p className="text-stone-600 dark:text-stone-300 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors duration-300 leading-relaxed">
                  Writers complete projects 3x faster with our AI-assisted workflow and structured creative approach.
                </p>
              </div>
            </div>
            
            <div className="group text-center space-y-6 p-8 rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-200/50 dark:border-amber-600/20 hover:shadow-2xl hover:shadow-amber-200/20 dark:hover:shadow-amber-900/10 transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-red-50/0 dark:from-orange-900/0 dark:to-red-900/0 group-hover:from-orange-50/50 group-hover:to-red-50/30 dark:group-hover:from-orange-900/20 dark:group-hover:to-red-900/10 transition-all duration-700"></div>
              
              <div className="relative z-10 space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 via-red-500 to-red-600 dark:from-orange-500 dark:via-red-600 dark:to-red-700 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Award className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-stone-800 dark:text-amber-50 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors duration-300">Publication Success</h3>
                <p className="text-stone-600 dark:text-stone-300 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors duration-300 leading-relaxed">
                  Over 2,500 stories created on Fablecraft have been successfully published across all genres and platforms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 py-32">
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-amber-50 via-orange-50/80 to-red-50/60 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 border border-amber-200/50 dark:border-slate-600/50 shadow-2xl">
          {/* Background texture */}
          <div className="absolute inset-0 opacity-20 bg-repeat bg-center" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a574' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          
          {/* Floating elements */}
          <div className="absolute top-8 right-8 w-32 h-32 bg-gradient-to-br from-amber-300/20 to-orange-400/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-8 left-8 w-24 h-24 bg-gradient-to-br from-orange-300/20 to-red-400/10 rounded-full blur-xl"></div>
          
          <div className="relative z-10 text-center space-y-12 p-16">
            <div className="space-y-8">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 dark:from-amber-500 dark:via-orange-600 dark:to-red-600 rounded-full flex items-center justify-center mx-auto shadow-2xl hover:shadow-3xl hover:scale-110 hover:rotate-6 transition-all duration-500 cursor-pointer">
                <Zap className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-stone-800 via-amber-700 to-orange-700 dark:from-amber-200 dark:via-orange-300 dark:to-red-300 bg-clip-text text-transparent leading-tight">
                Your Story Starts Now
              </h2>
              <p className="text-xl text-stone-600 dark:text-stone-300 max-w-3xl mx-auto leading-relaxed">
                Join the creative revolution. Transform your ideas into captivating stories 
                with the most advanced AI writing platform available today.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <Button 
                onClick={() => onNewProject()}
                size="lg"
                className="group bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 dark:from-amber-400 dark:via-orange-400 dark:to-red-400 dark:hover:from-amber-500 dark:hover:via-orange-500 dark:hover:to-red-500 text-white px-16 py-6 text-xl font-bold shadow-2xl hover:shadow-3xl hover:scale-110 hover:-translate-y-2 transition-all duration-500 rounded-2xl relative overflow-hidden"
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
                className="group border-2 border-amber-400 dark:border-amber-500/60 text-amber-700 dark:text-amber-200 bg-white dark:bg-slate-800/50 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-500 dark:hover:border-amber-400 px-16 py-6 text-xl font-semibold shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-500 rounded-2xl backdrop-blur-sm"
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
      <footer className="relative z-10 border-t border-amber-200/50 dark:border-slate-700/50 py-20 px-8 bg-gradient-to-t from-amber-50/30 to-transparent dark:from-slate-900/50 dark:to-transparent">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center space-x-4 group cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 dark:from-amber-400 dark:via-orange-500 dark:to-red-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <Feather className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-stone-800 to-amber-700 dark:from-amber-200 dark:to-orange-300 bg-clip-text text-transparent group-hover:from-amber-600 group-hover:to-orange-600 dark:group-hover:from-amber-100 dark:group-hover:to-orange-200 transition-all duration-300">
              Fablecraft
            </span>
          </div>
          <p className="text-xl text-stone-600 dark:text-stone-300 font-medium">
            Where every story finds its voice
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-stone-500 dark:text-stone-400">
            <span>Made with</span>
            <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse"></div>
            <span>for storytellers everywhere</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
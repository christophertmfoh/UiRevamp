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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/50 to-rose-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative transition-all duration-500">
      {/* Warm texture overlay */}
      <div className="absolute inset-0 opacity-30 bg-repeat bg-center" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a574' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      <div className="absolute inset-0 opacity-30 bg-repeat bg-center dark:block hidden" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.01'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Ambient lighting */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-amber-200/30 to-orange-300/20 dark:from-amber-500/10 dark:to-orange-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-br from-rose-200/20 to-pink-300/15 dark:from-rose-500/5 dark:to-pink-600/3 rounded-full blur-2xl"></div>

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
              className="text-stone-600 dark:text-stone-300 hover:bg-amber-100/50 dark:hover:bg-slate-700"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onNavigate('projects')}
              className="border-amber-200 dark:border-amber-600/30 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 px-6 py-2"
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
                <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse"></div>
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

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg"
                  onClick={() => onNewProject()}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 dark:from-amber-400 dark:to-orange-500 dark:hover:from-amber-500 dark:hover:to-orange-600 text-white px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Begin Your Story
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => onNavigate('projects')}
                  className="border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 px-8 py-4 text-lg"
                >
                  See Examples
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Process Preview */}
          <div className="lg:col-span-5">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-amber-200/50 dark:border-slate-700/50">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-stone-800 dark:text-stone-100">Your Writing Journey</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {processSteps.map((step, index) => {
                    const IconComponent = step.icon;
                    const isActive = index === currentStep;
                    
                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border transition-all duration-500 ${
                          isActive 
                            ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 scale-105 shadow-lg' 
                            : 'bg-white/50 dark:bg-slate-700/30 border-stone-200 dark:border-slate-600 hover:bg-amber-50/50 dark:hover:bg-amber-900/10'
                        }`}
                      >
                        <IconComponent className={`w-5 h-5 mb-2 transition-colors duration-300 ${
                          isActive ? 'text-amber-600 dark:text-amber-400' : 'text-stone-500 dark:text-stone-400'
                        }`} />
                        <h4 className={`font-medium text-sm transition-colors duration-300 ${
                          isActive ? 'text-stone-800 dark:text-stone-100' : 'text-stone-600 dark:text-stone-300'
                        }`}>
                          {step.title}
                        </h4>
                        {isActive && (
                          <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
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
            <div className="absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-amber-200 via-orange-300 to-rose-300 dark:from-amber-600/30 dark:via-orange-600/30 dark:to-rose-600/30 hidden lg:block rounded-full"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {processSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="text-center space-y-4 relative group">
                    {/* Step number */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600 rounded-full flex items-center justify-center text-xs font-bold text-white lg:block hidden z-10">
                      {index + 1}
                    </div>
                    
                    <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto shadow-lg border border-amber-200/50 dark:border-slate-700 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 cursor-pointer relative z-10">
                      <IconComponent className="w-8 h-8 text-amber-600 dark:text-amber-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-stone-800 dark:text-stone-100">{step.title}</h4>
                      <p className="text-sm text-stone-600 dark:text-stone-300">{step.description}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
            <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-700">
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
                <Card key={index} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-amber-200/50 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600 rounded-xl flex items-center justify-center mx-auto">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold text-stone-800 dark:text-stone-100">{indicator.number}</div>
                      <div className="text-stone-600 dark:text-stone-300 font-medium">{indicator.label}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-3 gap-8 pt-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 dark:from-emerald-500 dark:to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-stone-800 dark:text-stone-100">Proven Results</h3>
              <p className="text-stone-600 dark:text-stone-300">
                98% of writers report improved productivity and story quality within their first month.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-stone-800 dark:text-stone-100">Accelerated Growth</h3>
              <p className="text-stone-600 dark:text-stone-300">
                Writers complete projects 3x faster with our AI-assisted workflow and structured approach.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 dark:from-rose-500 dark:to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-stone-800 dark:text-stone-100">Publication Success</h3>
              <p className="text-stone-600 dark:text-stone-300">
                Over 2,500 stories created on Fablecraft have been successfully published across all genres.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 py-32">
        <div className="text-center space-y-12">
          <div className="space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-800 dark:text-stone-100">
              Your Story Starts Now
            </h2>
            <p className="text-xl text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
              Join the creative revolution. Transform your ideas into captivating stories 
              with the most advanced AI writing platform available today.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              onClick={() => onNewProject()}
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 dark:from-amber-400 dark:to-orange-500 dark:hover:from-amber-500 dark:hover:to-orange-600 text-white px-12 py-4 text-lg font-medium shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Create Your First Project
              <Sparkles className="ml-3 h-5 w-5" />
            </Button>
            <Button 
              onClick={() => onNavigate('projects')}
              variant="outline"
              size="lg"
              className="border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 px-12 py-4 text-lg hover:scale-105 transition-all duration-300"
            >
              Explore Examples
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-stone-200 dark:border-slate-700 py-16 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Feather className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-stone-800 dark:text-stone-100">Fablecraft</span>
          </div>
          <p className="text-stone-600 dark:text-stone-300 text-lg">
            Where every story finds its voice
          </p>
        </div>
      </footer>
    </div>
  );
}
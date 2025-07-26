import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Feather, 
  BookOpen, 
  Users, 
  Scroll, 
  Edit3, 
  ArrowRight,
  Sparkles,
  Globe,
  Target,
  PenTool,
  Brain,
  Heart,
  Crown,
  Flame,
  Mountain,
  Coffee,
  Leaf,
  Star,
  Pen,
  Compass
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onNewProject: () => void;
  onUploadManuscript: () => void;
  guideMode: boolean;
  setGuideMode: (mode: boolean) => void;
}

const craftPhilosophies = [
  {
    icon: Brain,
    title: "The Seamless Apprentice",
    description: "Your AI writing partner anticipates needs without intrusion, offering assistance when you need it most.",
    accent: "text-amber-600"
  },
  {
    icon: Heart,
    title: "Unshakeable Stability",
    description: "Never lose your work again. Every keystroke is preserved with enterprise-grade reliability.",
    accent: "text-rose-500"
  },
  {
    icon: Crown,
    title: "Modular Mastery",
    description: "Pay only for what you use. Build your perfect writing toolkit without breaking the bank.",
    accent: "text-orange-600"
  },
  {
    icon: Flame,
    title: "Immersive Focus",
    description: "Beautiful, distraction-free environments that adapt to your story's mood and genre.",
    accent: "text-red-500"
  }
];

const craftingStages = [
  { icon: Sparkles, label: "Spark", description: "Initial idea generation" },
  { icon: Compass, label: "Structure", description: "Outline and plot development" },
  { icon: Users, label: "Characters", description: "Deep character creation" },
  { icon: Mountain, label: "World", description: "Rich environment building" },
  { icon: Pen, label: "Craft", description: "Professional writing tools" },
  { icon: Star, label: "Polish", description: "Revision and refinement" }
];

export function LandingPage({ 
  onNavigate, 
  onNewProject, 
  onUploadManuscript, 
  guideMode, 
  setGuideMode 
}: LandingPageProps) {
  const [currentPhilosophy, setCurrentPhilosophy] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(() => {
        setCurrentPhilosophy(prev => (prev + 1) % craftPhilosophies.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isHovering]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/50 relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a574' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      {/* Floating geometric elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-40 right-20 w-48 h-48 bg-gradient-to-br from-rose-200/15 to-red-200/15 rounded-full blur-2xl"></div>
      <div className="absolute top-1/3 right-10 w-24 h-24 bg-gradient-to-br from-orange-300/25 to-amber-300/25 rounded-full blur-lg"></div>

      {/* Navigation */}
      <nav className="relative z-10 px-8 py-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Feather className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">
              Fablecraft
            </span>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => onNavigate('projects')}
            className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 transition-all duration-300 px-6 py-2"
          >
            Your Projects
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Hero Section - Asymmetric Layout */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-20">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-200">
                <Coffee className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">Where Stories Begin</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.9] text-stone-800">
                Craft Your
                <span className="block bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  Perfect Fable
                </span>
              </h1>
              
              <p className="text-xl text-stone-600 max-w-2xl leading-relaxed">
                An intelligent writing companion that grows with your creativity. 
                From character birth to world building, craft narratives that resonate.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                onClick={() => onNewProject()}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Begin Your Story
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => onNavigate('projects')}
                className="border-stone-300 text-stone-700 hover:bg-stone-50 px-8 py-4 text-lg"
              >
                View Examples
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Right Column - Philosophy Showcase */}
          <div className="lg:col-span-5">
            <div 
              className="space-y-6"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-stone-800">Built on Four Principles</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {craftPhilosophies.map((philosophy, index) => {
                  const IconComponent = philosophy.icon;
                  const isActive = index === currentPhilosophy;
                  
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border transition-all duration-500 cursor-pointer ${
                        isActive 
                          ? 'bg-white border-amber-200 shadow-lg scale-105' 
                          : 'bg-stone-50/50 border-stone-200 hover:bg-white hover:border-amber-200'
                      }`}
                      onClick={() => setCurrentPhilosophy(index)}
                    >
                      <IconComponent className={`w-6 h-6 mb-2 transition-colors duration-300 ${
                        isActive ? philosophy.accent : 'text-stone-500'
                      }`} />
                      <h4 className={`font-medium text-sm transition-colors duration-300 ${
                        isActive ? 'text-stone-800' : 'text-stone-600'
                      }`}>
                        {philosophy.title}
                      </h4>
                      {isActive && (
                        <p className="text-xs text-stone-600 mt-1 animate-fade-in">
                          {philosophy.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Crafting Journey - Visual Process */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-24">
        <div className="text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800">The Art of Story Crafting</h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              Follow a proven path from inspiration to publication, with AI guidance at every step
            </p>
          </div>

          {/* Visual Journey */}
          <div className="relative">
            {/* Connection path */}
            <div className="absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-amber-200 via-orange-300 to-red-200 hidden lg:block"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {craftingStages.map((stage, index) => {
                const IconComponent = stage.icon;
                return (
                  <div key={index} className="text-center space-y-3 relative">
                    {/* Stage number indicator */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white lg:block hidden">
                      {index + 1}
                    </div>
                    
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-lg border border-stone-200 group hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                      <IconComponent className="w-8 h-8 text-amber-600 group-hover:text-orange-600 transition-colors duration-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-800">{stage.label}</h4>
                      <p className="text-sm text-stone-600">{stage.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>



      {/* Feature Showcase */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-24 bg-white/40 backdrop-blur-sm rounded-3xl mx-8 my-16 border border-amber-200/50">
        <div className="text-center space-y-16">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <PenTool className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800">Your Creative Arsenal</h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              Every tool a storyteller needs, thoughtfully integrated into your writing workflow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
              <Users className="w-12 h-12 text-amber-600 mb-4" />
              <h3 className="text-xl font-semibold text-stone-800 mb-3">Character Creation</h3>
              <p className="text-stone-600 leading-relaxed">
                Generate detailed, nuanced characters with AI assistance. From personality traits to backstories, 
                craft memorable personas that drive your narrative.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
              <Globe className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold text-stone-800 mb-3">World Building</h3>
              <p className="text-stone-600 leading-relaxed">
                Design immersive worlds with interconnected cultures and histories. 
                Build the foundation for epic adventures.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-200">
              <Edit3 className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold text-stone-800 mb-3">Smart Writing</h3>
              <p className="text-stone-600 leading-relaxed">
                Keep your creative vision organized with project-based workflows. 
                Track character arcs, plot threads, and world details seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 py-24">
        <div className="text-center space-y-12">
          <div className="space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-800">
              Your Story Awaits
            </h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
              Join thousands of writers who have discovered the perfect balance of AI assistance and creative freedom
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              onClick={() => onNewProject()}
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-12 py-4 text-lg font-medium shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Start Your First Project
              <Sparkles className="ml-3 h-5 w-5" />
            </Button>
            <Button 
              onClick={() => onNavigate('projects')}
              variant="outline"
              size="lg"
              className="border-stone-300 text-stone-700 hover:bg-stone-50 px-12 py-4 text-lg hover:scale-105 transition-all duration-300"
            >
              Explore Examples
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Feather className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-stone-800">Fablecraft</span>
          </div>
          <p className="text-stone-600">
            Crafted for storytellers, by storytellers
          </p>
        </div>
      </footer>
    </div>
  );
}
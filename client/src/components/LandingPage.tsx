import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Zap, 
  BookOpen, 
  Users, 
  MapPin, 
  Scroll, 
  Edit3, 
  Clapperboard, 
  Eye, 
  Music,
  ArrowRight,
  Sparkles,
  Globe,
  Target,
  Palette,
  PenTool
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onNewProject: () => void;
  onUploadManuscript: () => void;
  guideMode: boolean;
  setGuideMode: (mode: boolean) => void;
}

const features = [
  {
    icon: Sparkles,
    title: "Brainstorm",
    description: "Generate endless story ideas with AI-powered creative assistance and narrative inspiration.",
    color: "candlelight-glow"
  },
  {
    icon: Globe,
    title: "World Bible",
    description: "Build comprehensive universes with characters, locations, factions, items, and deep lore systems.",
    color: "ember-accent"
  },
  {
    icon: Target,
    title: "Outline",
    description: "Structure your narrative with classic story beats, three-act structure, or custom frameworks.",
    color: "caramel-warm"
  },
  {
    icon: Edit3,
    title: "Manuscript",
    description: "Write novels and screenplays with AI assistance, formatting tools, and seamless revision tracking.",
    color: "leather-texture"
  },
  {
    icon: Clapperboard,
    title: "Storyboard",
    description: "Visualize scenes and sequences with collaborative storyboarding and scene planning tools.",
    color: "candlelight-glow"
  },
  {
    icon: Eye,
    title: "Pre-Visualization",
    description: "Create 3D scene previews, camera movements, and visual narrative planning.",
    color: "ember-accent"
  },
  {
    icon: Music,
    title: "Score & Audio",
    description: "Integrate music, sound effects, and audio elements to complete your multimedia story.",
    color: "caramel-warm"
  }
];

export function LandingPage({ 
  onNavigate, 
  onNewProject, 
  onUploadManuscript, 
  guideMode, 
  setGuideMode 
}: LandingPageProps) {
  const [storyIdea, setStoryIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateStoryIdea = async () => {
    if (!storyIdea.trim()) return;
    
    setIsGenerating(true);
    // TODO: Implement AI story generation
    setTimeout(() => {
      setIsGenerating(false);
      // Navigate to project creation with generated idea
      onNewProject();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50">
      {/* Header */}
      <header className="border-b border-border/30 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - empty for balance */}
            <div className="w-40"></div>
            
            {/* Center - Brand */}
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl flex items-center justify-center border border-accent/20">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
              <h1 className="font-display text-3xl text-foreground leading-none tracking-tight">Fablecraft</h1>
            </div>
            
            {/* Right side - Projects button */}
            <div className="w-40 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => onNavigate('projects')}
                className="border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/50 transition-all duration-300"
              >
                Your Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-12">
            {/* Main Hero */}
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-accent">AI-Powered Creative Writing Studio</span>
              </div>
              
              <h1 className="font-display text-6xl md:text-7xl lg:text-8xl text-foreground leading-[0.9] tracking-tight">
                Craft Stories That
                <span className="block bg-gradient-to-r from-accent via-accent/80 to-accent/60 bg-clip-text text-transparent">
                  Captivate Worlds
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                Transform fleeting ideas into rich, immersive narratives. Build characters, craft worlds, 
                and weave tales with AI-powered tools designed for storytellers.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <Button 
                  size="lg"
                  onClick={() => onNewProject()}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 text-lg font-medium"
                >
                  Start Creating
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={() => onNavigate('projects')}
                  className="text-muted-foreground hover:text-foreground px-8 py-4 text-lg"
                >
                  View Examples
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Feature Preview Cards */}
            <div className="grid md:grid-cols-3 gap-8 pt-20">
              <div className="group p-8 rounded-2xl bg-card/50 border border-border/50 hover:border-accent/30 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Character Creation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Generate detailed, nuanced characters with AI assistance. From personality traits to backstories, 
                  craft memorable personas that drive your narrative.
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-card/50 border border-border/50 hover:border-accent/30 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl flex items-center justify-center mb-6">
                  <Globe className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">World Building</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Design immersive worlds with interconnected locations, cultures, and histories. 
                  Build the foundation for epic adventures.
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-card/50 border border-border/50 hover:border-accent/30 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl flex items-center justify-center mb-6">
                  <PenTool className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Story Organization</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Keep your creative vision organized with project-based workflows. 
                  Track character arcs, plot threads, and world details seamlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Idea Generator - Prominent */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 candlelight-glow rounded-2xl opacity-20 blur-xl"></div>
            
            <Card className="creative-card p-12 relative border-2 border-accent/30">
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 candlelight-glow rounded-2xl flex items-center justify-center mx-auto">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-3xl text-foreground">Ready to Start Writing?</h3>
                  <p className="text-muted-foreground font-literary text-lg max-w-2xl mx-auto">
                    Begin your creative journey with a new project or continue working on existing stories
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => onNewProject()}
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 text-lg font-medium"
                  >
                    Create New Project
                    <Sparkles className="ml-3 h-5 w-5" />
                  </Button>
                  <Button 
                    onClick={() => onNavigate('projects')}
                    variant="outline"
                    size="lg"
                    className="border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/50 px-8 py-4 text-lg"
                  >
                    View Projects
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features - Long Rectangular Layout */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <div className="w-12 h-12 ember-accent rounded-xl flex items-center justify-center mx-auto mb-6">
              <Palette className="h-6 w-6" />
            </div>
            <h3 className="font-display text-4xl text-foreground">Your Creative Toolkit</h3>
            <p className="font-literary text-xl text-muted-foreground max-w-2xl mx-auto">
              Every tool you need to bring your stories to life, from concept to completion
            </p>
          </div>
          
          <div className="space-y-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="relative">
                  {/* Connection line to next feature */}
                  {index < features.length - 1 && (
                    <div className="absolute left-8 top-full w-0.5 h-6 bg-gradient-to-b from-accent/30 to-transparent z-10"></div>
                  )}
                  
                  <Card className="creative-card group hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 cursor-pointer relative overflow-hidden">
                    {/* Subtle glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="p-8 flex items-center space-x-6 relative">
                      <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="font-title text-2xl text-foreground group-hover:text-accent transition-colors duration-300">
                          {feature.title}
                        </h4>
                        <p className="font-literary text-muted-foreground leading-relaxed text-lg">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          {/* Visual Guide Leading to CTA */}
          <div className="flex justify-center mb-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-accent rounded-full animate-ping delay-150"></div>
                <div className="w-2 h-2 bg-accent rounded-full animate-ping delay-300"></div>
              </div>
              <div className="w-1 h-8 bg-gradient-to-b from-accent to-transparent rounded-full"></div>
            </div>
          </div>
          
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="w-16 h-16 candlelight-glow rounded-2xl flex items-center justify-center mx-auto">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="font-display text-4xl text-foreground">Begin Your Journey</h3>
              <p className="font-literary text-xl text-muted-foreground max-w-2xl mx-auto">
                Join storytellers worldwide in crafting the next generation of immersive narratives
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <div className="group">
                <Button 
                  onClick={onNewProject}
                  size="lg"
                  className="candlelight-glow text-lg px-10 py-4 min-w-[240px] group-hover:scale-105 transition-transform duration-300"
                >
                  <BookOpen className="mr-3 h-5 w-5" />
                  Begin Your Journey
                </Button>
                <div className="mt-2 text-sm text-muted-foreground text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Create your first project
                </div>
              </div>
              
              <div className="group">
                <Button 
                  onClick={() => onNavigate('projects')}
                  variant="outline"
                  size="lg"
                  className="creative-card hover:candlelight-glow transition-all duration-300 text-lg px-10 py-4 min-w-[240px] group-hover:scale-105"
                >
                  <ArrowRight className="mr-3 h-5 w-5" />
                  View Your Projects
                </Button>
                <div className="mt-2 text-sm text-muted-foreground text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Continue existing work
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-muted-foreground font-literary">
              Crafted for storytellers, by storytellers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
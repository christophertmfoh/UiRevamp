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
  Palette
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
    <div className="min-h-screen">
      {/* Header */}
      <header className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50"></div>
        <div className="relative container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 candlelight-glow rounded-xl flex items-center justify-center">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h1 className="font-display text-2xl text-foreground">Story Weaver</h1>
                <p className="text-sm text-muted-foreground font-literary">weave your worlds</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => onNavigate('projects')}
              className="creative-card hover:candlelight-glow transition-all duration-300"
            >
              Your Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Zap className="h-8 w-8 text-accent" />
              <span className="font-display text-xl text-accent">From Spark to Story</span>
            </div>
            
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight">
              The Complete
              <span className="block text-accent">Creative Pipeline</span>
            </h2>
            
            <p className="font-literary text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform fleeting ideas into rich, immersive worlds. From initial brainstorming to final production, 
              Story Weaver guides you through every step of the creative journey with AI-powered tools and 
              professional storytelling frameworks.
            </p>
          </div>
        </div>
      </section>

      {/* Story Idea Generator */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="creative-card p-8">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h3 className="font-title text-2xl text-foreground">Generate Your Story Idea</h3>
                <p className="text-muted-foreground font-literary">
                  Start your creative journey with an AI-generated story concept
                </p>
              </div>
              
              <div className="space-y-4">
                <Input
                  placeholder="Describe your story idea, genre, or theme..."
                  value={storyIdea}
                  onChange={(e) => setStoryIdea(e.target.value)}
                  className="creative-card text-lg py-3"
                />
                <Button 
                  onClick={handleGenerateStoryIdea}
                  disabled={!storyIdea.trim() || isGenerating}
                  className="w-full candlelight-glow text-lg py-3"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                      Weaving Your Story...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      Generate Story Idea
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h3 className="font-display text-4xl text-foreground">Your Creative Toolkit</h3>
            <p className="font-literary text-xl text-muted-foreground max-w-2xl mx-auto">
              Every tool you need to bring your stories to life, from concept to completion
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="creative-card group hover:scale-105 transition-all duration-300">
                  <CardHeader className="space-y-4">
                    <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <CardTitle className="font-title text-xl text-foreground">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="font-literary text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h3 className="font-display text-4xl text-foreground">Begin Your Journey</h3>
            <p className="font-literary text-xl text-muted-foreground max-w-2xl mx-auto">
              Join storytellers worldwide in crafting the next generation of immersive narratives
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={onNewProject}
              size="lg"
              className="candlelight-glow text-lg px-8 py-4 min-w-[200px]"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Begin Your Journey
            </Button>
            <Button 
              onClick={() => onNavigate('projects')}
              variant="outline"
              size="lg"
              className="creative-card hover:candlelight-glow transition-all duration-300 text-lg px-8 py-4 min-w-[200px]"
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              View Your Projects
            </Button>
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
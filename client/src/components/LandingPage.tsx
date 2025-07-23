import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Feather, Lightbulb, Users, Wand2, FileText, Upload, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onNewProject: () => void;
  onUploadManuscript: () => void;
  guideMode: boolean;
  setGuideMode: (enabled: boolean) => void;
}

export function LandingPage({ onNavigate, onNewProject, onUploadManuscript, guideMode, setGuideMode }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="creative-card mb-8 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="candlelight-glow rounded-lg p-3">
              <Feather className="h-8 w-8 text-ink" />
            </div>
            <div>
              <h1 className="font-title text-3xl text-foreground">World Crafter</h1>
              <p className="text-muted-foreground">Creative Suite for Storytellers</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant={guideMode ? "default" : "outline"}
              size="sm"
              onClick={() => setGuideMode(!guideMode)}
              className={guideMode ? "candlelight-glow" : ""}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI Guide {guideMode ? 'On' : 'Off'}
            </Button>
            <Button onClick={() => onNavigate('projects')} variant="outline" className="interactive-warm">
              <BookOpen className="h-4 w-4 mr-2" />
              Your Projects
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-title text-5xl mb-6 text-foreground">
            From Spark to Story
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 font-literary">
            A complete creative pipeline that guides you through world-building, outlining, 
            writing, and bringing your stories to life across any medium.
          </p>
          
          {/* Pipeline Visualization */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            {[
              { icon: Lightbulb, label: 'World Bible', desc: 'Build your universe' },
              { icon: FileText, label: 'Outline', desc: 'Structure your story' },
              { icon: Feather, label: 'Manuscript', desc: 'Write your tale' },
              { icon: Users, label: 'Storyboard', desc: 'Visualize scenes' }
            ].map((step, index) => (
              <div key={step.label} className="flex items-center">
                <div className="pipeline-step creative-card p-4 text-center interactive-warm">
                  <step.icon className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <div className="font-medium text-sm text-foreground">{step.label}</div>
                  <div className="text-xs text-muted-foreground">{step.desc}</div>
                  {guideMode && (
                    <div className="guide-hint">{step.desc}</div>
                  )}
                </div>
                {index < 3 && (
                  <div className="w-8 h-px bg-border mx-2"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          <Card className="creative-card interactive-warm animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center font-title">
                <Wand2 className="h-5 w-5 mr-2 text-accent" />
                Start Fresh
              </CardTitle>
              <CardDescription>
                Begin a new creative project with AI-powered assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={onNewProject} className="w-full candlelight-glow">
                <Feather className="h-4 w-4 mr-2" />
                Create New Project
              </Button>
              {guideMode && (
                <div className="guide-hint">Perfect for new stories and ideas</div>
              )}
            </CardContent>
          </Card>

          <Card className="creative-card interactive-warm animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center font-title">
                <Upload className="h-5 w-5 mr-2 text-accent" />
                Import Existing
              </CardTitle>
              <CardDescription>
                Bring your existing manuscript into the creative suite
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={onUploadManuscript} variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Upload Manuscript
              </Button>
              {guideMode && (
                <div className="guide-hint">Supports DOCX, PDF, and TXT files</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: 'World Bible',
              description: 'Characters, locations, factions, items, and more in one organized system',
              icon: BookOpen,
              features: ['Character Development', 'Location Mapping', 'Faction Politics', 'Magic Systems']
            },
            {
              title: 'Smart Outlining',
              description: 'Structure your story with proven frameworks or create your own',
              icon: FileText,
              features: ['15-Beat Structure', 'Three-Act Format', 'Custom Templates', 'Scene Planning']
            },
            {
              title: 'AI Integration',
              description: 'Intelligent assistance that understands your creative vision',
              icon: Sparkles,
              features: ['Context-Aware Help', 'Character Insights', 'Plot Suggestions', 'Consistency Checks']
            }
          ].map((feature, index) => (
            <Card key={feature.title} className="creative-card interactive-warm animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center font-title">
                  <feature.icon className="h-5 w-5 mr-2 text-accent" />
                  {feature.title}
                </CardTitle>
                <CardDescription className="font-literary">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {feature.features.map(feat => (
                    <Badge key={feat} variant="secondary" className="mr-2 mb-2">
                      {feat}
                    </Badge>
                  ))}
                </div>
                {guideMode && (
                  <div className="guide-hint">Click to explore this feature</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 mb-8">
          <p className="text-muted-foreground mb-6 font-literary">
            Ready to craft your world?
          </p>
          <div className="flex justify-center space-x-4">
            <Button onClick={onNewProject} size="lg" className="candlelight-glow font-title">
              Begin Your Journey
            </Button>
            <Button onClick={() => onNavigate('projects')} variant="outline" size="lg" className="interactive-warm">
              View Your Projects
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
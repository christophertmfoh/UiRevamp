import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Users, 
  MapPin, 
  Shield, 
  Package, 
  FileText, 
  BookOpen, 
  Feather,
  Sparkles,
  Settings,
  Plus,
  Search,
  ChevronRight
} from 'lucide-react';
import type { Project, ModalInfo } from '../lib/types';

interface ProjectDashboardProps {
  project: Project;
  onBack: () => void;
  onUpdateProject: (project: Project) => void;
  onOpenModal: (modalInfo: ModalInfo) => void;
  guideMode: boolean;
  setGuideMode: (enabled: boolean) => void;
}

export function ProjectDashboard({ 
  project, 
  onBack, 
  onUpdateProject, 
  onOpenModal, 
  guideMode, 
  setGuideMode 
}: ProjectDashboardProps) {
  const [activeView, setActiveView] = useState('overview');

  const pipelineSteps = [
    { 
      id: 'worldbible', 
      label: 'World Bible', 
      icon: BookOpen, 
      description: 'Build your universe',
      status: project.characters.length > 0 || project.locations.length > 0 ? 'active' : 'pending',
      count: project.characters.length + project.locations.length + project.factions.length + project.items.length
    },
    { 
      id: 'outline', 
      label: 'Outline', 
      icon: FileText, 
      description: 'Structure your story',
      status: project.outline.length > 0 ? 'active' : 'pending',
      count: project.outline.length
    },
    { 
      id: 'manuscript', 
      label: 'Manuscript', 
      icon: Feather, 
      description: 'Write your tale',
      status: project.manuscript.novel || project.manuscript.screenplay ? 'active' : 'pending',
      count: (project.manuscript.novel || project.manuscript.screenplay || '').split(' ').length
    },
    { 
      id: 'storyboard', 
      label: 'Storyboard', 
      icon: Users, 
      description: 'Visualize scenes',
      status: 'pending',
      count: 0
    }
  ];

  const worldBibleSections = [
    { 
      id: 'characters', 
      label: 'Characters', 
      icon: Users, 
      count: project.characters.length,
      description: 'People who inhabit your world'
    },
    { 
      id: 'locations', 
      label: 'Locations', 
      icon: MapPin, 
      count: project.locations.length,
      description: 'Places where your story unfolds'
    },
    { 
      id: 'factions', 
      label: 'Factions', 
      icon: Shield, 
      count: project.factions.length,
      description: 'Groups, organizations, and alliances'
    },
    { 
      id: 'items', 
      label: 'Items', 
      icon: Package, 
      count: project.items.length,
      description: 'Objects of power and significance'
    }
  ];

  const getStepStatusClass = (status: string) => {
    switch(status) {
      case 'active': return 'pipeline-step active';
      case 'completed': return 'pipeline-step completed';
      default: return 'pipeline-step';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="creative-card mb-8 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="interactive-warm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
            <div>
              <div className="studio-nav text-sm mb-2">
                <span>Studio</span>
                <span className="separator">→</span>
                <span className="text-accent">{project.name}</span>
              </div>
              <h1 className="font-title text-3xl text-foreground">{project.name}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="outline" className={`${project.type === 'novel' ? 'ember-accent' : project.type === 'screenplay' ? 'candlelight-glow' : 'leather-texture'}`}>
                  {project.type}
                </Badge>
                {project.genre.slice(0, 2).map(genre => (
                  <Badge key={genre} variant="secondary">{genre}</Badge>
                ))}
              </div>
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
              Guide {guideMode ? 'On' : 'Off'}
            </Button>
            <Button variant="outline" size="sm" className="interactive-warm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6">
        <Tabs value={activeView} onValueChange={setActiveView} className="space-y-8">
          <TabsList className="creative-card p-1">
            <TabsTrigger value="overview" className="px-6">Studio Overview</TabsTrigger>
            <TabsTrigger value="worldbible" className="px-6">World Bible</TabsTrigger>
            <TabsTrigger value="outline" className="px-6">Outline</TabsTrigger>
            <TabsTrigger value="manuscript" className="px-6">Manuscript</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Pipeline Progress */}
            <Card className="creative-card">
              <CardHeader>
                <CardTitle className="font-title flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-accent" />
                  Creative Pipeline
                </CardTitle>
                <CardDescription className="font-literary">
                  Your journey from concept to completion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {pipelineSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <Card className={`${getStepStatusClass(step.status)} interactive-warm cursor-pointer flex-1`}>
                        <CardContent className="p-4 text-center">
                          <step.icon className={`h-6 w-6 mx-auto mb-2 ${step.status === 'active' ? 'text-ink' : 'text-accent'}`} />
                          <div className="font-medium text-sm">{step.label}</div>
                          <div className="text-xs opacity-75 mb-2">{step.description}</div>
                          <Badge variant="outline" className="text-xs">
                            {step.count} {step.id === 'manuscript' ? 'words' : 'items'}
                          </Badge>
                          {guideMode && (
                            <div className="guide-hint">Click to start working here</div>
                          )}
                        </CardContent>
                      </Card>
                      {index < pipelineSteps.length - 1 && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* World Bible Quick Access */}
            <Card className="creative-card">
              <CardHeader>
                <CardTitle className="font-title flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-accent" />
                    World Bible
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setActiveView('worldbible')}
                    className="interactive-warm"
                  >
                    View All
                  </Button>
                </CardTitle>
                <CardDescription className="font-literary">
                  The foundation of your creative universe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {worldBibleSections.map(section => (
                    <Card key={section.id} className="workbench-surface interactive-warm cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <section.icon className="h-8 w-8 mx-auto mb-2 text-accent" />
                        <div className="font-medium text-sm mb-1">{section.label}</div>
                        <Badge variant="outline" className="text-xs">
                          {section.count}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-2">
                          {section.description}
                        </div>
                        {guideMode && (
                          <div className="guide-hint">Click to manage {section.label.toLowerCase()}</div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="creative-card">
              <CardHeader>
                <CardTitle className="font-title">Recent Activity</CardTitle>
                <CardDescription className="font-literary">
                  What you've been working on lately
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="font-literary">Start creating to see your recent activity here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="worldbible" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {worldBibleSections.map(section => (
                <Card key={section.id} className="creative-card interactive-warm">
                  <CardHeader>
                    <CardTitle className="flex items-center font-title">
                      <section.icon className="h-5 w-5 mr-2 text-accent" />
                      {section.label}
                      <Badge variant="outline" className="ml-auto">
                        {section.count}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="font-literary">
                      {section.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add {section.label.slice(0, -1)}
                    </Button>
                    {guideMode && (
                      <div className="guide-hint">Start building your {section.label.toLowerCase()}</div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="outline" className="space-y-8">
            <Card className="creative-card">
              <CardHeader>
                <CardTitle className="font-title">Story Structure</CardTitle>
                <CardDescription className="font-literary">
                  Organize your narrative flow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-title text-lg mb-2">No Outline Yet</h3>
                  <p className="text-muted-foreground mb-6 font-literary">
                    Start structuring your story with our guided outline tools
                  </p>
                  <Button className="candlelight-glow">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Outline
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manuscript" className="space-y-8">
            <Card className="creative-card">
              <CardHeader>
                <CardTitle className="font-title">Manuscript Editor</CardTitle>
                <CardDescription className="font-literary">
                  Where your story comes to life
                </CardDescription>
              </CardHeader>
              <CardContent>
                {project.manuscript.novel || project.manuscript.screenplay ? (
                  <div className="workbench-surface min-h-96 p-6">
                    <div className="font-literary text-foreground leading-relaxed">
                      {project.manuscript.novel || project.manuscript.screenplay}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Feather className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-title text-lg mb-2">Ready to Write?</h3>
                    <p className="text-muted-foreground mb-6 font-literary">
                      Your manuscript editor is ready for your first words
                    </p>
                    <Button className="candlelight-glow">
                      <Feather className="h-4 w-4 mr-2" />
                      Start Writing
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
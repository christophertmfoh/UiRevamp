import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ThemeToggle } from '../theme-toggle';
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
  ChevronRight,
  Globe,
  ScrollText,
  Film,
  Video,
  Music,
  BarChart3,
  Clock,
  Edit3
} from 'lucide-react';
import type { Project, ModalInfo } from '@/lib/types';
import { WorldBible } from '../world';

interface ProjectDashboardProps {
  project: Project;
  onBack: () => void;
  onUpdateProject: (project: Project) => void;
  onOpenModal: (modalInfo: ModalInfo) => void;
  onLogout: () => Promise<void>;
  user: any;
  isAuthenticated: boolean;
  guideMode: boolean;
  setGuideMode: (enabled: boolean) => void;
}

export function ProjectDashboard({ 
  project, 
  onBack, 
  onUpdateProject, 
  onOpenModal, 
  onLogout,
  user,
  isAuthenticated,
  guideMode, 
  setGuideMode 
}: ProjectDashboardProps) {
  const [activeSection, setActiveSection] = useState('studio-overview');

  // Micro menu navigation
  const microMenuItems = [
    { id: 'studio-overview', label: 'Studio Overview', icon: BarChart3 },
    { id: 'world-bible', label: 'World Bible', icon: Globe },
    { id: 'outline', label: 'Outline', icon: ScrollText },
    { id: 'manuscript', label: 'Manuscript', icon: Feather },
    { id: 'storyboard', label: 'Storyboard', icon: Film },
    { id: 'pre-vis', label: 'Pre-Vis', icon: Video },
    { id: 'score', label: 'Score', icon: Music }
  ];

  // Creative pipeline sections
  const pipelineSteps = [
    { 
      id: 'world-bible', 
      label: 'World Bible', 
      icon: Globe, 
      description: 'Develop your characters and story elements',
      status: (project?.characters?.length || 0) > 0 ? 'active' : 'pending',
      count: project?.characters?.length || 0,
      progress: Math.min(100, (project?.characters?.length || 0) * 10)
    },
    { 
      id: 'outline', 
      label: 'Outline', 
      icon: ScrollText, 
      description: 'Structure your story with detailed plotting',
      status: (project?.outline?.length || 0) > 0 ? 'active' : 'pending',
      count: project?.outline?.length || 0,
      progress: Math.min(100, (project?.outline?.length || 0) * 20)
    },
    { 
      id: 'manuscript', 
      label: 'Manuscript', 
      icon: Feather, 
      description: 'Write your story in novel, script, or graphic formats',
      status: project.manuscript?.novel || project.manuscript?.screenplay ? 'active' : 'pending',
      count: Math.floor((project.manuscript?.novel || project.manuscript?.screenplay || '').split(' ').length / 100) || 0,
      progress: Math.min(100, ((project.manuscript?.novel || project.manuscript?.screenplay || '').split(' ').length / 500))
    },
    { 
      id: 'storyboard', 
      label: 'Storyboard', 
      icon: Film, 
      description: 'Visualize scenes and camera movements',
      status: 'pending',
      count: 0,
      progress: 0
    },
    { 
      id: 'pre-vis', 
      label: 'Pre-Visualization', 
      icon: Video, 
      description: 'Assemble and animate your storyboards',
      status: 'pending',
      count: 0,
      progress: 0
    },
    { 
      id: 'score', 
      label: 'Score & Audio', 
      icon: Music, 
      description: 'Add music, sound effects, and voice over',
      status: 'pending',
      count: 0,
      progress: 0
    }
  ];

  // Recent activity data
  const recentActivity = [
    { action: 'Created character', item: 'Elena Marchetti', time: '2 hours ago', type: 'character' },
    { action: 'Updated manuscript', item: 'Chapter 3', time: '4 hours ago', type: 'manuscript' },
    { action: 'Added faction', item: 'The Crimson Order', time: '1 day ago', type: 'faction' },
    { action: 'Edited outline', item: 'Act II Structure', time: '2 days ago', type: 'outline' }
  ];

  return (
    <div className="min-h-screen">
      {/* Cinematic Header */}
      <header className="creative-card mb-8 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="interactive-warm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </div>
          
          {/* Fablecraft Logo - Centered */}
          <div className="text-center flex-1">
            <div className="flex items-center justify-center space-x-3">
              <Feather className="h-8 w-8 text-accent" />
              <h1 className="font-title text-4xl text-foreground tracking-wide">
                Fablecraft
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onOpenModal({ type: 'edit', project })}
              className="interactive-warm"
            >
              <Settings className="h-4 w-4 mr-2" />
              Project Settings
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setGuideMode(!guideMode)}
              className={guideMode ? 'candlelight-glow' : 'interactive-warm'}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {guideMode ? 'Exit Guide' : 'Guide'}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6">
        {/* Micro Menu Navigation */}
        <div className="mb-8">
          <div className="creative-card p-4">
            <nav className="flex justify-center space-x-1">
              {microMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 ${
                      activeSection === item.id ? 'candlelight-glow' : 'interactive-warm'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Based on Active Section */}
        {activeSection === 'studio-overview' && (
          <div className="space-y-8">
            {/* Creative Pipeline Section */}
            <div>
              <h2 className="font-title text-2xl mb-6 text-center">Creative Pipeline</h2>
              <div className="space-y-4">
                {pipelineSteps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <Card 
                      key={step.id} 
                      className="creative-card hover:shadow-lg transition-all cursor-pointer border-l-4"
                      style={{borderLeftColor: step.status === 'active' ? 'hsl(var(--accent))' : 'hsl(var(--border))'}}
                      onClick={() => setActiveSection(step.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-lg ${step.status === 'active' ? 'bg-accent/10 text-accent' : 'bg-muted'}`}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-title text-xl mb-1">{step.label}</h3>
                              <p className="text-muted-foreground">{step.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-2xl font-bold text-accent">{step.count}</div>
                              <div className="text-sm text-muted-foreground">
                                {step.id === 'manuscript' ? 'Pages' : step.id === 'outline' ? 'Beats' : 'Items'}
                              </div>
                            </div>
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-accent transition-all duration-300"
                                style={{width: `${step.progress}%`}}
                              />
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <Card className="creative-card">
              <CardHeader>
                <CardTitle className="font-title flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-accent" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Track your progress and recent changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 workbench-surface rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`h-2 w-2 rounded-full ${
                          activity.type === 'character' ? 'bg-blue-500' :
                          activity.type === 'manuscript' ? 'bg-green-500' :
                          activity.type === 'faction' ? 'bg-purple-500' :
                          'bg-orange-500'
                        }`} />
                        <div>
                          <span className="font-medium">{activity.action}</span>
                          <span className="text-accent mx-2">•</span>
                          <span className="text-muted-foreground">{activity.item}</span>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* World Bible Section */}
        {activeSection === 'world-bible' && (
          <WorldBible 
            project={project} 
            onBack={() => setActiveSection('studio-overview')} 
          />
        )}

        {/* Other section placeholders */}
        {activeSection !== 'studio-overview' && activeSection !== 'world-bible' && (
          <div className="text-center py-16">
            <div className="creative-card p-12 max-w-lg mx-auto">
              <div className="mb-4">
                {microMenuItems.find(item => item.id === activeSection)?.icon && 
                  React.createElement(microMenuItems.find(item => item.id === activeSection)!.icon, {
                    className: "h-16 w-16 mx-auto text-accent mb-4"
                  })
                }
              </div>
              <h3 className="font-title text-2xl mb-2">
                {microMenuItems.find(item => item.id === activeSection)?.label}
              </h3>
              <p className="text-muted-foreground mb-6">
                This section is coming soon with comprehensive tools for {activeSection.replace('-', ' ')}.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setActiveSection('studio-overview')}
                className="interactive-warm"
              >
                Return to Studio Overview
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
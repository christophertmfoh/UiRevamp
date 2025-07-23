import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Search, BookOpen, Clock, MoreVertical, Feather, Sparkles } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import type { Project, ModalInfo } from '../lib/types';

interface ProjectsViewProps {
  onSelectProject: (project: Project) => void;
  onOpenModal: (modalInfo: ModalInfo) => void;
  onBack: () => void;
  guideMode: boolean;
}

export function ProjectsView({ 
  onSelectProject, 
  onOpenModal, 
  onBack, 
  guideMode 
}: ProjectsViewProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['/api/projects'],
    queryFn: async () => {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      return response.json();
    }
  });

  const filteredProjects = projects.filter((project: Project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.genre.some((g: string) => g.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getProjectIcon = (type: string) => {
    switch(type) {
      case 'novel': return BookOpen;
      case 'screenplay': return Feather;
      case 'comic': return Sparkles;
      default: return BookOpen;
    }
  };

  const getProjectTypeColor = (type: string) => {
    switch(type) {
      case 'novel': return 'ember-accent';
      case 'screenplay': return 'candlelight-glow';
      case 'comic': return 'leather-texture';
      default: return 'ember-accent';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="creative-card p-8">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-48 mb-4"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="creative-card p-8 text-center">
          <h3 className="font-title text-xl mb-2 text-destructive">Error Loading Projects</h3>
          <p className="text-muted-foreground">Unable to load your projects. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="creative-card mb-8 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="interactive-warm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="font-title text-2xl text-foreground">Your Creative Projects</h1>
              <p className="text-muted-foreground">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'} in your studio
              </p>
            </div>
          </div>
          <Button onClick={() => onOpenModal({ type: 'new', project: null })} className="candlelight-glow">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 creative-card"
            />
            {guideMode && (
              <div className="guide-hint">Search by name, description, or genre</div>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 && projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="creative-card p-12 max-w-md mx-auto">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-title text-xl mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground mb-6 font-literary">
                Start your creative journey by creating your first project
              </p>
              <Button onClick={() => onOpenModal({ type: 'new', project: null })} className="candlelight-glow">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Project
              </Button>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="creative-card p-12 max-w-md mx-auto">
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-title text-xl mb-2">No Projects Found</h3>
              <p className="text-muted-foreground font-literary">
                Try adjusting your search terms
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: Project) => {
              const IconComponent = getProjectIcon(project.type);
              return (
                <Card 
                  key={project.id} 
                  className="creative-card hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => onSelectProject(project)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getProjectTypeColor(project.type)}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="font-title text-lg group-hover:text-accent transition-colors">
                            {project.name}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs capitalize">
                              {project.type}
                            </Badge>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDistanceToNow(new Date(project.lastModified), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="creative-card">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            onOpenModal({ type: 'rename', project });
                          }}>
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            onOpenModal({ type: 'edit', project });
                          }}>
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenModal({ type: 'delete', project });
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="font-literary text-sm line-clamp-3 mb-4">
                      {project.description || 'No description available'}
                    </CardDescription>
                    
                    {project.genre && project.genre.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.genre.slice(0, 3).map((genre, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                        {project.genre.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.genre.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
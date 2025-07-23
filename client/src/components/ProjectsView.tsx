import React from 'react';
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
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  onSelectProject: (project: Project) => void;
  onOpenModal: (modalInfo: ModalInfo) => void;
  onBack: () => void;
  guideMode: boolean;
}

export function ProjectsView({ 
  projects, 
  setProjects, 
  onSelectProject, 
  onOpenModal, 
  onBack, 
  guideMode 
}: ProjectsViewProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
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
            {filteredProjects.map((project) => {
              const ProjectIcon = getProjectIcon(project.type);
              return (
                <Card 
                  key={project.id} 
                  className="creative-card interactive-warm cursor-pointer group"
                  onClick={() => onSelectProject(project)}
                >
                  <CardHeader className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`${getProjectTypeColor(project.type)} rounded-lg p-2`}>
                          <ProjectIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="font-title text-lg group-hover:text-accent transition-colors">
                            {project.name}
                          </CardTitle>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {project.type}
                            </Badge>
                            <Clock className="h-3 w-3" />
                            <span>{formatDistanceToNow(project.lastModified, { addSuffix: true })}</span>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="creative-card">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            onOpenModal({ type: 'edit', project });
                          }}>
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            onOpenModal({ type: 'rename', project });
                          }}>
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenModal({ type: 'delete', project });
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {guideMode && (
                      <div className="guide-hint">Click to open this project</div>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    {project.description && (
                      <CardDescription className="mb-4 font-literary">
                        {project.description}
                      </CardDescription>
                    )}
                    
                    {project.genre.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.genre.slice(0, 3).map(genre => (
                          <Badge key={genre} variant="secondary" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                        {project.genre.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.genre.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      Created {formatDistanceToNow(project.createdAt, { addSuffix: true })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        {projects.length > 0 && (
          <div className="mt-12 text-center">
            <div className="creative-card p-6 max-w-md mx-auto">
              <h3 className="font-title text-lg mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  onClick={() => onOpenModal({ type: 'new', project: null })} 
                  className="w-full candlelight-glow"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Project
                </Button>
                <Button 
                  onClick={() => onOpenModal({ type: 'importManuscript', project: null })} 
                  variant="outline" 
                  className="w-full"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Import Manuscript
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
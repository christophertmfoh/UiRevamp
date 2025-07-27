import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

import { ArrowLeft, Plus, Search, BookOpen, Clock, MoreVertical, Feather, Sparkles, Users, MapPin, Edit, Trash2, Upload, FileText, Moon, Sun } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import type { Project, ModalInfo } from '@/lib/types';

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
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [genreFilter, setGenreFilter] = React.useState('all');
  const [isDark, setIsDark] = React.useState(true);

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

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

  const filteredProjects = projects.filter((project: Project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.genre.some((g: string) => g.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || project.type === typeFilter;
    const matchesGenre = genreFilter === 'all' || project.genre.includes(genreFilter);
    
    return matchesSearch && matchesType && matchesGenre;
  });

  // Get unique genres for filter dropdown
  const allGenres = Array.from(new Set(projects.flatMap((p: Project) => p.genre))).filter(Boolean) as string[];

  // Calculate project progress based on content
  const calculateProgress = (project: Project) => {
    let totalSections = 0;
    let completedSections = 0;

    // Check manuscript
    totalSections += 1;
    if (project.manuscript?.novel?.length > 100 || project.manuscript?.screenplay?.length > 100) {
      completedSections += 1;
    }

    // Check outline
    totalSections += 1;
    if (project.outline && project.outline.length > 0) {
      completedSections += 1;
    }

    // Check characters
    totalSections += 1;
    if (project.characters && project.characters.length > 0) {
      completedSections += 1;
    }

    // Check factions
    totalSections += 1;
    if (project.factions && project.factions.length > 0) {
      completedSections += 1;
    }

    return Math.round((completedSections / totalSections) * 100);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/50 to-red-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative transition-all duration-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 bg-repeat bg-center dark:block hidden" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a574' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Ambient lighting */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-amber-200/30 to-orange-300/20 dark:from-amber-500/10 dark:to-orange-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-br from-orange-200/20 to-red-300/15 dark:from-orange-500/5 dark:to-red-600/3 rounded-full blur-2xl"></div>

      {/* Header */}
      <header className="relative z-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border-b border-amber-200/60 dark:border-amber-500/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack} 
                className="text-stone-600 dark:text-amber-200 hover:bg-amber-100/70 dark:hover:bg-amber-900/30 transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <div className="h-6 w-px bg-amber-200 dark:bg-amber-700/50"></div>
              <div>
                <h1 className="text-3xl font-bold text-stone-800 dark:text-amber-50">Your Creative Projects</h1>
                <p className="text-sm text-stone-600 dark:text-stone-300">
                  {projects.length} {projects.length === 1 ? 'project' : 'projects'} in your studio
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setIsDark(!isDark)}
                variant="ghost"
                size="icon"
                className="w-10 h-10 p-0 rounded-xl text-stone-600 dark:text-amber-200 hover:bg-amber-100/70 dark:hover:bg-amber-900/30 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Button 
                onClick={() => onOpenModal({ type: 'import', project: null })} 
                variant="outline"
                className="border-amber-400 dark:border-amber-500/40 text-amber-700 dark:text-amber-200 bg-white/80 dark:bg-slate-800/50 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 hover:border-amber-500 dark:hover:border-amber-400 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Document
              </Button>
              <Button 
                onClick={() => onOpenModal({ type: 'new', project: null })} 
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 dark:from-amber-400 dark:via-orange-400 dark:to-red-400 dark:hover:from-amber-500 dark:hover:via-orange-500 dark:hover:to-red-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600 dark:text-amber-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-amber-200/60 dark:border-amber-500/30 text-stone-700 dark:text-amber-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:border-amber-400 dark:focus:border-amber-400 shadow-sm hover:shadow-md transition-all duration-200"
              />
              {guideMode && (
                <div className="guide-hint">Search by name, description, or genre</div>
              )}
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-amber-200/60 dark:border-amber-500/30 text-stone-700 dark:text-amber-100 hover:border-amber-400 dark:hover:border-amber-400 shadow-sm hover:shadow-md transition-all duration-200">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border border-amber-200/60 dark:border-amber-500/30">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="novel">Novel</SelectItem>
                <SelectItem value="screenplay">Screenplay</SelectItem>
                <SelectItem value="comic">Comic</SelectItem>
              </SelectContent>
            </Select>
            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-amber-200/60 dark:border-amber-500/30 text-stone-700 dark:text-amber-100 hover:border-amber-400 dark:hover:border-amber-400 shadow-sm hover:shadow-md transition-all duration-200">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border border-amber-200/60 dark:border-amber-500/30">
                <SelectItem value="all">All Genres</SelectItem>
                {allGenres.map((genre) => (
                  <SelectItem key={genre} value={genre}>{String(genre)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 && projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg rounded-3xl p-12 border border-amber-200/60 dark:border-slate-600/50 shadow-2xl max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 dark:from-amber-500 dark:via-orange-600 dark:to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-stone-800 dark:text-amber-50 mb-3">No Projects Yet</h3>
              <p className="text-stone-600 dark:text-stone-300 mb-8 leading-relaxed">
                Start your creative journey by creating your first project
              </p>
              <Button 
                onClick={() => onOpenModal({ type: 'new', project: null })} 
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 dark:from-amber-400 dark:via-orange-400 dark:to-red-400 dark:hover:from-amber-500 dark:hover:via-orange-500 dark:hover:to-red-500 text-white px-8 py-3 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Project
              </Button>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg rounded-3xl p-12 border border-amber-200/60 dark:border-slate-600/50 shadow-2xl max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 via-red-500 to-red-600 dark:from-orange-500 dark:via-red-600 dark:to-red-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Search className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-stone-800 dark:text-amber-50 mb-3">No Projects Found</h3>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                Try adjusting your search terms or filters
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: Project) => {
              const IconComponent = getProjectIcon(project.type);
              const projectProgress = calculateProgress(project);
              
              return (
                <div 
                  key={project.id} 
                  className="group relative bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-amber-200/50 dark:border-amber-600/20 shadow-lg hover:shadow-2xl hover:shadow-amber-200/20 dark:hover:shadow-amber-900/10 transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden"
                  onClick={() => onSelectProject(project)}
                >
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 via-orange-50/0 to-red-50/0 dark:from-amber-900/0 dark:via-orange-900/0 dark:to-red-900/0 group-hover:from-amber-50/50 group-hover:via-orange-50/30 group-hover:to-red-50/20 dark:group-hover:from-amber-900/20 dark:group-hover:via-orange-900/15 dark:group-hover:to-red-900/10 transition-all duration-700"></div>
                  
                  <div className="relative z-10 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${
                          project.type === 'novel' ? 'from-amber-400 via-orange-500 to-orange-600 dark:from-amber-500 dark:via-orange-600 dark:to-orange-700' :
                          project.type === 'screenplay' ? 'from-orange-400 via-red-500 to-red-600 dark:from-orange-500 dark:via-red-600 dark:to-red-700' :
                          'from-red-400 via-red-500 to-orange-600 dark:from-red-500 dark:via-red-600 dark:to-orange-700'
                        } rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-stone-800 dark:text-amber-50 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                            {project.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 capitalize bg-amber-100/50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                              {project.type}
                            </span>
                            <div className="flex items-center text-xs text-stone-500 dark:text-stone-400">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDistanceToNow(new Date(project.lastModified), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-stone-500 hover:text-amber-600 dark:text-stone-400 dark:hover:text-amber-400 hover:bg-amber-100/50 dark:hover:bg-amber-900/30"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border border-amber-200/60 dark:border-amber-500/30">
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenModal({ type: 'rename', project });
                            }}
                            className="hover:bg-amber-100 dark:hover:bg-amber-900/30"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenModal({ type: 'edit', project });
                            }}
                            className="hover:bg-amber-100 dark:hover:bg-amber-900/30"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenModal({ type: 'delete', project });
                            }}
                            className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 focus:text-red-600 dark:focus:text-red-400"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    {/* Genres */}
                    {project.genre && project.genre.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.genre.slice(0, 2).map((genre: string, index: number) => (
                          <span key={index} className="text-xs font-medium bg-amber-100/50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full">
                            {genre}
                          </span>
                        ))}
                        {project.genre.length > 2 && (
                          <span className="text-xs font-medium bg-orange-100/50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full">
                            +{project.genre.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-stone-700 dark:text-amber-100">Progress</span>
                        <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">{projectProgress}%</span>
                      </div>
                      <div className="h-2 bg-stone-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 dark:from-amber-500 dark:via-orange-600 dark:to-red-600 transition-all duration-500"
                          style={{ width: `${projectProgress}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-900/10 group-hover:bg-amber-100/50 dark:group-hover:bg-amber-900/20 transition-colors duration-300">
                        <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent mb-1">
                          {project.characters?.length || 0}
                        </div>
                        <div className="text-xs font-medium text-stone-600 dark:text-stone-300 uppercase tracking-wide">
                          Characters
                        </div>
                      </div>
                      <div className="text-center p-4 rounded-2xl bg-orange-50/50 dark:bg-orange-900/10 group-hover:bg-orange-100/50 dark:group-hover:bg-orange-900/20 transition-colors duration-300">
                        <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent mb-1">
                          {project.factions?.length || 0}
                        </div>
                        <div className="text-xs font-medium text-stone-600 dark:text-stone-300 uppercase tracking-wide">
                          Factions
                        </div>
                      </div>
                    </div>

                    {/* Description if exists */}
                    {project.description && (
                      <p className="mt-4 text-sm text-stone-600 dark:text-stone-300 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
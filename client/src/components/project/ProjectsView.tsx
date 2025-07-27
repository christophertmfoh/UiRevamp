import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ThemeToggle } from '../theme-toggle';

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
    const genreArray = Array.isArray(project.genre) ? project.genre : [project.genre].filter(Boolean);
    
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      genreArray.some((g: string) => g.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || project.type === typeFilter;
    const matchesGenre = genreFilter === 'all' || genreArray.includes(genreFilter);
    
    return matchesSearch && matchesType && matchesGenre;
  });

  // Get unique genres for filter dropdown
  const allGenres = Array.from(new Set(projects.flatMap((p: Project) => {
    return Array.isArray(p.genre) ? p.genre : [p.genre].filter(Boolean);
  }))).filter(Boolean) as string[];

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

    // Check description
    totalSections += 1;
    if (project.description && project.description.length > 20) {
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
    <div className="min-h-screen bg-gradient-to-br from-amber-100/70 via-orange-100/40 to-red-100/25 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative transition-all duration-700 overflow-hidden">
      {/* Enhanced Background Patterns */}
      <div className="absolute inset-0">
        {/* Light mode pattern */}
        <div className="absolute inset-0 opacity-20 dark:opacity-0 transition-opacity duration-700" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='0.08'%3E%3Cpath d='M50 50c13.807 0 25-11.193 25-25S63.807 0 50 0 25 11.193 25 25s11.193 25 25 25zm0 25c13.807 0 25-11.193 25-25S63.807 50 50 50 25 61.193 25 75s11.193 25 25 25zM25 25c13.807 0 25-11.193 25-25S38.807-25 25-25 0-13.807 0 0s11.193 25 25 25zm50 0c13.807 0 25-11.193 25-25S88.807-25 75-25 50-13.807 50 0s11.193 25 25 25z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Dark mode pattern */}
        <div className="absolute inset-0 opacity-0 dark:opacity-30 transition-opacity duration-700" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.03'%3E%3Ccircle cx='40' cy='40' r='20'/%3E%3Ccircle cx='20' cy='20' r='10'/%3E%3Ccircle cx='60' cy='20' r='10'/%3E%3Ccircle cx='20' cy='60' r='10'/%3E%3Ccircle cx='60' cy='60' r='10'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Enhanced Ambient Lighting */}
      <div className="absolute top-32 left-32 w-[500px] h-[500px] bg-gradient-to-br from-amber-300/40 via-orange-400/30 to-red-400/20 dark:from-amber-500/15 dark:via-orange-600/10 dark:to-red-600/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-[400px] h-[400px] bg-gradient-to-br from-orange-300/30 via-red-400/20 to-pink-400/15 dark:from-orange-500/10 dark:via-red-600/8 dark:to-pink-600/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-amber-200/20 via-orange-300/15 to-red-300/10 dark:from-amber-600/8 dark:via-orange-700/6 dark:to-red-700/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>

      {/* Cinematic Header */}
      <header className="relative z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-amber-200/60 dark:border-amber-500/20 shadow-xl">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Left Side - Navigation & Title */}
            <div className="flex items-center space-x-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack} 
                className="group text-stone-600 dark:text-amber-200 hover:bg-gradient-to-r hover:from-amber-100/80 hover:to-orange-100/60 dark:hover:from-amber-900/40 dark:hover:to-orange-900/30 transition-all duration-300 hover:scale-105 rounded-xl px-4 py-2 shadow-md hover:shadow-lg"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Home
              </Button>
              
              <div className="h-8 w-px bg-gradient-to-b from-amber-300 to-orange-400 dark:from-amber-600 dark:to-orange-700"></div>
              
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 dark:from-amber-400 dark:via-orange-400 dark:to-red-400 rounded-2xl shadow-lg">
                  <Feather className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-stone-800 via-amber-700 to-orange-600 dark:from-amber-100 dark:via-orange-200 dark:to-red-200 bg-clip-text text-transparent tracking-tight">
                    Creative Studio
                  </h1>
                  <p className="text-sm text-stone-600 dark:text-stone-300 font-medium">
                    {projects.length} {projects.length === 1 ? 'project' : 'projects'} in development
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right Side - Actions */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              <Button 
                onClick={() => onOpenModal({ type: 'import', project: null })} 
                variant="outline"
                className="group border-2 border-amber-400/60 dark:border-amber-500/40 text-amber-700 dark:text-amber-200 bg-white/90 dark:bg-slate-800/60 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/30 dark:hover:to-orange-900/20 hover:border-amber-500 dark:hover:border-amber-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 px-6 py-2.5 rounded-xl font-medium"
              >
                <Upload className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Import Document
              </Button>
              
              <Button 
                onClick={() => onOpenModal({ type: 'new', project: null })} 
                className="group bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 dark:from-amber-400 dark:via-orange-400 dark:to-red-400 dark:hover:from-amber-500 dark:hover:via-orange-500 dark:hover:to-red-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 px-6 py-2.5 rounded-xl font-semibold"
              >
                <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                New Project
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 container mx-auto px-8 py-12">
        {/* Enhanced Search and Filters Section */}
        <div className="mb-12">
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl p-8 border border-amber-200/60 dark:border-amber-500/20 shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-xl">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                  <Search className="h-4 w-4 text-white" />
                </div>
                <Input
                  placeholder="Search your creative projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-16 pr-6 py-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 border-amber-200/60 dark:border-amber-500/30 text-stone-700 dark:text-amber-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:border-amber-500 dark:focus:border-amber-400 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl text-lg font-medium"
                />
                {guideMode && (
                  <div className="absolute top-full mt-2 left-0 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
                    Search by name, description, or genre
                  </div>
                )}
              </div>
              
              {/* Filter Controls */}
              <div className="flex gap-4">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-56 py-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 border-amber-200/60 dark:border-amber-500/30 text-stone-700 dark:text-amber-100 hover:border-amber-500 dark:hover:border-amber-400 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl font-medium">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-amber-200/60 dark:border-amber-500/30 rounded-2xl shadow-2xl">
                    <SelectItem value="all" className="py-3 px-4 text-base font-medium">All Types</SelectItem>
                    <SelectItem value="novel" className="py-3 px-4 text-base font-medium">📖 Novel</SelectItem>
                    <SelectItem value="screenplay" className="py-3 px-4 text-base font-medium">🎬 Screenplay</SelectItem>
                    <SelectItem value="comic" className="py-3 px-4 text-base font-medium">📚 Comic</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={genreFilter} onValueChange={setGenreFilter}>
                  <SelectTrigger className="w-56 py-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 border-amber-200/60 dark:border-amber-500/30 text-stone-700 dark:text-amber-100 hover:border-amber-500 dark:hover:border-amber-400 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl font-medium">
                    <SelectValue placeholder="All Genres" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-amber-200/60 dark:border-amber-500/30 rounded-2xl shadow-2xl">
                    <SelectItem value="all" className="py-3 px-4 text-base font-medium">All Genres</SelectItem>
                    {allGenres.map((genre) => (
                      <SelectItem key={genre} value={genre} className="py-3 px-4 text-base font-medium">{String(genre)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Display */}
        {filteredProjects.length === 0 && projects.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-16 border border-amber-200/60 dark:border-amber-500/20 shadow-2xl max-w-2xl mx-auto relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"></div>
              
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 dark:from-amber-400 dark:via-orange-400 dark:to-red-400 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl animate-pulse">
                  <Feather className="h-12 w-12 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold bg-gradient-to-r from-stone-800 via-amber-700 to-orange-600 dark:from-amber-100 dark:via-orange-200 dark:to-red-200 bg-clip-text text-transparent mb-4">
                  Your Creative Journey Begins
                </h3>
                
                <p className="text-stone-600 dark:text-stone-300 mb-10 text-lg leading-relaxed max-w-md mx-auto">
                  Transform your ideas into extraordinary stories. Create your first project to unlock the full power of AI-assisted storytelling.
                </p>
                
                <div className="space-y-4">
                  <Button 
                    onClick={() => onOpenModal({ type: 'new', project: null })} 
                    className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 dark:from-amber-400 dark:via-orange-400 dark:to-red-400 dark:hover:from-amber-500 dark:hover:via-orange-500 dark:hover:to-red-500 text-white px-8 py-3 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 rounded-2xl"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Project
                  </Button>
                  
                  <Button 
                    onClick={() => onOpenModal({ type: 'import', project: null })} 
                    variant="outline"
                    className="border-2 border-amber-400 dark:border-amber-500/40 text-amber-700 dark:text-amber-200 bg-white/90 dark:bg-slate-800/60 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/30 dark:hover:to-orange-900/20 px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Import Document
                  </Button>
                </div>
              </div>
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
                    {(() => {
                      const genreArray = Array.isArray(project.genre) ? project.genre : [project.genre].filter(Boolean);
                      return genreArray.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {genreArray.slice(0, 2).map((genre: string, index: number) => (
                            <span key={index} className="text-xs font-medium bg-amber-100/50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full">
                              {genre}
                            </span>
                          ))}
                          {genreArray.length > 2 && (
                            <span className="text-xs font-medium bg-orange-100/50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full">
                              +{genreArray.length - 2}
                            </span>
                          )}
                        </div>
                      );
                    })()}
                    
                    {/* Description */}
                    {project.description && (
                      <p className="text-sm text-stone-600 dark:text-stone-300 mb-4 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    )}
                    
                    {/* Progress Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Progress</span>
                        <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{projectProgress}%</span>
                      </div>
                      
                      <div className="w-full bg-stone-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 dark:from-amber-400 dark:via-orange-400 dark:to-red-400 rounded-full transition-all duration-700 group-hover:animate-pulse"
                          style={{ width: `${projectProgress}%` }}
                        ></div>
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            <span>{project.characters?.length || 0} characters</span>
                          </div>
                          {project.lastModified && (
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Updated {formatDistanceToNow(new Date(project.lastModified), { addSuffix: true })}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover overlay with call-to-action */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-stone-800 dark:text-amber-100 px-4 py-2 rounded-xl font-medium text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      Click to open project
                    </div>
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
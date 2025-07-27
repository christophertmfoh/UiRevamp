import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PlusCircle, 
  Search, 
  Grid3X3, 
  List, 
  Clock, 
  Calendar,
  FileText,
  BookOpen,
  Settings,
  LogOut,
  User,
  Moon,
  Sun,
  ChevronDown,
  Sparkles,
  PenTool,
  Library,
  Feather,
  ArrowLeft,
  Activity,
  TrendingUp,
  Image,
  CheckCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { Project } from '@/lib/types';

interface ProjectsPageRedesignProps {
  onNavigate: (view: string) => void;
  onNewProject: () => void;
  onSelectProject: (project: Project) => void;
  onLogout: () => Promise<void>;
  user: any;
}

export function ProjectsPageRedesign({ 
  onNavigate, 
  onNewProject, 
  onSelectProject, 
  onLogout,
  user 
}: ProjectsPageRedesignProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    const saved = localStorage.getItem('projects-view-mode');
    return (saved as 'grid' | 'list') || 'list';
  });
  const [sortBy, setSortBy] = useState<'name' | 'updated' | 'created' | 'type'>(() => {
    const saved = localStorage.getItem('projects-sort-by');
    return (saved as 'name' | 'updated' | 'created' | 'type') || 'updated';
  });
  const [scrollY, setScrollY] = useState(0);

  // Helper functions to update preferences and save to localStorage
  const updateViewMode = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('projects-view-mode', mode);
  };

  const updateSortBy = (sort: 'name' | 'updated' | 'created' | 'type') => {
    setSortBy(sort);
    localStorage.setItem('projects-sort-by', sort);
  };

  // Parallax scrolling effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects']
  });

  const filteredProjects = projects.filter((project: Project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (typeof project.genre === 'string' && project.genre.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a: Project, b: Project) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'updated':
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'type':
        return (a.type || '').localeCompare(b.type || '');
      default:
        return 0;
    }
  });

  // Calculate stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p: Project) => 
    new Date(p.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
  ).length;
  const uniqueGenres = Array.from(new Set(projects.map((p: Project) => p.genre).filter(Boolean))).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-emerald-50 dark:from-stone-950 dark:via-stone-900 dark:to-emerald-950 transition-all duration-300">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/35 via-stone-300/50 to-amber-300/35 dark:from-emerald-900/20 dark:via-stone-900/40 dark:to-amber-900/20"></div>
        
        {/* Floating Orbs */}
        <div 
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/45 to-emerald-600/50 dark:from-emerald-600/30 dark:to-emerald-800/30 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        ></div>
        <div 
          className="absolute top-20 -right-32 w-96 h-96 bg-gradient-to-br from-amber-400/40 to-amber-600/45 dark:from-amber-600/20 dark:to-amber-800/20 rounded-full blur-3xl animate-pulse delay-1000"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        ></div>
        <div 
          className="absolute -bottom-32 left-1/2 w-64 h-64 bg-gradient-to-br from-stone-400/45 to-stone-600/50 dark:from-stone-600/30 dark:to-stone-800/30 rounded-full blur-3xl animate-pulse delay-500"
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        ></div>

        {/* Ambient Lighting Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-emerald-400/25 dark:bg-emerald-500/10 rounded-full blur-2xl animate-pulse delay-300"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-amber-400/25 dark:bg-amber-500/10 rounded-full blur-2xl animate-pulse delay-700"></div>
          <div className="absolute top-3/4 left-3/4 w-32 h-32 bg-stone-500/25 dark:bg-stone-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Navigation Header */}
      <nav className="relative z-10 px-8 py-6 border-b border-stone-200/20 dark:border-stone-800/20 backdrop-blur-xl">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-6">
            {/* Back to Landing */}
            <Button
              variant="ghost"
              onClick={() => onNavigate('landing')}
              className="group text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Back
            </Button>
            
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 via-stone-600 to-amber-700 rounded-xl flex items-center justify-center shadow-lg">
                <Feather className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black font-serif text-stone-900 dark:text-stone-50 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-wide">
                Fablecraft
              </span>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  className="group bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 hover:from-emerald-500 hover:via-stone-500 hover:to-amber-600 text-white px-4 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 rounded-xl relative overflow-hidden flex items-center space-x-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center space-x-2">
                    <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span className="hidden sm:inline">{user?.username}</span>
                    <ChevronDown className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        {/* Page Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 py-8">
          {/* Left Side - Title and Description */}
          <div className="space-y-6">
            <div className="overflow-visible py-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 bg-clip-text text-transparent leading-relaxed tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] pb-6 mt-[1px] mb-[1px]">
                Your Projects
              </h1>
            </div>
            <p className="text-xl text-stone-800 dark:text-stone-200 leading-[1.8] font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] tracking-wide">
              Organize, track, and bring your stories to life with intelligent project management.
            </p>
          </div>

          {/* Right Side - Quick Access Cards */}
          <div className="space-y-4">
            {/* Recent Project Card */}
            {projects.length > 0 && (
              <Card className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-xl rounded-[2rem] shadow-xl border border-stone-300/30 dark:border-slate-700/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-stone-900 dark:text-stone-50 text-sm">Recent Project</h3>
                    <Badge className="bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 text-white text-xs">
                      Active
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-stone-900 dark:text-stone-100 truncate">{projects[0]?.name}</p>
                    <p className="text-xs text-stone-600 dark:text-stone-400 truncate">{projects[0]?.description || 'No description'}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button 
                        size="sm"
                        onClick={() => onNavigate(`project/${projects[0]?.id}`)}
                        className="bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 hover:from-emerald-500 hover:via-stone-500 hover:to-amber-600 text-white text-xs px-3 py-1 font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg"
                      >
                        Open
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick To-Do Box */}
            <Card className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-xl rounded-[2rem] shadow-xl border border-stone-300/30 dark:border-slate-700/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-50 text-sm">Quick Tasks</h3>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                    <span className="text-stone-700 dark:text-stone-300">Develop main characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                    <span className="text-stone-700 dark:text-stone-300">Outline chapter structure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-stone-600 rounded-full"></div>
                    <span className="text-stone-700 dark:text-stone-300">Review plot points</span>
                  </div>
                </div>
                <Button 
                  size="sm"
                  className="mt-3 bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 hover:from-emerald-500 hover:via-stone-500 hover:to-amber-600 text-white text-xs px-3 py-1 font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg w-full"
                >
                  View All Tasks
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-xl rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-stone-300/30 dark:border-slate-700/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-black text-stone-900 dark:text-stone-50">
                    {totalProjects}
                  </p>
                  <p className="text-sm font-medium text-stone-600 dark:text-stone-400 mt-1">
                    Total Projects
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 via-stone-600 to-amber-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Library className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-xl rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-stone-300/30 dark:border-slate-700/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-black text-stone-900 dark:text-stone-50">
                    {activeProjects}
                  </p>
                  <p className="text-sm font-medium text-stone-600 dark:text-stone-400 mt-1">
                    Active This Week
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 via-stone-600 to-amber-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-xl rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-stone-300/30 dark:border-slate-700/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-black text-stone-900 dark:text-stone-50">
                    {uniqueGenres}
                  </p>
                  <p className="text-sm font-medium text-stone-600 dark:text-stone-400 mt-1">
                    Genres Explored
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 via-stone-600 to-amber-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-600 via-stone-600 to-amber-700 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer" onClick={onNewProject}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] tracking-tight">
                    New Project
                  </p>
                  <p className="text-sm font-medium text-white/90 mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] tracking-wide">
                    Start your journey
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <PlusCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl border border-stone-300/30 dark:border-slate-700/20 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-emerald-600 via-stone-600 to-amber-700 rounded-lg flex items-center justify-center">
                <Search className="h-4 w-4 text-white pointer-events-none" />
              </div>
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-14 pr-4 bg-white/80 dark:bg-stone-800/60 border-stone-300/30 dark:border-stone-700/30 rounded-2xl text-stone-900 dark:text-stone-100 placeholder:text-stone-500 dark:placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-300"
              />
            </div>

            {/* Sort Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-12 px-6 bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 hover:from-emerald-500 hover:via-stone-500 hover:to-amber-600 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {sortBy === 'updated' ? 'Recently Updated' : 
                   sortBy === 'created' ? 'Date Created' : 
                   sortBy === 'type' ? 'Type' :
                   'Name'}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                <DropdownMenuItem onClick={() => updateSortBy('name')}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateSortBy('updated')}>
                  <Clock className="w-4 h-4 mr-2" />
                  Recently Updated
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateSortBy('created')}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Date Created
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateSortBy('type')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Project Type
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Toggle */}
            <div className="flex items-center bg-white/80 dark:bg-stone-800/60 rounded-2xl p-1 border border-stone-300/30 dark:border-stone-700/30">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updateViewMode('grid')}
                className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 text-white shadow-md' 
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updateViewMode('list')}
                className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 text-white shadow-md' 
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Results Counter */}
          {searchTerm && (
            <div className="mt-4 text-center">
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Found <span className="font-semibold text-stone-900 dark:text-stone-100">{filteredProjects.length}</span> result{filteredProjects.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>

        {/* Projects Display */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card className="bg-white/80 dark:bg-stone-900/40 backdrop-blur-xl border-stone-300/20 dark:border-stone-700/30 shadow-xl">
            <CardContent className="p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-600/20 via-stone-600/20 to-amber-700/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <PenTool className="w-12 h-12 text-stone-600 dark:text-stone-400" />
              </div>
              <h3 className="text-2xl font-black text-stone-900 dark:text-stone-50 mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-tight">
                {searchTerm ? 'No projects found' : 'Start Your First Story'}
              </h3>
              <p className="text-stone-800 dark:text-stone-200 mb-6 max-w-md mx-auto font-medium leading-[1.6] drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] tracking-wide">
                {searchTerm 
                  ? 'Try adjusting your search or create a new project.' 
                  : 'Every great story begins with a single idea. Start crafting your narrative today.'}
              </p>
              <Button 
                onClick={onNewProject}
                className="bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 hover:from-emerald-500 hover:via-stone-500 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Create New Project
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: Project) => (
              <ProjectCard key={project.id} project={project} onSelect={onSelectProject} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project: Project) => (
              <ProjectListItem key={project.id} project={project} onSelect={onSelectProject} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Project Card Component
function ProjectCard({ project, onSelect }: { project: Project; onSelect: (project: Project) => void }) {
  const getProjectIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'novel': return BookOpen;
      case 'screenplay': return FileText;
      case 'graphic novel': return Image;
      default: return PenTool;
    }
  };

  const ProjectIcon = getProjectIcon(project.type || '');

  return (
    <Card 
      className="group bg-white/80 dark:bg-stone-900/40 backdrop-blur-xl border-stone-300/20 dark:border-stone-700/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 cursor-pointer overflow-hidden"
      onClick={() => onSelect(project)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 via-stone-600/5 to-amber-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardHeader className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 via-stone-600 to-amber-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <ProjectIcon className="w-7 h-7 text-white" />
          </div>
          <Badge className="bg-gradient-to-r from-emerald-100 to-amber-100 dark:from-emerald-600 dark:via-stone-600 dark:to-amber-700 text-stone-700 dark:text-white border-0">
            {typeof project.genre === 'string' ? project.genre : (Array.isArray(project.genre) && project.genre[0]) || 'Unspecified'}
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold text-stone-900 dark:text-stone-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
          {project.name}
        </CardTitle>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
          {project.type || 'Creative Project'}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-stone-700 dark:text-stone-300 text-sm mb-4 line-clamp-3">
          {project.description || 'No description available.'}
        </p>
        
        <div className="flex items-center text-xs text-stone-500 dark:text-stone-400">
          <Clock className="w-3 h-3 mr-1" />
          Updated {new Date(project.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}

// Project List Item Component
function ProjectListItem({ project, onSelect }: { project: Project; onSelect: (project: Project) => void }) {
  const getProjectIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'novel': return BookOpen;
      case 'screenplay': return FileText;
      case 'graphic novel': return Image;
      default: return PenTool;
    }
  };

  const ProjectIcon = getProjectIcon(project.type || '');

  return (
    <Card 
      className="group bg-white/80 dark:bg-stone-900/40 backdrop-blur-xl border-stone-300/20 dark:border-stone-700/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      onClick={() => onSelect(project)}
    >
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 via-stone-600 to-amber-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <ProjectIcon className="w-8 h-8 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
              {project.name}
            </h3>
            <p className="text-stone-600 dark:text-stone-400 text-sm">
              {project.type || 'Creative Project'}
            </p>
            <p className="text-stone-700 dark:text-stone-300 text-sm mt-1 line-clamp-1">
              {project.description || 'No description available.'}
            </p>
          </div>
          
          <div className="text-right space-y-2">
            <Badge className="bg-gradient-to-r from-emerald-100 to-amber-100 dark:from-emerald-600 dark:via-stone-600 dark:to-amber-700 text-stone-700 dark:text-white border-0">
              {typeof project.genre === 'string' ? project.genre : (Array.isArray(project.genre) && project.genre[0]) || 'Unspecified'}
            </Badge>
            <div className="flex items-center text-xs text-stone-500 dark:text-stone-400">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(project.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { 
  Feather, 
  BookOpen, 
  Users,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Settings,
  User,
  LogOut,
  ChevronDown,
  PenTool,
  Calendar,
  FileText,
  Image,
  Sparkles,
  TrendingUp,
  Clock,
  Star,
  Heart,
  Share2,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  Target,
  Zap,
  Moon,
  Sun
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Project } from '@/lib/types';

interface ProjectsViewProps {
  onNavigate: (view: string) => void;
  onNewProject: () => void;
  onSelectProject: (project: Project) => void;
  onLogout: () => Promise<void>;
  user: any;
}

export function ProjectsView({ 
  onNavigate, 
  onNewProject, 
  onSelectProject, 
  onLogout,
  user 
}: ProjectsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [scrollY, setScrollY] = useState(0);
  const queryClient = useQueryClient();

  // Parallax scrolling effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['/api/projects']
  });

  const filteredProjects = projects.filter((project: Project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate project progress based on content
  const calculateProgress = (project: Project) => {
    let totalSections = 0;
    let completedSections = 0;

    // Check basic info
    totalSections += 1;
    if (project.description && project.description.length > 20) {
      completedSections += 1;
    }

    // Check genres
    totalSections += 1;
    if (project.genres && project.genres.length > 0) {
      completedSections += 1;
    }

    // Check type
    totalSections += 1;
    if (project.type && project.type.length > 0) {
      completedSections += 1;
    }

    return Math.round((completedSections / totalSections) * 100);
  };

  const handleSettingsAction = async (action: string) => {
    switch (action) {
      case 'account':
        // Navigate to account page
        console.log('Navigate to account');
        break;
      case 'settings':
        // Navigate to settings page
        console.log('Navigate to settings');
        break;
      case 'logout':
        await onLogout();
        break;
    }
  };

  return (
    <div className="min-h-screen relative transition-all duration-300 overflow-hidden bg-gradient-to-br from-stone-50 via-amber-50/20 to-emerald-50/10 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      
      {/* Same Background System as Landing Page */}
      <div className="absolute inset-0">
        {/* Light Mode Mesh Gradient */}
        <div className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/80 via-amber-100/40 to-stone-100/60"></div>
          <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-stone-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>
        </div>

        {/* Dark Mode Mesh Gradient */}
        <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-amber-950/10 to-stone-950/20"></div>
          <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-800/20 rounded-full mix-blend-screen filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-amber-800/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-stone-800/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Noise Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            transform: `translateY(${scrollY * 0.05}px)`
          }}
        />

        {/* Animated Geometric Patterns */}
        <svg className="absolute inset-0 w-full h-full opacity-5 dark:opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="projects-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="0.5" fill="currentColor" className="text-stone-900 dark:text-stone-100"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#projects-grid)" style={{ transform: `translateY(${scrollY * 0.1}px)` }}/>
        </svg>
      </div>

      {/* Floating Orbs with Parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(155, 50%, 60%, 0.1) 0%, transparent 70%)',
            transform: `translate(${scrollY * 0.02}px, ${scrollY * 0.15}px) scale(${1 + scrollY * 0.0001})`,
            filter: 'blur(40px)'
          }}
        />
        <div 
          className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(35, 70%, 60%, 0.1) 0%, transparent 70%)',
            transform: `translate(${-scrollY * 0.03}px, ${-scrollY * 0.1}px) scale(${1 + scrollY * 0.0001})`,
            filter: 'blur(30px)'
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-8 py-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => onNavigate('landing')}
              variant="ghost"
              className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 -ml-2"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <div className="w-12 h-12 bg-gradient-to-br from-stone-600 to-emerald-700 dark:from-stone-500 dark:to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Feather className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black font-serif text-stone-900 dark:text-stone-50 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-wide">
                Fablecraft
              </span>
              <p className="text-sm text-stone-600 dark:text-stone-400 -mt-1">Your Projects</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Settings Dropdown with Theme Toggle Inside */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  className="group bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 hover:from-emerald-700 hover:via-stone-700 hover:to-amber-800 dark:from-emerald-500 dark:via-stone-500 dark:to-amber-600 dark:hover:from-emerald-600 dark:hover:via-stone-600 dark:hover:to-amber-700 text-white px-4 py-2 font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-0.5 rounded-2xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10 flex items-center">
                    <Settings className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    <span className="hidden sm:inline">Settings</span>
                    <ChevronDown className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform duration-300" />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border border-stone-200/50 dark:border-stone-700/50 shadow-2xl rounded-2xl">
                <DropdownMenuLabel>
                  <div className="flex flex-col py-2">
                    <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">{user?.fullName || user?.username}</span>
                    <span className="text-xs text-stone-600 dark:text-stone-400">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-stone-200/50 dark:bg-stone-700/50" />
                
                {/* Theme Toggle in Dropdown */}
                <div className="px-2 py-2">
                  <div className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-100/50 dark:hover:bg-stone-800/50 transition-colors duration-200">
                    <div className="flex items-center">
                      <Sun className="w-4 h-4 mr-3 text-stone-600 dark:text-stone-400" />
                      <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Theme</span>
                    </div>
                    <ThemeToggle />
                  </div>
                </div>
                
                <DropdownMenuSeparator className="bg-stone-200/50 dark:bg-stone-700/50" />
                <DropdownMenuItem 
                  onClick={() => handleSettingsAction('account')}
                  className="rounded-xl mx-2 my-1 hover:bg-stone-100/50 dark:hover:bg-stone-800/50 transition-colors duration-200"
                >
                  <User className="w-4 h-4 mr-3" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleSettingsAction('settings')}
                  className="rounded-xl mx-2 my-1 hover:bg-stone-100/50 dark:hover:bg-stone-800/50 transition-colors duration-200"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-stone-200/50 dark:bg-stone-700/50" />
                <DropdownMenuItem 
                  onClick={() => handleSettingsAction('logout')}
                  className="rounded-xl mx-2 my-1 hover:bg-red-100/50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/90 dark:bg-stone-900/30 border border-stone-400/50 dark:border-stone-700/50 shadow-lg backdrop-blur-sm mb-4">
              <div className="w-2 h-2 bg-emerald-600 dark:bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide">Creative Universe</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-50 leading-tight tracking-tight mb-2">
              Your{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 dark:from-emerald-500 dark:via-stone-500 dark:to-amber-600 bg-clip-text text-transparent">
                Projects
              </span>
            </h1>
            
            <p className="text-stone-700 dark:text-stone-300 max-w-2xl">
              Organize, track, and bring your stories to life with intelligent project management.
            </p>
          </div>

          <Button 
            onClick={onNewProject}
            className="group bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 hover:from-emerald-700 hover:via-stone-700 hover:to-amber-800 text-white px-6 py-3 text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl"
          >
            <Plus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            New Project
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm rounded-xl p-4 border border-stone-300/30 dark:border-stone-700/30 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-stone-900 dark:text-stone-50">{filteredProjects.length}</p>
                <p className="text-xs font-medium text-stone-600 dark:text-stone-400 uppercase tracking-wide">Projects</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 via-stone-600 to-amber-700 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm rounded-xl p-4 border border-stone-300/30 dark:border-stone-700/30 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-stone-900 dark:text-stone-50">
                  {filteredProjects.filter(p => new Date(p.updatedAt || p.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length}
                </p>
                <p className="text-xs font-medium text-stone-600 dark:text-stone-400 uppercase tracking-wide">Active</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 via-stone-600 to-amber-700 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm rounded-xl p-4 border border-stone-300/30 dark:border-stone-700/30 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-stone-900 dark:text-stone-50">
                  {Array.from(new Set(filteredProjects.flatMap(p => p.genres || []))).length}
                </p>
                <p className="text-xs font-medium text-stone-600 dark:text-stone-400 uppercase tracking-wide">Genres</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 via-stone-600 to-amber-700 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm rounded-xl p-4 border border-stone-300/30 dark:border-stone-700/30 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-stone-900 dark:text-stone-50">Ready</p>
                <p className="text-xs font-medium text-stone-600 dark:text-stone-400 uppercase tracking-wide">To Write</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 via-stone-600 to-amber-700 rounded-lg flex items-center justify-center">
                <PenTool className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and View Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-stone-400" />
            </div>
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/80 dark:bg-stone-800/80 border-stone-300/50 dark:border-stone-600/50 rounded-xl text-stone-900 dark:text-stone-100 placeholder:text-stone-500 dark:placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all duration-200"
            />
          </div>
          
          {/* Results Counter */}
          {searchTerm && (
            <div className="px-3 py-2 bg-stone-100 dark:bg-stone-700 rounded-xl">
              <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                {filteredProjects.length} result{filteredProjects.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* View Toggle */}
          <div className="flex bg-stone-200/50 dark:bg-stone-700/50 rounded-xl p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={`rounded-lg px-3 py-2 transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 text-white shadow-sm' 
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-white/50 dark:hover:bg-stone-600/50'
              }`}
            >
              <Grid3X3 className="w-4 h-4 mr-1" />
              Grid
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('list')}
              className={`rounded-lg px-3 py-2 transition-all duration-200 ${
                viewMode === 'list' 
                  ? 'bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 text-white shadow-sm' 
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-white/50 dark:hover:bg-stone-600/50'
              }`}
            >
              <List className="w-4 h-4 mr-1" />
              List
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Projects Section */}
          <div className="xl:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-white/50 dark:bg-stone-800/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 via-stone-600 to-amber-700 dark:from-emerald-600 dark:via-stone-700 dark:to-amber-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-4">
                  {searchTerm ? 'No projects found' : 'Start your first project'}
                </h3>
                <p className="text-stone-600 dark:text-stone-400 mb-8 max-w-md mx-auto">
              {searchTerm 
                ? 'Try adjusting your search terms to find what you\'re looking for.'
                : 'Every great story begins with a single idea. Create your first project and bring your imagination to life.'
              }
            </p>
            {!searchTerm && (
              <Button 
                onClick={onNewProject}
                className="group bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 hover:from-emerald-700 hover:via-stone-700 hover:to-amber-800 dark:from-emerald-500 dark:via-stone-500 dark:to-amber-600 dark:hover:from-emerald-600 dark:hover:via-stone-600 dark:hover:to-amber-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-1 rounded-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 flex items-center">
                  <Sparkles className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  Create First Project
                </span>
              </Button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: Project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={onSelectProject}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project: Project) => (
              <ProjectListItem
                key={project.id}
                project={project}
                onSelect={onSelectProject}
              />
            ))}
          </div>
        )}
          </div>

          {/* Recent Activity Sidebar */}
          <div className="xl:col-span-1">
            <div className="bg-white/80 dark:bg-stone-800/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-stone-300/30 dark:border-stone-700/20 sticky top-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 via-stone-600 to-amber-700 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50">Recent Activity</h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400">Latest updates</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredProjects.slice(0, 5).map((project) => {
                    const timeAgo = new Date(project.updatedAt || project.createdAt).toLocaleDateString();
                    const isRecent = new Date(project.updatedAt || project.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000;
                    
                    return (
                      <div key={project.id} className="flex items-center space-x-3 p-3 bg-stone-50/50 dark:bg-stone-700/30 rounded-xl hover:bg-stone-100/50 dark:hover:bg-stone-700/50 transition-colors duration-200 cursor-pointer" onClick={() => onSelectProject(project)}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isRecent 
                            ? 'bg-gradient-to-br from-emerald-500 via-stone-600 to-amber-700' 
                            : 'bg-stone-300 dark:bg-stone-600'
                        }`}>
                          {project.type === 'novel' ? <BookOpen className="w-4 h-4 text-white" /> :
                           project.type === 'screenplay' ? <FileText className="w-4 h-4 text-white" /> :
                           <Image className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                            {project.name}
                          </p>
                          <p className="text-xs text-stone-600 dark:text-stone-400">
                            {isRecent ? 'Today' : timeAgo}
                          </p>
                        </div>
                        {isRecent && (
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    );
                  })}
                  
                  {filteredProjects.length === 0 && (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 bg-stone-200 dark:bg-stone-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Clock className="w-6 h-6 text-stone-400 dark:text-stone-500" />
                      </div>
                      <p className="text-stone-600 dark:text-stone-400 text-sm">No activity yet</p>
                      <p className="text-stone-500 dark:text-stone-500 text-xs">Start creating!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
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
      className="group bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm border-stone-300 dark:border-stone-600 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer rounded-2xl overflow-hidden"
      onClick={() => onSelect(project)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-stone-600 to-amber-700 dark:from-emerald-600 dark:via-stone-700 dark:to-amber-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <ProjectIcon className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-stone-900 dark:text-stone-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
              {project.name}
            </CardTitle>
            <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">
              {project.type || 'Creative Project'}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-stone-700 dark:text-stone-300 text-sm mb-4 line-clamp-3">
          {project.description || 'No description available.'}
        </p>
        
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Updated {new Date(project.updatedAt || project.createdAt).toLocaleDateString()}
          </div>
          <Badge variant="secondary" className="bg-gradient-to-r from-emerald-100 to-amber-100 dark:from-emerald-900 dark:to-amber-900 text-stone-700 dark:text-stone-300">
            {project.genres?.[0] || 'Unspecified'}
          </Badge>
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
      className="group bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm border-stone-300 dark:border-stone-600 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer rounded-2xl p-6"
      onClick={() => onSelect(project)}
    >
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-stone-600 to-amber-700 dark:from-emerald-600 dark:via-stone-700 dark:to-amber-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <ProjectIcon className="w-8 h-8 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-stone-900 dark:text-stone-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
            {project.name}
          </h3>
          <p className="text-stone-600 dark:text-stone-400 text-sm">
            {project.type || 'Creative Project'}
          </p>
          <p className="text-stone-700 dark:text-stone-300 text-sm mt-1 line-clamp-2">
            {project.description || 'No description available.'}
          </p>
        </div>
        
        <div className="text-right space-y-2">
          <div className="flex items-center text-xs text-stone-500 dark:text-stone-400">
            <Clock className="w-3 h-3 mr-1" />
            {new Date(project.updatedAt || project.createdAt).toLocaleDateString()}
          </div>
          <Badge variant="secondary" className="bg-gradient-to-r from-emerald-100 to-amber-100 dark:from-emerald-900 dark:to-amber-900 text-stone-700 dark:text-stone-300">
            {project.genres?.[0] || 'Unspecified'}
          </Badge>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="w-4 h-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
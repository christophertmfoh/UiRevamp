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
  ArrowLeft
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
            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Settings</span>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user?.fullName || user?.username}</span>
                    <span className="text-xs text-gray-500">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSettingsAction('account')}>
                  <User className="w-4 h-4 mr-2" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSettingsAction('settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSettingsAction('logout')}>
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
      <main className="relative z-10 max-w-7xl mx-auto px-8 py-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-white/90 dark:bg-stone-900/30 border border-stone-400/50 dark:border-stone-700/50 shadow-md dark:shadow-none">
              <div className="w-2 h-2 bg-emerald-600 dark:bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-[0.15em] leading-tight">Your Creative Universe</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 dark:text-stone-50 leading-[1.1] tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
              Your{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 dark:from-emerald-500 dark:via-stone-500 dark:to-amber-600 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                Projects
              </span>
            </h1>
            
            <p className="text-lg text-stone-800 dark:text-stone-200 max-w-2xl mx-auto leading-[1.6] font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
              Manage your creative works, track your progress, and bring your stories to life.
            </p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm border-stone-300 dark:border-stone-600"
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex border border-stone-300 dark:border-stone-600 rounded-lg bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 text-white' : ''}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 text-white' : ''}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* New Project Button */}
          <Button 
            onClick={onNewProject}
            className="group bg-gradient-to-r from-emerald-600 via-stone-600 to-amber-700 hover:from-emerald-700 hover:via-stone-700 hover:to-amber-800 dark:from-emerald-500 dark:via-stone-500 dark:to-amber-600 dark:hover:from-emerald-600 dark:hover:via-stone-600 dark:hover:to-amber-700 text-white px-6 py-3 font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-1 rounded-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative z-10 flex items-center">
              <Plus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
              New Project
            </span>
          </Button>
        </div>

        {/* Projects Grid/List */}
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
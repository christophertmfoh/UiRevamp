import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '../theme-toggle';
import { FloatingOrbs } from '../FloatingOrbs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DashboardWidgets } from './DashboardWidgets';
import { useOptimizedScroll } from '@/hooks/useOptimizedScroll';
import { useProjectsLogic } from '@/hooks/useProjectsLogic';
import { useTaskManagement } from '@/hooks/useTaskManagement';
import { useWidgetManagement } from '@/hooks/useWidgetManagement';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Project, Character } from '@/lib/types';
import { 
  ArrowLeft, 
  Users, 
  Globe, 
  BookOpen, 
  Feather,
  Sparkles,
  Settings,
  Plus,
  Search,
  ChevronRight,
  ScrollText,
  Film,
  Video,
  Music,
  BarChart3,
  Clock,
  Edit3,
  Grid3X3,
  List,
  Filter,
  SortAsc,
  Eye,
  Trash2,
  MoreHorizontal,
  Star,
  Calendar,
  FileText,
  PenTool,
  Palette,
  Layout,
  MapPin,
  Image,
  ClipboardList,
  Lock,
  Unlock,
  User,
  LogOut,
  Shield,
  Sword,
  Scroll,
  Languages,
  Crown,
  Gem,
  Wand2,
  Zap,
  Download,
  Archive,
  ImageIcon
} from 'lucide-react';
// Import existing character manager temporarily
import { CharacterManager } from '../character/CharacterManager';
// Import universal entity manager for all world bible entities
import { UniversalEntityManager } from '../worldBible/UniversalEntityManager';

interface ProjectWorkspaceProps {
  user: any;
  onNavigate: (view: string) => void;
  onLogout: () => Promise<void>;
  onSelectProject?: (project: Project) => void;
  onNewProject?: () => void;
  projects: Project[];
  selectedProject?: Project | null;
  isLoading?: boolean;
}

export function ProjectWorkspace({
  user,
  onNavigate,
  onLogout,
  onSelectProject,
  onNewProject,
  projects: projectsData,
  selectedProject: externalSelectedProject,
  isLoading
}: ProjectWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'studio' | 'world' | 'outline' | 'storyboard' | 'previs' | 'score' | 'export' | 'library'>('overview');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [worldSection, setWorldSection] = useState<'overview' | 'characters' | 'locations' | 'timeline' | 'factions' | 'items' | 'magic' | 'bestiary' | 'languages' | 'cultures' | 'prophecies' | 'themes'>('overview');
  const [isEditMode, setIsEditMode] = useState(false);

  // Handle external project selection (from App.tsx routing)
  React.useEffect(() => {
    if (externalSelectedProject && externalSelectedProject !== selectedProject) {
      setSelectedProject(externalSelectedProject);
      setActiveTab('world'); // Automatically switch to World Bible tab
      setWorldSection('overview'); // Reset to overview section
    }
  }, [externalSelectedProject, selectedProject]);
  
  const { scrollY } = useOptimizedScroll();
  const queryClient = useQueryClient();
  
  const projects = projectsData || [];

  // Custom hooks for dashboard functionality
  const {
    searchQuery,
    viewMode,
    sortBy,
    filteredProjects,
    projectStats,
    setSearchQuery,
    setViewMode,
    setSortBy,
  } = useProjectsLogic({ projects });

  // Custom hook for task management
  const taskManagement = useTaskManagement();

  // Custom hook for widget management
  const widgetManagement = useWidgetManagement();

  // Fetch characters for selected project (world bible integration)
  const { data: characters = [] } = useQuery<Character[]>({
    queryKey: ['/api/projects', selectedProject?.id, 'characters'],
    enabled: !!selectedProject && activeTab === 'world',
  });

  // Calculate character completion for world bible
  const calculateCompletion = useCallback((character: Character) => {
    const fields = [
      character.name, character.role, character.physicalDescription, character.backstory,
      character.goals, character.motivations, character.fears, character.strengths,
      character.weaknesses, character.class, character.occupation
    ];
    const filledFields = fields.filter(field => field && field.trim().length > 0).length;
    return Math.round((filledFields / fields.length) * 100);
  }, []);

  // Handle project selection
  const handleProjectSelect = useCallback((project: Project) => {
    setSelectedProject(project);
    setActiveTab('world'); // Switch to world bible when project is selected
    setWorldSection('overview'); // Reset to overview section
    if (onSelectProject) {
      onSelectProject(project);
    }
  }, [onSelectProject]);

  // Render project card
  const renderProjectCard = useCallback((project: Project) => {
    const getProjectIcon = (type: string) => {
      switch (type) {
        case 'novel': return BookOpen;
        case 'screenplay': return Film;
        case 'comic': return ScrollText;
        case 'dnd-campaign': return Users;
        case 'poetry': return PenTool;
        default: return FileText;
      }
    };

    const Icon = getProjectIcon(project.type);
    const isSelected = selectedProject?.id === project.id;

    return (
      <Card 
        key={project.id}
        className={`group cursor-pointer transition-all duration-300 glass-card backdrop-blur-xl rounded-[2rem] shadow-xl border border-border/30 ${
          viewMode === 'grid' 
            ? 'hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 min-h-[200px]' 
            : 'hover:shadow-lg'
        } ${
          isSelected 
            ? 'ring-2 ring-primary/50 shadow-2xl border-primary/30' 
            : ''
        }`}
        onClick={() => handleProjectSelect(project)}
      >
        <CardHeader className={`${viewMode === 'list' ? 'pb-3' : 'pb-4'} p-5`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1 min-w-0">
              <div className={`${
                viewMode === 'list' ? 'w-12 h-12' : 'w-16 h-16'
              } bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/10 group-hover:border-primary/20 group-hover:bg-primary/10 transition-all duration-300`}>
                <Icon className={`${
                  viewMode === 'list' ? 'w-6 h-6' : 'w-8 h-8'
                } text-primary group-hover:text-primary/80 transition-colors`} />
              </div>
              <div className="min-w-0 flex-1 pt-1">
                <CardTitle className={`${
                  viewMode === 'list' ? 'text-lg' : 'text-xl'
                } font-semibold group-hover:text-primary transition-colors truncate mb-2 text-foreground`}>
                  {project.name}
                </CardTitle>
                <Badge variant="secondary" className="text-xs font-medium capitalize bg-primary/10 text-primary border-primary/20">
                  {project.type?.replace('-', ' ')}
                </Badge>
              </div>
            </div>
            {viewMode === 'list' && (
              <div className="text-right flex-shrink-0 pt-1">
                <p className="text-sm text-muted-foreground/80">
                  {new Date(project.lastModified || project.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </CardHeader>
        
        {viewMode === 'grid' && (
          <CardContent className="pt-0 pb-5 px-5 flex flex-col">
            <CardDescription className="text-sm mb-6 line-clamp-2 flex-grow text-muted-foreground/70 leading-relaxed">
              {project.synopsis || project.description || `Start building your ${project.type?.replace('-', ' ')} project...`}
            </CardDescription>
            <div className="flex items-center justify-between text-sm text-muted-foreground/60 mt-auto border-t border-border/20 pt-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(project.lastModified || project.createdAt).toLocaleDateString()}
              </span>
              {project.genre && (
                <Badge variant="outline" className="text-xs bg-background/50 border-border/40">
                  {Array.isArray(project.genre) ? project.genre[0] : project.genre}
                </Badge>
              )}
            </div>
          </CardContent>
        )}
        
        {viewMode === 'list' && (
          <CardContent className="pt-0 pb-4 px-5 ml-16">
            <CardDescription className="text-sm line-clamp-1 text-muted-foreground/70">
              {project.synopsis || project.description || `Start building your ${project.type?.replace('-', ' ')} project...`}
            </CardDescription>
          </CardContent>
        )}
      </Card>
    );
  }, [selectedProject, handleProjectSelect]);

  return (
    <div className="min-h-screen relative transition-all duration-300 overflow-hidden bg-background">
      {/* Background System */}
      <FloatingOrbs />
      
      {/* Modern Abstract Background System */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-0 -left-4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" 
          style={{ backgroundColor: 'hsl(var(--orb-primary) / 0.3)' }}
        />
        <div 
          className="absolute top-0 -right-4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
          style={{ backgroundColor: 'hsl(var(--orb-secondary) / 0.3)' }}
        />
        <div 
          className="absolute -bottom-8 left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"
          style={{ backgroundColor: 'hsl(var(--orb-primary) / 0.2)' }}
        />
      </div>

      {/* Header - Mobile Optimized */}
      <header className="relative z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <button 
                onClick={() => onNavigate('landing')}
                className="w-8 h-8 sm:w-10 sm:h-10 gradient-primary rounded-xl flex items-center justify-center hover:shadow-lg transition-all duration-300 hover:scale-105 flex-shrink-0"
              >
                <Feather className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-serif font-bold text-foreground truncate">
                  Welcome back, {user?.username || 'user'}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <Button
                onClick={onNewProject}
                className="gradient-primary text-primary-foreground hover:shadow-lg transition-all px-2 sm:px-4 py-2 text-xs sm:text-sm"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">New Project</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="group gradient-primary text-primary-foreground px-4 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:brightness-110 rounded-xl relative overflow-hidden flex items-center space-x-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center space-x-2">
                      <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      <span className="hidden sm:inline">{user?.username || 'User'}</span>
                      <ChevronRight className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-card/95 backdrop-blur-xl border border-border/30 shadow-2xl rounded-xl mt-2">
                  {/* Community Section */}
                  <div className="p-2 border-b border-border/20">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Community</div>
                    <DropdownMenuItem 
                      onClick={() => console.log('Community clicked - not implemented yet')}
                      className="cursor-pointer hover:bg-accent/10 py-3 px-4 rounded-lg transition-colors text-foreground hover:text-foreground focus:text-foreground"
                    >
                      <Users className="mr-3 h-4 w-4 text-primary" />
                      <div>
                        <div className="font-medium">Writer Community</div>
                        <div className="text-xs text-muted-foreground">Connect with other writers</div>
                      </div>
                    </DropdownMenuItem>
                  </div>

                  {/* Account Section */}
                  <div className="p-2 border-b border-border/20">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Account</div>
                    <DropdownMenuItem 
                      onClick={() => console.log('Profile clicked - not implemented yet')}
                      className="cursor-pointer hover:bg-accent/10 py-3 px-4 rounded-lg transition-colors text-foreground hover:text-foreground focus:text-foreground"
                    >
                      <User className="mr-3 h-4 w-4 text-primary" />
                      <div>
                        <div className="font-medium">Profile & Settings</div>
                        <div className="text-xs text-muted-foreground">Manage your account</div>
                      </div>
                    </DropdownMenuItem>
                  </div>

                  {/* Help Section */}
                  <div className="p-2 border-b border-border/20">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Support</div>
                    <DropdownMenuItem 
                      onClick={() => console.log('Help clicked - not implemented yet')}
                      className="cursor-pointer hover:bg-accent/10 py-3 px-4 rounded-lg transition-colors text-foreground hover:text-foreground focus:text-foreground"
                    >
                      <Settings className="mr-3 h-4 w-4 text-primary" />
                      <div>
                        <div className="font-medium">Help & Support</div>
                        <div className="text-xs text-muted-foreground">Get help and documentation</div>
                      </div>
                    </DropdownMenuItem>
                  </div>

                  {/* Sign Out */}
                  <div className="p-2">
                    <DropdownMenuItem 
                      onClick={() => onNavigate('landing')}
                      className="cursor-pointer hover:bg-destructive/10 py-3 px-4 rounded-lg transition-colors"
                    >
                      <LogOut className="mr-3 h-4 w-4 text-destructive" />
                      <span className="font-medium text-destructive">Sign Out</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
          {/* Tab Navigation - Responsive Layout */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Desktop Tab Bar */}
            <div className="hidden lg:block w-full">
              <TabsList className="inline-flex w-max bg-card/50 backdrop-blur-sm h-auto p-1 rounded-lg">
                <TabsTrigger value="overview" className="flex items-center justify-center px-3 py-2 text-xs">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  <span className="text-xs">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="projects" className="flex items-center justify-center px-3 py-2 text-xs">
                  <BookOpen className="w-3 h-3 mr-1" />
                  <span className="text-xs">Projects</span>
                </TabsTrigger>
                <TabsTrigger value="studio" className="flex items-center justify-center px-3 py-2 text-xs">
                  <Layout className="w-3 h-3 mr-1" />
                  <span className="text-xs">Studio</span>
                </TabsTrigger>
                <TabsTrigger value="world" className="flex items-center justify-center px-3 py-2 text-xs">
                  <Globe className="w-3 h-3 mr-1" />
                  <span className="text-xs">World</span>
                </TabsTrigger>
                <TabsTrigger value="outline" className="flex items-center justify-center px-3 py-2 text-xs">
                  <ClipboardList className="w-3 h-3 mr-1" />
                  <span className="text-xs">Outline</span>
                </TabsTrigger>
                <TabsTrigger value="storyboard" className="flex items-center justify-center px-3 py-2 text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  <span className="text-xs">Story</span>
                </TabsTrigger>
                <TabsTrigger value="previs" className="flex items-center justify-center px-3 py-2 text-xs">
                  <Video className="w-3 h-3 mr-1" />
                  <span className="text-xs">Pre-Vis</span>
                </TabsTrigger>
                <TabsTrigger value="score" className="flex items-center justify-center px-3 py-2 text-xs">
                  <Music className="w-3 h-3 mr-1" />
                  <span className="text-xs">Score</span>
                </TabsTrigger>
                <TabsTrigger value="export" className="flex items-center justify-center px-3 py-2 text-xs">
                  <Download className="w-3 h-3 mr-1" />
                  <span className="text-xs">Export</span>
                </TabsTrigger>
                <TabsTrigger value="library" className="flex items-center justify-center px-3 py-2 text-xs">
                  <Archive className="w-3 h-3 mr-1" />
                  <span className="text-xs">Library</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Mobile Tab Dropdown */}
            <div className="lg:hidden w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-card/50 backdrop-blur-sm">
                    <div className="flex items-center">
                      {activeTab === 'overview' && <><BarChart3 className="w-4 h-4 mr-2" />Overview</>}
                      {activeTab === 'projects' && <><BookOpen className="w-4 h-4 mr-2" />Projects</>}
                      {activeTab === 'studio' && <><Layout className="w-4 h-4 mr-2" />Studio</>}
                      {activeTab === 'world' && <><Globe className="w-4 h-4 mr-2" />World</>}
                      {activeTab === 'outline' && <><ClipboardList className="w-4 h-4 mr-2" />Outline</>}
                      {activeTab === 'storyboard' && <><FileText className="w-4 h-4 mr-2" />Story</>}
                      {activeTab === 'previs' && <><Video className="w-4 h-4 mr-2" />Pre-Vis</>}
                      {activeTab === 'score' && <><Music className="w-4 h-4 mr-2" />Score</>}
                      {activeTab === 'export' && <><Download className="w-4 h-4 mr-2" />Export</>}
                      {activeTab === 'library' && <><Archive className="w-4 h-4 mr-2" />Library</>}
                    </div>
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem onClick={() => setActiveTab('overview')}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Overview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('projects')}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Projects
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('studio')}>
                    <Layout className="w-4 h-4 mr-2" />
                    Studio
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('world')}>
                    <Globe className="w-4 h-4 mr-2" />
                    World
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('outline')}>
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Outline
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('storyboard')}>
                    <FileText className="w-4 h-4 mr-2" />
                    Story
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('previs')}>
                    <Video className="w-4 h-4 mr-2" />
                    Pre-Vis
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('score')}>
                    <Music className="w-4 h-4 mr-2" />
                    Score
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('export')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('library')}>
                    <Archive className="w-4 h-4 mr-2" />
                    Library
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Search and Filters - Fixed Layout */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {activeTab === 'projects' && (
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    title={viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
                  >
                    {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Sort Projects"
                      >
                        <SortAsc className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuItem onClick={() => setSortBy('name')}>
                        <span className={sortBy === 'name' ? 'font-semibold' : ''}>Name (A-Z)</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('updated')}>
                        <span className={sortBy === 'updated' ? 'font-semibold' : ''}>Last Updated</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('created')}>
                        <span className={sortBy === 'created' ? 'font-semibold' : ''}>Date Created</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('type')}>
                        <span className={sortBy === 'type' ? 'font-semibold' : ''}>Project Type</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('genre')}>
                        <span className={sortBy === 'genre' ? 'font-semibold' : ''}>Genre</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('status')}>
                        <span className={sortBy === 'status' ? 'font-semibold' : ''}>Status</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('wordcount')}>
                        <span className={sortBy === 'wordcount' ? 'font-semibold' : ''}>Word Count</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-56 lg:w-64 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <TabsContent value="overview" className="space-y-6">
            {/* Dashboard Header - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h2>
                <Button
                  size="icon"
                  onClick={() => setIsEditMode(!isEditMode)}
                  className="w-7 h-7 sm:w-8 sm:h-8 gradient-primary text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 hover:brightness-110 rounded-lg"
                  title={isEditMode ? 'Lock Layout' : 'Customize Layout'}
                >
                  {isEditMode ? (
                    <Unlock className="w-3 h-3" />
                  ) : (
                    <Lock className="w-3 h-3" />
                  )}
                </Button>
              </div>
              {isEditMode && (
                <Button
                  size="sm"
                  onClick={widgetManagement.resetWidgets}
                  className="text-xs text-muted-foreground hover:text-foreground self-start sm:self-auto"
                  variant="ghost"
                >
                  Reset Layout
                </Button>
              )}
            </div>
            
            <DashboardWidgets
              widgets={widgetManagement.widgets}
              projects={projects}
              isEditMode={isEditMode}
              draggedWidget={widgetManagement.draggedWidget}
              dragOverWidget={widgetManagement.dragOverWidget}
              onWidgetDragStart={widgetManagement.handleWidgetDragStart}
              onWidgetDragOver={widgetManagement.handleWidgetDragOver}
              onWidgetDrop={widgetManagement.handleWidgetDrop}
              onWidgetDragLeave={widgetManagement.handleWidgetDragLeave}
              taskManagement={taskManagement}
            />
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            {/* Projects Grid/List - Optimized Layout */}
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
            }>
              {filteredProjects.map(renderProjectCard)}
            </div>
            
            {filteredProjects.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Projects Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? `No projects match "${searchQuery}"` : 'Start creating your first project'}
                  </p>
                  <Button onClick={onNewProject} className="gradient-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Project
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="studio" className="space-y-6">
            <div className="space-y-6">
              <div className="text-center py-12">
                <Layout className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Studio Overview</h3>
                <p className="text-muted-foreground mb-6">
                  Your creative pipeline and project management hub
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4 sm:gap-6 max-w-7xl mx-auto">
                  <Card 
                    className="hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                    onClick={() => setActiveTab('world')}
                  >
                    <CardContent className="p-3 sm:p-6 text-center">
                      <Globe className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4 text-primary" />
                      <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">World Bible</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">{characters.length} Characters</p>
                      <p className="text-xs text-muted-foreground mt-1 hidden sm:block">Develop your characters and story elements</p>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 opacity-75"
                    onClick={() => setActiveTab('outline')}
                  >
                    <CardContent className="p-3 sm:p-6 text-center">
                      <ClipboardList className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4 text-primary" />
                      <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Outline</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">0 Beats</p>
                      <p className="text-xs text-muted-foreground mt-1 hidden sm:block">Structure your story with detailed plotting</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 opacity-75">
                    <CardContent className="p-3 sm:p-6 text-center">
                      <FileText className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4 text-primary" />
                      <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Story</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">0 Pages</p>
                      <p className="text-xs text-muted-foreground mt-1 hidden sm:block">Write your story in various formats</p>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 opacity-75"
                    onClick={() => setActiveTab('previs')}
                  >
                    <CardContent className="p-3 sm:p-6 text-center">
                      <Video className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4 text-primary" />
                      <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Pre-Vis</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">0 Items</p>
                      <p className="text-xs text-muted-foreground mt-1 hidden sm:block">Pre-visualization and motion planning</p>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 opacity-75"
                    onClick={() => setActiveTab('score')}
                  >
                    <CardContent className="p-3 sm:p-6 text-center">
                      <Music className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4 text-primary" />
                      <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Score</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">0 Tracks</p>
                      <p className="text-xs text-muted-foreground mt-1 hidden sm:block">Compose and manage musical elements</p>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 opacity-75"
                    onClick={() => setActiveTab('export')}
                  >
                    <CardContent className="p-3 sm:p-6 text-center">
                      <Download className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4 text-primary" />
                      <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Export</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">0 Formats</p>
                      <p className="text-xs text-muted-foreground mt-1 hidden sm:block">Export and publish your projects</p>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 opacity-75"
                    onClick={() => setActiveTab('library')}
                  >
                    <CardContent className="p-3 sm:p-6 text-center">
                      <Archive className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4 text-primary" />
                      <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Library</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">0 Assets</p>
                      <p className="text-xs text-muted-foreground mt-1 hidden sm:block">Manage templates and resources</p>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 opacity-75"
                    onClick={() => console.log('Cover manager clicked - not implemented yet')}
                  >
                    <CardContent className="p-3 sm:p-6 text-center">
                      <ImageIcon className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4 text-primary" />
                      <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Cover</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">0 Designs</p>
                      <p className="text-xs text-muted-foreground mt-1 hidden sm:block">Create book covers and artwork</p>
                    </CardContent>
                  </Card>

                  <Card 
                    className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 opacity-75"
                    onClick={() => alert('Project Info & Documentation Hub - Manage project details, notes, research, and documentation')}
                  >
                    <CardContent className="p-3 sm:p-6 text-center">
                      <ClipboardList className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4 text-primary" />
                      <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Info</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">Project Hub</p>
                      <p className="text-xs text-muted-foreground mt-1 hidden sm:block">Documentation and project info</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="world" className="space-y-6">
            {selectedProject ? (
              <div className="flex space-x-6">
                {/* Categories Sidebar */}
                <div className="w-64 flex-shrink-0">
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Categories</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                      <Button
                        variant={worldSection === 'overview' ? 'default' : 'ghost'}
                        onClick={() => setWorldSection('overview')}
                        className="w-full justify-start text-sm"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        <span>Overview</span>
                      </Button>
                      <Button
                        variant={worldSection === 'characters' ? 'default' : 'ghost'}
                        onClick={() => setWorldSection('characters')}
                        className="w-full justify-start text-sm"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        <span>Characters</span>
                        <Badge variant="secondary" className="ml-auto">{characters.length}</Badge>
                      </Button>
                      <Button
                        variant={worldSection === 'locations' ? 'default' : 'ghost'}
                        onClick={() => setWorldSection('locations')}
                        className="w-full justify-start text-sm"
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>Locations</span>
                        <Badge variant="secondary" className="ml-auto">0</Badge>
                      </Button>
                      <Button
                        variant={worldSection === 'timeline' ? 'default' : 'ghost'}
                        onClick={() => setWorldSection('timeline')}
                        className="w-full justify-start text-sm"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        <span>Timeline</span>
                        <Badge variant="secondary" className="ml-auto">0</Badge>
                      </Button>
                      <Button
                        variant={worldSection === 'factions' ? 'default' : 'ghost'}
                        onClick={() => setWorldSection('factions')}
                        className="w-full justify-start text-sm"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        <span>Factions</span>
                        <Badge variant="secondary" className="ml-auto">0</Badge>
                      </Button>
                      <Button
                        variant={worldSection === 'items' ? 'default' : 'ghost'}
                        onClick={() => setWorldSection('items')}
                        className="w-full justify-start text-sm"
                      >
                        <Sword className="w-4 h-4 mr-2" />
                        <span>Items</span>
                        <Badge variant="secondary" className="ml-auto">0</Badge>
                      </Button>
                      <Button
                        variant={worldSection === 'magic' ? 'default' : 'ghost'}
                        onClick={() => setWorldSection('magic')}
                        className="w-full justify-start text-sm"
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        <span>Magic & Lore</span>
                        <Badge variant="secondary" className="ml-auto">0</Badge>
                      </Button>
                      <Button
                        variant={worldSection === 'bestiary' ? 'default' : 'ghost'}
                        onClick={() => setWorldSection('bestiary')}
                        className="w-full justify-start text-sm"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        <span>Bestiary</span>
                        <Badge variant="secondary" className="ml-auto">0</Badge>
                      </Button>
                      <Button
                        variant={worldSection === 'languages' ? 'default' : 'ghost'}
                        onClick={() => setWorldSection('languages')}
                        className="w-full justify-start text-sm"
                      >
                        <Languages className="w-4 h-4 mr-2" />
                        <span>Languages</span>
                        <Badge variant="secondary" className="ml-auto">0</Badge>
                      </Button>
                      <Button
                        variant={worldSection === 'cultures' ? 'default' : 'ghost'}
                        onClick={() => setWorldSection('cultures')}
                        className="w-full justify-start text-sm"
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        <span>Cultures</span>
                        <Badge variant="secondary" className="ml-auto">0</Badge>
                      </Button>
                      <Button
                        variant={worldSection === 'prophecies' ? 'default' : 'ghost'}
                        onClick={() => setWorldSection('prophecies')}
                        className="w-full justify-start text-sm"
                      >
                        <Scroll className="w-4 h-4 mr-2" />
                        <span>Prophecies</span>
                        <Badge variant="secondary" className="ml-auto">0</Badge>
                      </Button>
                      <Button
                        variant={worldSection === 'themes' ? 'default' : 'ghost'}
                        onClick={() => setWorldSection('themes')}
                        className="w-full justify-start text-sm"
                      >
                        <Gem className="w-4 h-4 mr-2" />
                        <span>Themes</span>
                        <Badge variant="secondary" className="ml-auto">0</Badge>
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-3xl font-bold">World Bible</h1>
                      <div className="flex items-center mt-2">
                        <Button
                          variant="ghost"
                          onClick={() => setActiveTab('projects')}
                          className="text-muted-foreground hover:text-foreground p-0 h-auto"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back to Dashboard
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search world..."
                          className="pl-10 w-64"
                        />
                      </div>
                      <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>

                  {/* Content based on selected section */}
                  {worldSection === 'overview' && (
                    <div className="space-y-6">
                      {/* Project Info - Only in Overview */}
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
                              <Badge className="gradient-primary text-primary-foreground">
                                {selectedProject.type}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-muted-foreground italic">
                            Add a synopsis to describe your project...
                          </p>
                        </CardContent>
                      </Card>

                      {/* Overview Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="text-center p-6">
                          <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                          <div className="text-3xl font-bold mb-2">{characters.length}</div>
                          <div className="text-muted-foreground">Characters</div>
                        </Card>
                        <Card className="text-center p-6">
                          <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
                          <div className="text-3xl font-bold mb-2">0</div>
                          <div className="text-muted-foreground">Locations</div>
                        </Card>
                        <Card className="text-center p-6">
                          <Clock className="w-12 h-12 mx-auto mb-4 text-primary" />
                          <div className="text-3xl font-bold mb-2">0</div>
                          <div className="text-muted-foreground">Timeline Events</div>
                        </Card>
                        <Card className="text-center p-6">
                          <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
                          <div className="text-3xl font-bold mb-2">0</div>
                          <div className="text-muted-foreground">Factions</div>
                        </Card>
                      </div>
                    </div>
                  )}

                  {/* Universal Entity Management System - Replicates all CharacterManager functionality */}
                  {worldSection === 'characters' && (
                    <CharacterManager
                      projectId={selectedProject.id}
                    />
                  )}
                  
                  {worldSection === 'locations' && (
                    <UniversalEntityManager
                      entityType="locations"
                      projectId={selectedProject.id}
                    />
                  )}
                  
                  {worldSection === 'timeline' && (
                    <UniversalEntityManager
                      entityType="timeline"
                      projectId={selectedProject.id}
                    />
                  )}
                  
                  {worldSection === 'factions' && (
                    <UniversalEntityManager
                      entityType="factions"
                      projectId={selectedProject.id}
                    />
                  )}
                  
                  {worldSection === 'items' && (
                    <UniversalEntityManager
                      entityType="items"
                      projectId={selectedProject.id}
                    />
                  )}
                  
                  {worldSection === 'magic' && (
                    <UniversalEntityManager
                      entityType="magic"
                      projectId={selectedProject.id}
                    />
                  )}
                  
                  {worldSection === 'bestiary' && (
                    <UniversalEntityManager
                      entityType="bestiary"
                      projectId={selectedProject.id}
                    />
                  )}
                  
                  {worldSection === 'languages' && (
                    <UniversalEntityManager
                      entityType="languages"
                      projectId={selectedProject.id}
                    />
                  )}
                  
                  {worldSection === 'cultures' && (
                    <UniversalEntityManager
                      entityType="cultures"
                      projectId={selectedProject.id}
                    />
                  )}
                  
                  {worldSection === 'prophecies' && (
                    <UniversalEntityManager
                      entityType="prophecies"
                      projectId={selectedProject.id}
                    />
                  )}
                  
                  {worldSection === 'themes' && (
                    <UniversalEntityManager
                      entityType="themes"
                      projectId={selectedProject.id}
                    />
                  )}
                  
                  {/* All legacy placeholder sections have been replaced with UniversalEntityManager system */}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <Card className="text-center py-12">
                  <CardContent>
                    <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Select a Project to Access World Bible</h3>
                    <p className="text-muted-foreground mb-6">
                      Choose a project to explore its comprehensive world-building system with 11+ categories
                    </p>
                    <Button 
                      onClick={() => setActiveTab('projects')}
                      className="gradient-primary"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Browse Projects
                    </Button>
                  </CardContent>
                </Card>

                {/* Preview of World Bible Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle>World Bible Categories Available</CardTitle>
                    <CardDescription>
                      Comprehensive world-building tools for your creative projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {[
                        { icon: Users, name: 'Characters', desc: '164+ Fields' },
                        { icon: MapPin, name: 'Locations', desc: 'Geographic Data' },
                        { icon: Clock, name: 'Timeline', desc: 'Historical Events' },
                        { icon: Shield, name: 'Factions', desc: 'Organizations' },
                        { icon: Sword, name: 'Items', desc: 'Artifacts & Tools' },
                        { icon: Wand2, name: 'Magic & Lore', desc: 'Supernatural Systems' },
                        { icon: Zap, name: 'Bestiary', desc: 'Creatures & Species' },
                        { icon: Languages, name: 'Languages', desc: 'Communication' },
                        { icon: Crown, name: 'Cultures', desc: 'Societies & Customs' },
                        { icon: Scroll, name: 'Prophecies', desc: 'Oracles & Visions' },
                        { icon: Gem, name: 'Themes', desc: 'Narrative Elements' }
                      ].map((category, index) => {
                        const Icon = category.icon;
                        return (
                          <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                            <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="font-medium text-sm truncate">{category.name}</div>
                              <div className="text-xs text-muted-foreground truncate">{category.desc}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="outline" className="space-y-6">
            <div className="text-center py-12">
              <ClipboardList className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Story Outline</h3>
              <p className="text-muted-foreground mb-6">
                Structure your story with detailed plotting and beat sheets
              </p>
              <Button className="gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Outline
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="storyboard" className="space-y-6">
            <div className="text-center py-12">
              <Image className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Visual Storyboard</h3>
              <p className="text-muted-foreground mb-6">
                Create visual representations of scenes and sequences
              </p>
              <Button className="gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Scene
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="previs" className="space-y-6">
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Pre-Vis</h3>
              <p className="text-muted-foreground mb-6">
                Create pre-visualization and motion planning for your scenes
              </p>
              <Button className="gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Pre-Vis Element
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="score" className="space-y-6">
            <div className="text-center py-12">
              <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Musical Score</h3>
              <p className="text-muted-foreground mb-6">
                Compose and manage musical elements for your project
              </p>
              <Button className="gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Track
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <div className="text-center py-12">
              <Download className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Export & Publish</h3>
              <p className="text-muted-foreground mb-6">
                Export your project in various formats and publish to platforms
              </p>
              <Button className="gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Export Project
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            <div className="text-center py-12">
              <Archive className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Asset Library</h3>
              <p className="text-muted-foreground mb-6">
                Manage templates, assets, and resources for your creative projects
              </p>
              <Button className="gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Asset
              </Button>
            </div>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}
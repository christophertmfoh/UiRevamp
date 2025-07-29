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
  LogOut
} from 'lucide-react';

interface ProjectWorkspaceProps {
  user: any;
  onNavigate: (view: string) => void;
  onLogout: () => Promise<void>;
  onSelectProject?: (project: Project) => void;
  onNewProject?: () => void;
  projects: Project[];
  isLoading?: boolean;
}

export function ProjectWorkspace({
  user,
  onNavigate,
  onLogout,
  onSelectProject,
  onNewProject,
  projects: projectsData,
  isLoading
}: ProjectWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'studio' | 'world' | 'storyboard' | 'previs' | 'score'>('overview');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [worldSection, setWorldSection] = useState<'overview' | 'characters' | 'locations' | 'timeline' | 'outline' | 'manuscript' | 'storyboard' | 'previs' | 'score'>('overview');
  const [isEditMode, setIsEditMode] = useState(false);
  
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
        className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 ${
          isSelected ? 'ring-2 ring-primary shadow-lg' : ''
        }`}
        onClick={() => handleProjectSelect(project)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                  {project.name}
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {project.type}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm mb-3 line-clamp-2">
            {project.synopsis || project.description || 'No description available'}
          </CardDescription>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Updated {new Date(project.lastModified || 0).toLocaleDateString()}</span>
            <div className="flex items-center space-x-2">
              <Clock className="w-3 h-3" />
              <span>Active</span>
            </div>
          </div>
        </CardContent>
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

      {/* Header */}
      <header className="relative z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => onNavigate('landing')}
                className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Feather className="w-5 h-5 text-primary-foreground" />
              </button>
              <div>
                <h1 className="text-3xl font-serif font-bold gradient-primary-text">
                  Welcome back, {user?.username || 'user'}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={onNewProject}
                className="gradient-primary text-primary-foreground hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
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
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-4xl">
              <TabsList className="grid w-full grid-cols-7 bg-card/50 backdrop-blur-sm h-auto p-1">
                <TabsTrigger value="overview" className="flex items-center justify-center space-x-1 px-2 py-2 text-xs">
                  <BarChart3 className="w-3 h-3" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="projects" className="flex items-center justify-center space-x-1 px-2 py-2 text-xs">
                  <BookOpen className="w-3 h-3" />
                  <span className="hidden sm:inline">Projects</span>
                </TabsTrigger>
                <TabsTrigger value="studio" className="flex items-center justify-center space-x-1 px-2 py-2 text-xs">
                  <Layout className="w-3 h-3" />
                  <span className="hidden sm:inline">Studio</span>
                </TabsTrigger>
                <TabsTrigger value="world" className="flex items-center justify-center space-x-1 px-2 py-2 text-xs">
                  <Globe className="w-3 h-3" />
                  <span className="hidden sm:inline">World</span>
                </TabsTrigger>
                <TabsTrigger value="storyboard" className="flex items-center justify-center space-x-1 px-2 py-2 text-xs">
                  <Image className="w-3 h-3" />
                  <span className="hidden sm:inline">Story</span>
                </TabsTrigger>
                <TabsTrigger value="previs" className="flex items-center justify-center space-x-1 px-2 py-2 text-xs">
                  <Video className="w-3 h-3" />
                  <span className="hidden sm:inline">Pre-Vis</span>
                </TabsTrigger>
                <TabsTrigger value="score" className="flex items-center justify-center space-x-1 px-2 py-2 text-xs">
                  <Music className="w-3 h-3" />
                  <span className="hidden sm:inline">Score</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              {activeTab === 'projects' && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  >
                    {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSortBy(sortBy === 'name' ? 'updated' : 'name')}
                  >
                    <SortAsc className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Tab Content */}
          <TabsContent value="overview" className="space-y-6">
            {/* Dashboard Widgets - Restored Original 4 Widgets */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
                <Button
                  size="icon"
                  onClick={() => setIsEditMode(!isEditMode)}
                  className="w-8 h-8 gradient-primary text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 hover:brightness-110 rounded-lg"
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
                  className="text-xs text-muted-foreground hover:text-foreground"
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
            {/* Projects Grid/List */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
                  <Card 
                    className="hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                    onClick={() => setActiveTab('world')}
                  >
                    <CardContent className="p-6 text-center">
                      <Globe className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h4 className="font-semibold mb-2">World Bible</h4>
                      <p className="text-sm text-muted-foreground">{characters.length} Characters</p>
                      <p className="text-xs text-muted-foreground mt-1">Develop your characters and story elements</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 opacity-75">
                    <CardContent className="p-6 text-center">
                      <ClipboardList className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h4 className="font-semibold mb-2">Outline</h4>
                      <p className="text-sm text-muted-foreground">0 Beats</p>
                      <p className="text-xs text-muted-foreground mt-1">Structure your story with detailed plotting</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 opacity-75">
                    <CardContent className="p-6 text-center">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h4 className="font-semibold mb-2">Story</h4>
                      <p className="text-sm text-muted-foreground">0 Pages</p>
                      <p className="text-xs text-muted-foreground mt-1">Write your story in various formats</p>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 opacity-75"
                    onClick={() => setActiveTab('previs')}
                  >
                    <CardContent className="p-6 text-center">
                      <Video className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h4 className="font-semibold mb-2">Pre-Vis</h4>
                      <p className="text-sm text-muted-foreground">0 Items</p>
                      <p className="text-xs text-muted-foreground mt-1">Pre-visualization and motion planning</p>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 opacity-75"
                    onClick={() => setActiveTab('score')}
                  >
                    <CardContent className="p-6 text-center">
                      <Music className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h4 className="font-semibold mb-2">Score</h4>
                      <p className="text-sm text-muted-foreground">0 Tracks</p>
                      <p className="text-xs text-muted-foreground mt-1">Compose and manage musical elements</p>
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
                    <CardContent className="space-y-2">
                      <Button
                        variant={worldSection === 'overview' ? 'default' : 'ghost'}
                        onClick={() => setWorldSection('overview')}
                        className="w-full justify-start"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        <span>Overview</span>
                        <Badge variant="secondary" className="ml-auto">0</Badge>
                      </Button>
                      <Button
                        variant={worldSection === 'characters' ? 'default' : 'ghost'}
                        onClick={() => setWorldSection('characters')}
                        className="w-full justify-start"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        <span>Characters</span>
                        <Badge variant="secondary" className="ml-auto">{characters.length}</Badge>
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

                  {/* Project Info */}
                  <Card className="mb-6">
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

                  {/* Content based on selected section */}
                  {worldSection === 'overview' && (
                    <div className="text-center py-12">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full">
                        <Users className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-6xl font-bold text-foreground mb-2">
                        {characters.length}
                      </div>
                      <div className="text-muted-foreground">Characters</div>
                    </div>
                  )}

                  {worldSection === 'characters' && (
                    <div className="space-y-6">
                      {/* Featured Characters Section */}
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Users className="w-5 h-5 text-primary" />
                              <CardTitle>Featured Characters</CardTitle>
                              <Badge variant="secondary">{characters.length}</Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <span>Sort by:</span>
                                <Button variant="ghost" size="sm" className="h-auto p-1">
                                  Custom Order
                                  <ChevronRight className="w-3 h-3 ml-1" />
                                </Button>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <span>Show:</span>
                                <Button variant="ghost" size="sm" className="h-auto p-1">
                                  6
                                  <ChevronRight className="w-3 h-3 ml-1" />
                                </Button>
                              </div>
                              <Button size="sm" variant="outline">
                                <SortAsc className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Settings className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {characters.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {characters.map((character) => (
                                <Card key={character.id} className="group hover:shadow-lg transition-all cursor-pointer">
                                  <CardContent className="p-4">
                                    <div className="flex items-center space-x-3 mb-3">
                                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
                                        <Users className="w-6 h-6 text-primary-foreground" />
                                      </div>
                                      <div>
                                        <h4 className="font-semibold">{character.name || 'Unnamed Character'}</h4>
                                        <p className="text-sm text-muted-foreground">{character.role || 'No role defined'}</p>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex justify-between text-sm">
                                        <span>Completion</span>
                                        <span>{calculateCompletion(character)}%</span>
                                      </div>
                                      <Progress value={calculateCompletion(character)} className="h-2" />
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-12">
                              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                              <h3 className="text-lg font-medium mb-2">No Characters Yet</h3>
                              <p className="text-muted-foreground mb-4">
                                Start building your world by creating compelling characters with the full 164+ field system
                              </p>
                              <Button className="gradient-primary">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Your First Character
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a Project</h3>
                  <p className="text-muted-foreground">
                    Choose a project from the Projects tab to explore its world bible
                  </p>
                </CardContent>
              </Card>
            )}
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

        </Tabs>
      </main>
    </div>
  );
}
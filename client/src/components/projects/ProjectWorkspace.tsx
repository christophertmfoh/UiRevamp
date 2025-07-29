import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '../theme-toggle';
import { FloatingOrbs } from '../FloatingOrbs';
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
  Timeline,
  Image,
  ClipboardList,
  Lock,
  Unlock
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
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'world'>('overview');
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
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Feather className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Creative Workspace</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user?.username || 'Writer'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={onNewProject}
                className="gradient-primary text-primary-foreground hover:shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
              <ThemeToggle />
              <Button
                variant="ghost"
                onClick={() => onNavigate('landing')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex items-center justify-between">
            <TabsList className="grid w-fit grid-cols-3 bg-card/50 backdrop-blur-sm">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Projects</span>
              </TabsTrigger>
              <TabsTrigger value="world" className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>World Bible</span>
              </TabsTrigger>
            </TabsList>

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

          <TabsContent value="world" className="space-y-6">
            {selectedProject ? (
              <div className="space-y-6">
                {/* Project Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-3">
                          <Globe className="w-6 h-6 text-primary" />
                          <span>{selectedProject.name} - World Bible</span>
                        </CardTitle>
                        <CardDescription>
                          Comprehensive world-building and creative development hub
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedProject(null);
                          setActiveTab('projects');
                        }}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Projects
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                {/* World Bible Navigation */}
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                      {/* World Overview */}
                      <Button
                        variant={worldSection === 'overview' ? 'default' : 'outline'}
                        onClick={() => setWorldSection('overview')}
                        className="flex flex-col items-center space-y-2 h-auto py-4"
                      >
                        <Layout className="w-6 h-6" />
                        <span className="text-xs">Overview</span>
                      </Button>

                      {/* Characters (where your character system goes) */}
                      <Button
                        variant={worldSection === 'characters' ? 'default' : 'outline'}
                        onClick={() => setWorldSection('characters')}
                        className="flex flex-col items-center space-y-2 h-auto py-4"
                      >
                        <Users className="w-6 h-6" />
                        <span className="text-xs">Characters</span>
                      </Button>

                      {/* Locations */}
                      <Button
                        variant={worldSection === 'locations' ? 'default' : 'outline'}
                        onClick={() => setWorldSection('locations')}
                        className="flex flex-col items-center space-y-2 h-auto py-4"
                      >
                        <MapPin className="w-6 h-6" />
                        <span className="text-xs">Locations</span>
                      </Button>

                      {/* Timeline */}
                      <Button
                        variant={worldSection === 'timeline' ? 'default' : 'outline'}
                        onClick={() => setWorldSection('timeline')}
                        className="flex flex-col items-center space-y-2 h-auto py-4"
                      >
                        <Clock className="w-6 h-6" />
                        <span className="text-xs">Timeline</span>
                      </Button>

                      {/* Outline */}
                      <Button
                        variant={worldSection === 'outline' ? 'default' : 'outline'}
                        onClick={() => setWorldSection('outline')}
                        className="flex flex-col items-center space-y-2 h-auto py-4"
                      >
                        <ClipboardList className="w-6 h-6" />
                        <span className="text-xs">Outline</span>
                      </Button>

                      {/* Manuscript */}
                      <Button
                        variant={worldSection === 'manuscript' ? 'default' : 'outline'}
                        onClick={() => setWorldSection('manuscript')}
                        className="flex flex-col items-center space-y-2 h-auto py-4"
                      >
                        <FileText className="w-6 h-6" />
                        <span className="text-xs">Manuscript</span>
                      </Button>

                      {/* Storyboard */}
                      <Button
                        variant={worldSection === 'storyboard' ? 'default' : 'outline'}
                        onClick={() => setWorldSection('storyboard')}
                        className="flex flex-col items-center space-y-2 h-auto py-4"
                      >
                        <Image className="w-6 h-6" />
                        <span className="text-xs">Storyboard</span>
                      </Button>

                      {/* Score */}
                      <Button
                        variant={worldSection === 'score' ? 'default' : 'outline'}
                        onClick={() => setWorldSection('score')}
                        className="flex flex-col items-center space-y-2 h-auto py-4"
                      >
                        <Music className="w-6 h-6" />
                        <span className="text-xs">Score</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* World Bible Content */}
                <Card>
                  <CardContent className="p-6">
                    {worldSection === 'overview' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-bold">World Overview</h3>
                          <Button size="sm" className="gradient-primary">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Element
                          </Button>
                        </div>
                        
                        {/* Project Synopsis */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Project Synopsis</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground">
                              {selectedProject.synopsis || selectedProject.description || 'No synopsis available'}
                            </p>
                          </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <Card>
                            <CardContent className="p-4 text-center">
                              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                              <div className="text-2xl font-bold">{characters.length}</div>
                              <div className="text-sm text-muted-foreground">Characters</div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <MapPin className="w-8 h-8 mx-auto mb-2 text-primary" />
                              <div className="text-2xl font-bold">0</div>
                              <div className="text-sm text-muted-foreground">Locations</div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
                              <div className="text-2xl font-bold">0</div>
                              <div className="text-sm text-muted-foreground">Timeline Events</div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
                              <div className="text-2xl font-bold">1</div>
                              <div className="text-sm text-muted-foreground">Manuscripts</div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )}

                    {worldSection === 'characters' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-bold">Character Management</h3>
                          <Button size="sm" className="gradient-primary">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Character
                          </Button>
                        </div>
                        
                        {characters.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {characters.map((character) => (
                              <Card key={character.id} className="group hover:shadow-lg transition-all">
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
                                  <div className="mt-3 flex space-x-2">
                                    <Button size="sm" variant="outline" className="flex-1">
                                      <Edit3 className="w-3 h-3 mr-1" />
                                      Edit
                                    </Button>
                                    <Button size="sm" variant="outline" className="flex-1">
                                      <Eye className="w-3 h-3 mr-1" />
                                      View
                                    </Button>
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
                      </div>
                    )}

                    {/* Other sections - placeholder for now */}
                    {worldSection === 'locations' && (
                      <div className="text-center py-12">
                        <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Locations & Settings</h3>
                        <p className="text-muted-foreground mb-4">
                          Create and manage the places where your story unfolds
                        </p>
                        <Button className="gradient-primary">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Location
                        </Button>
                      </div>
                    )}

                    {worldSection === 'timeline' && (
                      <div className="text-center py-12">
                        <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Timeline & Events</h3>
                        <p className="text-muted-foreground mb-4">
                          Organize the chronology of your story events
                        </p>
                        <Button className="gradient-primary">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Event
                        </Button>
                      </div>
                    )}

                    {worldSection === 'outline' && (
                      <div className="text-center py-12">
                        <ClipboardList className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Story Outline</h3>
                        <p className="text-muted-foreground mb-4">
                          Structure and organize your narrative arc
                        </p>
                        <Button className="gradient-primary">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Chapter
                        </Button>
                      </div>
                    )}

                    {worldSection === 'manuscript' && (
                      <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Manuscript Editor</h3>
                        <p className="text-muted-foreground mb-4">
                          Write and refine your prose with advanced editing tools
                        </p>
                        <Button className="gradient-primary">
                          <Plus className="w-4 h-4 mr-2" />
                          Open Editor
                        </Button>
                      </div>
                    )}

                    {worldSection === 'storyboard' && (
                      <div className="text-center py-12">
                        <Image className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Visual Storyboard</h3>
                        <p className="text-muted-foreground mb-4">
                          Create visual representations of scenes and sequences
                        </p>
                        <Button className="gradient-primary">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Scene
                        </Button>
                      </div>
                    )}

                    {worldSection === 'score' && (
                      <div className="text-center py-12">
                        <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Musical Score</h3>
                        <p className="text-muted-foreground mb-4">
                          Compose and manage musical elements for your project
                        </p>
                        <Button className="gradient-primary">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Track
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
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

        </Tabs>
      </main>
    </div>
  );
}
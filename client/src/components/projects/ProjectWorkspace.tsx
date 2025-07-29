import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '../theme-toggle';
import { FloatingOrbs } from '../FloatingOrbs';
import { useOptimizedScroll } from '@/hooks/useOptimizedScroll';
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
  Palette
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
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'updated' | 'type'>('updated');
  
  const { scrollY } = useOptimizedScroll();
  const queryClient = useQueryClient();
  
  const projects = projectsData || [];

  // Fetch characters for selected project (world bible integration)
  const { data: characters = [] } = useQuery<Character[]>({
    queryKey: ['/api/projects', selectedProject?.id, 'characters'],
    enabled: !!selectedProject && activeTab === 'world',
  });

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(project =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'updated':
          return new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime();
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return filtered;
  }, [projects, searchQuery, sortBy]);

  // Project statistics
  const projectStats = useMemo(() => {
    const total = projects.length;
    const byType = projects.reduce((acc, project) => {
      acc[project.type] = (acc[project.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const recentlyUpdated = projects.filter(project => {
      const updated = new Date(project.lastModified || 0);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return updated > weekAgo;
    }).length;

    return { total, byType, recentlyUpdated };
  }, [projects]);

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
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projectStats.total}</div>
                  <p className="text-xs text-muted-foreground">Active creative works</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recently Updated</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projectStats.recentlyUpdated}</div>
                  <p className="text-xs text-muted-foreground">In the last 7 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Characters</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{characters.length}</div>
                  <p className="text-xs text-muted-foreground">Across all projects</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {characters.length > 0 ? Math.round(characters.reduce((acc, char) => acc + calculateCompletion(char), 0) / characters.length) : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">Average character detail</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Your most recently updated creative works</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProjects.slice(0, 6).map(renderProjectCard)}
                </div>
              </CardContent>
            </Card>
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
                          Manage characters, locations, and world-building elements
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedProject(null)}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Projects
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                {/* Characters Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>Characters ({characters.length})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {characters.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {characters.map((character) => (
                          <Card key={character.id} className="group hover:shadow-lg transition-all">
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
                                  <Users className="w-5 h-5 text-primary-foreground" />
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
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Characters Yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Start building your world by creating characters
                        </p>
                        <Button className="gradient-primary">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Character
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
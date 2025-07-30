import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSkeleton, LoadingCard } from '@/components/ui/LoadingStates';
import { EmptyProjectsState, EmptySearchState } from '@/components/ui/EmptyStates';
import { 
  PlusCircle, 
  Clock, 
  BookOpen,
  FileText,
  Image,
  PenTool
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  type?: string;
  genre?: string | string[];
  description?: string;
  createdAt: string;
  [key: string]: any;
}

interface ProjectsListProps {
  projects: Project[];
  searchQuery: string;
  sortBy: 'name' | 'updated' | 'created' | 'type';
  viewMode: 'grid' | 'list';
  isLoading?: boolean;
  onSelectProject: (project: Project) => void;
  onNewProject: () => void;
}

// Project Card Component
const ProjectCard = React.memo(function ProjectCard({ 
  project, 
  onSelect 
}: { 
  project: Project; 
  onSelect: (project: Project) => void 
}) {
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
      className="group card-enhanced surface-elevated backdrop-blur-xl border-border/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 cursor-pointer overflow-hidden"
      onClick={() => onSelect(project)}
    >
      <div className="absolute inset-0 gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
      <CardHeader className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="w-14 h-14 gradient-primary-br rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <ProjectIcon className="w-7 h-7 text-primary-foreground" />
          </div>
          <Badge className="gradient-primary text-primary-foreground border-0">
            {typeof project.genre === 'string' ? project.genre : (Array.isArray(project.genre) && project.genre[0]) || 'Unspecified'}
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
          {project.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          {project.type || 'Creative Project'}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/80 text-sm mb-4 line-clamp-3">
          {project.description || 'No description available.'}
        </p>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="w-3 h-3 mr-1" />
          Updated {new Date(project.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
});

// Project List Item Component
const ProjectListItem = React.memo(function ProjectListItem({ 
  project, 
  onSelect 
}: { 
  project: Project; 
  onSelect: (project: Project) => void 
}) {
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
      className="group card-enhanced surface-elevated backdrop-blur-xl border-border/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      onClick={() => onSelect(project)}
    >
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 gradient-primary-br rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <ProjectIcon className="w-8 h-8 text-primary-foreground" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              {project.name}
            </h3>
            <p className="text-muted-foreground text-sm">
              {project.type || 'Creative Project'}
            </p>
            <p className="text-foreground/80 text-sm mt-1 line-clamp-1">
              {project.description || 'No description available.'}
            </p>
          </div>
          
          <div className="text-right space-y-2">
            <Badge className="gradient-primary text-primary-foreground border-0">
              {typeof project.genre === 'string' ? project.genre : (Array.isArray(project.genre) && project.genre[0]) || 'Unspecified'}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(project.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export const ProjectsList = React.memo(function ProjectsList({
  projects,
  searchQuery,
  sortBy,
  viewMode,
  isLoading = false,
  onSelectProject,
  onNewProject
}: ProjectsListProps) {
  const filteredProjects = useMemo(() => {
    const filtered = projects.filter((project: Project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return filtered.sort((a: Project, b: Project) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'type':
          return (a.type || '').localeCompare(b.type || '');
        default: // 'updated'
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [projects, searchQuery, sortBy]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Results counter skeleton */}
        <div className="text-center">
          <LoadingSkeleton className="h-6 w-48 mx-auto" />
        </div>
        
        {/* Projects grid/list skeleton */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Results counter
  const resultsCounter = searchQuery && (
    <div className="mb-6 text-center">
      <p className="text-sm text-foreground">
        Found <span className="font-semibold text-foreground">{filteredProjects.length}</span> result{filteredProjects.length !== 1 ? 's' : ''}
      </p>
    </div>
  );

  // Empty states
  if (filteredProjects.length === 0) {
    return (
      <div>
        {resultsCounter}
        {searchQuery ? (
          <EmptySearchState />
        ) : (
          <EmptyProjectsState onCreateProject={onNewProject} />
        )}
      </div>
    );
  }

  // Projects display
  return (
    <div>
      {resultsCounter}
      
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {filteredProjects.map((project: Project) => (
            <ProjectCard key={project.id} project={project} onSelect={onSelectProject} />
          ))}
        </div>
      ) : (
        <div className="space-y-3 stagger-children">
          {filteredProjects.map((project: Project) => (
            <ProjectListItem key={project.id} project={project} onSelect={onSelectProject} />
          ))}
        </div>
      )}
    </div>
  );
});
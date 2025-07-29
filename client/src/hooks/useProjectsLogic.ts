import { useState, useCallback, useMemo, useEffect } from 'react';

interface Project {
  id: string;
  name: string;
  type?: string;
  genre?: string | string[];
  description?: string;
  createdAt: string;
  [key: string]: any;
}

interface UseProjectsLogicProps {
  projects: Project[];
}

interface UseProjectsLogicReturn {
  // State
  searchQuery: string;
  viewMode: 'grid' | 'list';
  sortBy: 'name' | 'updated' | 'created' | 'type' | 'genre' | 'status' | 'wordcount';
  
  // Computed values
  filteredProjects: Project[];
  projectStats: {
    total: number;
    active: number;
    uniqueGenres: number;
  };
  
  // Actions
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setSortBy: (sort: 'name' | 'updated' | 'created' | 'type' | 'genre' | 'status' | 'wordcount') => void;
}

export function useProjectsLogic({ projects }: UseProjectsLogicProps): UseProjectsLogicReturn {
  // Initialize state from localStorage with fallbacks
  const [viewMode, setViewModeState] = useState<'grid' | 'list'>(() => {
    const saved = localStorage.getItem('projectsViewMode');
    return (saved as 'grid' | 'list') || 'list';
  });

  const [sortBy, setSortByState] = useState<'name' | 'updated' | 'created' | 'type' | 'genre' | 'status' | 'wordcount'>(() => {
    const saved = localStorage.getItem('projectsSortBy');
    return (saved as 'name' | 'updated' | 'created' | 'type' | 'genre' | 'status' | 'wordcount') || 'updated';
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Persist view mode and sort preferences
  const setViewMode = useCallback((mode: 'grid' | 'list') => {
    setViewModeState(mode);
    localStorage.setItem('projectsViewMode', mode);
  }, []);

  const setSortBy = useCallback((sort: 'name' | 'updated' | 'created' | 'type' | 'genre' | 'status' | 'wordcount') => {
    setSortByState(sort);
    localStorage.setItem('projectsSortBy', sort);
  }, []);

  // Memoized filtered and sorted projects
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
        case 'genre':
          const aGenre = Array.isArray(a.genre) ? (a.genre[0] || '') : (a.genre || '');
          const bGenre = Array.isArray(b.genre) ? (b.genre[0] || '') : (b.genre || '');
          return aGenre.localeCompare(bGenre);
        case 'status':
          const aStatus = (a as any).status || 'draft';
          const bStatus = (b as any).status || 'draft';
          // Sort order: planning, draft, in-progress, review, complete
          const statusOrder: { [key: string]: number } = { 'planning': 0, 'draft': 1, 'in-progress': 2, 'review': 3, 'complete': 4 };
          return (statusOrder[aStatus] || 1) - (statusOrder[bStatus] || 1);
        case 'wordcount':
          const aWordCount = (a as any).wordCount || (a as any).statistics?.wordCount || 0;
          const bWordCount = (b as any).wordCount || (b as any).statistics?.wordCount || 0;
          return bWordCount - aWordCount; // Descending order (highest first)
        case 'updated':
        default:
          const aDate = (a as any).lastModified || (a as any).updatedAt || a.createdAt;
          const bDate = (b as any).lastModified || (b as any).updatedAt || b.createdAt;
          return new Date(bDate).getTime() - new Date(aDate).getTime();
      }
    });
  }, [projects, searchQuery, sortBy]);

  // Memoized project statistics
  const projectStats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter((p: Project) => 
      new Date(p.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length;
    const uniqueGenres = Array.from(
      new Set(projects.map((p: Project) => p.genre).filter((genre): genre is string => Boolean(genre)))
    ).length;

    return { total, active, uniqueGenres };
  }, [projects]);

  return {
    // State
    searchQuery,
    viewMode,
    sortBy,
    
    // Computed values
    filteredProjects,
    projectStats,
    
    // Actions
    setSearchQuery,
    setViewMode,
    setSortBy,
  };
}
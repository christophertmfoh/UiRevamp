import React, { useState, useEffect, useMemo, useCallback, memo, lazy, Suspense } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Grid, 
  List as ListIcon, 
  X,
  RefreshCw
} from 'lucide-react';
// Using standard fetch for API calls
import { showErrorToast, showSuccessToast } from '../../../client/src/lib/utils/errorHandling';
import type { EnhancedUniversalEntityConfig } from '../config/EntityConfig';
import { UniversalEntityCard } from './UniversalEntityCard';
import { UniversalEntityForm } from './UniversalEntityForm';
import { UniversalEntityDetailView } from './UniversalEntityDetailView';

// Lazy load heavy components for performance
const LazyUniversalEntityCard = lazy(() => import('./UniversalEntityCard'));
const LazyUniversalWizard = lazy(() => import('./UniversalWizard'));

interface UniversalEntityManagerProps {
  config: EnhancedUniversalEntityConfig;
  projectId: string;
  selectedEntityId?: string | null;
  onClearSelection?: () => void;
}

type SortOption = string;
type ViewMode = 'grid' | 'list';

// Memoized card component for performance
const MemoizedEntityCard = memo(({ config, entity, viewMode, onEdit, onDelete }: any) => {
  return (
    <Suspense fallback={<EntityCardSkeleton />}>
      <LazyUniversalEntityCard
        config={config}
        entity={entity}
        viewMode={viewMode}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </Suspense>
  );
});

// Loading skeleton for cards
const EntityCardSkeleton = memo(() => (
  <Card>
    <CardContent className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </CardContent>
  </Card>
));

// Virtual list item for large datasets
const VirtualListItem = memo(({ index, style, data }: any) => {
  const { entities, config, viewMode, onEdit, onDelete } = data;
  const entity = entities[index];
  
  return (
    <div style={style}>
      <div className="p-2">
        <MemoizedEntityCard
          config={config}
          entity={entity}
          viewMode={viewMode}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
});

export const UniversalEntityManager = memo(function UniversalEntityManager({ 
  config, 
  projectId, 
  selectedEntityId, 
  onClearSelection 
}: UniversalEntityManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEntity, setEditingEntity] = useState<any | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [showWizard, setShowWizard] = useState(false);
  
  // Storage keys for persistence
  const getViewStorageKey = () => `fablecraft_viewMode_${config.entityType}_${projectId}`;
  const getSortStorageKey = () => `fablecraft_sortBy_${config.entityType}_${projectId}`;

  // Sort state with persistence
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    const saved = localStorage.getItem(getSortStorageKey());
    return saved || config.displayConfig?.defaultSortField || 'name';
  });

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    localStorage.setItem(getSortStorageKey(), option);
  };
  
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem(getViewStorageKey());
    return (saved as ViewMode) || 'grid';
  });

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(getViewStorageKey(), mode);
  };

  const queryClient = useQueryClient();

  // Fetch entities using the universal API pattern
  const { data: entities = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/projects', projectId, config.entityType],
    enabled: !!projectId && projectId !== 'undefined' && projectId !== 'null',
  });

  // Create entity mutation
  const createMutation = useMutation({
    mutationFn: async (entityData: any) => {
      const response = await fetch(`/api/projects/${projectId}/${config.entityType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...entityData,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          projectId
        })
      });
      if (!response.ok) throw new Error(`Failed to create ${config.entityType}`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, config.entityType] });
      setIsCreating(false);
      showSuccessToast(`${config.displayName} created successfully`);
    },
    onError: (error) => {
      console.error(`Error creating ${config.entityType}:`, error);
      showErrorToast(`Failed to create ${config.displayName.toLowerCase()}`);
    }
  });

  // Update entity mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/projects/${projectId}/${config.entityType}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`Failed to update ${config.entityType}`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, config.entityType] });
      setIsEditing(false);
      setEditingEntity(null);
      showSuccessToast(`${config.displayName} updated successfully`);
    },
    onError: (error) => {
      console.error(`Error updating ${config.entityType}:`, error);
      showErrorToast(`Failed to update ${config.displayName.toLowerCase()}`);
    }
  });

  // Delete entity mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/projects/${projectId}/${config.entityType}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error(`Failed to delete ${config.entityType}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, config.entityType] });
      showSuccessToast(`${config.displayName} deleted successfully`);
    },
    onError: (error) => {
      console.error(`Error deleting ${config.entityType}:`, error);
      showErrorToast(`Failed to delete ${config.displayName.toLowerCase()}`);
    }
  });

  // Handle entity selection from URL
  useEffect(() => {
    if (selectedEntityId && entities.length > 0) {
      const entity = entities.find(e => e.id === selectedEntityId);
      if (entity) {
        setSelectedEntity(entity);
      }
    }
  }, [selectedEntityId, entities]);

  // Filter entities based on search query and active filters
  const filteredEntities = entities.filter(entity => {
    // Search query filter
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      const searchFields = config.displayConfig?.searchFields || ['name', 'description'];
      const matchesSearch = searchFields.some(field => {
        const value = entity[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchLower);
        }
        if (Array.isArray(value)) {
          return value.some(item => 
            typeof item === 'string' && item.toLowerCase().includes(searchLower)
          );
        }
        return false;
      });
      
      if (!matchesSearch) return false;
    }
    
    // Active filters
    const filterOptions = config.displayConfig?.filterOptions || [];
    return filterOptions.every(filterConfig => {
      const filterValue = activeFilters[filterConfig.key];
      if (!filterValue || filterValue === 'all') return true;
      
      const entityValue = entity[filterConfig.key];
      
      switch (filterConfig.type) {
        case 'select':
          return entityValue === filterValue;
        case 'multiselect':
          if (Array.isArray(entityValue)) {
            return entityValue.includes(filterValue);
          }
          return entityValue === filterValue;
        case 'boolean':
          return Boolean(entityValue) === (filterValue === 'true');
        case 'range':
          if (typeof entityValue === 'number' && filterValue.min !== undefined && filterValue.max !== undefined) {
            return entityValue >= filterValue.min && entityValue <= filterValue.max;
          }
          return true;
        default:
          return true;
      }
    });
  });

  // Sort entities with enhanced configuration support
  const sortedEntities = [...filteredEntities].sort((a, b) => {
    const sortOptions = config.displayConfig?.sortOptions || [{ key: 'name', label: 'Name', direction: 'asc' }];
    const sortConfig = sortOptions.find(opt => opt.key === sortBy);
    const direction = sortConfig?.direction || 'asc';
    
    let aValue = a[sortBy] || '';
    let bValue = b[sortBy] || '';
    
    // Handle different data types for sorting
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (Array.isArray(aValue) && Array.isArray(bValue)) {
      aValue = aValue.length;
      bValue = bValue.length;
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (aValue instanceof Date && bValue instanceof Date) {
      return direction === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
    }
    
    // Default string comparison
    aValue = String(aValue).toLowerCase();
    bValue = String(bValue).toLowerCase();
    
    if (direction === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  // Performance: Use useMemo for expensive computations
  const searchFields = useMemo(() => 
    config.displayConfig?.searchFields || config.fields.map(f => f.key),
    [config.displayConfig?.searchFields, config.fields]
  );
  
  // Memoized filter function for performance
  const filteredEntitiesMemo = useMemo(() => {
    let filtered = entities;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(entity =>
        searchFields.some(field => {
          const value = entity[field];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchLower);
          }
          if (Array.isArray(value)) {
            return value.some(item => 
              typeof item === 'string' && item.toLowerCase().includes(searchLower)
            );
          }
          return false;
        })
      );
    }
    
    // Apply active filters
    const filterOptions = config.displayConfig?.filterOptions || [];
    filtered = filtered.filter(entity => {
      return filterOptions.every(filterConfig => {
        const filterValue = activeFilters[filterConfig.key];
        if (!filterValue || filterValue === 'all') return true;
        
        const entityValue = entity[filterConfig.key];
        
        switch (filterConfig.type) {
          case 'select':
            return entityValue === filterValue;
          case 'multiselect':
            return Array.isArray(entityValue) && entityValue.includes(filterValue);
          case 'boolean':
            return entityValue === (filterValue === 'true');
          case 'range':
            // Implement range filtering if needed
            return true;
          default:
            return true;
        }
      });
    });
    
    return filtered;
  }, [entities, searchQuery, searchFields, activeFilters, config.displayConfig?.filterOptions]);
  
  // Memoized sorting for performance
  const sortedEntitiesMemo = useMemo(() => {
    const sorted = [...filteredEntitiesMemo].sort((a, b) => {
      const sortOptions = config.displayConfig?.sortOptions || [{ key: 'name', label: 'Name', direction: 'asc' }];
      const sortConfig = sortOptions.find(opt => opt.key === sortBy);
      const direction = sortConfig?.direction || 'asc';
      
      let aValue = a[sortBy] || '';
      let bValue = b[sortBy] || '';
      
      // Performance: Type-specific sorting with memoized comparisons
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        const aTime = aValue.getTime();
        const bTime = bValue.getTime();
        return direction === 'asc' ? aTime - bTime : bTime - aTime;
      }
      
      if (Array.isArray(aValue) && Array.isArray(bValue)) {
        const aLength = aValue.length;
        const bLength = bValue.length;
        return direction === 'asc' ? aLength - bLength : bLength - aLength;
      }
      
      // String comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      
      if (direction === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
    
    return sorted;
  }, [filteredEntitiesMemo, sortBy, config.displayConfig?.sortOptions]);
  
  // Performance: Memoized filter change handler
  const handleFilterChange = useCallback((filterKey: string, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  }, []);
  
  // Performance: Memoized clear filters handler
  const clearAllFilters = useCallback(() => {
    setActiveFilters({});
    setSearchQuery('');
  }, []);
  
  // Check if virtualization is needed (for large datasets)
  const shouldUseVirtualization = useMemo(() => {
    return config.performance?.enableVirtualization && sortedEntitiesMemo.length > 100;
  }, [config.performance?.enableVirtualization, sortedEntitiesMemo.length]);
  
  // Performance: Memoized active filters check
  const hasActiveFilters = useMemo(() => {
    return Object.keys(activeFilters).length > 0 || searchQuery.trim().length > 0;
  }, [activeFilters, searchQuery]);
  
  // Performance: Memoized card height for virtualization
  const getItemSize = useCallback(() => {
    return viewMode === 'grid' ? 300 : 120; // Estimated heights
  }, [viewMode]);
  
  // Handle entity creation with lazy loading
  const handleCreateEntity = useCallback(() => {
    if (config.wizard?.enabled) {
      setShowWizard(true);
    } else {
      setIsCreating(true);
    }
  }, [config.wizard?.enabled]);
  
  // Performance: Memoized render function for virtual list
  const virtualListData = useMemo(() => ({
    entities: sortedEntitiesMemo,
    config,
    viewMode,
    onEdit: handleEntityEdit,
    onDelete: handleEntityDelete
  }), [sortedEntitiesMemo, config, viewMode, handleEntityEdit, handleEntityDelete]);
  
  // Event handlers
  const handleEntitySelect = (entity: any) => {
    setSelectedEntity(entity);
  };

  const handleEntityEdit = (entity: any) => {
    setEditingEntity(entity);
    setIsEditing(true);
  };

  const handleEntityDelete = (entity: any) => {
    if (window.confirm(`Are you sure you want to delete ${entity.name}?`)) {
      deleteMutation.mutate(entity.id);
    }
  };

  const handleCreateEntityForm = (entityData: any) => {
    createMutation.mutate(entityData);
  };

  const handleUpdateEntity = (entityData: any) => {
    if (editingEntity) {
      updateMutation.mutate({ id: editingEntity.id, data: entityData });
    }
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingEntity(null);
  };

  const handleClearEntitySelection = () => {
    setSelectedEntity(null);
    onClearSelection?.();
  };
  
  // Filter management
  const handleFilterChangeMemo = useCallback((filterKey: string, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  }, []);
  
  const clearFilter = useCallback((filterKey: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  }, []);
  
  const clearAllFiltersMemo = useCallback(() => {
    setActiveFilters({});
    setSearchQuery('');
  }, []);
  
  const hasActiveFiltersMemo = useMemo(() => {
    return Object.keys(activeFilters).length > 0 || searchQuery.trim().length > 0;
  }, [activeFilters, searchQuery]);

  // Show detail view if entity is selected
  if (selectedEntity) {
    return (
      <UniversalEntityDetailView
        config={config}
        entity={selectedEntity}
        projectId={projectId}
        onBack={handleClearEntitySelection}
        onEdit={() => handleEntityEdit(selectedEntity)}
        onDelete={() => handleEntityDelete(selectedEntity)}
      />
    );
  }

  // Show create form
  if (isCreating) {
    return (
      <UniversalEntityForm
        config={config}
        projectId={projectId}
        onSave={handleCreateEntityForm}
        onCancel={handleCancelCreate}
        isLoading={createMutation.isPending}
      />
    );
  }

  // Show edit form
  if (isEditing && editingEntity) {
    return (
      <UniversalEntityForm
        config={config}
        projectId={projectId}
        entity={editingEntity}
        onSave={handleUpdateEntity}
        onCancel={handleCancelEdit}
        isLoading={updateMutation.isPending}
      />
    );
  }

  // Main manager view
  return (
    <div className="space-y-6">
      {/* Header with performance-optimized controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{config.pluralDisplayName || config.name}</CardTitle>
            <Button onClick={handleCreateEntity} className="gap-2">
              <Plus className="h-4 w-4" />
              Create {config.displayName || config.name}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={`Search ${config.pluralDisplayName?.toLowerCase() || 'entities'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Sort */}
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {config.displayConfig?.sortOptions?.map((option) => (
                    <SelectItem key={option.key} value={option.key}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortBy(prev => prev === 'name' ? 'name_desc' : 'name')}
              >
                {sortBy === 'name' ? <ArrowUpDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4 rotate-180" />}
              </Button>
            </div>
            
            {/* View mode */}
            <div className="flex items-center gap-1 border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Filters - Only render if configured */}
          {config.displayConfig?.filterOptions && config.displayConfig.filterOptions.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {config.displayConfig.filterOptions.map((filterConfig) => (
                <Select
                  key={filterConfig.key}
                  value={activeFilters[filterConfig.key] || 'all'}
                  onValueChange={(value) => handleFilterChangeMemo(filterConfig.key, value)}
                >
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder={filterConfig.label} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All {filterConfig.label}</SelectItem>
                    {filterConfig.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
              
              {hasActiveFiltersMemo && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFiltersMemo}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Results with performance optimizations */}
      <Card>
        <CardContent className="p-6">
          {sortedEntitiesMemo.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                {searchQuery || hasActiveFiltersMemo 
                  ? `No ${config.pluralDisplayName?.toLowerCase() || 'entities'} match your criteria`
                  : `No ${config.pluralDisplayName?.toLowerCase() || 'entities'} yet`
                }
              </div>
              {!searchQuery && !hasActiveFiltersMemo && (
                <Button onClick={handleCreateEntity} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First {config.displayName || config.name}
                </Button>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  {sortedEntitiesMemo.length} {sortedEntitiesMemo.length === 1 ? config.displayName?.toLowerCase() || 'entity' : config.pluralDisplayName?.toLowerCase() || 'entities'}
                  {(searchQuery || hasActiveFiltersMemo) && (
                    <span> (filtered from {entities.length})</span>
                  )}
                </p>
                
                {shouldUseVirtualization && (
                  <Badge variant="outline" className="gap-1">
                    <RefreshCw className="h-3 w-3" />
                    Virtualized
                  </Badge>
                )}
              </div>
              
              {/* Performance: Use virtualization for large datasets */}
              {shouldUseVirtualization ? (
                <div className="h-96">
                  <List
                    height={384} // 24rem
                    itemCount={sortedEntitiesMemo.length}
                    itemSize={getItemSize()}
                    itemData={virtualListData}
                  >
                    {VirtualListItem}
                  </List>
                </div>
              ) : (
                /* Regular grid/list for smaller datasets */
                <div className={viewMode === 'grid' 
                  ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "space-y-3"
                }>
                  {sortedEntitiesMemo.map((entity) => (
                    <MemoizedEntityCard
                      key={entity.id}
                      config={config}
                      entity={entity}
                      viewMode={viewMode}
                      onEdit={handleEntityEdit}
                      onDelete={handleEntityDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Lazy-loaded wizard */}
      {showWizard && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <Card className="w-96">
              <CardContent className="p-6 text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading creation wizard...</p>
              </CardContent>
            </Card>
          </div>
        }>
          <LazyUniversalWizard
            isOpen={showWizard}
            onClose={() => setShowWizard(false)}
            config={config}
            projectId={projectId}
            onComplete={() => {
              setShowWizard(false);
              setIsCreating(true); // Revert to create form
            }}
          />
        </Suspense>
      )}
    </div>
  );
});

export default UniversalEntityManager;
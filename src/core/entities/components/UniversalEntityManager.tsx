import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Search, ArrowUpDown, Filter, Grid3X3, List, MoreVertical, X } from 'lucide-react';
// Using standard fetch for API calls
import { showErrorToast, showSuccessToast } from '../../../client/src/lib/utils/errorHandling';
import type { EnhancedUniversalEntityConfig } from '../config/EntityConfig';
import { UniversalEntityCard } from './UniversalEntityCard';
import { UniversalEntityForm } from './UniversalEntityForm';
import { UniversalEntityDetailView } from './UniversalEntityDetailView';

interface UniversalEntityManagerProps {
  config: EnhancedUniversalEntityConfig;
  projectId: string;
  selectedEntityId?: string | null;
  onClearSelection?: () => void;
}

type SortOption = string;
type ViewMode = 'grid' | 'list';

export function UniversalEntityManager({ 
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

  const handleCreateEntity = (entityData: any) => {
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
  const handleFilterChange = (filterKey: string, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };
  
  const clearFilter = (filterKey: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  };
  
  const clearAllFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
  };
  
  const hasActiveFilters = Object.keys(activeFilters).length > 0 || searchQuery.trim().length > 0;

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
        onSave={handleCreateEntity}
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{config.pluralDisplayName}</h1>
          <p className="text-muted-foreground">{config.description}</p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create {config.displayName}
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`Search ${config.pluralDisplayName.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        {config.displayConfig?.filterOptions && config.displayConfig.filterOptions.length > 0 && (
          <div className="flex items-center gap-2">
            {config.displayConfig.filterOptions.map((filterConfig) => (
              <Select
                key={filterConfig.key}
                value={activeFilters[filterConfig.key] || 'all'}
                onValueChange={(value) => handleFilterChange(filterConfig.key, value)}
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
            
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        )}

        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {(config.displayConfig?.sortOptions || []).map((option) => (
              <DropdownMenuItem
                key={option.key}
                onClick={() => handleSortChange(option.key)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Mode */}
        <div className="flex border rounded-lg">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleViewModeChange('grid')}
            className="rounded-r-none"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleViewModeChange('list')}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Entity Count */}
      <div className="text-sm text-muted-foreground">
        {filteredEntities.length} of {entities.length} {config.pluralDisplayName.toLowerCase()}
        {searchQuery && ` matching "${searchQuery}"`}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="text-muted-foreground">Loading {config.pluralDisplayName.toLowerCase()}...</div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && entities.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <config.icon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No {config.pluralDisplayName} Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by creating your first {config.displayName.toLowerCase()}.
            </p>
            <Button onClick={() => setIsCreating(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create {config.displayName}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Entity Grid/List */}
      {!isLoading && sortedEntities.length > 0 && (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }>
          {sortedEntities.map((entity) => (
            <UniversalEntityCard
              key={entity.id}
              config={config}
              entity={entity}
              viewMode={viewMode}
              onSelect={handleEntitySelect}
              onEdit={handleEntityEdit}
              onDelete={handleEntityDelete}
            />
          ))}
        </div>
      )}

      {/* No Search Results */}
      {!isLoading && entities.length > 0 && filteredEntities.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              No {config.pluralDisplayName.toLowerCase()} match your search criteria.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
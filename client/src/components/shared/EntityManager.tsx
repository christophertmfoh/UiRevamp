import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Users, 
  Search, 
  Edit, 
  Trash2, 
  MoreVertical, 
  Edit2, 
  Camera, 
  Sparkles, 
  ArrowUpDown, 
  Filter, 
  Grid3X3, 
  List, 
  Eye,
  MapPin,
  Shield,
  Package,
  Crown,
  Clock,
  Languages,
  Heart,
  Scroll,
  Globe
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { BaseEntity, EntityType } from '@/lib/types';
import { ENTITY_CONFIGS } from '@/lib/config/entityConfig';

interface EntityManagerProps {
  entityType: EntityType;
  projectId: string;
  selectedEntityId?: string | null;
  onClearSelection?: () => void;
  onSelectEntity?: (entity: BaseEntity) => void;
  onCreateNew?: () => void;
}

type SortOption = 'alphabetical' | 'recently-added' | 'recently-edited';
type ViewMode = 'grid' | 'list';

export function EntityManager({
  entityType,
  projectId,
  selectedEntityId,
  onClearSelection,
  onSelectEntity,
  onCreateNew
}: EntityManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedEntity, setSelectedEntity] = useState<BaseEntity | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const queryClient = useQueryClient();
  const config = ENTITY_CONFIGS[entityType];

  // Fetch entities
  const { data: entities = [], isLoading } = useQuery<BaseEntity[]>({
    queryKey: ['/api/projects', projectId, config.apiEndpoint],
  });

  // Load sort and view preferences from localStorage
  useEffect(() => {
    const savedSort = localStorage.getItem(`entityManager_${entityType}_sort`) as SortOption;
    const savedView = localStorage.getItem(`entityManager_${entityType}_view`) as ViewMode;
    
    if (savedSort) setSortBy(savedSort);
    if (savedView) setViewMode(savedView);
  }, [entityType]);

  // Save preferences to localStorage
  const updateSortBy = (newSort: SortOption) => {
    setSortBy(newSort);
    localStorage.setItem(`entityManager_${entityType}_sort`, newSort);
  };

  const updateViewMode = (newView: ViewMode) => {
    setViewMode(newView);
    localStorage.setItem(`entityManager_${entityType}_view`, newView);
  };

  // Filter and sort entities
  const filteredAndSortedEntities = useMemo(() => {
    let filtered = entities.filter(entity =>
      entity.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (sortBy) {
      case 'alphabetical':
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'recently-added':
        filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case 'recently-edited':
        filtered.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
        break;
    }

    return filtered;
  }, [entities, searchQuery, sortBy]);

  // Calculate completeness for an entity
  const calculateCompleteness = (entity: BaseEntity): number => {
    const fields = Object.values(entity);
    const filledFields = fields.filter(field => {
      if (Array.isArray(field)) return field.length > 0;
      if (typeof field === 'string') return field.trim() !== '';
      return field != null;
    });
    return Math.round((filledFields.length / fields.length) * 100);
  };

  // Handle entity selection
  const handleEntitySelect = (entity: BaseEntity) => {
    setSelectedEntity(entity);
    onSelectEntity?.(entity);
  };

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/${config.apiEndpoint}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, config.apiEndpoint] });
    },
  });

  // Show entity detail view if one is selected
  if (selectedEntity) {
    return (
      <div>
        <h2>Entity Detail View</h2>
        <p>Selected: {selectedEntity.name}</p>
        <Button onClick={() => setSelectedEntity(null)}>Back to List</Button>
      </div>
    );
  }

  // Show creation view
  if (isCreating) {
    return (
      <div>
        <h2>Create New {config.singular}</h2>
        <Button onClick={() => setIsCreating(false)}>Cancel</Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-amber-50 to-orange-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <config.icon className="h-8 w-8 text-accent" />
                {config.label}
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your {config.label.toLowerCase()} and bring your world to life
              </p>
            </div>
            
            <Button 
              onClick={() => setIsCreating(true)}
              className="gap-2 bg-accent hover:bg-accent/90 shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Create {config.singular}
            </Button>
          </div>

          {/* Search and Controls */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={`Search ${config.label.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-border/50"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-background/50">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort: {sortBy === 'alphabetical' ? 'A-Z' : sortBy === 'recently-added' ? 'Recently Added' : 'Recently Edited'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => updateSortBy('alphabetical')}>
                  Alphabetical (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateSortBy('recently-added')}>
                  Recently Added
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateSortBy('recently-edited')}>
                  Recently Edited
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center border border-border/50 rounded-md bg-background/50">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updateViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updateViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading {config.label.toLowerCase()}...</p>
            </div>
          </div>
        ) : filteredAndSortedEntities.length === 0 ? (
          <div className="text-center py-12">
            <config.icon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-title text-xl mb-2">No {config.label} Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? `No ${config.label.toLowerCase()} match "${searchQuery}"`
                : `You haven't created any ${config.label.toLowerCase()} yet.`
              }
            </p>
            <Button onClick={() => setIsCreating(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First {config.singular}
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {filteredAndSortedEntities.map((entity) => {
              const completeness = calculateCompleteness(entity);
              
              if (viewMode === 'grid') {
                return (
                  <Card 
                    key={entity.id}
                    className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-card/80 backdrop-blur-sm border-border/50"
                    onClick={() => handleEntitySelect(entity)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg line-clamp-1">
                            {entity.name || `Unnamed ${config.singular}`}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {config.singular}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {completeness}% complete
                            </Badge>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleEntitySelect(entity);
                            }}>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteMutation.mutate(entity.id);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="aspect-square bg-gradient-to-br from-accent/20 to-accent/40 rounded-lg mb-3 flex items-center justify-center">
                        {entity.imageUrl ? (
                          <img 
                            src={entity.imageUrl} 
                            alt={entity.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <config.icon className="h-12 w-12 text-accent/60" />
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {entity.description || `A ${config.singular.toLowerCase()} in your world.`}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {entity.updatedAt 
                            ? `Updated ${new Date(entity.updatedAt).toLocaleDateString()}`
                            : 'Never updated'
                          }
                        </span>
                        <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent transition-all duration-300"
                            style={{ width: `${completeness}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              } else {
                return (
                  <Card 
                    key={entity.id}
                    className="group cursor-pointer transition-all duration-200 hover:shadow-lg bg-card/80 backdrop-blur-sm border-border/50"
                    onClick={() => handleEntitySelect(entity)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/40 rounded-lg flex items-center justify-center flex-shrink-0">
                          {entity.imageUrl ? (
                            <img 
                              src={entity.imageUrl} 
                              alt={entity.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <config.icon className="h-8 w-8 text-accent/60" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-lg line-clamp-1">
                              {entity.name || `Unnamed ${config.singular}`}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {config.singular}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {completeness}% complete
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                            {entity.description || `A ${config.singular.toLowerCase()} in your world.`}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              {entity.updatedAt 
                                ? `Updated ${new Date(entity.updatedAt).toLocaleDateString()}`
                                : 'Never updated'
                              }
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-accent transition-all duration-300"
                                  style={{ width: `${completeness}%` }}
                                />
                              </div>
                              <span>{completeness}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleEntitySelect(entity);
                            }}>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteMutation.mutate(entity.id);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
}
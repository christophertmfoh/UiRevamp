import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Users, Search, Edit, Trash2, MoreVertical, Edit2, Camera, Sparkles, ArrowUpDown, Filter, Grid3X3, List, Eye, Zap, FileText, MapPin, Shield, Package } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Character, Project } from '../../lib/types';
import { getFieldDefinitionsByEntityType, getSectionsByEntityType } from '@/lib/config/fieldConfig';


// Define the possible entity types
export type EntityType = 'character' | 'location' | 'faction' | 'item';

// Generic entity interface - all entities have these common fields
interface BaseEntity {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  imageUrl?: string;
  displayImageId?: string;
  tags?: string[];
}

interface EntityListViewProps {
  entityType: EntityType;
  projectId: string;
  selectedEntityId?: string | null;
  onClearSelection?: () => void;
  onSelectEntity?: (entity: BaseEntity) => void;
  onCreateNew?: () => void;
}

type SortOption = 'alphabetical' | 'recently-added' | 'recently-edited';
type ViewMode = 'grid' | 'list';

// Entity type configurations
const ENTITY_CONFIGS = {
  character: {
    icon: Users,
    singular: 'character',
    plural: 'characters',
    apiEndpoint: 'characters',
    createButtonText: 'Create Character',
    searchPlaceholder: 'Search characters by name, role, or race...',
    emptyStateTitle: 'No characters yet',
    emptyStateDescription: 'Create your first character to start building your story world.',
    createFirstText: 'Create First Character'
  },
  location: {
    icon: MapPin,
    singular: 'location',
    plural: 'locations', 
    apiEndpoint: 'locations',
    createButtonText: 'Create Location',
    searchPlaceholder: 'Search locations by name, type, or region...',
    emptyStateTitle: 'No locations yet',
    emptyStateDescription: 'Create your first location to start building your world geography.',
    createFirstText: 'Create First Location'
  },
  faction: {
    icon: Shield,
    singular: 'faction',
    plural: 'factions',
    apiEndpoint: 'factions', 
    createButtonText: 'Create Faction',
    searchPlaceholder: 'Search factions by name, type, or ideology...',
    emptyStateTitle: 'No factions yet',
    emptyStateDescription: 'Create your first faction to establish the power structures in your world.',
    createFirstText: 'Create First Faction'
  },
  item: {
    icon: Package,
    singular: 'item',
    plural: 'items',
    apiEndpoint: 'items',
    createButtonText: 'Create Item',
    searchPlaceholder: 'Search items by name, type, or significance...',
    emptyStateTitle: 'No items yet', 
    emptyStateDescription: 'Create your first item to add important artifacts to your world.',
    createFirstText: 'Create First Item'
  }
};

export function EntityListView({ 
  entityType, 
  projectId, 
  selectedEntityId, 
  onClearSelection, 
  onSelectEntity,
  onCreateNew 
}: EntityListViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<BaseEntity | null>(null);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);

  // Storage keys for persistence (EntityListView)
  const getViewStorageKey = () => `storyWeaver_viewMode_entityList_${entityType}_${projectId}`;
  const getSortStorageKey = () => `storyWeaver_sortBy_entityList_${entityType}_${projectId}`;

  // Sort state with persistence
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    const saved = localStorage.getItem(getSortStorageKey());
    return (saved as SortOption) || 'alphabetical';
  });

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    localStorage.setItem(getSortStorageKey(), option);
  };
  
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // Load saved view preference from localStorage
    const saved = localStorage.getItem(getViewStorageKey());
    return (saved as ViewMode) || 'grid';
  });

  // Save view preference whenever it changes
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(getViewStorageKey(), mode);
  };
  
  const queryClient = useQueryClient();
  const config = ENTITY_CONFIGS[entityType];
  const IconComponent = config.icon;

  // Fetch entities based on type
  const { data: entities = [], isLoading } = useQuery<BaseEntity[]>({
    queryKey: ['/api/projects', projectId, config.apiEndpoint],
  });

  const { data: project } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
  });

  // Auto-select entity if selectedEntityId is provided
  useEffect(() => {
    if (selectedEntityId && entities.length > 0) {
      const entity = entities.find(e => e.id === selectedEntityId);
      if (entity) {
        setSelectedEntity(entity);
        onClearSelection?.();
      }
    }
  }, [selectedEntityId, entities, onClearSelection]);

  // CRUD mutations - generic for all entity types
  const deleteMutation = useMutation({
    mutationFn: (entityId: string) => 
      apiRequest('DELETE', `/api/${config.apiEndpoint}/${entityId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, config.apiEndpoint] });
    },
  });

  const updateEntityMutation = useMutation({
    mutationFn: (entity: BaseEntity) => 
      apiRequest('PUT', `/api/${config.apiEndpoint}/${entity.id}`, entity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, config.apiEndpoint] });
    },
  });

  const createEntityMutation = useMutation({
    mutationFn: async (entity: Partial<BaseEntity>) => {
      console.log(`Creating ${entityType} with data:`, entity);
      const response = await apiRequest('POST', `/api/projects/${projectId}/${config.apiEndpoint}`, entity);
      const result = await response.json();
      return result;
    },
    onSuccess: (newEntity: BaseEntity) => {
      console.log(`${entityType} created successfully:`, newEntity);
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, config.apiEndpoint] });
      setSelectedEntity(newEntity);
    },
    onError: (error) => {
      console.error(`Failed to create ${entityType}:`, error);
    }
  });

  // Sort and filter entities
  const sortEntities = (items: BaseEntity[]): BaseEntity[] => {
    switch (sortBy) {
      case 'alphabetical':
        return [...items].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'recently-added':
        return [...items].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      case 'recently-edited':
        return [...items].sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime());
      default:
        return items;
    }
  };

  const filteredEntities = sortEntities(
    entities.filter(entity => {
      const searchLower = searchQuery.toLowerCase();
      return (
        entity.name?.toLowerCase().includes(searchLower) ||
        entity.description?.toLowerCase().includes(searchLower) ||
        (entity.tags && entity.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    })
  );

  const handleEdit = (entity: BaseEntity) => {
    setSelectedEntity(entity);
    onSelectEntity?.(entity);
  };

  // Show detail view if entity is selected
  if (selectedEntity) {
    return (
      <div>
        <h2>Entity Detail View Coming Soon</h2>
        <p>Selected: {selectedEntity.name}</p>
        <button onClick={() => setSelectedEntity(null)}>Back to List</button>
      </div>
    );
  }

  const handleDelete = (entity: BaseEntity) => {
    if (confirm(`Are you sure you want to delete ${entity.name}?`)) {
      deleteMutation.mutate(entity.id, {
        onSuccess: () => {
          setSelectedEntity(null);
        }
      });
    }
  };

  const handleCreateNew = () => {
    setIsCreationModalOpen(true);
    onCreateNew?.();
  };

  // Calculate entity completeness based on entity type (matching original character calculation)
  const calculateCompleteness = (entity: BaseEntity): number => {
    if (entityType === 'character') {
      const char = entity as any; // Cast to access character-specific fields
      return Math.min(100, ((char.name ? 10 : 0) + 
                           (char.description ? 15 : 0) + 
                           (char.imageUrl ? 15 : 0) + 
                           (char.personalityTraits?.length ? 10 : 0) + 
                           (char.race ? 10 : 0) +
                           (char.class ? 10 : 0) +
                           (char.age ? 5 : 0) +
                           (char.background ? 10 : 0) +
                           (char.goals ? 10 : 0) +
                           (char.relationships ? 5 : 0)));
    }
    
    // Generic calculation for other entity types
    let score = 0;
    if (entity.name) score += 20;
    if (entity.description) score += 20;
    if (entity.imageUrl) score += 15;
    if (entity.tags && entity.tags.length > 0) score += 10;
    
    if (entityType === 'location') {
      const loc = entity as any;
      if (loc.locationType) score += 15;
      if (loc.geography) score += 10;
      if (loc.population) score += 10;
    } else if (entityType === 'faction') {
      const fac = entity as any;
      if (fac.type) score += 15;
      if (fac.goals) score += 10;
      if (fac.leadership) score += 10;
    } else if (entityType === 'item') {
      const item = entity as any;
      if (item.powers) score += 20;
      if (item.history) score += 15;
    }
    
    return Math.min(100, score);
  };

  // Generic Entity Card for grid view (matches CharacterManager styling for characters)
  const EntityCard = ({ entity }: { entity: BaseEntity }) => {
    if (entityType === 'character') {
      const character = entity as any; // Cast to access character-specific fields
      return (
        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] border border-border/30 hover:border-accent/50 bg-gradient-to-br from-background via-background/90 to-accent/5 overflow-hidden relative" 
              onClick={() => handleEdit(entity)}>
          <CardContent className="p-0 relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            
            {/* Character Image Header */}
            <div className="relative h-64 bg-gradient-to-br from-accent/5 via-muted/20 to-accent/10 overflow-hidden">
              {character.imageUrl ? (
                <>
                  <img 
                    src={character.imageUrl} 
                    alt={character.name}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                  />
                  {/* Image Overlay for Better Text Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/10 to-muted/30">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-3 bg-accent/20 rounded-full flex items-center justify-center">
                      <Users className="h-10 w-10 text-accent/60" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">Ready for portrait</p>
                  </div>
                </div>
              )}
              
              {/* Clean Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                {/* Subtle overlay for better readability */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-white/90 text-sm font-medium line-clamp-2 leading-relaxed">
                    {character.description || 'Click to view character details...'}
                  </div>
                </div>
              </div>

              {/* Premium Status Badge */}
              <div className="absolute bottom-4 left-4 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                <Badge className="bg-accent/90 text-accent-foreground backdrop-blur-sm border-0 shadow-lg font-medium">
                  {character.role || 'Character'}
                </Badge>
              </div>
            </div>

            {/* Premium Character Info */}
            <div className="p-6 space-y-4 relative">
              <div>
                <h3 className="font-bold text-xl group-hover:text-accent transition-colors truncate leading-tight mb-1">
                  {character.name}
                </h3>
                {character.title && (
                  <p className="text-accent/80 text-sm font-medium truncate mb-3">
                    "{character.title}"
                  </p>
                )}
                
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {character.race && (
                    <Badge variant="outline" className="text-xs bg-accent/5 border-accent/30 text-accent/80 hover:bg-accent/10 transition-colors font-medium">
                      {character.race}
                    </Badge>
                  )}
                  {character.class && (
                    <Badge variant="outline" className="text-xs bg-accent/5 border-accent/30 text-accent/80 hover:bg-accent/10 transition-colors font-medium">
                      {character.class}
                    </Badge>
                  )}
                  {character.age && (
                    <Badge variant="outline" className="text-xs bg-accent/5 border-accent/30 text-accent/80 hover:bg-accent/10 transition-colors font-medium">
                      Age {character.age}
                    </Badge>
                  )}
                </div>
              </div>

              {!character.description && (
                <div className="text-center py-2">
                  <p className="text-sm text-muted-foreground italic">
                    Click to add character details...
                  </p>
                </div>
              )}

              {/* Premium Key Traits */}
              {character.personalityTraits && character.personalityTraits.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {character.personalityTraits.slice(0, 3).map((trait: string, index: number) => (
                    <span key={index} className="text-xs px-3 py-1.5 bg-accent/15 text-accent rounded-full font-semibold border border-accent/20">
                      {trait}
                    </span>
                  ))}
                  {character.personalityTraits.length > 3 && (
                    <span className="text-xs px-3 py-1.5 bg-muted/40 rounded-full text-muted-foreground font-semibold border border-muted/40">
                      +{character.personalityTraits.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Character Completeness Indicator */}
              <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-muted/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-300"
                        style={{ width: `${calculateCompleteness(entity)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {calculateCompleteness(entity)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Generic entity card for other types  
    return (
      <Card 
        className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border border-border/30 hover:border-accent/50 bg-gradient-to-br from-background via-background/95 to-accent/5 relative overflow-hidden h-full" 
        onClick={() => handleEdit(entity)}
      >
        <CardContent className="p-6 relative h-full flex flex-col">
          {/* Hover Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Entity Image/Icon */}
          <div className="relative mb-4">
            <div className="w-full h-48 rounded-xl bg-gradient-to-br from-accent/10 via-muted/20 to-accent/15 flex items-center justify-center border border-accent/20 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              {entity.imageUrl ? (
                <img 
                  src={entity.imageUrl} 
                  alt={entity.name}
                  className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center">
                  <IconComponent className="h-10 w-10 text-accent/70" />
                </div>
              )}
            </div>
            
            {/* Quick Actions */}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button size="sm" className="h-8 w-8 p-0 bg-accent/90 hover:bg-accent text-accent-foreground transition-colors rounded-lg shadow-md"
                      onClick={(e) => { e.stopPropagation(); handleEdit(entity); }}>
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Entity Info */}
          <div className="space-y-3 flex-1">
            <div>
              <h3 className="font-bold text-lg leading-tight group-hover:text-accent transition-colors truncate">
                {entity.name}
              </h3>
              {entity.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {entity.description}
                </p>
              )}
            </div>
            
            {/* Tags */}
            {entity.tags && entity.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {entity.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="text-xs px-2 py-1 bg-accent/15 text-accent rounded-full font-medium border border-accent/20">
                    {tag}
                  </span>
                ))}
                {entity.tags.length > 3 && (
                  <span className="text-xs px-2 py-1 bg-muted/40 rounded-full text-muted-foreground font-medium">
                    +{entity.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Completeness Indicator */}
            <div className="flex items-center gap-2 pt-2 border-t border-border/30">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-300"
                      style={{ width: `${calculateCompleteness(entity)}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {calculateCompleteness(entity)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Generic Entity List Item for list view (matches CharacterManager styling for characters)
  const EntityListItem = ({ entity }: { entity: BaseEntity }) => {
    if (entityType === 'character') {
      const character = entity as any; // Cast to access character-specific fields
      return (
        <Card className="group cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.01] border border-border/30 hover:border-accent/50 bg-gradient-to-r from-background via-background/95 to-accent/5 relative overflow-hidden" 
              onClick={() => handleEdit(entity)}>
          <CardContent className="p-5 relative">
            {/* Subtle Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent/3 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            
            <div className="flex items-center gap-5 relative">
              {/* Premium Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/10 via-muted/20 to-accent/15 flex items-center justify-center flex-shrink-0 border border-accent/20 shadow-md group-hover:shadow-lg transition-shadow duration-200">
                {character.imageUrl ? (
                  <img 
                    src={character.imageUrl} 
                    alt={character.name}
                    className="w-full h-full object-cover rounded-2xl transition-transform duration-200 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-accent/70" />
                  </div>
                )}
              </div>

              {/* Premium Character Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-xl group-hover:text-accent transition-colors truncate">
                    {character.name}
                  </h3>
                  {character.title && (
                    <span className="text-accent/70 text-sm font-medium italic">"{character.title}"</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge className="text-xs bg-accent/90 text-accent-foreground font-medium shadow-sm">
                    {character.role || 'Character'}
                  </Badge>
                  {character.race && (
                    <Badge variant="outline" className="text-xs bg-accent/5 border-accent/30 text-accent/80 hover:bg-accent/10 transition-colors font-medium">
                      {character.race}
                    </Badge>
                  )}
                  {character.class && (
                    <Badge variant="outline" className="text-xs bg-accent/5 border-accent/30 text-accent/80 hover:bg-accent/10 transition-colors font-medium">
                      {character.class}
                    </Badge>
                  )}
                  {character.age && (
                    <Badge variant="outline" className="text-xs bg-accent/5 border-accent/30 text-accent/80 hover:bg-accent/10 transition-colors font-medium">
                      Age {character.age}
                    </Badge>
                  )}
                </div>

                {/* Enhanced Description or Call to Action */}
                {character.description ? (
                  <p className="text-sm text-muted-foreground line-clamp-1 leading-relaxed font-medium">
                    {character.description}
                  </p>
                ) : (
                  <p className="text-sm text-accent/60 italic font-medium">
                    Ready to develop • Click to add details and bring them to life
                  </p>
                )}

                {/* Character Completeness Mini-Indicator */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-1 flex-1 bg-muted/30 rounded-full overflow-hidden max-w-32">
                    <div 
                      className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-300"
                      style={{ width: `${calculateCompleteness(entity)}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {calculateCompleteness(entity)}% complete
                  </span>
                </div>
              </div>

              {/* Premium Quick Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <Button size="sm" variant="ghost" className="h-10 w-10 p-0 hover:bg-accent/10 hover:text-accent transition-colors rounded-xl"
                        onClick={(e) => { e.stopPropagation(); handleEdit(entity); }}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-10 w-10 p-0 hover:bg-accent/10 hover:text-accent transition-colors rounded-xl"
                        onClick={(e) => { e.stopPropagation(); handleEdit(entity); }}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" className="h-10 w-10 p-0 bg-accent/90 hover:bg-accent text-accent-foreground transition-colors rounded-xl shadow-md"
                        onClick={(e) => { e.stopPropagation(); console.log('Portrait click for', entity.name); }}>
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Generic entity list item for other types
    return (
      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.01] border border-border/30 hover:border-accent/50 bg-gradient-to-r from-background via-background/95 to-accent/5 relative overflow-hidden" 
            onClick={() => handleEdit(entity)}>
        <CardContent className="p-5 relative">
          {/* Hover Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent/3 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          
          <div className="flex items-center gap-5 relative">
            {/* Entity Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/10 via-muted/20 to-accent/15 flex items-center justify-center flex-shrink-0 border border-accent/20 shadow-md group-hover:shadow-lg transition-shadow duration-200">
              {entity.imageUrl ? (
                <img 
                  src={entity.imageUrl} 
                  alt={entity.name}
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-200 group-hover:scale-105"
                />
              ) : (
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                  <IconComponent className="h-6 w-6 text-accent/70" />
                </div>
              )}
            </div>

            {/* Entity Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-xl group-hover:text-accent transition-colors truncate">
                  {entity.name}
                </h3>
              </div>
              
              {/* Description */}
              {entity.description ? (
                <p className="text-sm text-muted-foreground line-clamp-1 leading-relaxed font-medium">
                  {entity.description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Ready to develop • Click to add details and bring them to life
                </p>
              )}

              {/* Completeness Bar */}
              <div className="flex items-center gap-2 mt-2">
                <div className="h-1.5 flex-1 bg-muted/30 rounded-full overflow-hidden max-w-32">
                  <div 
                    className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-300"
                    style={{ width: `${calculateCompleteness(entity)}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {calculateCompleteness(entity)}% complete
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button size="sm" className="h-10 w-10 p-0 bg-accent/90 hover:bg-accent text-accent-foreground transition-colors rounded-xl shadow-md"
                      onClick={(e) => { e.stopPropagation(); handleEdit(entity); }}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const capitalizedEntityType = config.singular.charAt(0).toUpperCase() + config.singular.slice(1);
  const capitalizedPlural = config.plural.charAt(0).toUpperCase() + config.plural.slice(1);

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Statistics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-title text-3xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {capitalizedPlural}
            </h2>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-muted-foreground">
                {entities.length} {entities.length === 1 ? config.singular : config.plural} in your world
              </span>
              {filteredEntities.length !== entities.length && (
                <span className="text-sm text-accent">
                  ({filteredEntities.length} visible)
                </span>
              )}
            </div>
          </div>
          
          {/* Primary Action */}
          <div className="flex gap-3">
            <Button 
              onClick={handleCreateNew} 
              size="lg"
              className="bg-gradient-to-r from-accent via-accent/90 to-accent/80 hover:from-accent/95 hover:via-accent/85 hover:to-accent/75 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-center">
                <div className="p-1 bg-accent-foreground/10 rounded-full mr-3 group-hover:rotate-90 transition-transform duration-300">
                  <Plus className="h-4 w-4" />
                </div>
                <span className="font-semibold tracking-wide">{config.createButtonText}</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Enhanced Controls Bar */}
        <div className="flex items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={config.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border/50 focus:border-accent/50"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort: {sortBy === 'alphabetical' ? 'A-Z' : sortBy === 'recently-added' ? 'Recent' : 'Edited'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSortChange('alphabetical')} className="flex items-center justify-between">
                  A-Z Order
                  {sortBy === 'alphabetical' && <span className="text-accent">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange('recently-added')} className="flex items-center justify-between">
                  Recently Added
                  {sortBy === 'recently-added' && <span className="text-accent">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange('recently-edited')} className="flex items-center justify-between">
                  Recently Edited
                  {sortBy === 'recently-edited' && <span className="text-accent">✓</span>}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-border/50 rounded-lg p-1 bg-background">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => handleViewModeChange('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => handleViewModeChange('list')}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Entities Display */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
            <p className="text-muted-foreground">Loading {config.plural}...</p>
          </div>
        </div>
      ) : filteredEntities.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <IconComponent className="h-16 w-16 text-muted-foreground/50 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {entities.length === 0 ? config.emptyStateTitle : `No ${config.plural} match your search`}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {entities.length === 0 
                ? config.emptyStateDescription
                : 'Try adjusting your search terms or filters.'
              }
            </p>
          </div>
          {entities.length === 0 && (
            <div className="flex gap-3 justify-center pt-4">
              <Button 
                onClick={handleCreateNew} 
                size="lg"
                className="bg-gradient-to-r from-accent via-accent/90 to-accent/80 hover:from-accent/95 hover:via-accent/85 hover:to-accent/75 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center">
                  <div className="p-1 bg-accent-foreground/10 rounded-full mr-3 group-hover:rotate-90 transition-transform duration-300">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span className="font-semibold tracking-wide">{config.createFirstText}</span>
                </div>
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-3"
        }>
          {filteredEntities.map((entity) => 
            viewMode === 'grid' ? (
              <EntityCard key={entity.id} entity={entity} />
            ) : (
              <EntityListItem key={entity.id} entity={entity} />
            )
          )}
        </div>
      )}
    </div>
  );
}
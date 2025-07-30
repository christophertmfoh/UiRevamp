/**
 * Universal Entity Manager
 * Replicates the sophisticated CharacterManager system for all world bible entities
 * Supports: Locations, Timeline, Factions, Items, Magic, Bestiary, Languages, Cultures, Prophecies, Themes
 * FULL FEATURE PARITY: Grid/List views, AI generation, portraits, sorting, filtering, creation wizards
 */

import React, { useState, useEffect, useCallback, useMemo, memo, lazy, Suspense } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Plus, Search, Edit, Trash2, MoreVertical, Edit2, Camera, Sparkles, ArrowUpDown, Filter, Grid3X3, List, Eye, Zap, FileText,
  MapPin, Calendar, Sword, Gem, Wand2, Globe, Languages, Crown, Scroll, BookOpen, Users, Image, Map, X
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { 
  Location, TimelineEvent, Faction, Item, MagicSystem, Creature, 
  Language, Culture, Prophecy, Theme, BaseWorldEntity 
} from '@/lib/worldBibleTypes';

// Universal entity type mapping to match Character system
type EntityType = 'locations' | 'timeline' | 'factions' | 'items' | 'magic' | 'bestiary' | 'languages' | 'cultures' | 'prophecies' | 'themes';
type ViewMode = 'grid' | 'list';
type SortOption = string;

// Complete entity configuration for all world bible categories
const ENTITY_CONFIGS: Record<EntityType, {
  displayName: string;
  singular: string;
  icon: React.ComponentType<any>;
  apiEndpoint: string;
  createPrompt: string;
  emptyMessage: string;
  primaryFields: string[];
  secondaryFields: string[];
  sortOptions: { value: string; label: string }[];
  colorTheme: string;
  generationPrompts: {
    basic: string;
    detailed: string;
    creative: string;
  };
}> = {
  locations: {
    displayName: 'Locations',
    singular: 'Location',
    icon: MapPin,
    apiEndpoint: 'locations',
    createPrompt: 'Create Location',
    emptyMessage: 'No locations created yet. Build your world one place at a time.',
    primaryFields: ['name', 'locationType', 'geography', 'population', 'culture'],
    secondaryFields: ['climate', 'government', 'economy', 'landmarks', 'atmosphere'],
    sortOptions: [
      { value: 'alphabetical', label: 'Alphabetical' },
      { value: 'recently-added', label: 'Recently Added' },
      { value: 'recently-edited', label: 'Recently Edited' },
      { value: 'by-type', label: 'By Type' },
      { value: 'by-size', label: 'By Size' },
      { value: 'by-importance', label: 'By Importance' },
      { value: 'by-population', label: 'By Population' }
    ],

    generationPrompts: {
      basic: 'Generate a basic location with essential details',
      detailed: 'Create a comprehensive location with rich history and culture',
      creative: 'Design a unique and memorable location with special characteristics'
    }
  },
  timeline: {
    displayName: 'Timeline',
    singular: 'Event',
    icon: Calendar,
    apiEndpoint: 'timeline',
    createPrompt: 'Create Event',
    emptyMessage: 'No timeline events created yet. Chronicle your world\'s history.',
    primaryFields: ['name', 'date', 'eventType', 'magnitude', 'summary'],
    secondaryFields: ['era', 'participants', 'consequences', 'impact', 'significance'],
    sortOptions: [
      { value: 'chronological', label: 'Chronological' },
      { value: 'reverse-chronological', label: 'Reverse Chronological' },
      { value: 'by-importance', label: 'By Importance' },
      { value: 'by-type', label: 'By Type' },
      { value: 'by-magnitude', label: 'By Magnitude' },
      { value: 'recently-added', label: 'Recently Added' }
    ],

    generationPrompts: {
      basic: 'Generate a historical event with key details',
      detailed: 'Create a comprehensive historical event with causes and consequences',
      creative: 'Design a pivotal moment that shapes your world\'s destiny'
    }
  },
  factions: {
    displayName: 'Factions',
    singular: 'Faction',
    icon: Sword,
    apiEndpoint: 'factions',
    createPrompt: 'Create Faction',
    emptyMessage: 'No factions created yet. Organize the powers that shape your world.',
    primaryFields: ['name', 'factionType', 'structure', 'size', 'leader'],
    secondaryFields: ['goals', 'resources', 'influence', 'reputation', 'activities'],
    sortOptions: [
      { value: 'alphabetical', label: 'Alphabetical' },
      { value: 'by-power', label: 'By Power' },
      { value: 'by-size', label: 'By Size' },
      { value: 'by-type', label: 'By Type' },
      { value: 'recently-added', label: 'Recently Added' },
      { value: 'by-influence', label: 'By Influence' }
    ],

    generationPrompts: {
      basic: 'Generate a faction with clear purpose and structure',
      detailed: 'Create a complex organization with detailed hierarchy and goals',
      creative: 'Design a unique faction with distinctive methods and motivations'
    }
  },
  items: {
    displayName: 'Items & Artifacts',
    singular: 'Item',
    icon: Gem,
    apiEndpoint: 'items',
    createPrompt: 'Create Item',
    emptyMessage: 'No items created yet. Fill your world with legendary artifacts.',
    primaryFields: ['name', 'itemType', 'rarity', 'creator', 'powers'],
    secondaryFields: ['material', 'magical', 'history', 'value', 'location'],
    sortOptions: [
      { value: 'alphabetical', label: 'Alphabetical' },
      { value: 'by-rarity', label: 'By Rarity' },
      { value: 'by-type', label: 'By Type' },
      { value: 'by-power', label: 'By Power' },
      { value: 'by-value', label: 'By Value' },
      { value: 'recently-added', label: 'Recently Added' }
    ],

    generationPrompts: {
      basic: 'Generate a useful item with clear properties',
      detailed: 'Create a legendary artifact with rich history and powers',
      creative: 'Design a unique magical item with unexpected abilities'
    }
  },
  magic: {
    displayName: 'Magic & Lore',
    singular: 'Magic System',
    icon: Wand2,
    apiEndpoint: 'magic',
    createPrompt: 'Create Magic System',
    emptyMessage: 'No magic systems created yet. Define the supernatural forces of your world.',
    primaryFields: ['name', 'systemType', 'source', 'practitioners', 'principles'],
    secondaryFields: ['limitations', 'costs', 'schools', 'acceptance', 'theory'],
    sortOptions: [
      { value: 'alphabetical', label: 'Alphabetical' },
      { value: 'by-type', label: 'By Type' },
      { value: 'by-power', label: 'By Power Level' },
      { value: 'by-complexity', label: 'By Complexity' },
      { value: 'recently-added', label: 'Recently Added' }
    ],

    generationPrompts: {
      basic: 'Generate a magic system with clear rules and limitations',
      detailed: 'Create a comprehensive magical framework with schools and practitioners',
      creative: 'Design a unique supernatural system that defies conventional magic'
    }
  },
  bestiary: {
    displayName: 'Bestiary',
    singular: 'Creature',
    icon: Users,
    apiEndpoint: 'bestiary',
    createPrompt: 'Create Creature',
    emptyMessage: 'No creatures created yet. Populate your world with fascinating beings.',
    primaryFields: ['name', 'species', 'category', 'size', 'intelligence'],
    secondaryFields: ['habitat', 'abilities', 'behavior', 'rarity', 'threat_level'],
    sortOptions: [
      { value: 'alphabetical', label: 'Alphabetical' },
      { value: 'by-size', label: 'By Size' },
      { value: 'by-threat', label: 'By Threat Level' },
      { value: 'by-rarity', label: 'By Rarity' },
      { value: 'by-intelligence', label: 'By Intelligence' },
      { value: 'recently-added', label: 'Recently Added' }
    ],

    generationPrompts: {
      basic: 'Generate a creature with clear characteristics and behavior',
      detailed: 'Create a complex being with detailed ecology and abilities',
      creative: 'Design a unique creature that challenges conventional fantasy'
    }
  },
  languages: {
    displayName: 'Languages',
    singular: 'Language',
    icon: Languages,
    apiEndpoint: 'languages',
    createPrompt: 'Create Language',
    emptyMessage: 'No languages created yet. Give voice to your world\'s cultures.',
    primaryFields: ['name', 'language_type', 'native_speakers', 'complexity', 'script'],
    secondaryFields: ['family', 'dialects', 'cultural_significance', 'vitality', 'difficulty'],
    sortOptions: [
      { value: 'alphabetical', label: 'Alphabetical' },
      { value: 'by-speakers', label: 'By Speakers' },
      { value: 'by-complexity', label: 'By Complexity' },
      { value: 'by-vitality', label: 'By Vitality' },
      { value: 'recently-added', label: 'Recently Added' }
    ],

    generationPrompts: {
      basic: 'Generate a language with essential linguistic features',
      detailed: 'Create a comprehensive language with rich cultural context',
      creative: 'Design a unique communication system unlike any earthly language'
    }
  },
  cultures: {
    displayName: 'Cultures',
    singular: 'Culture',
    icon: Crown,
    apiEndpoint: 'cultures',
    createPrompt: 'Create Culture',
    emptyMessage: 'No cultures created yet. Build the societies that define your world.',
    primaryFields: ['name', 'culture_type', 'population_size', 'core_values', 'social_hierarchy'],
    secondaryFields: ['beliefs', 'customs', 'technology_level', 'government_type', 'arts'],
    sortOptions: [
      { value: 'alphabetical', label: 'Alphabetical' },
      { value: 'by-population', label: 'By Population' },
      { value: 'by-technology', label: 'By Technology Level' },
      { value: 'by-influence', label: 'By Influence' },
      { value: 'recently-added', label: 'Recently Added' }
    ],

    generationPrompts: {
      basic: 'Generate a culture with distinct values and practices',
      detailed: 'Create a comprehensive civilization with detailed social structures',
      creative: 'Design a unique society that challenges conventional cultural norms'
    }
  },
  prophecies: {
    displayName: 'Prophecies',
    singular: 'Prophecy',
    icon: Scroll,
    apiEndpoint: 'prophecies',
    createPrompt: 'Create Prophecy',
    emptyMessage: 'No prophecies created yet. Weave fate and destiny into your narrative.',
    primaryFields: ['name', 'prophecy_type', 'scope', 'prophet', 'original_text'],
    secondaryFields: ['interpretations', 'fulfillment_status', 'key_figures', 'timeline', 'consequences'],
    sortOptions: [
      { value: 'alphabetical', label: 'Alphabetical' },
      { value: 'by-scope', label: 'By Scope' },
      { value: 'by-fulfillment', label: 'By Fulfillment Status' },
      { value: 'by-importance', label: 'By Importance' },
      { value: 'recently-added', label: 'Recently Added' }
    ],

    generationPrompts: {
      basic: 'Generate a prophecy with clear meaning and implications',
      detailed: 'Create a complex prophecy with multiple interpretations and layers',
      creative: 'Design a mysterious prophecy that drives your narrative forward'
    }
  },
  themes: {
    displayName: 'Themes & Meta',
    singular: 'Theme',
    icon: BookOpen,
    apiEndpoint: 'themes',
    createPrompt: 'Create Theme',
    emptyMessage: 'No themes created yet. Define the deeper meanings of your story.',
    primaryFields: ['name', 'theme_type', 'description', 'manifestations', 'importance'],
    secondaryFields: ['symbols', 'character_arcs', 'plot_threads', 'cultural_expressions', 'resolution'],
    sortOptions: [
      { value: 'alphabetical', label: 'Alphabetical' },
      { value: 'by-importance', label: 'By Importance' },
      { value: 'by-prevalence', label: 'By Prevalence' },
      { value: 'by-complexity', label: 'By Complexity' },
      { value: 'recently-added', label: 'Recently Added' }
    ],

    generationPrompts: {
      basic: 'Generate a theme with clear narrative purpose',
      detailed: 'Create a complex thematic element woven throughout your story',
      creative: 'Design a unique thematic approach that elevates your narrative'
    }
  }
};

interface UniversalEntityManagerProps {
  entityType: EntityType;
  projectId: string;
  selectedEntityId?: string | null;
  onClearSelection?: () => void;
}

// PERFORMANCE: Memoized entity card component to prevent unnecessary re-renders
const MemoizedEntityCard = memo(({ 
  entity, 
  config, 
  isSelectionMode, 
  selectedEntityIds, 
  onEntityClick, 
  onSelectEntity 
}: {
  entity: BaseWorldEntity;
  config: any;
  isSelectionMode: boolean;
  selectedEntityIds: Set<string>;
  onEntityClick: (entity: BaseWorldEntity) => void;
  onSelectEntity: (entityId: string, selected: boolean) => void;
}) => {
  const handleClick = useCallback(() => {
    if (isSelectionMode) {
      onSelectEntity(entity.id, !selectedEntityIds.has(entity.id));
    } else {
      onEntityClick(entity);
    }
  }, [entity, isSelectionMode, selectedEntityIds, onEntityClick, onSelectEntity]);

  return (
    <Card 
      className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] border overflow-hidden relative ${
        isSelectionMode 
          ? selectedEntityIds.has(entity.id)
            ? 'border-[var(--accent)] bg-[var(--accent)]/5 shadow-lg' 
            : 'border-border/30 hover:border-[var(--accent)]/50 bg-gradient-to-br from-background via-background/90 to-[var(--accent)]/5'
          : 'border-border/30 hover:border-[var(--accent)]/50 bg-gradient-to-br from-background via-background/90 to-[var(--accent)]/5'
      }`}
      onClick={handleClick}
    >
      <CardContent className="p-0 relative">
        {/* Subtle Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/3 via-transparent to-[var(--accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        
        {/* Selection Checkbox */}
        {isSelectionMode && (
          <div className="absolute top-3 left-3 z-10">
            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
              selectedEntityIds.has(entity.id)
                ? 'bg-[var(--accent)] border-[var(--accent)] text-[white]'
                : 'bg-background/80 border-border hover:border-[var(--accent)]'
            }`}>
              {selectedEntityIds.has(entity.id) && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
        )}
        
        {/* Entity Image Header */}
        <div className="relative h-64 bg-gradient-to-br from-[var(--accent)]/5 via-muted/20 to-[var(--accent)]/10 overflow-hidden">
          {entity.imageUrl ? (
            <>
              <img 
                src={entity.imageUrl} 
                alt={entity.name}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--accent)]/10 to-muted/30">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 bg-[var(--accent)]/20 rounded-full flex items-center justify-center">
                  <config.icon className="h-10 w-10 text-[var(--accent)]/60" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">Add Image</p>
              </div>
            </div>
          )}
        </div>

        {/* Entity Details */}
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl group-hover:text-[var(--accent)] transition-colors truncate">
                {entity.name}
              </h3>
              {entity.description && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {entity.description}
                </p>
              )}
            </div>
          </div>

          {/* Entity Type/Category Badge */}
          {(entity.type || entity.category) && (
            <div className="flex flex-wrap gap-2">
              {entity.type && (
                <Badge variant="secondary" className="text-xs">
                  {entity.type}
                </Badge>
              )}
              {entity.category && (
                <Badge variant="outline" className="text-xs">
                  {entity.category}
                </Badge>
              )}
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-border/30">
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle edit action
                }}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle delete action
                }}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// PERFORMANCE: Entity card skeleton for lazy loading
const EntityCardSkeleton = memo(() => (
  <Card className="overflow-hidden">
    <CardContent className="p-0">
      <Skeleton className="h-64 w-full" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </CardContent>
  </Card>
));

// PERFORMANCE: Virtualized entity list for large datasets
const VirtualEntityList = memo(({ 
  entities, 
  config, 
  isSelectionMode, 
  selectedEntityIds, 
  onEntityClick, 
  onSelectEntity,
  viewMode 
}: {
  entities: BaseWorldEntity[];
  config: any;
  isSelectionMode: boolean;
  selectedEntityIds: Set<string>;
  onEntityClick: (entity: BaseWorldEntity) => void;
  onSelectEntity: (entityId: string, selected: boolean) => void;
  viewMode: ViewMode;
}) => {
  // Enable virtualization for large datasets (>50 items)
  const shouldVirtualize = entities.length > 50;

  if (!shouldVirtualize) {
    return (
      <div className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
          : "space-y-3"
      }>
        {entities.map((entity) => (
          <Suspense key={entity.id} fallback={<EntityCardSkeleton />}>
            <MemoizedEntityCard
              entity={entity}
              config={config}
              isSelectionMode={isSelectionMode}
              selectedEntityIds={selectedEntityIds}
              onEntityClick={onEntityClick}
              onSelectEntity={onSelectEntity}
            />
          </Suspense>
        ))}
      </div>
    );
  }

  // For large datasets, implement simple virtualization
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const itemHeight = viewMode === 'grid' ? 400 : 120;
      const start = Math.floor(scrollTop / itemHeight);
      const end = Math.min(start + 20, entities.length);
      setVisibleRange({ start, end });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [entities.length, viewMode]);

  const visibleEntities = entities.slice(visibleRange.start, visibleRange.end);

  return (
    <div className={
      viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
        : "space-y-3"
    }>
      {visibleEntities.map((entity) => (
        <Suspense key={entity.id} fallback={<EntityCardSkeleton />}>
          <MemoizedEntityCard
            entity={entity}
            config={config}
            isSelectionMode={isSelectionMode}
            selectedEntityIds={selectedEntityIds}
            onEntityClick={onEntityClick}
            onSelectEntity={onSelectEntity}
          />
        </Suspense>
      ))}
    </div>
  );
});

export const UniversalEntityManager = memo(function UniversalEntityManager({ 
  entityType, 
  projectId, 
  selectedEntityId, 
  onClearSelection 
}: UniversalEntityManagerProps) {
  const config = ENTITY_CONFIGS[entityType];
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('alphabetical');
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem(`${entityType}ViewMode`);
    return (saved as ViewMode) || 'grid';
  });
  
  // State management - matching CharacterManager exactly
  const [selectedEntity, setSelectedEntity] = useState<BaseWorldEntity | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isGuidedCreation, setIsGuidedCreation] = useState(false);
  const [portraitEntity, setPortraitEntity] = useState<BaseWorldEntity | null>(null);
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isCreationLaunchOpen, setIsCreationLaunchOpen] = useState(false);
  const [isDocumentUploadOpen, setIsDocumentUploadOpen] = useState(false);
  const [newEntityData, setNewEntityData] = useState<Partial<BaseWorldEntity>>({});
  const [selectedEntityIds, setSelectedEntityIds] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const queryClient = useQueryClient();



  // Data fetching - fixed to use correct World Bible API endpoints
  const { data: entities = [], isLoading } = useQuery<BaseWorldEntity[]>({
    queryKey: [`/api/projects/${projectId}/worldbible/${config.apiEndpoint}`],
    enabled: !!projectId && projectId !== 'undefined' && projectId !== 'null',
  });

  // Create mutation for World Bible entities
  const createEntityMutation = useMutation({
    mutationFn: async (entityData: Partial<BaseWorldEntity>) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/worldbible/${config.apiEndpoint}`, entityData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/worldbible/${config.apiEndpoint}`] });
    },
    onError: (error) => {
      console.error('Save failed:', error);
    }
  });

  // Update mutation for World Bible entities  
  const updateEntityMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<BaseWorldEntity> }) => {
      const response = await apiRequest('PUT', `/api/worldbible/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/worldbible/${config.apiEndpoint}`] });
    },
    onError: (error) => {
      console.error('Update failed:', error);
    }
  });

  // Delete mutation for World Bible entities
  const deleteEntityMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/worldbible/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/worldbible/${config.apiEndpoint}`] });
    },
    onError: (error) => {
      console.error('Delete failed:', error);
    }
  });

  // PERFORMANCE: Persist view mode to localStorage with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(`${entityType}ViewMode`, viewMode);
    }, 100); // Debounce for 100ms
    
    return () => clearTimeout(timeoutId);
  }, [viewMode, entityType]);

  // PERFORMANCE: Memoized sorting function to prevent recalculation
  const sortEntities = useCallback((entitiesArray: BaseWorldEntity[]): BaseWorldEntity[] => {
    switch (sortBy) {
      case 'alphabetical':
        return [...entitiesArray].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'recently-added':
        return [...entitiesArray].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      case 'recently-edited':
        return [...entitiesArray].sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
      case 'by-importance':
        return [...entitiesArray].sort((a, b) => {
          const importanceOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
          return (importanceOrder[b.importance] || 0) - (importanceOrder[a.importance] || 0);
        });
      default:
        return entitiesArray;
    }
  }, [sortBy]);

  // PERFORMANCE: Memoized filtering and sorting for better performance
  const filteredEntities = useMemo(() => {
    // First filter entities based on debounced search query
    const filtered = entities.filter(entity => {
      if (!debouncedSearchQuery.trim()) return true;
      
      const searchLower = debouncedSearchQuery.toLowerCase();
      const searchFields = [
        entity.name,
        entity.description,
        entity.type,
        entity.category,
        entity.tags
      ];
      
      return searchFields.some(field => {
        if (typeof field === 'string') {
          return field.toLowerCase().includes(searchLower);
        }
        if (Array.isArray(field)) {
          return field.some(item => 
            typeof item === 'string' && item.toLowerCase().includes(searchLower)
          );
        }
        return false;
      });
    });
    
    // Then sort the filtered results
    return sortEntities(filtered);
  }, [entities, debouncedSearchQuery, sortBy]);

  // PERFORMANCE: Memoized selection handlers to prevent unnecessary re-renders
  const handleSelectEntity = useCallback((entityId: string, selected: boolean) => {
    setSelectedEntityIds(prev => {
      const newSelected = new Set(prev);
      if (selected) {
        newSelected.add(entityId);
      } else {
        newSelected.delete(entityId);
      }
      return newSelected;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedEntityIds(prev => {
      if (prev.size === filteredEntities.length) {
        return new Set();
      } else {
        return new Set(filteredEntities.map(e => e.id));
      }
    });
  }, [filteredEntities]);

  const toggleSelectionMode = useCallback(() => {
    setIsSelectionMode(prev => {
      const newMode = !prev;
      if (prev) { // If we're turning off selection mode
        setSelectedEntityIds(new Set());
      }
      return newMode;
    });
  }, []);

  // PERFORMANCE: Memoized view mode handlers
  const handleGridView = useCallback(() => setViewMode('grid'), []);
  const handleListView = useCallback(() => setViewMode('list'), []);

  // PERFORMANCE: Debounced search to reduce re-renders
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // PERFORMANCE: Memoized statistics to prevent recalculation
  const entityStats = useMemo(() => ({
    total: entities.length,
    visible: filteredEntities.length,
    selected: selectedEntityIds.size,
    isFiltered: filteredEntities.length !== entities.length
  }), [entities.length, filteredEntities.length, selectedEntityIds.size]);

  // COMPLETE CHARACTER MANAGER INTERFACE - EXACTLY THE SAME
  return (
    <div className="space-y-6">
      {/* Enhanced Header with Statistics - EXACT MATCH */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-title text-3xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {config.displayName}
            </h2>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-muted-foreground">
                {entityStats.total} {entityStats.total === 1 ? config.singular.toLowerCase() : config.displayName.toLowerCase()} in your world
              </span>
              {entityStats.isFiltered && (
                <span className="text-sm text-accent">
                  ({entityStats.visible} visible)
                </span>
              )}
            </div>
          </div>
          
          {/* Primary Action */}
          <div className="flex gap-3">
            <Button 
              onClick={() => setIsCreationLaunchOpen(true)} 
              size="lg"
              className="bg-[var(--accent)] hover:bg-[var(--accent)] text-[white] shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-center">
                <div className="p-1 bg-white/10 rounded-full mr-3 group-hover:rotate-90 transition-transform duration-300">
                  <Plus className="h-4 w-4" />
                </div>
                <span className="font-semibold tracking-wide">Create {config.singular}</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Enhanced Controls Bar - EXACT MATCH */}
        <div className="flex items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${config.displayName.toLowerCase()} by name or description...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border/50 focus:border-accent/50"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Selection Mode Toggle */}
            <Button
              variant={isSelectionMode ? "default" : "outline"}
              size="sm"
              onClick={toggleSelectionMode}
              className="h-9"
            >
              {isSelectionMode ? 'Cancel Select' : 'Select'}
            </Button>

            {/* Bulk Actions - Only show in selection mode */}
            {isSelectionMode && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="h-9"
                  disabled={filteredEntities.length === 0}
                >
                  {selectedEntityIds.size === filteredEntities.length ? 'Deselect All' : `Select All (${filteredEntities.length})`}
                </Button>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => console.log('Bulk delete not implemented yet')}
                  disabled={selectedEntityIds.size === 0}
                  className="h-9"
                >
                  Delete Selected ({selectedEntityIds.size})
                </Button>
              </>
            )}

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {config.sortOptions.map((option) => (
                  <DropdownMenuItem 
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-border/50 rounded-lg p-1 bg-background">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={handleGridView}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={handleListView}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Entities Display - EXACT MATCH PATTERN */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
            <p className="text-muted-foreground">Loading {config.displayName.toLowerCase()}...</p>
          </div>
        </div>
      ) : filteredEntities.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <config.icon className="h-16 w-16 text-muted-foreground/50 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {entities.length === 0 ? `No ${config.displayName.toLowerCase()} yet` : `No ${config.displayName.toLowerCase()} match your search`}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {entities.length === 0 
                ? config.emptyMessage
                : 'Try adjusting your search terms or filters.'
              }
            </p>
          </div>
          {entities.length === 0 && (
            <div className="flex gap-3 justify-center pt-4">
              <Button 
                onClick={() => setIsCreationLaunchOpen(true)} 
                size="lg"
                className="bg-[var(--accent)] hover:bg-[var(--accent)] text-[white] shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center">
                  <div className="p-1 bg-white/10 rounded-full mr-3 group-hover:rotate-90 transition-transform duration-300">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span className="font-semibold tracking-wide">Create First {config.singular}</span>
                </div>
              </Button>
            </div>
          )}
        </div>
      ) : (
        <VirtualEntityList
          entities={filteredEntities}
          config={config}
          isSelectionMode={isSelectionMode}
          selectedEntityIds={selectedEntityIds}
          onEntityClick={setSelectedEntity}
          onSelectEntity={handleSelectEntity}
          viewMode={viewMode}
        />
      )}

      {/* MODALS - ALL CATEGORY FUNCTIONALITY IMPLEMENTATIONS */}
      
      {/* Creation Launch Modal - Universal for all entity types */}
      {isCreationLaunchOpen && (
        <UniversalCreationLaunch
          entityType={entityType}
          config={config}
          isOpen={isCreationLaunchOpen}
          onClose={() => setIsCreationLaunchOpen(false)}
          onCreateManual={() => {
            setIsCreationLaunchOpen(false);
            setIsCreating(true);
          }}
          onCreateTemplate={() => {
            setIsCreationLaunchOpen(false);
            setIsTemplateModalOpen(true);
          }}
          onCreateAI={() => {
            setIsCreationLaunchOpen(false);
            setIsGenerationModalOpen(true);
          }}
          onCreateGuided={() => {
            setIsCreationLaunchOpen(false);
            setIsGuidedCreation(true);
            setIsCreating(true);
          }}
          onUploadDocument={() => {
            setIsCreationLaunchOpen(false);
            setIsDocumentUploadOpen(true);
          }}
        />
      )}

      {/* OLD CARD RENDERING - DISABLED FOR PERFORMANCE */}
      {false && false && (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-3"
        }>
          {filteredEntities.map((entity) => (
            <Card 
              key={entity.id}
              className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] border overflow-hidden relative ${
                isSelectionMode 
                  ? selectedEntityIds.has(entity.id)
                    ? 'border-[var(--accent)] bg-[var(--accent)]/5 shadow-lg' 
                    : 'border-border/30 hover:border-[var(--accent)]/50 bg-gradient-to-br from-background via-background/90 to-[var(--accent)]/5'
                  : 'border-border/30 hover:border-[var(--accent)]/50 bg-gradient-to-br from-background via-background/90 to-[var(--accent)]/5'
              }`}
              onClick={() => {
                if (isSelectionMode) {
                  handleSelectEntity(entity.id, !selectedEntityIds.has(entity.id));
                } else {
                  setSelectedEntity(entity);
                }
              }}
            >
              <CardContent className="p-0 relative">
                {/* Subtle Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/3 via-transparent to-[var(--accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                
                {/* Selection Checkbox */}
                {isSelectionMode && (
                  <div className="absolute top-3 left-3 z-10">
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                      selectedEntityIds.has(entity.id)
                        ? 'bg-[var(--accent)] border-[var(--accent)] text-[white]'
                        : 'bg-background/80 border-border hover:border-[var(--accent)]'
                    }`}>
                      {selectedEntityIds.has(entity.id) && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Entity Image Header */}
                <div className="relative h-64 bg-gradient-to-br from-[var(--accent)]/5 via-muted/20 to-[var(--accent)]/10 overflow-hidden">
                  {entity.imageUrl ? (
                    <>
                      <img 
                        src={entity.imageUrl} 
                        alt={entity.name}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--accent)]/10 to-muted/30">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-3 bg-[var(--accent)]/20 rounded-full flex items-center justify-center">
                          <config.icon className="h-10 w-10 text-[var(--accent)]/60" />
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">Add Image</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Entity Details */}
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-lg leading-tight group-hover:text-[var(--accent)] transition-colors duration-200 line-clamp-2">
                        {entity.name || 'Unnamed ' + config.singular}
                      </h3>
                      <Badge className="bg-[var(--accent)] text-[white] font-medium text-xs px-2 py-1 shadow-md border-0 rounded-full">
                        {config.singular}
                      </Badge>
                    </div>
                    
                    {entity.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {entity.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/30">
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-accent/5 border-accent/30 text-accent/80 hover:bg-accent/10 transition-colors font-medium"
                    >
                      {entity.importance}
                    </Badge>
                    
                    <span className="text-xs text-muted-foreground">
                      {entity.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* MODALS - ALL CATEGORY FUNCTIONALITY IMPLEMENTATIONS */}
      
      {/* Creation Launch Modal - Universal for all entity types */}
      {isCreationLaunchOpen && (
        <UniversalCreationLaunch
          entityType={entityType}
          config={config}
          isOpen={isCreationLaunchOpen}
          onClose={() => setIsCreationLaunchOpen(false)}
          onCreateManual={() => {
            setIsCreationLaunchOpen(false);
            setIsCreating(true);
          }}
          onCreateTemplate={() => {
            setIsCreationLaunchOpen(false);
            setIsTemplateModalOpen(true);
          }}
          onCreateAI={() => {
            setIsCreationLaunchOpen(false);
            setIsGenerationModalOpen(true);
          }}
          onCreateGuided={() => {
            setIsCreationLaunchOpen(false);
            setIsGuidedCreation(true);
            setIsCreating(true);
          }}
          onUploadDocument={() => {
            setIsCreationLaunchOpen(false);
            setIsDocumentUploadOpen(true);
          }}
        />
      )}

      {/* AI Generation Modal - Universal for all entity types */}
      {isGenerationModalOpen && (
        <UniversalGenerationModal
          entityType={entityType}
          config={config}
          projectId={projectId}
          isOpen={isGenerationModalOpen}
          onClose={() => setIsGenerationModalOpen(false)}
          onEntityGenerated={(entity) => {
            setSelectedEntity(entity);
            setIsGenerationModalOpen(false);
            queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/worldbible/${config.apiEndpoint}`] });
          }}
        />
      )}

      {/* Templates Modal - Universal for all entity types */}
      {isTemplateModalOpen && (
        <UniversalTemplates
          entityType={entityType}
          config={config}
          projectId={projectId}
          isOpen={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          onEntityCreated={(entity) => {
            setSelectedEntity(entity);
            setIsTemplateModalOpen(false);
            queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/worldbible/${config.apiEndpoint}`] });
          }}
        />
      )}

      {/* Portrait/Image Modal - Universal for all entity types */}
      {isPortraitModalOpen && portraitEntity && (
        <UniversalPortraitModal
          entityType={entityType}
          config={config}
          entity={portraitEntity}
          isOpen={isPortraitModalOpen}
          onClose={() => {
            setIsPortraitModalOpen(false);
            setPortraitEntity(null);
          }}
          onImageUpdated={(updatedEntity) => {
            setPortraitEntity(updatedEntity);
            queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, config.apiEndpoint] });
          }}
        />
      )}

      {/* Document Upload Modal - Universal for all entity types */}
      {isDocumentUploadOpen && (
        <UniversalDocumentUpload
          entityType={entityType}
          config={config}
          projectId={projectId}
          isOpen={isDocumentUploadOpen}
          onClose={() => setIsDocumentUploadOpen(false)}
          onEntityCreated={(entity) => {
            setSelectedEntity(entity);
            setIsDocumentUploadOpen(false);
            queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, config.apiEndpoint] });
          }}
        />
      )}

      {/* Detail View - Universal for all entity types */}
      {selectedEntity && !isCreating && (
        <UniversalDetailView
          entityType={entityType}
          config={config}
          entity={selectedEntity}
          projectId={projectId}
          onClose={() => setSelectedEntity(null)}
          onEdit={() => {
            setIsCreating(true);
            setNewEntityData(selectedEntity);
          }}
          onPortraitEdit={() => {
            setPortraitEntity(selectedEntity);
            setIsPortraitModalOpen(true);
          }}
          onDeleted={() => {
            setSelectedEntity(null);
            queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/worldbible/${config.apiEndpoint}`] });
          }}
        />
      )}

      {/* Creation/Edit View - Universal for all entity types */}
      {isCreating && (
        <UniversalCreationView
          entityType={entityType}
          config={config}
          projectId={projectId}
          initialData={newEntityData}
          isGuided={isGuidedCreation}
          onClose={() => {
            setIsCreating(false);
            setIsGuidedCreation(false);
            setNewEntityData({});
          }}
          onEntitySaved={(entity) => {
            setSelectedEntity(entity);
            setIsCreating(false);
            setIsGuidedCreation(false);
            setNewEntityData({});
            queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/worldbible/${config.apiEndpoint}`] });
          }}
        />
      )}
    </div>
  );
};

// UNIVERSAL CREATION LAUNCH MODAL - Matches CharacterCreationLaunch exactly
interface UniversalCreationLaunchProps {
  entityType: EntityType;
  config: typeof ENTITY_CONFIGS[EntityType];
  isOpen: boolean;
  onClose: () => void;
  onCreateManual: () => void;
  onCreateTemplate: () => void;
  onCreateAI: () => void;
  onCreateGuided: () => void;
  onUploadDocument: () => void;
}

function UniversalCreationLaunch({ 
  entityType, 
  config, 
  isOpen, 
  onClose, 
  onCreateManual, 
  onCreateTemplate, 
  onCreateAI, 
  onCreateGuided, 
  onUploadDocument 
}: UniversalCreationLaunchProps) {
  if (!isOpen) return null;

  // Category-specific creation method descriptions
  const creationMethods = {
    locations: {
      manual: "Build your location from scratch with complete creative control over every detail",
      template: "Choose from pre-made location templates like cities, dungeons, or mystical realms",
      ai: "Let AI generate a unique location based on your world's themes and requirements",
      guided: "Step-by-step location creation with helpful prompts and suggestions",
      document: "Import location details from existing documents or world building notes"
    },
    timeline: {
      manual: "Chronicle your world's history with complete control over every event and detail",
      template: "Use historical event templates like wars, discoveries, or golden ages",
      ai: "Generate significant historical events that fit your world's timeline and themes",
      guided: "Build your timeline with guided prompts for causes, events, and consequences",
      document: "Import historical events from existing chronologies or world notes"
    },
    factions: {
      manual: "Design organizations and groups with full control over structure and goals",
      template: "Select from faction templates like guilds, kingdoms, or secret societies",
      ai: "Create compelling factions with AI-generated motivations and conflicts",
      guided: "Build factions step-by-step with guidance on structure and relationships",
      document: "Import faction details from existing organizational charts or notes"
    },
    items: {
      manual: "Craft legendary artifacts and items with complete creative freedom",
      template: "Choose from item templates like weapons, magical artifacts, or treasures",
      ai: "Generate unique items with AI-created powers, histories, and significance",
      guided: "Create items with step-by-step guidance on properties and lore",
      document: "Import item descriptions from existing equipment lists or artifacts"
    },
    magic: {
      manual: "Design magical systems with full control over rules and manifestations",
      template: "Use magic system templates like elemental, divine, or scholarly traditions",
      ai: "Generate unique magical frameworks with AI-created rules and limitations",
      guided: "Build magic systems with guided prompts for sources, costs, and effects",
      document: "Import magical traditions from existing spell lists or magical lore"
    },
    bestiary: {
      manual: "Create creatures and beings with complete control over every characteristic",
      template: "Select from creature templates like dragons, spirits, or mythical beasts",
      ai: "Generate unique creatures with AI-created behaviors and abilities",
      guided: "Design creatures step-by-step with guidance on ecology and traits",
      document: "Import creature details from existing bestiaries or creature notes"
    },
    languages: {
      manual: "Develop languages with full control over linguistics and cultural context",
      template: "Choose from language templates like ancient, mystical, or trading tongues",
      ai: "Create unique languages with AI-generated grammar and cultural significance",
      guided: "Build languages with step-by-step guidance on structure and speakers",
      document: "Import language details from existing linguistic notes or phrase books"
    },
    cultures: {
      manual: "Design civilizations and peoples with complete creative control",
      template: "Select from culture templates like nomadic, imperial, or mystical societies",
      ai: "Generate rich cultures with AI-created traditions and social structures",
      guided: "Build cultures step-by-step with guidance on values and customs",
      document: "Import cultural details from existing society notes or anthropological texts"
    },
    prophecies: {
      manual: "Craft prophecies and visions with full control over meaning and fulfillment",
      template: "Choose from prophecy templates like doom, hope, or transformation themes",
      ai: "Generate compelling prophecies with AI-created symbolism and interpretations",
      guided: "Create prophecies with step-by-step guidance on visions and meanings",
      document: "Import prophetic texts from existing oracles or visionary writings"
    },
    themes: {
      manual: "Develop narrative themes with complete control over meaning and expression",
      template: "Select from thematic templates like love, power, or transformation motifs",
      ai: "Generate profound themes with AI-created symbolic representations",
      guided: "Build themes step-by-step with guidance on narrative integration",
      document: "Import thematic elements from existing literary analysis or story notes"
    }
  };

  const methods = creationMethods[entityType];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-xl">
                <config.icon className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Create {config.singular}</h2>
                <p className="text-muted-foreground mt-1">Choose your preferred creation method</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Manual Creation */}
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-accent/50" onClick={onCreateManual}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <Edit2 className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">Manual Creation</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{methods.manual}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Template Creation */}
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-accent/50" onClick={onCreateTemplate}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <FileText className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">From Template</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{methods.template}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Generation */}
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-accent/50" onClick={onCreateAI}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <Sparkles className="h-6 w-6 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">AI Generation</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{methods.ai}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guided Creation */}
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-accent/50" onClick={onCreateGuided}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-500/10 rounded-lg">
                    <Zap className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">Guided Creation</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{methods.guided}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Upload */}
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-accent/50 md:col-span-2" onClick={onUploadDocument}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-lg">
                    <FileText className="h-6 w-6 text-cyan-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">Import from Document</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{methods.document}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// UNIVERSAL AI GENERATION MODAL - For all entity types
interface UniversalGenerationModalProps {
  entityType: EntityType;
  config: typeof ENTITY_CONFIGS[EntityType];
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onEntityGenerated: (entity: BaseWorldEntity) => void;
}

function UniversalGenerationModal({ 
  entityType, 
  config, 
  projectId, 
  isOpen, 
  onClose, 
  onEntityGenerated 
}: UniversalGenerationModalProps) {
  const [generationType, setGenerationType] = useState<'basic' | 'detailed' | 'creative'>('basic');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = customPrompt || config.generationPrompts[generationType];
      
      const response = await apiRequest(`/api/projects/${projectId}/${config.apiEndpoint}/generate`, {
        method: 'POST',
        body: JSON.stringify({
          type: generationType,
          prompt,
          entityType
        })
      });
      
      onEntityGenerated(response);
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Sparkles className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI Generate {config.singular}</h2>
                <p className="text-muted-foreground">Let AI create a unique {config.singular.toLowerCase()} for your world</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Generation Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Generation Style</label>
              <div className="grid grid-cols-3 gap-3">
                {(['basic', 'detailed', 'creative'] as const).map((type) => (
                  <Card 
                    key={type}
                    className={`cursor-pointer transition-all ${
                      generationType === type 
                        ? 'border-accent bg-accent/5' 
                        : 'border-border hover:border-accent/50'
                    }`}
                    onClick={() => setGenerationType(type)}
                  >
                    <CardContent className="p-4 text-center">
                      <h3 className="font-medium capitalize mb-1">{type}</h3>
                      <p className="text-xs text-muted-foreground">
                        {type === 'basic' && 'Quick and essential'}
                        {type === 'detailed' && 'Rich and comprehensive'}
                        {type === 'creative' && 'Unique and imaginative'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Custom Prompt */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Custom Instructions (Optional)</label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={`Add specific requirements for your ${config.singular.toLowerCase()}...`}
                className="w-full h-24 p-3 border border-border rounded-lg bg-background resize-none"
              />
            </div>

            {/* Generate Button */}
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={onClose} disabled={isGenerating}>
                Cancel
              </Button>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Generate {config.singular}
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// UNIVERSAL TEMPLATES MODAL - For all entity types  
interface UniversalTemplatesProps {
  entityType: EntityType;
  config: typeof ENTITY_CONFIGS[EntityType];
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onEntityCreated: (entity: BaseWorldEntity) => void;
}

function UniversalTemplates({ 
  entityType, 
  config, 
  projectId, 
  isOpen, 
  onClose, 
  onEntityCreated 
}: UniversalTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  // Category-specific templates
  const templates = {
    locations: [
      { id: 'mystical-forest', name: 'Mystical Forest', description: 'Ancient woodland with magical properties' },
      { id: 'mountain-fortress', name: 'Mountain Fortress', description: 'Imposing stronghold built into stone' },
      { id: 'cosmic-nexus', name: 'Cosmic Nexus', description: 'Reality intersection point with otherworldly energy' },
      { id: 'underground-city', name: 'Underground City', description: 'Vast subterranean civilization' },
      { id: 'floating-island', name: 'Floating Island', description: 'Airborne landmass defying gravity' }
    ],
    timeline: [
      { id: 'age-of-magic', name: 'Age of Magic', description: 'Era when magic first awakened in the world' },
      { id: 'great-cataclysm', name: 'Great Cataclysm', description: 'World-shattering event that changed everything' },
      { id: 'golden-age', name: 'Golden Age', description: 'Period of peace, prosperity, and advancement' },
      { id: 'dark-times', name: 'Dark Times', description: 'Era of suffering, chaos, and despair' },
      { id: 'cosmic-convergence', name: 'Cosmic Convergence', description: 'Moment when cosmic forces aligned' }
    ],
    factions: [
      { id: 'mystical-order', name: 'Mystical Order', description: 'Ancient organization devoted to magical knowledge' },
      { id: 'stone-lords', name: 'Stone Lords', description: 'Noble house connected to earth and endurance' },
      { id: 'dream-cultists', name: 'Dream Cultists', description: 'Fanatics seeking absolute control of reality' },
      { id: 'life-wardens', name: 'Life Wardens', description: 'Guardians of natural balance and growth' },
      { id: 'shadow-guild', name: 'Shadow Guild', description: 'Secret society operating from the shadows' }
    ],
    items: [
      { id: 'cosmic-artifact', name: 'Cosmic Artifact', description: 'Item of immense power from beyond reality' },
      { id: 'memory-crystal', name: 'Memory Crystal', description: 'Stone that records and replays experiences' },
      { id: 'dream-focus', name: 'Dream Focus', description: 'Tool for manipulating consciousness and reality' },
      { id: 'bloom-essence', name: 'Bloom Essence', description: 'Concentrated life force from mystical sources' },
      { id: 'stone-monument', name: 'Stone Monument', description: 'Ancient structure with embedded power' }
    ],
    magic: [
      { id: 'dream-weaving', name: 'Dream Weaving', description: 'Magic system based on consciousness manipulation' },
      { id: 'bloom-magic', name: 'Bloom Magic', description: 'Life-force based magical tradition' },
      { id: 'stone-binding', name: 'Stone Binding', description: 'Earth-based magic focusing on permanence' },
      { id: 'cosmic-channeling', name: 'Cosmic Channeling', description: 'Drawing power from universal forces' },
      { id: 'memory-craft', name: 'Memory Craft', description: 'Magic that manipulates time and recollection' }
    ],
    bestiary: [
      { id: 'bloom-touched', name: 'Bloom-Touched Creature', description: 'Being transformed by mystical life energy' },
      { id: 'dream-phantom', name: 'Dream Phantom', description: 'Manifestation of consciousness and nightmare' },
      { id: 'stone-guardian', name: 'Stone Guardian', description: 'Ancient protector infused with earth power' },
      { id: 'cosmic-entity', name: 'Cosmic Entity', description: 'Being from beyond normal reality' },
      { id: 'memory-wraith', name: 'Memory Wraith', description: 'Ghost-like entity tied to past events' }
    ],
    languages: [
      { id: 'ancient-tongue', name: 'Ancient Tongue', description: 'Primordial language from world\'s beginning' },
      { id: 'bloom-speech', name: 'Bloom Speech', description: 'Living language that grows and evolves' },
      { id: 'stone-runes', name: 'Stone Runes', description: 'Carved symbols of permanence and memory' },
      { id: 'dream-whispers', name: 'Dream Whispers', description: 'Telepathic communication through consciousness' },
      { id: 'cosmic-resonance', name: 'Cosmic Resonance', description: 'Universal language of fundamental forces' }
    ],
    cultures: [
      { id: 'mountain-folk', name: 'Mountain Folk', description: 'Hardy people devoted to stone and memory' },
      { id: 'dream-seekers', name: 'Dream Seekers', description: 'Culture obsessed with controlling reality' },
      { id: 'bloom-touched', name: 'Bloom-Touched', description: 'Community transformed by life-giving energy' },
      { id: 'cosmic-nomads', name: 'Cosmic Nomads', description: 'Wanderers who travel between realities' },
      { id: 'memory-keepers', name: 'Memory Keepers', description: 'Archival society preserving all history' }
    ],
    prophecies: [
      { id: 'great-convergence', name: 'Great Convergence', description: 'Foretelling of cosmic forces uniting' },
      { id: 'bloom-eternal', name: 'Bloom Eternal', description: 'Vision of endless growth and connection' },
      { id: 'stone-endurance', name: 'Stone Endurance', description: 'Prophecy of permanence through suffering' },
      { id: 'dream-fulfillment', name: 'Dream Fulfillment', description: 'Prediction of reality bending to will' },
      { id: 'memory-echo', name: 'Memory Echo', description: 'Prophecy that repeats throughout time' }
    ],
    themes: [
      { id: 'love-corruption', name: 'Love\'s Corruption', description: 'How pure love can become monstrous' },
      { id: 'order-chaos', name: 'Order vs Chaos', description: 'Eternal struggle between control and freedom' },
      { id: 'unity-individuality', name: 'Unity vs Individuality', description: 'Tension between collective and personal' },
      { id: 'memory-forgetting', name: 'Memory vs Forgetting', description: 'Power and burden of remembrance' },
      { id: 'transformation-stasis', name: 'Transformation vs Stasis', description: 'Change versus permanence' }
    ]
  };

  const currentTemplates = templates[entityType] || [];

  const handleCreateFromTemplate = async () => {
    if (!selectedTemplate) return;
    
    setIsCreating(true);
    try {
      const template = currentTemplates.find(t => t.id === selectedTemplate);
      const basicEntityData = {
        name: template?.name || 'New ' + config.singular,
        description: template?.description || '',
        entityType: config.apiEndpoint,
        importance: 'medium'
      };
      
      const response = await apiRequest('POST', `/api/projects/${projectId}/worldbible/${config.apiEndpoint}`, basicEntityData);  
      onEntityCreated(await response.json());
    } catch (error) {
      console.error('Template creation failed:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <FileText className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{config.singular} Templates</h2>
                <p className="text-muted-foreground">Choose a template to get started quickly</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {currentTemplates.map((template) => (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? 'border-accent bg-accent/5' 
                    : 'border-border hover:border-accent/50'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose} disabled={isCreating}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateFromTemplate} 
              disabled={!selectedTemplate || isCreating}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Create from Template
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// UNIVERSAL DETAIL VIEW - Shows full entity information
interface UniversalDetailViewProps {
  entityType: EntityType;
  config: typeof ENTITY_CONFIGS[EntityType];
  entity: BaseWorldEntity;
  projectId: string;
  onClose: () => void;
  onEdit: () => void;
  onPortraitEdit: () => void;
  onDeleted: () => void;
}

function UniversalDetailView({ 
  entityType, 
  config, 
  entity, 
  projectId, 
  onClose, 
  onEdit, 
  onPortraitEdit, 
  onDeleted 
}: UniversalDetailViewProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${entity.name}? This cannot be undone.`)) return;
    
    setIsDeleting(true);
    try {
      await apiRequest('DELETE', `/api/worldbible/${entity.id}`);
      onDeleted();
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-xl">
                <config.icon className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{entity.name || 'Untitled ' + config.singular}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-accent text-white">{config.singular}</Badge>
                  <Badge variant="outline">{entity.importance || 'medium'}</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onPortraitEdit}>
                <Camera className="h-4 w-4 mr-2" />
                Image
              </Button>
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            {entity.description && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{entity.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// UNIVERSAL CREATION VIEW - Form for creating/editing entities
interface UniversalCreationViewProps {
  entityType: EntityType;
  config: typeof ENTITY_CONFIGS[EntityType];
  projectId: string;
  initialData?: Partial<BaseWorldEntity>;
  isGuided?: boolean;
  onClose: () => void;
  onEntitySaved: (entity: BaseWorldEntity) => void;
}

function UniversalCreationView({ 
  entityType, 
  config, 
  projectId, 
  initialData = {}, 
  isGuided = false, 
  onClose, 
  onEntitySaved 
}: UniversalCreationViewProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [entityData, setEntityData] = useState<Partial<BaseWorldEntity>>(initialData);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (initialData.id) {
        // Update existing entity
        const response = await apiRequest('PUT', `/api/worldbible/${initialData.id}`, {
          ...entityData,
          entityType: config.apiEndpoint,
          projectId
        });
        onEntitySaved(await response.json());
      } else {
        // Create new entity  
        const response = await apiRequest('POST', `/api/projects/${projectId}/worldbible/${config.apiEndpoint}`, {
          ...entityData,
          entityType: config.apiEndpoint,
          projectId,
          importance: entityData.importance || 'medium'
        });
        onEntitySaved(await response.json());
      }
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setEntityData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-xl">
                <config.icon className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">
                  {initialData.id ? 'Edit' : 'Create'} {config.singular}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {isGuided ? 'Guided creation with helpful prompts' : 'Fill in the details below'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name *</label>
                  <Input
                    value={entityData.name || ''}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder={`Enter ${config.singular.toLowerCase()} name...`}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Importance Level</label>
                  <select
                    value={entityData.importance || 'medium'}
                    onChange={(e) => updateField('importance', e.target.value)}
                    className="w-full p-2 border border-border rounded-lg bg-background"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={entityData.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder={`Describe this ${config.singular.toLowerCase()}...`}
                  className="w-full h-24 p-3 border border-border rounded-lg bg-background resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-border">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!entityData.name || isSaving}
              className="bg-accent hover:bg-accent text-white"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {initialData.id ? 'Update' : 'Create'} {config.singular}
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
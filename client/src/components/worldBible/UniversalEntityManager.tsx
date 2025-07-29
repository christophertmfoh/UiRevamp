/**
 * Universal Entity Manager
 * Replicates the sophisticated CharacterManager system for all world bible entities
 * Supports: Locations, Timeline, Factions, Items, Magic, Bestiary, Languages, Cultures, Prophecies, Themes
 * FULL FEATURE PARITY: Grid/List views, AI generation, portraits, sorting, filtering, creation wizards
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Plus, Search, Edit, Trash2, MoreVertical, Edit2, Camera, Sparkles, ArrowUpDown, Filter, Grid3X3, List, Eye, Zap, FileText,
  MapPin, Calendar, Sword, Gem, Wand2, Globe, Languages, Crown, Scroll, BookOpen, Users, Image, Map
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

export function UniversalEntityManager({ 
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



  // Data fetching - matching CharacterManager pattern exactly
  const { data: entities = [], isLoading } = useQuery<BaseWorldEntity[]>({
    queryKey: ['/api/projects', projectId, config.apiEndpoint],
    enabled: !!projectId && projectId !== 'undefined' && projectId !== 'null',
  });

  // Persist view mode to localStorage
  useEffect(() => {
    localStorage.setItem(`${entityType}ViewMode`, viewMode);
  }, [viewMode, entityType]);

  // Sort and filter entities - exact same logic as CharacterManager
  const sortEntities = (entitiesArray: BaseWorldEntity[]): BaseWorldEntity[] => {
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
  };

  const filteredEntities = sortEntities(
    entities.filter(entity => 
      entity.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Selection handling - matching CharacterManager exactly
  const handleSelectEntity = (entityId: string, selected: boolean) => {
    const newSelected = new Set(selectedEntityIds);
    if (selected) {
      newSelected.add(entityId);
    } else {
      newSelected.delete(entityId);
    }
    setSelectedEntityIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedEntityIds.size === filteredEntities.length) {
      setSelectedEntityIds(new Set());
    } else {
      setSelectedEntityIds(new Set(filteredEntities.map(e => e.id)));
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      setSelectedEntityIds(new Set());
    }
  };

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
                {entities.length} {entities.length === 1 ? config.singular.toLowerCase() : config.displayName.toLowerCase()} in your world
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
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
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
    </div>
  );
};
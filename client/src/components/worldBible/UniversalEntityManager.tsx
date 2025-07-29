/**
 * Universal Entity Manager
 * Replicates the sophisticated CharacterManager system for all world bible entities
 * Supports: Locations, Timeline, Factions, Items, Magic, Bestiary, Languages, Cultures, Prophecies, Themes
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Search, Edit, Trash2, MoreVertical, Edit2, Camera, Sparkles, ArrowUpDown, Filter, Grid3X3, List, Eye, Zap, FileText } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { WorldBibleEntity, WorldBibleCategory } from '@/lib/worldBibleTypes';
import { UniversalEntityDetail } from './UniversalEntityDetail';
import { UniversalCreationLaunch } from './UniversalCreationLaunch';
import { UniversalPortraitModal } from './UniversalPortraitModal';

// Entity configuration for each world bible category
const ENTITY_CONFIGS = {
  locations: {
    displayName: 'Locations',
    singular: 'Location',
    icon: '🗺️',
    createPrompt: 'Create New Location',
    emptyMessage: 'No locations created yet',
    fields: ['name', 'locationType', 'geography', 'population', 'culture'],
    sortOptions: [
      'alphabetical',
      'recently-added', 
      'recently-edited',
      'by-type',
      'by-size',
      'by-importance',
      'by-population'
    ]
  },
  timeline: {
    displayName: 'Timeline',
    singular: 'Event',
    icon: '📅',
    createPrompt: 'Create New Event',
    emptyMessage: 'No timeline events created yet',
    fields: ['name', 'date', 'eventType', 'magnitude', 'summary'],
    sortOptions: [
      'chronological',
      'reverse-chronological',
      'by-importance',
      'by-type',
      'by-magnitude',
      'recently-added'
    ]
  },
  factions: {
    displayName: 'Factions',
    singular: 'Faction',
    icon: '⚔️',
    createPrompt: 'Create New Faction',
    emptyMessage: 'No factions created yet',
    fields: ['name', 'factionType', 'structure', 'size', 'leader'],
    sortOptions: [
      'alphabetical',
      'by-power',
      'by-size',
      'by-type',
      'recently-added',
      'by-influence'
    ]
  },
  items: {
    displayName: 'Items & Artifacts',
    singular: 'Item',
    icon: '⚔️',
    createPrompt: 'Create New Item',
    emptyMessage: 'No items created yet',
    fields: ['name', 'itemType', 'rarity', 'magical', 'currentOwner'],
    sortOptions: [
      'alphabetical',
      'by-rarity',
      'by-type',
      'by-value',
      'magical-first',
      'recently-added'
    ]
  },
  magic: {
    displayName: 'Magic & Lore',
    singular: 'Magic System',  
    icon: '✨',
    createPrompt: 'Create New Magic System',
    emptyMessage: 'No magic systems created yet',
    fields: ['name', 'systemType', 'source', 'acceptance', 'practitioners'],
    sortOptions: [
      'alphabetical',
      'by-type',
      'by-power',
      'by-acceptance',
      'recently-added'
    ]
  },
  bestiary: {
    displayName: 'Bestiary',
    singular: 'Creature',
    icon: '🐉',
    createPrompt: 'Create New Creature',
    emptyMessage: 'No creatures created yet',
    fields: ['name', 'species', 'category', 'size', 'intelligence'],
    sortOptions: [
      'alphabetical',
      'by-category',
      'by-size',
      'by-intelligence',
      'by-threat-level',
      'recently-added'
    ]
  },
  languages: {
    displayName: 'Languages',
    singular: 'Language',
    icon: '📖',
    createPrompt: 'Create New Language',
    emptyMessage: 'No languages created yet',
    fields: ['name', 'language_type', 'complexity', 'native_speakers', 'vitality'],
    sortOptions: [
      'alphabetical',
      'by-speakers',
      'by-complexity',
      'by-vitality',
      'recently-added'
    ]
  },
  cultures: {
    displayName: 'Cultures',
    singular: 'Culture',
    icon: '🏛️',
    createPrompt: 'Create New Culture',
    emptyMessage: 'No cultures created yet',
    fields: ['name', 'culture_type', 'population_size', 'technology_level', 'government_type'],
    sortOptions: [
      'alphabetical',
      'by-population',
      'by-technology',
      'by-type',
      'recently-added'
    ]
  },
  prophecies: {
    displayName: 'Prophecies',
    singular: 'Prophecy',
    icon: '🔮',
    createPrompt: 'Create New Prophecy',
    emptyMessage: 'No prophecies created yet',
    fields: ['name', 'prophecy_type', 'scope', 'fulfillment_status', 'clarity'],
    sortOptions: [
      'alphabetical',
      'by-scope',
      'by-fulfillment',
      'by-clarity',
      'recently-added'
    ]
  },
  themes: {
    displayName: 'Themes & Meta',
    singular: 'Theme',
    icon: '🎭',
    createPrompt: 'Create New Theme',
    emptyMessage: 'No themes created yet',
    fields: ['name', 'theme_type', 'narrative_level', 'central_idea', 'emotional_core'],
    sortOptions: [
      'alphabetical',
      'by-type',
      'by-level',
      'by-importance',
      'recently-added'
    ]
  }
};

interface UniversalEntityManagerProps {
  projectId: string;
  category: WorldBibleCategory;
  selectedEntityId?: string | null;
  onClearSelection?: () => void;
}

type ViewMode = 'grid' | 'list';

export function UniversalEntityManager({ 
  projectId, 
  category,
  selectedEntityId, 
  onClearSelection 
}: UniversalEntityManagerProps) {
  const config = ENTITY_CONFIGS[category];
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState(config.sortOptions[0]);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem(`${category}ViewMode`);
    return (saved as ViewMode) || 'grid';
  });
  
  const [selectedEntity, setSelectedEntity] = useState<WorldBibleEntity | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isGuidedCreation, setIsGuidedCreation] = useState(false);
  const [portraitEntity, setPortraitEntity] = useState<WorldBibleEntity | null>(null);
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isCreationLaunchOpen, setIsCreationLaunchOpen] = useState(false);
  const [isDocumentUploadOpen, setIsDocumentUploadOpen] = useState(false);
  const [newEntityData, setNewEntityData] = useState<Partial<WorldBibleEntity>>({});
  const [selectedEntityIds, setSelectedEntityIds] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  
  const queryClient = useQueryClient();

  // Fetch entities for this category
  const { data: entities = [], isLoading } = useQuery<WorldBibleEntity[]>({
    queryKey: ['/api/projects', projectId, category],
    enabled: !!projectId && projectId !== 'undefined' && projectId !== 'null',
  });

  // Auto-select entity if selectedEntityId is provided
  useEffect(() => {
    if (selectedEntityId && entities.length > 0) {
      const entity = entities.find(e => e.id === selectedEntityId);
      if (entity) {
        setSelectedEntity(entity);
        setIsCreating(false);
        onClearSelection?.();
      }
    }
  }, [selectedEntityId, entities, onClearSelection]);

  // Persist view mode to localStorage
  useEffect(() => {
    localStorage.setItem(`${category}ViewMode`, viewMode);
  }, [viewMode, category]);

  // CRUD mutations
  const deleteMutation = useMutation({
    mutationFn: (entityId: string) => 
      apiRequest('DELETE', `/api/${category}/${entityId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, category] });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (entityIds: string[]) => {
      await Promise.all(
        entityIds.map(id => apiRequest('DELETE', `/api/${category}/${id}`))
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, category] });
      setSelectedEntityIds(new Set());
      setIsSelectionMode(false);
    },
  });

  const updateEntityMutation = useMutation({
    mutationFn: (entity: WorldBibleEntity) => 
      apiRequest('PUT', `/api/${category}/${entity.id}`, entity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, category] });
    },
  });

  const createEntityMutation = useMutation({
    mutationFn: async (entity: Partial<WorldBibleEntity>) => {
      console.log(`Creating ${category} with data:`, entity);
      const response = await apiRequest('POST', `/api/projects/${projectId}/${category}`, entity);
      return await response.json();
    },
    onSuccess: (newEntity: WorldBibleEntity) => {
      console.log(`${config.singular} created successfully:`, newEntity);
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, category] });
      setSelectedEntity(newEntity);
      setIsCreating(false);
    },
  });

  // Filter and sort entities
  const filteredAndSortedEntities = useCallback(() => {
    let filtered = entities.filter(entity =>
      entity.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply sorting based on category-specific logic
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return (a.name || '').localeCompare(b.name || '');
        case 'recently-added':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'recently-edited':
          const aDate = a.updatedAt || a.createdAt;
          const bDate = b.updatedAt || b.createdAt;
          return new Date(bDate).getTime() - new Date(aDate).getTime();
        case 'by-importance':
          const importanceOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
          return (importanceOrder[b.importance] || 0) - (importanceOrder[a.importance] || 0);
        default:
          return (a.name || '').localeCompare(b.name || '');
      }
    });

    return filtered;
  }, [entities, searchQuery, sortBy]);

  // Calculate completion percentage for an entity
  const calculateCompletion = useCallback((entity: WorldBibleEntity) => {
    const relevantFields = config.fields;
    const filledFields = relevantFields.filter(field => {
      const value = (entity as any)[field];
      return value && (typeof value === 'string' ? value.trim().length > 0 : true);
    }).length;
    return Math.round((filledFields / relevantFields.length) * 100);
  }, [config.fields]);

  // Handle creation flow
  const handleCreateEntity = () => {
    setIsCreationLaunchOpen(true);
  };

  const handleCreateBlank = () => {
    setIsCreating(true);
    setIsGuidedCreation(false);
    setSelectedEntity(null);
    setNewEntityData({
      projectId,
      name: '',
      description: '',
      importance: 'medium',
      status: 'draft'
    });
  };

  const handleEdit = (entity: WorldBibleEntity) => {
    setSelectedEntity(entity);
    setIsCreating(false);
  };

  const handleDelete = (entity: WorldBibleEntity) => {
    if (confirm(`Are you sure you want to delete "${entity.name}"?`)) {
      deleteMutation.mutate(entity.id);
    }
  };

  const handlePortraitClick = (entity: WorldBibleEntity) => {
    setPortraitEntity(entity);
    setIsPortraitModalOpen(true);
  };

  // Show entity detail if one is selected
  if (selectedEntity || isCreating) {
    return (
      <UniversalEntityDetail
        projectId={projectId}
        category={category}
        entity={selectedEntity}
        isCreating={isCreating}
        isGuidedCreation={isGuidedCreation}
        onBack={() => {
          setSelectedEntity(null);
          setIsCreating(false);
          setIsGuidedCreation(false);
          setNewEntityData({});
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{config.icon}</span>
          <div>
            <h2 className="text-2xl font-bold">{config.displayName}</h2>
            <p className="text-muted-foreground">
              {entities.length} {entities.length === 1 ? config.singular.toLowerCase() : config.displayName.toLowerCase()}
            </p>
          </div>
        </div>
        
        <Button onClick={handleCreateEntity} className="gap-2">
          <Plus className="w-4 h-4" />
          {config.createPrompt}
        </Button>
      </div>

      {/* Search and Controls */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={`Search ${config.displayName.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <ArrowUpDown className="w-4 h-4" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {config.sortOptions.map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => setSortBy(option)}
                className={sortBy === option ? 'bg-accent' : ''}
              >
                {option.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex border rounded-lg">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="rounded-r-none"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="rounded-l-none"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Entity Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAndSortedEntities().length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">{config.icon}</div>
          <h3 className="text-lg font-semibold mb-2">{config.emptyMessage}</h3>
          <p className="text-muted-foreground mb-6">
            Get started by creating your first {config.singular.toLowerCase()}.
          </p>
          <Button onClick={handleCreateEntity}>
            <Plus className="w-4 h-4 mr-2" />
            {config.createPrompt}
          </Button>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "space-y-2"
        }>
          {filteredAndSortedEntities().map((entity) => (
            <Card 
              key={entity.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleEdit(entity)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold truncate">{entity.name || 'Unnamed'}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(entity);
                      }}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handlePortraitClick(entity);
                      }}>
                        <Camera className="w-4 h-4 mr-2" />
                        Manage Images
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(entity);
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {entity.description || 'No description'}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {entity.importance}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {entity.status}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {calculateCompletion(entity)}% complete
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <UniversalCreationLaunch
        category={category}
        isOpen={isCreationLaunchOpen}
        onClose={() => setIsCreationLaunchOpen(false)}
        onCreateBlank={handleCreateBlank}
        onOpenTemplates={() => setIsTemplateModalOpen(true)}
        onOpenAIGeneration={() => setIsGenerationModalOpen(true)}
        onOpenDocumentUpload={() => setIsDocumentUploadOpen(true)}
      />

      {portraitEntity && (
        <UniversalPortraitModal
          entity={portraitEntity}
          category={category}
          isOpen={isPortraitModalOpen}
          onClose={() => {
            setIsPortraitModalOpen(false);
            setPortraitEntity(null);
          }}
          onImageGenerated={(imageUrl) => {
            // Handle image generation completion
            console.log('Image generated:', imageUrl);
          }}
          onImageUploaded={(imageUrl) => {
            // Handle image upload completion
            console.log('Image uploaded:', imageUrl);
          }}
        />
      )}
    </div>
  );
}
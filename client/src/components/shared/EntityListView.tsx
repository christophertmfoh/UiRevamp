import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Users, Search, Edit, Trash2, MoreVertical, Edit2, Camera, Sparkles, ArrowUpDown, Filter, Grid3X3, List, Eye, Zap, FileText } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { handleEntityError, showErrorToast, showSuccessToast } from '@/lib/utils/errorHandling';
import type { Character, Project } from '@/lib/types';
import { CharacterDetailView } from '../character/CharacterDetailView';
import { 
  CharacterPortraitModal, 
  CharacterGenerationModal, 
  CharacterTemplates, 
  CharacterCreationLaunch,
  type CharacterGenerationOptions 
} from '../character/shared/ComponentIndex';
import { generateContextualCharacter } from '@/lib/services/characterGeneration';

interface EntityListViewProps {
  entityType: string;
  projectId?: string;
}

type SortOption = 'alphabetical' | 'recently-added' | 'recently-edited';
type ViewMode = 'grid' | 'list';

export function EntityListView({ entityType, projectId: propProjectId }: EntityListViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);

  // Get dynamic project ID from props or use placeholder
  const projectId = propProjectId || "1753290240799"; // Default to first project for now

  // Create dynamic titles
  const capitalizedEntityType = entityType.charAt(0).toUpperCase() + entityType.slice(1);
  const pluralEntityType = entityType.endsWith('s') ? entityType : `${entityType}s`;
  const dynamicTitle = capitalizedEntityType + (entityType.endsWith('s') ? '' : 's');

  // Storage keys for persistence
  const getViewStorageKey = () => `storyWeaver_viewMode_${entityType}Manager_${projectId}`;
  const getSortStorageKey = () => `storyWeaver_sortBy_${entityType}Manager_${projectId}`;

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
  const [isCreating, setIsCreating] = useState(false);
  const [isGuidedCreation, setIsGuidedCreation] = useState(false);
  const [portraitEntity, setPortraitEntity] = useState<any | null>(null);
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isCreationLaunchOpen, setIsCreationLaunchOpen] = useState(false);
  const [newEntityData, setNewEntityData] = useState<Partial<any>>({});
  const queryClient = useQueryClient();

  // Dynamic data fetching based on entityType
  const { data: entities = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/projects', projectId, pluralEntityType],
  });

  const { data: project } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
  });

  // Auto-select entity if selectedEntityId is provided
  useEffect(() => {
    if (entities.length > 0) {
      // Auto-selection logic can be added here if needed
    }
  }, [entities]);

  const deleteMutation = useMutation({
    mutationFn: (entityId: string) => 
      apiRequest('DELETE', `/api/${pluralEntityType}/${entityId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, pluralEntityType] });
      showSuccessToast(`${capitalizedEntityType} deleted successfully`);
    },
    onError: (error) => {
      const entityError = handleEntityError(error, 'delete', entityType);
      showErrorToast(entityError, 'Delete Failed');
    }
  });

  const updateEntityMutation = useMutation({
    mutationFn: (entity: any) => 
      apiRequest('PUT', `/api/${pluralEntityType}/${entity.id}`, entity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, pluralEntityType] });
      showSuccessToast(`${capitalizedEntityType} updated successfully`);
    },
    onError: (error) => {
      const entityError = handleEntityError(error, 'update', entityType);
      showErrorToast(entityError, 'Update Failed');
    }
  });

  const createEntityMutation = useMutation({
    mutationFn: async (entity: Partial<any>) => {
      console.log(`Mutation: Creating ${entityType} with data:`, entity);
      const response = await apiRequest('POST', `/api/projects/${projectId}/${pluralEntityType}`, entity);
      console.log('Mutation: Received response:', response);
      const result = await response.json();
      console.log('Mutation: Parsed JSON:', result);
      return result;
    },
    onSuccess: (newEntity: any) => {
      console.log(`${capitalizedEntityType} created successfully, setting as selected:`, newEntity);
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, pluralEntityType] });
      setSelectedEntity(newEntity);
      setIsCreating(false);
    },
    onError: (error) => {
      console.error(`Failed to create ${entityType}:`, error);
      const entityError = handleEntityError(error, 'create', entityType);
      showErrorToast(entityError, 'Create Failed');
    }
  });

  // Sort and filter entities
  const sortEntities = (ents: any[]): any[] => {
    switch (sortBy) {
      case 'alphabetical':
        return [...ents].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'recently-added':
        return [...ents].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      case 'recently-edited':
        return [...ents].sort((a, b) => new Date((b as any).updatedAt || b.createdAt || 0).getTime() - new Date((a as any).updatedAt || a.createdAt || 0).getTime());
      default:
        return ents;
    }
  };

  const filteredEntities = sortEntities(
    entities.filter(entity => 
      entity.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.race?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleEdit = (entity: any) => {
    setSelectedEntity(entity);
    setIsCreating(false);
    setIsGuidedCreation(false);
  };

  const handleDelete = (entity: any) => {
    if (confirm(`Are you sure you want to delete ${entity.name}?`)) {
      deleteMutation.mutate(entity.id, {
        onSuccess: () => {
          setSelectedEntity(null);
          setIsCreating(false);
        }
      });
    }
  };

  const handleCreateNew = () => {
    setIsCreationLaunchOpen(false);
    setIsCreating(true);
    setIsGuidedCreation(true);
    setSelectedEntity(null);
  };

  const handleOpenGenerationModal = () => {
    setIsGenerationModalOpen(true);
  };



  const handleSelectTemplate = async (template: any) => {
    // Use AI to generate a comprehensive character based on the template
    setIsGenerating(true);
    
    try {
      // Create a comprehensive prompt using all template information
      const templatePrompt = `Create a detailed character based on the ${template.name} archetype. 
      
Template Details:
- Category: ${template.category}
- Description: ${template.description}
- Tags: ${template.tags.join(', ')}

Base Template Fields:
${Object.entries(template.fields).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('\n')}

Generate a complete, detailed character that expands on these template foundations while maintaining the core archetype essence.`;

      const generationOptions = {
        characterType: template.category,
        role: template.fields.role || 'Character',
        customPrompt: templatePrompt,
        personality: Array.isArray(template.fields.personalityTraits) ? template.fields.personalityTraits.join(', ') : template.fields.personalityTraits || '',
        archetype: template.fields.archetype || template.name.toLowerCase().replace(/\s+/g, '-')
      };

      console.log('Generating character from template with options:', generationOptions);
      
      const response = await fetch(`/api/projects/${projectId}/characters/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generationOptions)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to generate character');
      }
      
      const generatedCharacter = await response.json();
      console.log('Generated character from template:', generatedCharacter);

      // Merge template fields with generated character for comprehensive result
      const characterFromTemplate = {
        ...generatedCharacter,
        ...template.fields, // Keep template structure as foundation
        name: generatedCharacter.name || `New ${template.name}`,
        projectId: projectId
      };
      
      const createdCharacter = await createEntityMutation.mutateAsync(characterFromTemplate);
      console.log('Template-based character creation completed:', createdCharacter);
      
      setSelectedEntity(createdCharacter);
      setIsCreating(false);
      setIsTemplateModalOpen(false);
    } catch (error) {
      console.error('Failed to generate character from template:', error);
      // Fallback to basic template creation
      const characterFromTemplate = {
        name: `New ${template.name}`,
        ...template.fields,
        projectId: projectId
      };
      
      setNewEntityData(characterFromTemplate);
      setIsCreating(true);
      setIsTemplateModalOpen(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCharacter = async (options: CharacterGenerationOptions) => {
    if (!project) return;
    
    setIsGenerating(true);
    try {
      console.log('Starting server-side character generation with options:', options);
      
      const response = await fetch(`/api/projects/${projectId}/characters/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to generate character');
      }
      
      const generatedCharacter = await response.json();
      console.log('Generated character data:', generatedCharacter);
      
      const characterToCreate = {
        ...generatedCharacter,
        projectId,
        name: generatedCharacter.name || `Generated ${options.characterType || 'Character'}`
      };
      
      console.log('Creating character with data:', characterToCreate);
      
      const createdCharacter = await createEntityMutation.mutateAsync(characterToCreate);
      console.log('Character creation completed, created character:', createdCharacter);
      
      setSelectedEntity(createdCharacter);
      setIsCreating(false);
      setIsGenerationModalOpen(false);
    } catch (error) {
      console.error('Error generating character:', error);
      alert(`Failed to generate character: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToList = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, pluralEntityType] });
    setSelectedEntity(null);
    setIsCreating(false);
    setIsGuidedCreation(false);
  };

  const handlePortraitClick = (entity: any, event: React.MouseEvent) => {
    event.stopPropagation();
    setPortraitEntity(entity);
    setIsPortraitModalOpen(true);
  };

  const handleImageGenerated = (imageUrl: string) => {
    if (portraitEntity) {
      updateEntityMutation.mutate({ 
        ...portraitEntity, 
        imageUrl,
        portraits: portraitEntity.portraits || []
      });
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    if (portraitEntity) {
      updateEntityMutation.mutate({ 
        ...portraitEntity, 
        imageUrl,
        portraits: portraitEntity.portraits || []
      });
    }
  };

  // Character detail view - only show for characters
  if ((selectedEntity || isCreating) && entityType === 'character') {
    return (
      <CharacterDetailView
        projectId={projectId}
        character={selectedEntity}
        isCreating={isCreating}
        isGuidedCreation={isGuidedCreation}
        onBack={handleBackToList}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  // Generic entity detail view for non-characters
  if (selectedEntity || isCreating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button onClick={handleBackToList} variant="outline">
            ← Back to {dynamicTitle}
          </Button>
          <h1 className="font-title text-2xl">
            {isCreating ? `Create New ${capitalizedEntityType}` : selectedEntity?.name || 'Entity Details'}
          </h1>
          <div></div>
        </div>
        <div className="text-center py-16">
          <h3 className="font-title text-xl mb-2">Entity Detail View</h3>
          <p className="text-muted-foreground mb-6">
            Detailed editing interface for {pluralEntityType} will be implemented here.
          </p>
          <Button onClick={handleBackToList} variant="outline">
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  // Character Card Component for Grid View (restored functionality)
  const EntityCard = ({ entity }: { entity: any }) => {
    // For characters, show rich card; for others, show simple card
    if (entityType === 'character') {
      const character = entity as Character;
      return (
        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] border border-border/30 hover:border-accent/50 bg-gradient-to-br from-background via-background/90 to-accent/5 overflow-hidden relative" 
              onClick={() => setSelectedEntity(character)}>
          <CardContent className="p-0 relative">
            {/* Character Image Header */}
            <div className="relative h-64 bg-gradient-to-br from-accent/5 via-muted/20 to-accent/10 overflow-hidden">
              {character.imageUrl ? (
                <>
                  <img 
                    src={character.imageUrl} 
                    alt={character.name}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                  />
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
              
              {/* Status Badge */}
              <div className="absolute bottom-4 left-4 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                <Badge className="bg-accent/90 text-accent-foreground backdrop-blur-sm border-0 shadow-lg font-medium">
                  {character.role || 'Character'}
                </Badge>
              </div>
            </div>

            {/* Character Info */}
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
                    <Badge variant="outline" className="text-xs bg-accent/5 border-accent/30 text-accent/80">
                      {character.race}
                    </Badge>
                  )}
                  {character.class && (
                    <Badge variant="outline" className="text-xs bg-accent/5 border-accent/30 text-accent/80">
                      {character.class}
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
            </div>
          </CardContent>
        </Card>
      );
    } else {
      // Simple card for non-characters
      return (
        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl border border-border/30 hover:border-accent/50 bg-background overflow-hidden" 
              onClick={() => setSelectedEntity(entity)}>
          <CardContent className="p-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">
                {entity.name || 'Unnamed Entity'}
              </h3>
              {entity.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {entity.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {capitalizedEntityType}
                </span>
                <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleEdit(entity); }}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }
  };

  // Simple List View Item
  const EntityListItem = ({ entity }: { entity: any }) => (
    <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg border border-border/30 hover:border-accent/50 bg-background" 
          onClick={() => setSelectedEntity(entity)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Character Avatar with Image Support */}
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center flex-shrink-0">
            {entityType === 'character' && entity.imageUrl ? (
              <img 
                src={entity.imageUrl} 
                alt={entity.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Users className="h-6 w-6 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg group-hover:text-accent transition-colors truncate">
              {entity.name || 'Unnamed Entity'}
            </h3>
            {entityType === 'character' && entity.title && (
              <p className="text-accent/80 text-sm font-medium truncate">
                "{entity.title}"
              </p>
            )}
            {entity.description && (
              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                {entity.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {capitalizedEntityType}
              </Badge>
              {entityType === 'character' && entity.role && (
                <Badge variant="outline" className="text-xs bg-accent/5 border-accent/30 text-accent/80">
                  {entity.role}
                </Badge>
              )}
              {entityType === 'character' && entity.race && (
                <Badge variant="outline" className="text-xs bg-accent/5 border-accent/30 text-accent/80">
                  {entity.race}
                </Badge>
              )}
              {entityType === 'character' && entity.class && (
                <Badge variant="outline" className="text-xs bg-accent/5 border-accent/30 text-accent/80">
                  {entity.class}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleEdit(entity); }}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Statistics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-title text-3xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {dynamicTitle}
            </h2>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-muted-foreground">
                {entities.length} {entities.length === 1 ? entityType : pluralEntityType} in your world
              </span>
              {entities.filter(entity => 
                entity.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                entity.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                entity.race?.toLowerCase().includes(searchQuery.toLowerCase())
              ).length !== entities.length && (
                <span className="text-sm text-accent">
                  ({entities.filter(entity => 
                    entity.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    entity.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    entity.race?.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length} visible)
                </span>
              )}
            </div>
          </div>
          
          {/* Primary Action */}
          <div className="flex gap-3">
            {entityType === 'character' ? (
              <Button 
                onClick={() => setIsCreationLaunchOpen(true)} 
                size="lg"
                className="bg-gradient-to-r from-accent via-accent/90 to-accent/80 hover:from-accent/95 hover:via-accent/85 hover:to-accent/75 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center">
                  <div className="p-1 bg-accent-foreground/10 rounded-full mr-3 group-hover:rotate-90 transition-transform duration-300">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span className="font-semibold tracking-wide">Create Character</span>
                </div>
              </Button>
            ) : (
              <Button 
                onClick={handleCreateNew} 
                size="lg"
                className="bg-gradient-to-r from-accent via-accent/90 to-accent/80 hover:from-accent/95 hover:via-accent/85 hover:to-accent/75 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center">
                  <div className="p-1 bg-accent-foreground/10 rounded-full mr-3 group-hover:rotate-90 transition-transform duration-300">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span className="font-semibold tracking-wide">Create {capitalizedEntityType}</span>
                </div>
              </Button>
            )}
          </div>
        </div>

        {/* Enhanced Controls Bar */}
        <div className="flex items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${pluralEntityType} by name, role, or race...`}
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

      {/* Characters Display */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
            <p className="text-muted-foreground">Loading {pluralEntityType}...</p>
          </div>
        </div>
      ) : filteredEntities.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <Users className="h-16 w-16 text-muted-foreground/50 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {entities.length === 0 ? `No ${pluralEntityType} yet` : `No ${pluralEntityType} match your search`}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {entities.length === 0 
                ? `Create your first ${entityType} to start building your story world.`
                : 'Try adjusting your search terms or filters.'
              }
            </p>
          </div>
          {entities.length === 0 && (
            <div className="flex gap-3 justify-center pt-4">
              <Button 
                onClick={() => setIsCreationLaunchOpen(true)} 
                size="lg"
                className="bg-gradient-to-r from-accent via-accent/90 to-accent/80 hover:from-accent/95 hover:via-accent/85 hover:to-accent/75 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center">
                  <div className="p-1 bg-accent-foreground/10 rounded-full mr-3 group-hover:rotate-90 transition-transform duration-300">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span className="font-semibold tracking-wide">Create First {capitalizedEntityType}</span>
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

      {/* Character Creation Modals (only for characters) */}
      {entityType === 'character' && (
        <>
          {/* Character Creation Launch Modal */}
          <CharacterCreationLaunch
            isOpen={isCreationLaunchOpen}
            onClose={() => setIsCreationLaunchOpen(false)}
            onCreateBlank={handleCreateNew}
            onOpenTemplates={() => setIsTemplateModalOpen(true)}
            onOpenAIGeneration={() => setIsGenerationModalOpen(true)}
          />

          {/* Character Generation Modal */}
          <CharacterGenerationModal
            isOpen={isGenerationModalOpen}
            onClose={() => setIsGenerationModalOpen(false)}
            onGenerate={handleGenerateCharacter}
            isGenerating={isGenerating}
          />

          {/* Character Templates Modal */}
          <CharacterTemplates
            isOpen={isTemplateModalOpen}
            onClose={() => setIsTemplateModalOpen(false)}
            onSelectTemplate={handleSelectTemplate}
            isGenerating={isGenerating}
          />
        </>
      )}

      {/* Simple Creation Modal for non-characters */}
      {entityType !== 'character' && isCreationLaunchOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Create New {capitalizedEntityType}</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Entity creation interface will be implemented here.
            </p>
            <div className="flex gap-3">
              <Button onClick={handleCreateNew} className="flex-1">
                Create Blank {capitalizedEntityType}
              </Button>
              <Button variant="outline" onClick={() => setIsCreationLaunchOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
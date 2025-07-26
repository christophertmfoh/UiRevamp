/**
 * Universal Entity Manager Template
 * Exact replica of CharacterManager with generic placeholders for all World Bible entity types
 * Includes: list/grid view, sorting, filtering, search, creation workflow, AI systems
 */

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Users, Search, Edit, Trash2, MoreVertical, Edit2, Camera, Sparkles, ArrowUpDown, Filter, Grid3X3, List, Eye, Zap, FileText } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Project } from '../../../lib/types';
import { UniversalEntityDetailView } from './UniversalEntityDetailView';
import { UniversalEntityPortraitModal } from './UniversalEntityPortraitModal';
import { UniversalEntityGenerationModal, type EntityGenerationOptions } from './UniversalEntityGenerationModal';
import { UniversalEntityTemplates } from './UniversalEntityTemplates';
import { UniversalEntityCreationLaunch } from './UniversalEntityCreationLaunch';
import { generateContextualEntity } from '../../../lib/services/entityGeneration';

interface UniversalEntityManagerProps {
  projectId: string;
  entityType: string; // 'factions' | 'items' | 'organizations' | etc.
  selectedEntityId?: string | null;
  onClearSelection?: () => void;
}

type SortOption = 'alphabetical' | 'recently-added' | 'recently-edited';
type ViewMode = 'grid' | 'list';

interface BaseEntity {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  projectId: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export function UniversalEntityManager({ 
  projectId, 
  entityType, 
  selectedEntityId, 
  onClearSelection 
}: UniversalEntityManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<BaseEntity | null>(null);

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
  const [portraitEntity, setPortraitEntity] = useState<BaseEntity | null>(null);
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isCreationLaunchOpen, setIsCreationLaunchOpen] = useState(false);
  const [newEntityData, setNewEntityData] = useState<Partial<BaseEntity>>({});
  const queryClient = useQueryClient();

  const { data: entities = [], isLoading } = useQuery<BaseEntity[]>({
    queryKey: ['/api/projects', projectId, entityType],
  });

  const { data: project } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (entityId: string) => {
      return await apiRequest('DELETE', `/api/${entityType}/${entityId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, entityType] });
      setSelectedEntity(null);
    },
  });

  // Calculate entity completeness (generic version)
  const calculateCompleteness = (entity: BaseEntity) => {
    const fields = ['name', 'description', 'imageUrl'];
    const filledFields = fields.filter(field => entity[field] && entity[field] !== '').length;
    return Math.min(100, Math.round((filledFields / fields.length) * 100));
  };

  // Filter and sort entities
  const filteredEntities = entities.filter(entity =>
    entity.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entity.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedEntities = [...filteredEntities].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return (a.name || '').localeCompare(b.name || '');
      case 'recently-added':
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      case 'recently-edited':
        return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
      default:
        return 0;
    }
  });

  // Handle entity selection
  useEffect(() => {
    if (selectedEntityId) {
      const entity = entities.find(e => e.id === selectedEntityId);
      if (entity) {
        setSelectedEntity(entity);
      }
    }
  }, [selectedEntityId, entities]);

  const handleEntitySelect = (entity: BaseEntity) => {
    setSelectedEntity(entity);
  };

  const handleClearSelection = () => {
    setSelectedEntity(null);
    onClearSelection?.();
  };

  const handleCreateFromTemplate = (templateData: Partial<BaseEntity>) => {
    setNewEntityData(templateData);
    setIsCreating(true);
    setIsTemplateModalOpen(false);
  };

  const handleGenerateEntity = async (options: EntityGenerationOptions) => {
    setIsGenerating(true);
    try {
      const generatedEntity = await generateContextualEntity(options, entityType);
      setNewEntityData(generatedEntity);
      setIsCreating(true);
      setIsGenerationModalOpen(false);
    } catch (error) {
      console.error('Failed to generate entity:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Show detail view if entity is selected
  if (selectedEntity) {
    return (
      <UniversalEntityDetailView
        projectId={projectId}
        entityType={entityType}
        entity={selectedEntity}
        onBack={handleClearSelection}
        onDelete={(entity) => deleteMutation.mutate(entity.id)}
      />
    );
  }

  const getSortIcon = (option: SortOption) => {
    return sortBy === option ? (
      <ArrowUpDown className="h-4 w-4 text-primary" />
    ) : (
      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
    );
  };

  const entityTypeCapitalized = entityType.charAt(0).toUpperCase() + entityType.slice(1);
  const entityTypeSingular = entityType.endsWith('s') ? entityType.slice(0, -1) : entityType;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-title font-bold tracking-tight">{entityTypeCapitalized}</h2>
          <p className="text-muted-foreground">
            Manage your story's {entityType.toLowerCase()} and world elements
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={`Search ${entityType.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleSortChange('alphabetical')} className="flex items-center justify-between">
                <span>Alphabetical</span>
                {getSortIcon('alphabetical')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('recently-added')} className="flex items-center justify-between">
                <span>Recently Added</span>
                {getSortIcon('recently-added')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('recently-edited')} className="flex items-center justify-between">
                <span>Recently Edited</span>
                {getSortIcon('recently-edited')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange('grid')}
              className="px-3"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange('list')}
              className="px-3"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Create Button */}
          <Button 
            onClick={() => setIsCreationLaunchOpen(true)}
            className="creative-button group relative overflow-hidden"
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
              Create {entityTypeSingular}
            </div>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total {entityTypeCapitalized}</p>
                <p className="text-2xl font-bold">{entities.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Zap className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Well Developed</p>
                <p className="text-2xl font-bold">
                  {entities.filter(e => calculateCompleteness(e) >= 70).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Eye className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">
                  {entities.filter(e => {
                    const completeness = calculateCompleteness(e);
                    return completeness > 30 && completeness < 70;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Need Work</p>
                <p className="text-2xl font-bold">
                  {entities.filter(e => calculateCompleteness(e) <= 30).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Entity Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="w-full h-48 bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sortedEntities.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No {entityType} Yet</h3>
              <p className="text-muted-foreground">
                Start building your world by creating your first {entityTypeSingular.toLowerCase()}.
              </p>
            </div>
            <Button onClick={() => setIsCreationLaunchOpen(true)} className="creative-button">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First {entityTypeSingular}
            </Button>
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEntities.map((entity) => {
            const completeness = calculateCompleteness(entity);
            return (
              <Card 
                key={entity.id} 
                className="group creative-card cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-border/50 hover:border-primary/30"
                onClick={() => handleEntitySelect(entity)}
              >
                <CardContent className="p-0">
                  {/* Entity Image */}
                  <div className="relative w-full h-64 bg-gradient-to-br from-muted/30 to-muted/60 rounded-t-lg overflow-hidden">
                    {entity.imageUrl ? (
                      <img 
                        src={entity.imageUrl} 
                        alt={entity.name}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="h-16 w-16 text-muted-foreground/50" />
                      </div>
                    )}
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPortraitEntity(entity);
                          setIsPortraitModalOpen(true);
                        }}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEntitySelect(entity);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button size="sm" variant="secondary">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEntitySelect(entity)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteMutation.mutate(entity.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Completeness Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge 
                        variant={completeness >= 70 ? 'default' : completeness >= 40 ? 'secondary' : 'outline'}
                        className="bg-black/80 text-white border-white/20"
                      >
                        {completeness}%
                      </Badge>
                    </div>
                  </div>

                  {/* Entity Info */}
                  <div className="p-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                        {entity.name || `Unnamed ${entityTypeSingular}`}
                      </h3>
                      
                      {entity.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {entity.description}
                        </p>
                      )}

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Development</span>
                          <span className="font-medium">{completeness}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              completeness >= 70 ? 'bg-green-500' : 
                              completeness >= 40 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${completeness}%` }}
                          />
                        </div>
                      </div>

                      {/* Quick Action */}
                      <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEntitySelect(entity);
                          }}
                        >
                          {completeness < 50 ? 'Continue Developing' : 'View Details'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {sortedEntities.map((entity) => {
            const completeness = calculateCompleteness(entity);
            return (
              <Card 
                key={entity.id}
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/30"
                onClick={() => handleEntitySelect(entity)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Entity Avatar */}
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-muted/30 to-muted/60 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {entity.imageUrl ? (
                        <img 
                          src={entity.imageUrl} 
                          alt={entity.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users className="h-8 w-8 text-muted-foreground/50" />
                      )}
                    </div>

                    {/* Entity Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <h3 className="font-semibold truncate">
                            {entity.name || `Unnamed ${entityTypeSingular}`}
                          </h3>
                          
                          {entity.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {entity.description}
                            </p>
                          )}

                          {/* Progress */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-muted rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full transition-all duration-300 ${
                                    completeness >= 70 ? 'bg-green-500' : 
                                    completeness >= 40 ? 'bg-orange-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${completeness}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">{completeness}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPortraitEntity(entity);
                              setIsPortraitModalOpen(true);
                            }}
                          >
                            <Camera className="h-4 w-4" />
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button size="sm" variant="outline">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleEntitySelect(entity)}>
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => deleteMutation.mutate(entity.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <UniversalEntityCreationLaunch
        entityType={entityType}
        isOpen={isCreationLaunchOpen}
        onClose={() => setIsCreationLaunchOpen(false)}
        onCreateBlank={() => {
          setIsCreating(true);
          setNewEntityData({});
          setIsCreationLaunchOpen(false);
        }}
        onOpenTemplates={() => {
          setIsTemplateModalOpen(true);
          setIsCreationLaunchOpen(false);
        }}
        onOpenAIGeneration={() => {
          setIsGenerationModalOpen(true);
          setIsCreationLaunchOpen(false);
        }}
      />

      <UniversalEntityTemplates
        entityType={entityType}
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleCreateFromTemplate}
      />

      <UniversalEntityGenerationModal
        entityType={entityType}
        isOpen={isGenerationModalOpen}
        onClose={() => setIsGenerationModalOpen(false)}
        onGenerate={handleGenerateEntity}
        isGenerating={isGenerating}
        projectId={projectId}
      />

      {portraitEntity && (
        <UniversalEntityPortraitModal
          entity={portraitEntity}
          entityType={entityType}
          isOpen={isPortraitModalOpen}
          onClose={() => {
            setIsPortraitModalOpen(false);
            setPortraitEntity(null);
          }}
          onImageGenerated={(imageUrl) => {
            // Update entity with new image
            queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, entityType] });
          }}
          onImageUploaded={(imageUrl) => {
            // Update entity with uploaded image
            queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, entityType] });
          }}
        />
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Users, Search, Edit, Trash2, MoreVertical, Edit2, Camera, Sparkles, ArrowUpDown } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Faction, Project } from '../../lib/types';
import { FactionDetailView } from './FactionDetailView';
import { FactionPortraitModal } from './FactionPortraitModal';
import { FactionGenerationModal, type FactionGenerationOptions } from './FactionGenerationModal';
import { generateContextualFaction } from '../../lib/services/factionGeneration';

interface FactionManagerProps {
  projectId: string;
  selectedFactionId?: string | null;
  onClearSelection?: () => void;
}

type SortOption = 'alphabetical' | 'recently-added' | 'recently-edited';

export function FactionManager({ projectId, selectedFactionId, onClearSelection }: FactionManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [portraitFaction, setPortraitFaction] = useState<Faction | null>(null);
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: factions = [], isLoading } = useQuery<Faction[]>({
    queryKey: ['/api/projects', projectId, 'factions'],
  });

  const { data: project } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
  });

  const { data: locations = [] } = useQuery<any[]>({
    queryKey: ['/api/projects', projectId, 'locations'],
  });

  // Auto-select faction if selectedFactionId is provided
  useEffect(() => {
    if (selectedFactionId && factions.length > 0) {
      const faction = factions.find(f => f.id === selectedFactionId);
      if (faction) {
        setSelectedFaction(faction);
        setIsCreating(false);
        // Clear the selection from the parent component
        onClearSelection?.();
      }
    }
  }, [selectedFactionId, factions, onClearSelection]);

  const deleteMutation = useMutation({
    mutationFn: (factionId: string) => 
      apiRequest('DELETE', `/api/factions/${factionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'factions'] });
    },
  });

  const updateFactionMutation = useMutation({
    mutationFn: (faction: Faction) => 
      apiRequest('PUT', `/api/factions/${faction.id}`, faction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'factions'] });
    },
  });

  const createFactionMutation = useMutation({
    mutationFn: async (faction: Partial<Faction>) => {
      console.log('Mutation: Creating faction with data:', faction);
      const response = await apiRequest('POST', `/api/projects/${projectId}/factions`, faction);
      console.log('Mutation: Received response:', response);
      const result = await response.json();
      console.log('Mutation: Parsed JSON:', result);
      return result;
    },
    onSuccess: (newFaction: Faction) => {
      console.log('Faction created successfully, setting as selected:', newFaction);
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'factions'] });
      // Open the newly created faction in the editor
      setSelectedFaction(newFaction);
      setIsCreating(false);
    },
    onError: (error) => {
      console.error('Failed to create faction:', error);
    }
  });

  // Sort and filter factions
  const sortFactions = (facts: Faction[]): Faction[] => {
    switch (sortBy) {
      case 'alphabetical':
        return [...facts].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'recently-added':
        return [...facts].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      case 'recently-edited':
        return [...facts].sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime());
      default:
        return facts;
    }
  };

  const filteredAndSortedFactions = sortFactions(
    factions.filter((faction: Faction) =>
      (faction.name && faction.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (faction.description && faction.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (faction.type && faction.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (faction.tags && faction.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    )
  );

  const handleEdit = (faction: Faction) => {
    setSelectedFaction(faction);
  };

  const handleDelete = (faction: Faction) => {
    if (confirm(`Are you sure you want to delete ${faction.name}?`)) {
      deleteMutation.mutate(faction.id, {
        onSuccess: () => {
          // Navigate back to the faction list after successful deletion
          setSelectedFaction(null);
          setIsCreating(false);
        }
      });
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedFaction(null);
  };

  const handleOpenGenerationModal = () => {
    setIsGenerationModalOpen(true);
  };

  const handleGenerateFaction = async (options: FactionGenerationOptions) => {
    if (!project) return;
    
    setIsGenerating(true);
    try {
      console.log('Starting server-side faction generation with options:', options);
      
      // Call the server-side generation endpoint
      const response = await fetch(`/api/projects/${projectId}/factions/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to generate faction');
      }
      
      const generatedFaction = await response.json();
      console.log('Generated faction data:', generatedFaction);
      
      // Create the faction with generated data and ensure it has the projectId
      const factionToCreate = {
        ...generatedFaction,
        projectId,
        // Ensure we have at least a basic name if generation didn't provide one
        name: generatedFaction.name || `Generated ${options.factionType || 'Faction'}`
      };
      
      console.log('Creating faction with data:', factionToCreate);
      
      // Create the faction - this will automatically open it in the editor on success
      const createdFaction = await createFactionMutation.mutateAsync(factionToCreate);
      console.log('Faction creation completed, created faction:', createdFaction);
      
      // Explicitly set the faction and ensure we're not in creating mode
      setSelectedFaction(createdFaction);
      setIsCreating(false);
      
      // Close the generation modal
      setIsGenerationModalOpen(false);
    } catch (error) {
      console.error('Error generating faction:', error);
      alert(`Failed to generate faction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToList = () => {
    // Invalidate the faction list query to fetch fresh data
    queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'factions'] });
    setSelectedFaction(null);
    setIsCreating(false);
  };

  const handlePortraitClick = (faction: Faction, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    setPortraitFaction(faction);
    setIsPortraitModalOpen(true);
  };

  const handleImageGenerated = (imageUrl: string) => {
    if (portraitFaction) {
      updateFactionMutation.mutate({ 
        ...portraitFaction, 
        imageUrl
      });
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    if (portraitFaction) {
      updateFactionMutation.mutate({ 
        ...portraitFaction, 
        imageUrl
      });
    }
  };

  // Show faction detail view (which handles both viewing and editing)
  if (selectedFaction || isCreating) {
    return (
      <FactionDetailView
        projectId={projectId}
        faction={selectedFaction}
        isCreating={isCreating}
        onBack={handleBackToList}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-title text-2xl">Factions</h2>
          <p className="text-muted-foreground">
            {factions.length} {factions.length === 1 ? 'faction' : 'factions'} in your world
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleCreateNew} 
            className="interactive-warm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Faction
          </Button>
          <Button 
            onClick={handleOpenGenerationModal} 
            disabled={!project}
            variant="outline"
            className="border-accent/20 hover:bg-accent/10"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Faction
          </Button>
        </div>
      </div>

      {/* Search and Sort Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search factions by name, type, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 creative-input"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[140px]">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              {sortBy === 'alphabetical' && 'A-Z'}
              {sortBy === 'recently-added' && 'Recently Added'}
              {sortBy === 'recently-edited' && 'Recently Edited'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy('alphabetical')}>
              Alphabetical (A-Z)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('recently-added')}>
              Recently Added
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('recently-edited')}>
              Recently Edited
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Faction List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="animate-spin h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p>Loading factions...</p>
        </div>
      ) : filteredAndSortedFactions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-24 w-24 mx-auto mb-6 opacity-30" />
          <h3 className="text-xl font-semibold mb-3">
            {factions.length === 0 ? 'No Factions Created' : 'No Factions Found'}
          </h3>
          <p className="mb-6">
            {factions.length === 0 
              ? 'Start building your cast of factions to bring your world to life.'
              : 'Try adjusting your search terms to find the faction you\'re looking for.'
            }
          </p>
          {factions.length === 0 && (
            <Button 
              onClick={handleCreateNew} 
              className="interactive-warm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Faction
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAndSortedFactions.map((faction: Faction) => (
            <Card 
              key={faction.id} 
              className="creative-card cursor-pointer hover:shadow-lg transition-all duration-200 border-yellow-500/30 hover:border-yellow-500/50"
              onClick={() => handleEdit(faction)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Faction Image - Clickable */}
                  <div 
                    className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity relative group"
                    onClick={(e) => handlePortraitClick(faction, e)}
                  >
                    {faction.imageUrl ? (
                      <img 
                        src={faction.imageUrl} 
                        alt={faction.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Users className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                    )}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* Faction Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 truncate">{faction.name || 'Unnamed Faction'}</h3>
                        {faction.type && (
                          <p className="text-sm text-muted-foreground mb-2 italic">{faction.type}</p>
                        )}
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger 
                          className="opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(faction);
                            }}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(faction);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="default" className="text-xs px-2 py-1">
                        Faction
                      </Badge>
                      {faction.type && (
                        <Badge variant="outline" className="text-xs">
                          {faction.type}
                        </Badge>
                      )}
                      {faction.status && (
                        <Badge variant="outline" className="text-xs">
                          {faction.status}
                        </Badge>
                      )}
                    </div>

                    {/* Description */}
                    {faction.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {faction.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Faction Portrait Modal */}
      {portraitFaction && (
        <FactionPortraitModal
          faction={portraitFaction}
          isOpen={isPortraitModalOpen}
          onClose={() => {
            setIsPortraitModalOpen(false);
            setPortraitFaction(null);
          }}
          onImageGenerated={handleImageGenerated}
          onImageUploaded={handleImageUploaded}
        />
      )}

      {/* Faction Generation Modal */}
      <FactionGenerationModal
        isOpen={isGenerationModalOpen}
        onClose={() => setIsGenerationModalOpen(false)}
        onGenerate={handleGenerateFaction}
        isGenerating={isGenerating}
      />
    </div>
  );
}

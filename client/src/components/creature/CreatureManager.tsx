import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Users, Search, Edit, Trash2, MoreVertical, Edit2, Camera, Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Creature, Project } from '../../lib/types';
import { CreatureDetailView } from './CreatureDetailView';
import { CreaturePortraitModal } from './CreaturePortraitModal';
import { CreatureGenerationModal, type CreatureGenerationOptions } from './CreatureGenerationModal';
import { generateContextualCreature } from '../../lib/services/creatureGeneration';

interface CreatureManagerProps {
  projectId: string;
  selectedCreatureId?: string | null;
  onClearSelection?: () => void;
}

export function CreatureManager({ projectId, selectedCreatureId, onClearSelection }: CreatureManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCreature, setSelectedCreature] = useState<Creature | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [portraitCreature, setPortraitCreature] = useState<Creature | null>(null);
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: creatures = [], isLoading } = useQuery<Creature[]>({
    queryKey: ['/api/projects', projectId, 'creatures'],
  });

  const { data: project } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
  });

  const { data: locations = [] } = useQuery<any[]>({
    queryKey: ['/api/projects', projectId, 'locations'],
  });

  // Auto-select creature if selectedCreatureId is provided
  useEffect(() => {
    if (selectedCreatureId && creatures.length > 0) {
      const creature = creatures.find(item => item.id === selectedCreatureId);
      if (creature) {
        setSelectedCreature(creature);
        setIsCreating(false);
        // Clear the selection from the parent component
        onClearSelection?.();
      }
    }
  }, [selectedCreatureId, creatures, onClearSelection]);

  const deleteMutation = useMutation({
    mutationFn: (creatureId: string) => 
      apiRequest('DELETE', `/api/creatures/${creatureId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'creatures'] });
    },
  });

  const updateCreatureMutation = useMutation({
    mutationFn: (creature: Creature) => 
      apiRequest('PUT', `/api/creatures/${creature.id}`, creature),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'creatures'] });
    },
  });

  const createCreatureMutation = useMutation({
    mutationFn: async (creature: Partial<Creature>) => {
      console.log('Mutation: Creating creature with data:', creature);
      const response = await apiRequest('POST', `/api/projects/${projectId}/creatures`, creature);
      console.log('Mutation: Received response:', response);
      const result = await response.json();
      console.log('Mutation: Parsed JSON:', result);
      return result;
    },
    onSuccess: (newCreature: Creature) => {
      console.log('Creature created successfully, setting as selected:', newCreature);
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'creatures'] });
      // Open the newly created creature in the editor
      setSelectedCreature(newCreature);
      setIsCreating(false);
    },
    onError: (error) => {
      console.error('Failed to create creature:', error);
    }
  });

  const filteredCreatures = creatures.filter((creature: Creature) =>
    (creature.name && creature.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (creature.role && creature.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (creature.race && creature.race.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (creature.occupation && creature.occupation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEdit = (creature: Creature) => {
    setSelectedCreature(creature);
  };

  const handleDelete = (creature: Creature) => {
    if (confirm(`Are you sure you want to delete ${creature.name}?`)) {
      deleteMutation.mutate(creature.id, {
        onSuccess: () => {
          // Navigate back to the creature list after successful deletion
          setSelectedCreature(null);
          setIsCreating(false);
        }
      });
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedCreature(null);
  };

  const handleOpenGenerationModal = () => {
    setIsGenerationModalOpen(true);
  };

  const handleGenerateCreature = async (options: CreatureGenerationOptions) => {
    if (!project) return;
    
    setIsGenerating(true);
    try {
      console.log('Starting server-side creature generation with options:', options);
      
      // Call the server-side generation endpoint
      const response = await fetch(`/api/projects/${projectId}/creatures/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to generate creature');
      }
      
      const generatedCreature = await response.json();
      console.log('Generated creature data:', generatedCreature);
      
      // Create the creature with generated data and ensure it has the projectId
      const creatureToCreate = {
        ...generatedCreature,
        projectId,
        // Ensure we have at least a basic name if generation didn't provide one
        name: generatedCreature.name || `Generated ${options.creatureType || 'Creature'}`
      };
      
      console.log('Creating creature with data:', creatureToCreate);
      
      // Create the creature - this will automatically open it in the editor on success
      const createdCreature = await createCreatureMutation.mutateAsync(creatureToCreate);
      console.log('Creature creation completed, created creature:', createdCreature);
      
      // Explicitly set the creature and ensure we're not in creating mode
      setSelectedCreature(createdCreature);
      setIsCreating(false);
      
      // Close the generation modal
      setIsGenerationModalOpen(false);
    } catch (error) {
      console.error('Error generating creature:', error);
      alert(`Failed to generate creature: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToList = () => {
    // Invalidate the creature list query to fetch fresh data
    queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'creatures'] });
    setSelectedCreature(null);
    setIsCreating(false);
  };

  const handlePortraitClick = (creature: Creature, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    setPortraitCreature(creature);
    setIsPortraitModalOpen(true);
  };

  const handleImageGenerated = (imageUrl: string) => {
    if (portraitCreature) {
      updateCreatureMutation.mutate({ 
        ...portraitCreature, 
        imageUrl,
        // Make sure to preserve any existing portraits array
        portraits: portraitCreature.portraits || []
      });
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    if (portraitCreature) {
      updateCreatureMutation.mutate({ 
        ...portraitCreature, 
        imageUrl,
        // Make sure to preserve any existing portraits array
        portraits: portraitCreature.portraits || []
      });
    }
  };

  // Show creature detail view (which handles both viewing and editing)
  if (selectedCreature || isCreating) {
    return (
      <CreatureDetailView
        projectId={projectId}
        creature={selectedCreature}
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
          <h2 className="font-title text-2xl">Creatures</h2>
          <p className="text-muted-foreground">
            {creatures.length} {creatures.length === 1 ? 'creature' : 'creatures'} in your world
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleCreateNew} 
            className="interactive-warm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Creature
          </Button>
          <Button 
            onClick={handleOpenGenerationModal} 
            disabled={!project}
            variant="outline"
            className="border-accent/20 hover:bg-accent/10"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Creature
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search creatures by name, role, or race..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 creative-input"
        />
      </div>

      {/* Creature List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="animate-spin h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p>Loading creatures...</p>
        </div>
      ) : filteredCreatures.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-24 w-24 mx-auto mb-6 opacity-30" />
          <h3 className="text-xl font-semibold mb-3">
            {creatures.length === 0 ? 'No Creatures Created' : 'No Creatures Found'}
          </h3>
          <p className="mb-6">
            {creatures.length === 0 
              ? 'Start building your cast of creatures to bring your world to life.'
              : 'Try adjusting your search terms to find the creature you\'re looking for.'
            }
          </p>
          {creatures.length === 0 && (
            <Button 
              onClick={handleCreateNew} 
              className="interactive-warm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Creature
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCreatures.map((creature: Creature) => (
            <Card 
              key={creature.id} 
              className="creative-card cursor-pointer hover:shadow-lg transition-all duration-200 border-yellow-500/30 hover:border-yellow-500/50"
              onClick={() => handleEdit(creature)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Creature Image - Clickable */}
                  <div 
                    className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity relative group"
                    onClick={(e) => handlePortraitClick(creature, e)}
                  >
                    {creature.imageUrl ? (
                      <img 
                        src={creature.imageUrl} 
                        alt={creature.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Edit className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                    )}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* Creature Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 truncate">{creature.name || 'Unnamed Creature'}</h3>
                        {creature.title && (
                          <p className="text-sm text-muted-foreground mb-2 italic">"{creature.title}"</p>
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
                              handleEdit(creature);
                            }}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(creature);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Badges - same as header */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {creature.role && (
                        <Badge variant="default" className="text-xs px-2 py-1">
                          {creature.role}
                        </Badge>
                      )}
                      {creature.class && (
                        <Badge variant="outline" className="text-xs">
                          {creature.class}
                        </Badge>
                      )}
                      {creature.age && (
                        <Badge variant="outline" className="text-xs">
                          Age {creature.age}
                        </Badge>
                      )}
                    </div>

                    {/* One-line or description */}
                    {creature.oneLine && (
                      <p className="text-sm italic text-muted-foreground mb-2">
                        "{creature.oneLine}"
                      </p>
                    )}
                    
                    {creature.description && !creature.oneLine && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {creature.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Creature Portrait Modal */}
      {portraitCreature && (
        <CreaturePortraitModal
          creature={portraitCreature}
          isOpen={isPortraitModalOpen}
          onClose={() => {
            setIsPortraitModalOpen(false);
            setPortraitCreature(null);
          }}
          onImageGenerated={handleImageGenerated}
          onImageUploaded={handleImageUploaded}
        />
      )}

      {/* Creature Generation Modal */}
      <CreatureGenerationModal
        isOpen={isGenerationModalOpen}
        onClose={() => setIsGenerationModalOpen(false)}
        onGenerate={handleGenerateCreature}
        isGenerating={isGenerating}
      />
    </div>
  );
}

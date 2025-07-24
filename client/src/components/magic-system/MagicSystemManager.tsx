import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Users, Search, Edit, Trash2, MoreVertical, Edit2, Camera, Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { MagicSystem, Project } from '../../lib/types';
import { MagicSystemDetailView } from './MagicSystemDetailView';
import { MagicSystemPortraitModal } from './MagicSystemPortraitModal';
import { MagicSystemGenerationModal, type MagicSystemGenerationOptions } from './MagicSystemGenerationModal';
import { generateContextualMagicSystem } from '../../lib/services/magicsystemGeneration';

interface MagicSystemManagerProps {
  projectId: string;
  selectedMagicSystemId?: string | null;
  onClearSelection?: () => void;
}

export function MagicSystemManager({ projectId, selectedMagicSystemId, onClearSelection }: MagicSystemManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMagicSystem, setSelectedMagicSystem] = useState<MagicSystem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [portraitMagicSystem, setPortraitMagicSystem] = useState<MagicSystem | null>(null);
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: magicsystems = [], isLoading } = useQuery<MagicSystem[]>({
    queryKey: ['/api/projects', projectId, 'magicsystems'],
  });

  const { data: project } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
  });

  const { data: locations = [] } = useQuery<any[]>({
    queryKey: ['/api/projects', projectId, 'locations'],
  });

  // Auto-select magicsystem if selectedMagicSystemId is provided
  useEffect(() => {
    if (selectedMagicSystemId && magicsystems.length > 0) {
      const magicsystem = magicsystems.find(item => item.id === selectedMagicSystemId);
      if (magicsystem) {
        setSelectedMagicSystem(magicsystem);
        setIsCreating(false);
        // Clear the selection from the parent component
        onClearSelection?.();
      }
    }
  }, [selectedMagicSystemId, magicsystems, onClearSelection]);

  const deleteMutation = useMutation({
    mutationFn: (magicsystemId: string) => 
      apiRequest('DELETE', `/api/magicsystems/${magicsystemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'magicsystems'] });
    },
  });

  const updateMagicSystemMutation = useMutation({
    mutationFn: (magicsystem: MagicSystem) => 
      apiRequest('PUT', `/api/magicsystems/${magicsystem.id}`, magicsystem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'magicsystems'] });
    },
  });

  const createMagicSystemMutation = useMutation({
    mutationFn: async (magicsystem: Partial<MagicSystem>) => {
      console.log('Mutation: Creating magicsystem with data:', magicsystem);
      const response = await apiRequest('POST', `/api/projects/${projectId}/magicsystems`, magicsystem);
      console.log('Mutation: Received response:', response);
      const result = await response.json();
      console.log('Mutation: Parsed JSON:', result);
      return result;
    },
    onSuccess: (newMagicSystem: MagicSystem) => {
      console.log('MagicSystem created successfully, setting as selected:', newMagicSystem);
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'magicsystems'] });
      // Open the newly created magicsystem in the editor
      setSelectedMagicSystem(newMagicSystem);
      setIsCreating(false);
    },
    onError: (error) => {
      console.error('Failed to create magicsystem:', error);
    }
  });

  const filteredMagicSystems = magicsystems.filter((magicsystem: MagicSystem) =>
    (magicsystem.name && magicsystem.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (magicsystem.role && magicsystem.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (magicsystem.race && magicsystem.race.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (magicsystem.occupation && magicsystem.occupation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEdit = (magicsystem: MagicSystem) => {
    setSelectedMagicSystem(magicsystem);
  };

  const handleDelete = (magicsystem: MagicSystem) => {
    if (confirm(`Are you sure you want to delete ${magicsystem.name}?`)) {
      deleteMutation.mutate(magicsystem.id, {
        onSuccess: () => {
          // Navigate back to the magicsystem list after successful deletion
          setSelectedMagicSystem(null);
          setIsCreating(false);
        }
      });
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedMagicSystem(null);
  };

  const handleOpenGenerationModal = () => {
    setIsGenerationModalOpen(true);
  };

  const handleGenerateMagicSystem = async (options: MagicSystemGenerationOptions) => {
    if (!project) return;
    
    setIsGenerating(true);
    try {
      console.log('Starting server-side magicsystem generation with options:', options);
      
      // Call the server-side generation endpoint
      const response = await fetch(`/api/projects/${projectId}/magicsystems/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to generate magicsystem');
      }
      
      const generatedMagicSystem = await response.json();
      console.log('Generated magicsystem data:', generatedMagicSystem);
      
      // Create the magicsystem with generated data and ensure it has the projectId
      const magicsystemToCreate = {
        ...generatedMagicSystem,
        projectId,
        // Ensure we have at least a basic name if generation didn't provide one
        name: generatedMagicSystem.name || `Generated ${options.magicsystemType || 'MagicSystem'}`
      };
      
      console.log('Creating magicsystem with data:', magicsystemToCreate);
      
      // Create the magicsystem - this will automatically open it in the editor on success
      const createdMagicSystem = await createMagicSystemMutation.mutateAsync(magicsystemToCreate);
      console.log('MagicSystem creation completed, created magicsystem:', createdMagicSystem);
      
      // Explicitly set the magicsystem and ensure we're not in creating mode
      setSelectedMagicSystem(createdMagicSystem);
      setIsCreating(false);
      
      // Close the generation modal
      setIsGenerationModalOpen(false);
    } catch (error) {
      console.error('Error generating magicsystem:', error);
      alert(`Failed to generate magicsystem: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToList = () => {
    // Invalidate the magicsystem list query to fetch fresh data
    queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'magicsystems'] });
    setSelectedMagicSystem(null);
    setIsCreating(false);
  };

  const handlePortraitClick = (magicsystem: MagicSystem, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    setPortraitMagicSystem(magicsystem);
    setIsPortraitModalOpen(true);
  };

  const handleImageGenerated = (imageUrl: string) => {
    if (portraitMagicSystem) {
      updateMagicSystemMutation.mutate({ 
        ...portraitMagicSystem, 
        imageUrl,
        // Make sure to preserve any existing portraits array
        portraits: portraitMagicSystem.portraits || []
      });
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    if (portraitMagicSystem) {
      updateMagicSystemMutation.mutate({ 
        ...portraitMagicSystem, 
        imageUrl,
        // Make sure to preserve any existing portraits array
        portraits: portraitMagicSystem.portraits || []
      });
    }
  };

  // Show magicsystem detail view (which handles both viewing and editing)
  if (selectedMagicSystem || isCreating) {
    return (
      <MagicSystemDetailView
        projectId={projectId}
        magicsystem={selectedMagicSystem}
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
          <h2 className="font-title text-2xl">MagicSystems</h2>
          <p className="text-muted-foreground">
            {magicsystems.length} {magicsystems.length === 1 ? 'magicsystem' : 'magicsystems'} in your world
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleCreateNew} 
            className="interactive-warm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add MagicSystem
          </Button>
          <Button 
            onClick={handleOpenGenerationModal} 
            disabled={!project}
            variant="outline"
            className="border-accent/20 hover:bg-accent/10"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate MagicSystem
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search magicsystems by name, role, or race..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 creative-input"
        />
      </div>

      {/* MagicSystem List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="animate-spin h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p>Loading magicsystems...</p>
        </div>
      ) : filteredMagicSystems.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-24 w-24 mx-auto mb-6 opacity-30" />
          <h3 className="text-xl font-semibold mb-3">
            {magicsystems.length === 0 ? 'No MagicSystems Created' : 'No MagicSystems Found'}
          </h3>
          <p className="mb-6">
            {magicsystems.length === 0 
              ? 'Start building your cast of magicsystems to bring your world to life.'
              : 'Try adjusting your search terms to find the magicsystem you\'re looking for.'
            }
          </p>
          {magicsystems.length === 0 && (
            <Button 
              onClick={handleCreateNew} 
              className="interactive-warm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First MagicSystem
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMagicSystems.map((magicsystem: MagicSystem) => (
            <Card 
              key={magicsystem.id} 
              className="creative-card cursor-pointer hover:shadow-lg transition-all duration-200 border-yellow-500/30 hover:border-yellow-500/50"
              onClick={() => handleEdit(magicsystem)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* MagicSystem Image - Clickable */}
                  <div 
                    className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity relative group"
                    onClick={(e) => handlePortraitClick(magicsystem, e)}
                  >
                    {magicsystem.imageUrl ? (
                      <img 
                        src={magicsystem.imageUrl} 
                        alt={magicsystem.name}
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

                  {/* MagicSystem Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 truncate">{magicsystem.name || 'Unnamed MagicSystem'}</h3>
                        {magicsystem.title && (
                          <p className="text-sm text-muted-foreground mb-2 italic">"{magicsystem.title}"</p>
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
                              handleEdit(magicsystem);
                            }}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(magicsystem);
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
                      {magicsystem.role && (
                        <Badge variant="default" className="text-xs px-2 py-1">
                          {magicsystem.role}
                        </Badge>
                      )}
                      {magicsystem.class && (
                        <Badge variant="outline" className="text-xs">
                          {magicsystem.class}
                        </Badge>
                      )}
                      {magicsystem.age && (
                        <Badge variant="outline" className="text-xs">
                          Age {magicsystem.age}
                        </Badge>
                      )}
                    </div>

                    {/* One-line or description */}
                    {magicsystem.oneLine && (
                      <p className="text-sm italic text-muted-foreground mb-2">
                        "{magicsystem.oneLine}"
                      </p>
                    )}
                    
                    {magicsystem.description && !magicsystem.oneLine && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {magicsystem.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* MagicSystem Portrait Modal */}
      {portraitMagicSystem && (
        <MagicSystemPortraitModal
          magicsystem={portraitMagicSystem}
          isOpen={isPortraitModalOpen}
          onClose={() => {
            setIsPortraitModalOpen(false);
            setPortraitMagicSystem(null);
          }}
          onImageGenerated={handleImageGenerated}
          onImageUploaded={handleImageUploaded}
        />
      )}

      {/* MagicSystem Generation Modal */}
      <MagicSystemGenerationModal
        isOpen={isGenerationModalOpen}
        onClose={() => setIsGenerationModalOpen(false)}
        onGenerate={handleGenerateMagicSystem}
        isGenerating={isGenerating}
      />
    </div>
  );
}

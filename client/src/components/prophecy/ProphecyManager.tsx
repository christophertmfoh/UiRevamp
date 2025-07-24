import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Users, Search, Edit, Trash2, MoreVertical, Edit2, Camera, Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Prophecy, Project } from '../../lib/types';
import { ProphecyDetailView } from './ProphecyDetailView';
import { ProphecyPortraitModal } from './ProphecyPortraitModal';
import { ProphecyGenerationModal, type ProphecyGenerationOptions } from './ProphecyGenerationModal';
import { generateContextualProphecy } from '../../lib/services/prophecyGeneration';

interface ProphecyManagerProps {
  projectId: string;
  selectedProphecyId?: string | null;
  onClearSelection?: () => void;
}

export function ProphecyManager({ projectId, selectedProphecyId, onClearSelection }: ProphecyManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProphecy, setSelectedProphecy] = useState<Prophecy | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [portraitProphecy, setPortraitProphecy] = useState<Prophecy | null>(null);
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: prophecys = [], isLoading } = useQuery<Prophecy[]>({
    queryKey: ['/api/projects', projectId, 'prophecys'],
  });

  const { data: project } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
  });

  const { data: locations = [] } = useQuery<any[]>({
    queryKey: ['/api/projects', projectId, 'locations'],
  });

  // Auto-select prophecy if selectedProphecyId is provided
  useEffect(() => {
    if (selectedProphecyId && prophecys.length > 0) {
      const prophecy = prophecys.find(c => c.id === selectedProphecyId);
      if (prophecy) {
        setSelectedProphecy(prophecy);
        setIsCreating(false);
        // Clear the selection from the parent component
        onClearSelection?.();
      }
    }
  }, [selectedProphecyId, prophecys, onClearSelection]);

  const deleteMutation = useMutation({
    mutationFn: (prophecyId: string) => 
      apiRequest('DELETE', `/api/prophecys/${prophecyId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'prophecys'] });
    },
  });

  const updateProphecyMutation = useMutation({
    mutationFn: (prophecy: Prophecy) => 
      apiRequest('PUT', `/api/prophecys/${prophecy.id}`, prophecy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'prophecys'] });
    },
  });

  const createProphecyMutation = useMutation({
    mutationFn: async (prophecy: Partial<Prophecy>) => {
      console.log('Mutation: Creating prophecy with data:', prophecy);
      const response = await apiRequest('POST', `/api/projects/${projectId}/prophecys`, prophecy);
      console.log('Mutation: Received response:', response);
      const result = await response.json();
      console.log('Mutation: Parsed JSON:', result);
      return result;
    },
    onSuccess: (newProphecy: Prophecy) => {
      console.log('Prophecy created successfully, setting as selected:', newProphecy);
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'prophecys'] });
      // Open the newly created prophecy in the editor
      setSelectedProphecy(newProphecy);
      setIsCreating(false);
    },
    onError: (error) => {
      console.error('Failed to create prophecy:', error);
    }
  });

  const filteredProphecys = prophecys.filter((prophecy: Prophecy) =>
    (prophecy.name && prophecy.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (prophecy.role && prophecy.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (prophecy.race && prophecy.race.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (prophecy.occupation && prophecy.occupation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEdit = (prophecy: Prophecy) => {
    setSelectedProphecy(prophecy);
  };

  const handleDelete = (prophecy: Prophecy) => {
    if (confirm(`Are you sure you want to delete ${prophecy.name}?`)) {
      deleteMutation.mutate(prophecy.id, {
        onSuccess: () => {
          // Navigate back to the prophecy list after successful deletion
          setSelectedProphecy(null);
          setIsCreating(false);
        }
      });
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedProphecy(null);
  };

  const handleOpenGenerationModal = () => {
    setIsGenerationModalOpen(true);
  };

  const handleGenerateProphecy = async (options: ProphecyGenerationOptions) => {
    if (!project) return;
    
    setIsGenerating(true);
    try {
      console.log('Starting server-side prophecy generation with options:', options);
      
      // Call the server-side generation endpoint
      const response = await fetch(`/api/projects/${projectId}/prophecys/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to generate prophecy');
      }
      
      const generatedProphecy = await response.json();
      console.log('Generated prophecy data:', generatedProphecy);
      
      // Create the prophecy with generated data and ensure it has the projectId
      const prophecyToCreate = {
        ...generatedProphecy,
        projectId,
        // Ensure we have at least a basic name if generation didn't provide one
        name: generatedProphecy.name || `Generated ${options.prophecyType || 'Prophecy'}`
      };
      
      console.log('Creating prophecy with data:', prophecyToCreate);
      
      // Create the prophecy - this will automatically open it in the editor on success
      const createdProphecy = await createProphecyMutation.mutateAsync(prophecyToCreate);
      console.log('Prophecy creation completed, created prophecy:', createdProphecy);
      
      // Explicitly set the prophecy and ensure we're not in creating mode
      setSelectedProphecy(createdProphecy);
      setIsCreating(false);
      
      // Close the generation modal
      setIsGenerationModalOpen(false);
    } catch (error) {
      console.error('Error generating prophecy:', error);
      alert(`Failed to generate prophecy: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToList = () => {
    // Invalidate the prophecy list query to fetch fresh data
    queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'prophecys'] });
    setSelectedProphecy(null);
    setIsCreating(false);
  };

  const handlePortraitClick = (prophecy: Prophecy, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    setPortraitProphecy(prophecy);
    setIsPortraitModalOpen(true);
  };

  const handleImageGenerated = (imageUrl: string) => {
    if (portraitProphecy) {
      updateProphecyMutation.mutate({ 
        ...portraitProphecy, 
        imageUrl,
        // Make sure to preserve any existing portraits array
        portraits: portraitProphecy.portraits || []
      });
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    if (portraitProphecy) {
      updateProphecyMutation.mutate({ 
        ...portraitProphecy, 
        imageUrl,
        // Make sure to preserve any existing portraits array
        portraits: portraitProphecy.portraits || []
      });
    }
  };

  // Show prophecy detail view (which handles both viewing and editing)
  if (selectedProphecy || isCreating) {
    return (
      <ProphecyDetailView
        projectId={projectId}
        prophecy={selectedProphecy}
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
          <h2 className="font-title text-2xl">Prophecys</h2>
          <p className="text-muted-foreground">
            {prophecys.length} {prophecys.length === 1 ? 'prophecy' : 'prophecys'} in your world
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleCreateNew} 
            className="interactive-warm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Prophecy
          </Button>
          <Button 
            onClick={handleOpenGenerationModal} 
            disabled={!project}
            variant="outline"
            className="border-accent/20 hover:bg-accent/10"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Prophecy
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search prophecys by name, role, or race..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 creative-input"
        />
      </div>

      {/* Prophecy List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="animate-spin h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p>Loading prophecys...</p>
        </div>
      ) : filteredProphecys.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-24 w-24 mx-auto mb-6 opacity-30" />
          <h3 className="text-xl font-semibold mb-3">
            {prophecys.length === 0 ? 'No Prophecys Created' : 'No Prophecys Found'}
          </h3>
          <p className="mb-6">
            {prophecys.length === 0 
              ? 'Start building your cast of prophecys to bring your world to life.'
              : 'Try adjusting your search terms to find the prophecy you\'re looking for.'
            }
          </p>
          {prophecys.length === 0 && (
            <Button 
              onClick={handleCreateNew} 
              className="interactive-warm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Prophecy
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProphecys.map((prophecy: Prophecy) => (
            <Card 
              key={prophecy.id} 
              className="creative-card cursor-pointer hover:shadow-lg transition-all duration-200 border-yellow-500/30 hover:border-yellow-500/50"
              onClick={() => handleEdit(prophecy)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Prophecy Image - Clickable */}
                  <div 
                    className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity relative group"
                    onClick={(e) => handlePortraitClick(prophecy, e)}
                  >
                    {prophecy.imageUrl ? (
                      <img 
                        src={prophecy.imageUrl} 
                        alt={prophecy.name}
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

                  {/* Prophecy Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 truncate">{prophecy.name || 'Unnamed Prophecy'}</h3>
                        {prophecy.title && (
                          <p className="text-sm text-muted-foreground mb-2 italic">"{prophecy.title}"</p>
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
                              handleEdit(prophecy);
                            }}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(prophecy);
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
                      {prophecy.role && (
                        <Badge variant="default" className="text-xs px-2 py-1">
                          {prophecy.role}
                        </Badge>
                      )}
                      {prophecy.class && (
                        <Badge variant="outline" className="text-xs">
                          {prophecy.class}
                        </Badge>
                      )}
                      {prophecy.age && (
                        <Badge variant="outline" className="text-xs">
                          Age {prophecy.age}
                        </Badge>
                      )}
                    </div>

                    {/* One-line or description */}
                    {prophecy.oneLine && (
                      <p className="text-sm italic text-muted-foreground mb-2">
                        "{prophecy.oneLine}"
                      </p>
                    )}
                    
                    {prophecy.description && !prophecy.oneLine && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {prophecy.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Prophecy Portrait Modal */}
      {portraitProphecy && (
        <ProphecyPortraitModal
          prophecy={portraitProphecy}
          isOpen={isPortraitModalOpen}
          onClose={() => {
            setIsPortraitModalOpen(false);
            setPortraitProphecy(null);
          }}
          onImageGenerated={handleImageGenerated}
          onImageUploaded={handleImageUploaded}
        />
      )}

      {/* Prophecy Generation Modal */}
      <ProphecyGenerationModal
        isOpen={isGenerationModalOpen}
        onClose={() => setIsGenerationModalOpen(false)}
        onGenerate={handleGenerateProphecy}
        isGenerating={isGenerating}
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Users, Search, Edit, Trash2, MoreVertical, Edit2, Camera, Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Culture, Project } from '../../lib/types';
import { CultureDetailView } from './CultureDetailView';
import { CulturePortraitModal } from './CulturePortraitModal';
import { CultureGenerationModal, type CultureGenerationOptions } from './CultureGenerationModal';
import { generateContextualCulture } from '../../lib/services/cultureGeneration';

interface CultureManagerProps {
  projectId: string;
  selectedCultureId?: string | null;
  onClearSelection?: () => void;
}

export function CultureManager({ projectId, selectedCultureId, onClearSelection }: CultureManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCulture, setSelectedCulture] = useState<Culture | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [portraitCulture, setPortraitCulture] = useState<Culture | null>(null);
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: cultures = [], isLoading } = useQuery<Culture[]>({
    queryKey: ['/api/projects', projectId, 'cultures'],
  });

  const { data: project } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
  });

  const { data: locations = [] } = useQuery<any[]>({
    queryKey: ['/api/projects', projectId, 'locations'],
  });

  // Auto-select culture if selectedCultureId is provided
  useEffect(() => {
    if (selectedCultureId && cultures.length > 0) {
      const culture = cultures.find(item => item.id === selectedCultureId);
      if (culture) {
        setSelectedCulture(culture);
        setIsCreating(false);
        // Clear the selection from the parent component
        onClearSelection?.();
      }
    }
  }, [selectedCultureId, cultures, onClearSelection]);

  const deleteMutation = useMutation({
    mutationFn: (cultureId: string) => 
      apiRequest('DELETE', `/api/cultures/${cultureId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'cultures'] });
    },
  });

  const updateCultureMutation = useMutation({
    mutationFn: (culture: Culture) => 
      apiRequest('PUT', `/api/cultures/${culture.id}`, culture),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'cultures'] });
    },
  });

  const createCultureMutation = useMutation({
    mutationFn: async (culture: Partial<Culture>) => {
      console.log('Mutation: Creating culture with data:', culture);
      const response = await apiRequest('POST', `/api/projects/${projectId}/cultures`, culture);
      console.log('Mutation: Received response:', response);
      const result = await response.json();
      console.log('Mutation: Parsed JSON:', result);
      return result;
    },
    onSuccess: (newCulture: Culture) => {
      console.log('Culture created successfully, setting as selected:', newCulture);
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'cultures'] });
      // Open the newly created culture in the editor
      setSelectedCulture(newCulture);
      setIsCreating(false);
    },
    onError: (error) => {
      console.error('Failed to create culture:', error);
    }
  });

  const filteredCultures = cultures.filter((culture: Culture) =>
    (culture.name && culture.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (culture.role && culture.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (culture.race && culture.race.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (culture.occupation && culture.occupation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEdit = (culture: Culture) => {
    setSelectedCulture(culture);
  };

  const handleDelete = (culture: Culture) => {
    if (confirm(`Are you sure you want to delete ${culture.name}?`)) {
      deleteMutation.mutate(culture.id, {
        onSuccess: () => {
          // Navigate back to the culture list after successful deletion
          setSelectedCulture(null);
          setIsCreating(false);
        }
      });
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedCulture(null);
  };

  const handleOpenGenerationModal = () => {
    setIsGenerationModalOpen(true);
  };

  const handleGenerateCulture = async (options: CultureGenerationOptions) => {
    if (!project) return;
    
    setIsGenerating(true);
    try {
      console.log('Starting server-side culture generation with options:', options);
      
      // Call the server-side generation endpoint
      const response = await fetch(`/api/projects/${projectId}/cultures/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to generate culture');
      }
      
      const generatedCulture = await response.json();
      console.log('Generated culture data:', generatedCulture);
      
      // Create the culture with generated data and ensure it has the projectId
      const cultureToCreate = {
        ...generatedCulture,
        projectId,
        // Ensure we have at least a basic name if generation didn't provide one
        name: generatedCulture.name || `Generated ${options.cultureType || 'Culture'}`
      };
      
      console.log('Creating culture with data:', cultureToCreate);
      
      // Create the culture - this will automatically open it in the editor on success
      const createdCulture = await createCultureMutation.mutateAsync(cultureToCreate);
      console.log('Culture creation completed, created culture:', createdCulture);
      
      // Explicitly set the culture and ensure we're not in creating mode
      setSelectedCulture(createdCulture);
      setIsCreating(false);
      
      // Close the generation modal
      setIsGenerationModalOpen(false);
    } catch (error) {
      console.error('Error generating culture:', error);
      alert(`Failed to generate culture: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToList = () => {
    // Invalidate the culture list query to fetch fresh data
    queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'cultures'] });
    setSelectedCulture(null);
    setIsCreating(false);
  };

  const handlePortraitClick = (culture: Culture, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    setPortraitCulture(culture);
    setIsPortraitModalOpen(true);
  };

  const handleImageGenerated = (imageUrl: string) => {
    if (portraitCulture) {
      updateCultureMutation.mutate({ 
        ...portraitCulture, 
        imageUrl,
        // Make sure to preserve any existing portraits array
        portraits: portraitCulture.portraits || []
      });
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    if (portraitCulture) {
      updateCultureMutation.mutate({ 
        ...portraitCulture, 
        imageUrl,
        // Make sure to preserve any existing portraits array
        portraits: portraitCulture.portraits || []
      });
    }
  };

  // Show culture detail view (which handles both viewing and editing)
  if (selectedCulture || isCreating) {
    return (
      <CultureDetailView
        projectId={projectId}
        culture={selectedCulture}
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
          <h2 className="font-title text-2xl">Cultures</h2>
          <p className="text-muted-foreground">
            {cultures.length} {cultures.length === 1 ? 'culture' : 'cultures'} in your world
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleCreateNew} 
            className="interactive-warm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Culture
          </Button>
          <Button 
            onClick={handleOpenGenerationModal} 
            disabled={!project}
            variant="outline"
            className="border-accent/20 hover:bg-accent/10"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Culture
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search cultures by name, role, or race..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 creative-input"
        />
      </div>

      {/* Culture List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="animate-spin h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p>Loading cultures...</p>
        </div>
      ) : filteredCultures.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-24 w-24 mx-auto mb-6 opacity-30" />
          <h3 className="text-xl font-semibold mb-3">
            {cultures.length === 0 ? 'No Cultures Created' : 'No Cultures Found'}
          </h3>
          <p className="mb-6">
            {cultures.length === 0 
              ? 'Start building your cast of cultures to bring your world to life.'
              : 'Try adjusting your search terms to find the culture you\'re looking for.'
            }
          </p>
          {cultures.length === 0 && (
            <Button 
              onClick={handleCreateNew} 
              className="interactive-warm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Culture
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCultures.map((culture: Culture) => (
            <Card 
              key={culture.id} 
              className="creative-card cursor-pointer hover:shadow-lg transition-all duration-200 border-yellow-500/30 hover:border-yellow-500/50"
              onClick={() => handleEdit(culture)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Culture Image - Clickable */}
                  <div 
                    className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity relative group"
                    onClick={(e) => handlePortraitClick(culture, e)}
                  >
                    {culture.imageUrl ? (
                      <img 
                        src={culture.imageUrl} 
                        alt={culture.name}
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

                  {/* Culture Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 truncate">{culture.name || 'Unnamed Culture'}</h3>
                        {culture.title && (
                          <p className="text-sm text-muted-foreground mb-2 italic">"{culture.title}"</p>
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
                              handleEdit(culture);
                            }}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(culture);
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
                      {culture.role && (
                        <Badge variant="default" className="text-xs px-2 py-1">
                          {culture.role}
                        </Badge>
                      )}
                      {culture.class && (
                        <Badge variant="outline" className="text-xs">
                          {culture.class}
                        </Badge>
                      )}
                      {culture.age && (
                        <Badge variant="outline" className="text-xs">
                          Age {culture.age}
                        </Badge>
                      )}
                    </div>

                    {/* One-line or description */}
                    {culture.oneLine && (
                      <p className="text-sm italic text-muted-foreground mb-2">
                        "{culture.oneLine}"
                      </p>
                    )}
                    
                    {culture.description && !culture.oneLine && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {culture.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Culture Portrait Modal */}
      {portraitCulture && (
        <CulturePortraitModal
          culture={portraitCulture}
          isOpen={isPortraitModalOpen}
          onClose={() => {
            setIsPortraitModalOpen(false);
            setPortraitCulture(null);
          }}
          onImageGenerated={handleImageGenerated}
          onImageUploaded={handleImageUploaded}
        />
      )}

      {/* Culture Generation Modal */}
      <CultureGenerationModal
        isOpen={isGenerationModalOpen}
        onClose={() => setIsGenerationModalOpen(false)}
        onGenerate={handleGenerateCulture}
        isGenerating={isGenerating}
      />
    </div>
  );
}

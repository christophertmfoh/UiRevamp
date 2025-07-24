import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Users, Search, Edit, Trash2, MoreVertical, Edit2, Camera, Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Character, Project } from '../../lib/types';
import { CharacterDetailView } from './CharacterDetailView';
import { CharacterPortraitModal } from './CharacterPortraitModal';
import { CharacterGenerationModal, type CharacterGenerationOptions } from './CharacterGenerationModal';
import { generateContextualCharacter } from '../../lib/services/characterGeneration';

interface CharacterManagerProps {
  projectId: string;
  selectedCharacterId?: string | null;
  onClearSelection?: () => void;
}

export function CharacterManager({ projectId, selectedCharacterId, onClearSelection }: CharacterManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [portraitCharacter, setPortraitCharacter] = useState<Character | null>(null);
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: characters = [], isLoading } = useQuery<Character[]>({
    queryKey: ['/api/projects', projectId, 'characters'],
  });

  const { data: project } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
  });

  const { data: locations = [] } = useQuery<any[]>({
    queryKey: ['/api/projects', projectId, 'locations'],
  });

  // Auto-select character if selectedCharacterId is provided
  useEffect(() => {
    if (selectedCharacterId && characters.length > 0) {
      const character = characters.find(c => c.id === selectedCharacterId);
      if (character) {
        setSelectedCharacter(character);
        setIsCreating(false);
        // Clear the selection from the parent component
        onClearSelection?.();
      }
    }
  }, [selectedCharacterId, characters, onClearSelection]);

  const deleteMutation = useMutation({
    mutationFn: (characterId: string) => 
      apiRequest('DELETE', `/api/characters/${characterId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
    },
  });

  const updateCharacterMutation = useMutation({
    mutationFn: (character: Character) => 
      apiRequest('PUT', `/api/characters/${character.id}`, character),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
    },
  });

  const createCharacterMutation = useMutation({
    mutationFn: (character: Partial<Character>) => 
      apiRequest('POST', `/api/projects/${projectId}/characters`, character),
    onSuccess: (newCharacter: Character) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
      setSelectedCharacter(newCharacter);
      setIsCreating(false);
    },
  });

  const filteredCharacters = characters.filter((character: Character) =>
    (character.name && character.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (character.role && character.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (character.race && character.race.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (character.occupation && character.occupation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEdit = (character: Character) => {
    setSelectedCharacter(character);
  };

  const handleDelete = (character: Character) => {
    if (confirm(`Are you sure you want to delete ${character.name}?`)) {
      deleteMutation.mutate(character.id, {
        onSuccess: () => {
          // Navigate back to the character list after successful deletion
          setSelectedCharacter(null);
          setIsCreating(false);
        }
      });
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedCharacter(null);
  };

  const handleOpenGenerationModal = () => {
    setIsGenerationModalOpen(true);
  };

  const handleGenerateCharacter = async (options: CharacterGenerationOptions) => {
    if (!project) return;
    
    setIsGenerating(true);
    try {
      const generatedCharacter = await generateContextualCharacter({
        project,
        locations,
        existingCharacters: characters,
        generationOptions: options
      });
      
      // Create the character with generated data
      createCharacterMutation.mutate({
        ...generatedCharacter,
        projectId
      });
      
      // Close the generation modal
      setIsGenerationModalOpen(false);
    } catch (error) {
      console.error('Error generating character:', error);
      // Show error to user - you could add a toast here
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToList = () => {
    // Invalidate the character list query to fetch fresh data
    queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
    setSelectedCharacter(null);
    setIsCreating(false);
  };

  const handlePortraitClick = (character: Character, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    setPortraitCharacter(character);
    setIsPortraitModalOpen(true);
  };

  const handleImageGenerated = (imageUrl: string) => {
    if (portraitCharacter) {
      updateCharacterMutation.mutate({ 
        ...portraitCharacter, 
        imageUrl,
        // Make sure to preserve any existing portraits array
        portraits: portraitCharacter.portraits || []
      });
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    if (portraitCharacter) {
      updateCharacterMutation.mutate({ 
        ...portraitCharacter, 
        imageUrl,
        // Make sure to preserve any existing portraits array
        portraits: portraitCharacter.portraits || []
      });
    }
  };

  // Show character detail view (which handles both viewing and editing)
  if (selectedCharacter || isCreating) {
    return (
      <CharacterDetailView
        projectId={projectId}
        character={selectedCharacter}
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
          <h2 className="font-title text-2xl">Characters</h2>
          <p className="text-muted-foreground">
            {characters.length} {characters.length === 1 ? 'character' : 'characters'} in your world
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleCreateNew} 
            className="interactive-warm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Character
          </Button>
          <Button 
            onClick={handleOpenGenerationModal} 
            disabled={!project}
            variant="outline"
            className="border-accent/20 hover:bg-accent/10"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Character
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search characters by name, role, or race..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 creative-input"
        />
      </div>

      {/* Character List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="animate-spin h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p>Loading characters...</p>
        </div>
      ) : filteredCharacters.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-24 w-24 mx-auto mb-6 opacity-30" />
          <h3 className="text-xl font-semibold mb-3">
            {characters.length === 0 ? 'No Characters Created' : 'No Characters Found'}
          </h3>
          <p className="mb-6">
            {characters.length === 0 
              ? 'Start building your cast of characters to bring your world to life.'
              : 'Try adjusting your search terms to find the character you\'re looking for.'
            }
          </p>
          {characters.length === 0 && (
            <Button 
              onClick={handleCreateNew} 
              className="interactive-warm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Character
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCharacters.map((character: Character) => (
            <Card 
              key={character.id} 
              className="creative-card cursor-pointer hover:shadow-lg transition-all duration-200 border-yellow-500/30 hover:border-yellow-500/50"
              onClick={() => handleEdit(character)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Character Image - Clickable */}
                  <div 
                    className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity relative group"
                    onClick={(e) => handlePortraitClick(character, e)}
                  >
                    {character.imageUrl ? (
                      <img 
                        src={character.imageUrl} 
                        alt={character.name}
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

                  {/* Character Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 truncate">{character.name || 'Unnamed Character'}</h3>
                        {character.title && (
                          <p className="text-sm text-muted-foreground mb-2 italic">"{character.title}"</p>
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
                              handleEdit(character);
                            }}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(character);
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
                      {character.role && (
                        <Badge variant="default" className="text-xs px-2 py-1">
                          {character.role}
                        </Badge>
                      )}
                      {character.class && (
                        <Badge variant="outline" className="text-xs">
                          {character.class}
                        </Badge>
                      )}
                      {character.age && (
                        <Badge variant="outline" className="text-xs">
                          Age {character.age}
                        </Badge>
                      )}
                    </div>

                    {/* One-line or description */}
                    {character.oneLine && (
                      <p className="text-sm italic text-muted-foreground mb-2">
                        "{character.oneLine}"
                      </p>
                    )}
                    
                    {character.description && !character.oneLine && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {character.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Character Portrait Modal */}
      {portraitCharacter && (
        <CharacterPortraitModal
          character={portraitCharacter}
          isOpen={isPortraitModalOpen}
          onClose={() => {
            setIsPortraitModalOpen(false);
            setPortraitCharacter(null);
          }}
          onImageGenerated={handleImageGenerated}
          onImageUploaded={handleImageUploaded}
        />
      )}

      {/* Character Generation Modal */}
      <CharacterGenerationModal
        isOpen={isGenerationModalOpen}
        onClose={() => setIsGenerationModalOpen(false)}
        onGenerate={handleGenerateCharacter}
        isGenerating={isGenerating}
      />
    </div>
  );
}

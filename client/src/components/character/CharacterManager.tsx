import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Users, Search, Edit, Trash2, MoreVertical, Edit2, Camera, Sparkles, ArrowUpDown, Filter, Grid3X3, List, Eye, Zap, FileText } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Character, Project } from '../../lib/types';
import { CharacterDetailView } from './CharacterDetailView';
import { CharacterPortraitModal } from './CharacterPortraitModal';
import { CharacterGenerationModal, type CharacterGenerationOptions } from './CharacterGenerationModal';
import { CharacterTemplates } from './CharacterTemplates';
import { generateContextualCharacter } from '../../lib/services/characterGeneration';

interface CharacterManagerProps {
  projectId: string;
  selectedCharacterId?: string | null;
  onClearSelection?: () => void;
}

type SortOption = 'alphabetical' | 'recently-added' | 'recently-edited';
type ViewMode = 'grid' | 'list';

export function CharacterManager({ projectId, selectedCharacterId, onClearSelection }: CharacterManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [portraitCharacter, setPortraitCharacter] = useState<Character | null>(null);
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [newCharacterData, setNewCharacterData] = useState<Partial<Character>>({});
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
    mutationFn: async (character: Partial<Character>) => {
      console.log('Mutation: Creating character with data:', character);
      const response = await apiRequest('POST', `/api/projects/${projectId}/characters`, character);
      console.log('Mutation: Received response:', response);
      const result = await response.json();
      console.log('Mutation: Parsed JSON:', result);
      return result;
    },
    onSuccess: (newCharacter: Character) => {
      console.log('Character created successfully, setting as selected:', newCharacter);
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
      setSelectedCharacter(newCharacter);
      setIsCreating(false);
    },
    onError: (error) => {
      console.error('Failed to create character:', error);
    }
  });

  // Sort and filter characters
  const sortCharacters = (chars: Character[]): Character[] => {
    switch (sortBy) {
      case 'alphabetical':
        return [...chars].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'recently-added':
        return [...chars].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      case 'recently-edited':
        return [...chars].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      default:
        return chars;
    }
  };

  const filteredCharacters = sortCharacters(
    characters.filter(character => 
      character.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      character.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      character.race?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleEdit = (character: Character) => {
    setSelectedCharacter(character);
    setIsCreating(false);
  };

  const handleDelete = (character: Character) => {
    if (confirm(`Are you sure you want to delete ${character.name}?`)) {
      deleteMutation.mutate(character.id, {
        onSuccess: () => {
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

  const handleSelectTemplate = (template: any) => {
    // Create new character with template data
    const newCharacter = {
      ...template.fields,
      name: template.fields.name || 'New Character',
      projectId: projectId
    };
    
    setNewCharacterData(newCharacter);
    setIsCreating(true);
    setIsTemplateModalOpen(false);
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
      
      const createdCharacter = await createCharacterMutation.mutateAsync(characterToCreate);
      console.log('Character creation completed, created character:', createdCharacter);
      
      setSelectedCharacter(createdCharacter);
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
    queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
    setSelectedCharacter(null);
    setIsCreating(false);
  };

  const handlePortraitClick = (character: Character, event: React.MouseEvent) => {
    event.stopPropagation();
    setPortraitCharacter(character);
    setIsPortraitModalOpen(true);
  };

  const handleImageGenerated = (imageUrl: string) => {
    if (portraitCharacter) {
      updateCharacterMutation.mutate({ 
        ...portraitCharacter, 
        imageUrl,
        portraits: portraitCharacter.portraits || []
      });
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    if (portraitCharacter) {
      updateCharacterMutation.mutate({ 
        ...portraitCharacter, 
        imageUrl,
        portraits: portraitCharacter.portraits || []
      });
    }
  };

  // Character detail view
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

  // Enhanced Character Card for Grid View
  const CharacterCard = ({ character }: { character: Character }) => (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-border/50 hover:border-accent/30 bg-gradient-to-br from-background to-muted/20" 
          onClick={() => setSelectedCharacter(character)}>
      <CardContent className="p-0">
        {/* Character Image Header */}
        <div className="relative h-48 bg-gradient-to-br from-amber-100 via-orange-100 to-amber-200 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-amber-900/30 rounded-t-lg overflow-hidden">
          {character.imageUrl ? (
            <img 
              src={character.imageUrl} 
              alt={character.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Users className="h-16 w-16 text-amber-600/60 dark:text-amber-400/60" />
            </div>
          )}
          {/* Quick Actions Overlay */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-1">
              <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-background/90 hover:bg-background" 
                      onClick={(e) => { e.stopPropagation(); handleEdit(character); }}>
                <Edit className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-background/90 hover:bg-background"
                      onClick={(e) => handlePortraitClick(character, e)}>
                <Camera className="h-3 w-3" />
              </Button>
            </div>
          </div>
          {/* Character Status Badge */}
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="bg-background/90 text-foreground backdrop-blur-sm">
              {character.role || 'Character'}
            </Badge>
          </div>
        </div>

        {/* Character Info */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg group-hover:text-accent transition-colors truncate">
              {character.name}
              {character.title && (
                <span className="text-muted-foreground font-normal text-sm ml-1">
                  · {character.title}
                </span>
              )}
            </h3>
            
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {character.race && (
                <Badge variant="outline" className="text-xs">
                  {character.race}
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
          </div>

          {character.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {character.description}
            </p>
          )}

          {/* Key Traits */}
          {character.personalityTraits && character.personalityTraits.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {character.personalityTraits.slice(0, 3).map((trait, index) => (
                <span key={index} className="text-xs px-2 py-1 bg-muted/60 rounded-full">
                  {trait}
                </span>
              ))}
              {character.personalityTraits.length > 3 && (
                <span className="text-xs px-2 py-1 bg-muted/60 rounded-full text-muted-foreground">
                  +{character.personalityTraits.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Compact List View Item
  const CharacterListItem = ({ character }: { character: Character }) => (
    <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md border border-border/50 hover:border-accent/30 bg-gradient-to-r from-background to-muted/10" 
          onClick={() => setSelectedCharacter(character)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0">
            {character.imageUrl ? (
              <img 
                src={character.imageUrl} 
                alt={character.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            )}
          </div>

          {/* Character Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold group-hover:text-accent transition-colors truncate">
                {character.name}
              </h3>
              {character.title && (
                <span className="text-muted-foreground text-sm">· {character.title}</span>
              )}
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">{character.role || 'Character'}</Badge>
              {character.race && <Badge variant="outline" className="text-xs">{character.race}</Badge>}
              {character.class && <Badge variant="outline" className="text-xs">{character.class}</Badge>}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0"
                    onClick={(e) => { e.stopPropagation(); setSelectedCharacter(character); }}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0"
                    onClick={(e) => { e.stopPropagation(); handleEdit(character); }}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0"
                    onClick={(e) => handlePortraitClick(character, e)}>
              <Camera className="h-4 w-4" />
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
              Characters
            </h2>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-muted-foreground">
                {characters.length} {characters.length === 1 ? 'character' : 'characters'} in your world
              </span>
              {filteredCharacters.length !== characters.length && (
                <span className="text-sm text-accent">
                  ({filteredCharacters.length} visible)
                </span>
              )}
            </div>
          </div>
          
          {/* Primary Actions */}
          <div className="flex gap-3">
            <Button 
              onClick={handleCreateNew} 
              size="lg"
              className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Character
            </Button>
            <Button 
              onClick={() => setIsTemplateModalOpen(true)} 
              size="lg"
              variant="outline"
              className="border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50 transition-all duration-200"
            >
              <FileText className="h-4 w-4 mr-2" />
              Use Template
            </Button>
            <Button 
              onClick={handleOpenGenerationModal} 
              disabled={!project}
              size="lg"
              variant="outline"
              className="border-accent/30 hover:bg-accent/10 hover:border-accent/50 transition-all duration-200"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI Generate
            </Button>
          </div>
        </div>

        {/* Enhanced Controls Bar */}
        <div className="flex items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search characters by name, role, or race..."
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
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy('alphabetical')}>
                  A-Z Order
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('recently-added')}>
                  Recently Added
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('recently-edited')}>
                  Recently Edited
                </DropdownMenuItem>
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

      {/* Characters Display */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
            <p className="text-muted-foreground">Loading characters...</p>
          </div>
        </div>
      ) : filteredCharacters.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <Users className="h-16 w-16 text-muted-foreground/50 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {characters.length === 0 ? 'No characters yet' : 'No characters match your search'}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {characters.length === 0 
                ? 'Create your first character to start building your story world.'
                : 'Try adjusting your search terms or filters.'
              }
            </p>
          </div>
          {characters.length === 0 && (
            <div className="flex gap-3 justify-center pt-4">
              <Button onClick={handleCreateNew} className="interactive-warm">
                <Plus className="h-4 w-4 mr-2" />
                Create First Character
              </Button>
              <Button onClick={handleOpenGenerationModal} variant="outline">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Character
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
          {filteredCharacters.map((character) => 
            viewMode === 'grid' ? (
              <CharacterCard key={character.id} character={character} />
            ) : (
              <CharacterListItem key={character.id} character={character} />
            )
          )}
        </div>
      )}

      {/* Modals */}
      <CharacterGenerationModal
        isOpen={isGenerationModalOpen}
        onClose={() => setIsGenerationModalOpen(false)}
        onGenerate={handleGenerateCharacter}
        isGenerating={isGenerating}
      />

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

      <CharacterTemplates
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}
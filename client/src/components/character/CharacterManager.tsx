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
import { CharacterPortraitModal } from './CharacterPortraitModalImproved';
import { CharacterGenerationModal, type CharacterGenerationOptions } from './CharacterGenerationModal';
import { CharacterTemplates } from './CharacterTemplates';
import { CharacterCreationLaunch } from './CharacterCreationLaunch';
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
  const [isGuidedCreation, setIsGuidedCreation] = useState(false);
  const [portraitCharacter, setPortraitCharacter] = useState<Character | null>(null);
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isCreationLaunchOpen, setIsCreationLaunchOpen] = useState(false);
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
    setIsCreationLaunchOpen(false);
    setIsCreating(true);
    setIsGuidedCreation(true);
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
    setIsGuidedCreation(false);
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
        isGuidedCreation={isGuidedCreation}
        onBack={handleBackToList}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  // Premium Character Card for Grid View
  const CharacterCard = ({ character }: { character: Character }) => (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] border border-border/30 hover:border-accent/50 bg-gradient-to-br from-background via-background/90 to-accent/5 overflow-hidden relative" 
          onClick={() => setSelectedCharacter(character)}>
      <CardContent className="p-0 relative">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
        
        {/* Character Image Header */}
        <div className="relative h-64 bg-gradient-to-br from-accent/5 via-muted/20 to-accent/10 overflow-hidden">
          {character.imageUrl ? (
            <>
              <img 
                src={character.imageUrl} 
                alt={character.name}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
              />
              {/* Image Overlay for Better Text Contrast */}
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
          
          {/* Premium Action Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="absolute top-4 right-4 flex gap-2">
              <Button size="sm" className="h-9 w-9 p-0 bg-white/90 hover:bg-white text-black shadow-xl backdrop-blur-sm border-0" 
                      onClick={(e) => { e.stopPropagation(); handleEdit(character); }}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" className="h-9 w-9 p-0 bg-accent/90 hover:bg-accent text-accent-foreground shadow-xl backdrop-blur-sm border-0"
                      onClick={(e) => handlePortraitClick(character, e)}>
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Quick Preview Text */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-white/90 text-sm font-medium line-clamp-2 leading-relaxed">
                {character.description || 'Click to add character details and bring them to life...'}
              </div>
            </div>
          </div>

          {/* Premium Status Badge */}
          <div className="absolute bottom-4 left-4 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
            <Badge className="bg-accent/90 text-accent-foreground backdrop-blur-sm border-0 shadow-lg font-medium">
              {character.role || 'Character'}
            </Badge>
          </div>
        </div>

        {/* Premium Character Info */}
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
                <Badge variant="outline" className="text-xs bg-accent/5 border-accent/30 text-accent/80 hover:bg-accent/10 transition-colors font-medium">
                  {character.race}
                </Badge>
              )}
              {character.class && (
                <Badge variant="outline" className="text-xs bg-accent/5 border-accent/30 text-accent/80 hover:bg-accent/10 transition-colors font-medium">
                  {character.class}
                </Badge>
              )}
              {character.age && (
                <Badge variant="outline" className="text-xs bg-accent/5 border-accent/30 text-accent/80 hover:bg-accent/10 transition-colors font-medium">
                  Age {character.age}
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

          {/* Premium Key Traits */}
          {character.personalityTraits && character.personalityTraits.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {character.personalityTraits.slice(0, 3).map((trait, index) => (
                <span key={index} className="text-xs px-3 py-1.5 bg-accent/15 text-accent rounded-full font-semibold border border-accent/20">
                  {trait}
                </span>
              ))}
              {character.personalityTraits.length > 3 && (
                <span className="text-xs px-3 py-1.5 bg-muted/40 rounded-full text-muted-foreground font-semibold border border-muted/40">
                  +{character.personalityTraits.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Character Completeness Indicator */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/30">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 bg-muted/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-300"
                    style={{
                      width: `${Math.min(100, ((character.name ? 10 : 0) + 
                                                (character.description ? 15 : 0) + 
                                                (character.imageUrl ? 15 : 0) + 
                                                (character.personalityTraits?.length ? 10 : 0) + 
                                                (character.race ? 10 : 0) +
                                                (character.class ? 10 : 0) +
                                                (character.age ? 5 : 0) +
                                                (character.background ? 10 : 0) +
                                                (character.goals ? 10 : 0) +
                                                (character.relationships ? 5 : 0)))}%`
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {Math.min(100, ((character.name ? 10 : 0) + 
                                  (character.description ? 15 : 0) + 
                                  (character.imageUrl ? 15 : 0) + 
                                  (character.personalityTraits?.length ? 10 : 0) + 
                                  (character.race ? 10 : 0) +
                                  (character.class ? 10 : 0) +
                                  (character.age ? 5 : 0) +
                                  (character.background ? 10 : 0) +
                                  (character.goals ? 10 : 0) +
                                  (character.relationships ? 5 : 0)))}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Premium List View Item
  const CharacterListItem = ({ character }: { character: Character }) => (
    <Card className="group cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.01] border border-border/30 hover:border-accent/50 bg-gradient-to-r from-background via-background/95 to-accent/5 relative overflow-hidden" 
          onClick={() => setSelectedCharacter(character)}>
      <CardContent className="p-5 relative">
        {/* Subtle Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent/3 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        
        <div className="flex items-center gap-5 relative">
          {/* Premium Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/10 via-muted/20 to-accent/15 flex items-center justify-center flex-shrink-0 border border-accent/20 shadow-md group-hover:shadow-lg transition-shadow duration-200">
            {character.imageUrl ? (
              <img 
                src={character.imageUrl} 
                alt={character.name}
                className="w-full h-full object-cover rounded-2xl transition-transform duration-200 group-hover:scale-105"
              />
            ) : (
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-accent/70" />
              </div>
            )}
          </div>

          {/* Premium Character Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-xl group-hover:text-accent transition-colors truncate">
                {character.name}
              </h3>
              {character.title && (
                <span className="text-accent/70 text-sm font-medium italic">"{character.title}"</span>
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge className="text-xs bg-accent/90 text-accent-foreground font-medium shadow-sm">
                {character.role || 'Character'}
              </Badge>
              {character.race && (
                <Badge variant="outline" className="text-xs bg-accent/5 border-accent/30 text-accent/80 hover:bg-accent/10 transition-colors font-medium">
                  {character.race}
                </Badge>
              )}
              {character.class && (
                <Badge variant="outline" className="text-xs bg-accent/5 border-accent/30 text-accent/80 hover:bg-accent/10 transition-colors font-medium">
                  {character.class}
                </Badge>
              )}
              {character.age && (
                <Badge variant="outline" className="text-xs bg-accent/5 border-accent/30 text-accent/80 hover:bg-accent/10 transition-colors font-medium">
                  Age {character.age}
                </Badge>
              )}
            </div>

            {/* Enhanced Description or Call to Action */}
            {character.description ? (
              <p className="text-sm text-muted-foreground line-clamp-1 leading-relaxed font-medium">
                {character.description}
              </p>
            ) : (
              <p className="text-sm text-accent/60 italic font-medium">
                Ready to develop • Click to add details and bring them to life
              </p>
            )}

            {/* Character Completeness Mini-Indicator */}
            <div className="flex items-center gap-2 mt-2">
              <div className="h-1 flex-1 bg-muted/30 rounded-full overflow-hidden max-w-32">
                <div 
                  className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-300"
                  style={{
                    width: `${Math.min(100, ((character.name ? 10 : 0) + 
                                            (character.description ? 15 : 0) + 
                                            (character.imageUrl ? 15 : 0) + 
                                            (character.personalityTraits?.length ? 10 : 0) + 
                                            (character.race ? 10 : 0) +
                                            (character.class ? 10 : 0) +
                                            (character.age ? 5 : 0) +
                                            (character.background ? 10 : 0) +
                                            (character.goals ? 10 : 0) +
                                            (character.relationships ? 5 : 0)))}%`
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {Math.min(100, ((character.name ? 10 : 0) + 
                                (character.description ? 15 : 0) + 
                                (character.imageUrl ? 15 : 0) + 
                                (character.personalityTraits?.length ? 10 : 0) + 
                                (character.race ? 10 : 0) +
                                (character.class ? 10 : 0) +
                                (character.age ? 5 : 0) +
                                (character.background ? 10 : 0) +
                                (character.goals ? 10 : 0) +
                                (character.relationships ? 5 : 0)))}%
              </span>
            </div>
          </div>

          {/* Premium Quick Actions */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <Button size="sm" variant="ghost" className="h-10 w-10 p-0 hover:bg-accent/10 hover:text-accent transition-colors rounded-xl"
                    onClick={(e) => { e.stopPropagation(); setSelectedCharacter(character); }}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="h-10 w-10 p-0 hover:bg-accent/10 hover:text-accent transition-colors rounded-xl"
                    onClick={(e) => { e.stopPropagation(); handleEdit(character); }}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" className="h-10 w-10 p-0 bg-accent/90 hover:bg-accent text-accent-foreground transition-colors rounded-xl shadow-md"
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
          
          {/* Primary Action */}
          <div className="flex gap-3">
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
              <Button 
                onClick={() => setIsCreationLaunchOpen(true)} 
                size="lg"
                className="bg-gradient-to-r from-accent via-accent/90 to-accent/80 hover:from-accent/95 hover:via-accent/85 hover:to-accent/75 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center">
                  <div className="p-1 bg-accent-foreground/10 rounded-full mr-3 group-hover:rotate-90 transition-transform duration-300">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span className="font-semibold tracking-wide">Create First Character</span>
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

      {/* Character Creation Launch Modal */}
      <CharacterCreationLaunch
        isOpen={isCreationLaunchOpen}
        onClose={() => setIsCreationLaunchOpen(false)}
        onCreateBlank={handleCreateNew}
        onOpenTemplates={() => {
          setIsCreationLaunchOpen(false);
          setIsTemplateModalOpen(true);
        }}
        onOpenAIGeneration={() => {
          setIsCreationLaunchOpen(false);
          setIsGenerationModalOpen(true);
        }}
      />

      <CharacterTemplates
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        showSaveOption={true}
      />
    </div>
  );
}
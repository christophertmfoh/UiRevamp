import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Users, Search, Edit, Trash2, MoreVertical, Edit2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Character } from '../lib/types';
import { CharacterDetailView } from './CharacterDetailView';

interface CharacterManagerProps {
  projectId: string;
}

export function CharacterManager({ projectId }: CharacterManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  const { data: characters = [], isLoading } = useQuery<Character[]>({
    queryKey: ['/api/projects', projectId, 'characters'],
  });

  const deleteMutation = useMutation({
    mutationFn: (characterId: string) => 
      apiRequest('DELETE', `/api/characters/${characterId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
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
      deleteMutation.mutate(character.id);
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedCharacter(null);
  };

  const handleBackToList = () => {
    setSelectedCharacter(null);
    setIsCreating(false);
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
        <Button 
          onClick={handleCreateNew} 
          className="interactive-warm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Character
        </Button>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCharacters.map((character: Character) => (
            <Card 
              key={character.id} 
              className="creative-card cursor-pointer hover:shadow-lg transition-shadow aspect-square"
              onClick={() => handleEdit(character)}
            >
              <CardContent className="p-4 h-full flex flex-col">
                {/* Header with dropdown */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1 truncate">{character.name || 'Unnamed Character'}</h3>
                    {character.role && (
                      <Badge variant="secondary" className="text-xs mb-2">{character.role}</Badge>
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
                
                {/* Key info - compact for square layout */}
                <div className="flex-1 space-y-2 text-xs overflow-hidden">
                  {character.title && (
                    <p className="text-muted-foreground italic truncate">"{character.title}"</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-1 text-muted-foreground">
                    {character.race && (
                      <div className="truncate">
                        <span className="font-medium">Race:</span> {character.race}
                      </div>
                    )}
                    {character.age && (
                      <div className="truncate">
                        <span className="font-medium">Age:</span> {character.age}
                      </div>
                    )}
                    {character.occupation && (
                      <div className="col-span-2 truncate">
                        <span className="font-medium">Job:</span> {character.occupation}
                      </div>
                    )}
                  </div>

                  {character.oneLine && (
                    <p className="text-muted-foreground italic text-xs line-clamp-2 mt-2">
                      "{character.oneLine}"
                    </p>
                  )}
                  
                  {!character.oneLine && character.description && (
                    <p className="text-muted-foreground text-xs line-clamp-2 mt-2">
                      {character.description}
                    </p>
                  )}
                </div>

                {/* Bottom section - abilities and tags */}
                <div className="mt-auto pt-2 space-y-2">
                  {/* Key abilities */}
                  {((character.abilities && character.abilities.length > 0) || character.magicalAbilities || character.specialAbilities) && (
                    <div className="flex flex-wrap gap-1">
                      {character.abilities?.slice(0, 1).map((ability, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                          {ability}
                        </Badge>
                      ))}
                      {character.magicalAbilities && (
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                          Magic
                        </Badge>
                      )}
                      {character.specialAbilities && (
                        <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700">
                          Special
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {character.tags && character.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {character.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {character.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{character.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

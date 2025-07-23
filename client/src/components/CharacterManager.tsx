import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Users, Search, Edit, Trash2, ChevronRight, Upload, User } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Character } from '../lib/types';
import { CharacterForm } from './CharacterForm';
import { CharacterCard } from './CharacterCard';
import { CharacterDetailView } from './CharacterDetailView';

interface CharacterManagerProps {
  projectId: string;
}

export function CharacterManager({ projectId }: CharacterManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
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
    character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    character.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (character.race && character.race.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEdit = (character: Character) => {
    setEditingCharacter(character);
  };

  const handleDelete = (character: Character) => {
    if (confirm(`Are you sure you want to delete ${character.name}?`)) {
      deleteMutation.mutate(character.id);
    }
  };

  if (selectedCharacter) {
    return (
      <CharacterDetailView
        character={selectedCharacter}
        onBack={() => setSelectedCharacter(null)}
        onEdit={handleEdit}
      />
    );
  }

  return (
    <>
      {showCreateForm && (
        <CharacterForm
          projectId={projectId}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
      
      {editingCharacter && (
        <CharacterForm
          projectId={projectId}
          character={editingCharacter}
          onCancel={() => setEditingCharacter(null)}
        />
      )}
      
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
            onClick={() => setShowCreateForm(true)} 
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
                onClick={() => setShowCreateForm(true)} 
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
              <CharacterCard
                key={character.id}
                character={character}
                onSelect={setSelectedCharacter}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

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

interface CharacterManagerProps {
  projectId: string;
}

interface CharacterCardProps {
  character: Character;
  onSelect: (character: Character) => void;
  onEdit: (character: Character) => void;
  onDelete: (character: Character) => void;
}

function CharacterCard({ character, onSelect, onEdit, onDelete }: CharacterCardProps) {
  return (
    <Card className="creative-card hover:bg-muted/20 transition-colors cursor-pointer group">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          {/* Character Image Placeholder */}
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
            {character.imageUrl ? (
              <img 
                src={character.imageUrl} 
                alt={character.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <User className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          
          {/* Character Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate">{character.name}</h3>
                {character.title && (
                  <p className="text-sm text-accent font-medium">{character.title}</p>
                )}
                <div className="flex items-center space-x-2 mt-1">
                  {character.race && (
                    <Badge variant="outline" className="text-xs">{character.race}</Badge>
                  )}
                  {character.class && (
                    <Badge variant="outline" className="text-xs">{character.class}</Badge>
                  )}
                  {character.age && (
                    <Badge variant="outline" className="text-xs">Age {character.age}</Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(character);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(character);
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {character.role && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                <span className="font-medium">Role:</span> {character.role}
              </p>
            )}
            
            {character.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {character.description}
              </p>
            )}
            
            {/* Quick Stats */}
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <div className="flex items-center space-x-4">
                {character.abilities.length > 0 && (
                  <span>{character.abilities.length} Abilities</span>
                )}
                {character.languages.length > 0 && (
                  <span>{character.languages.length} Languages</span>
                )}
                {character.personalityTraits.length > 0 && (
                  <span>{character.personalityTraits.length} Traits</span>
                )}
              </div>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CharacterDetailView({ character, onBack, onEdit }: { 
  character: Character; 
  onBack: () => void; 
  onEdit: (character: Character) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <Button variant="ghost" onClick={onBack} className="mt-2">
            ← Back to Characters
          </Button>
          <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
            {character.imageUrl ? (
              <img 
                src={character.imageUrl} 
                alt={character.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <User className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
          <div>
            <h1 className="font-title text-3xl">{character.name}</h1>
            {character.title && (
              <p className="text-xl text-accent font-medium">{character.title}</p>
            )}
            <div className="flex items-center space-x-2 mt-2">
              {character.race && <Badge variant="outline">{character.race}</Badge>}
              {character.class && <Badge variant="outline">{character.class}</Badge>}
              {character.age && <Badge variant="outline">Age {character.age}</Badge>}
            </div>
          </div>
        </div>
        <Button onClick={() => onEdit(character)} className="interactive-warm">
          <Edit className="h-4 w-4 mr-2" />
          Edit Character
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="creative-card">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {character.role && (
              <div>
                <h4 className="font-semibold mb-1">Role</h4>
                <p className="text-sm text-muted-foreground">{character.role}</p>
              </div>
            )}
            {character.description && (
              <div>
                <h4 className="font-semibold mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">{character.description}</p>
              </div>
            )}
            {character.backstory && (
              <div>
                <h4 className="font-semibold mb-1">Backstory</h4>
                <p className="text-sm text-muted-foreground">{character.backstory}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Physical Appearance */}
        <Card className="creative-card">
          <CardHeader>
            <CardTitle>Physical Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {character.physicalDescription && (
              <div>
                <h4 className="font-semibold mb-1">Overall Description</h4>
                <p className="text-sm text-muted-foreground">{character.physicalDescription}</p>
              </div>
            )}
            {character.facialFeatures && (
              <div>
                <h4 className="font-semibold mb-1">Facial Features</h4>
                <p className="text-sm text-muted-foreground">{character.facialFeatures}</p>
              </div>
            )}
            {character.hair && (
              <div>
                <h4 className="font-semibold mb-1">Hair</h4>
                <p className="text-sm text-muted-foreground">{character.hair}</p>
              </div>
            )}
            {character.skin && (
              <div>
                <h4 className="font-semibold mb-1">Skin</h4>
                <p className="text-sm text-muted-foreground">{character.skin}</p>
              </div>
            )}
            {character.attire && (
              <div>
                <h4 className="font-semibold mb-1">Attire</h4>
                <p className="text-sm text-muted-foreground">{character.attire}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Personality & Psychology */}
        <Card className="creative-card">
          <CardHeader>
            <CardTitle>Personality & Psychology</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {character.personality && (
              <div>
                <h4 className="font-semibold mb-1">Personality</h4>
                <p className="text-sm text-muted-foreground">{character.personality}</p>
              </div>
            )}
            {character.personalityTraits.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Personality Traits</h4>
                <div className="flex flex-wrap gap-1">
                  {character.personalityTraits.map((trait, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {character.motivations && (
              <div>
                <h4 className="font-semibold mb-1">Motivations</h4>
                <p className="text-sm text-muted-foreground">{character.motivations}</p>
              </div>
            )}
            {character.fears && (
              <div>
                <h4 className="font-semibold mb-1">Fears</h4>
                <p className="text-sm text-muted-foreground">{character.fears}</p>
              </div>
            )}
            {character.secrets && (
              <div>
                <h4 className="font-semibold mb-1">Secrets</h4>
                <p className="text-sm text-muted-foreground">{character.secrets}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Abilities & Skills */}
        <Card className="creative-card">
          <CardHeader>
            <CardTitle>Abilities & Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {character.abilities.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Abilities</h4>
                <div className="space-y-1">
                  {character.abilities.map((ability, index) => (
                    <div key={index} className="text-sm text-muted-foreground">• {ability}</div>
                  ))}
                </div>
              </div>
            )}
            {character.skills.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Skills</h4>
                <div className="space-y-1">
                  {character.skills.map((skill, index) => (
                    <div key={index} className="text-sm text-muted-foreground">• {skill}</div>
                  ))}
                </div>
              </div>
            )}
            {character.specialAbilities && (
              <div>
                <h4 className="font-semibold mb-1">Special Abilities</h4>
                <p className="text-sm text-muted-foreground">{character.specialAbilities}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Background & History */}
        <Card className="creative-card">
          <CardHeader>
            <CardTitle>Background & History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {character.background && (
              <div>
                <h4 className="font-semibold mb-1">Background</h4>
                <p className="text-sm text-muted-foreground">{character.background}</p>
              </div>
            )}
            {character.academicHistory && (
              <div>
                <h4 className="font-semibold mb-1">Academic History</h4>
                <p className="text-sm text-muted-foreground">{character.academicHistory}</p>
              </div>
            )}
            {character.personalStruggle && (
              <div>
                <h4 className="font-semibold mb-1">Personal Struggle</h4>
                <p className="text-sm text-muted-foreground">{character.personalStruggle}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Languages & Communication */}
        <Card className="creative-card">
          <CardHeader>
            <CardTitle>Languages & Communication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {character.languages.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Languages</h4>
                <div className="flex flex-wrap gap-1">
                  {character.languages.map((language, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {character.accent && (
              <div>
                <h4 className="font-semibold mb-1">Accent</h4>
                <p className="text-sm text-muted-foreground">{character.accent}</p>
              </div>
            )}
            {character.speechPatterns && (
              <div>
                <h4 className="font-semibold mb-1">Speech Patterns</h4>
                <p className="text-sm text-muted-foreground">{character.speechPatterns}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
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
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Users, Search } from 'lucide-react';
import type { Character } from '@/lib/types';

interface CharacterManagerProps {
  projectId: string;
  selectedCharacterId?: string | null;
  onClearSelection: () => void;
}

export function CharacterManager({ projectId }: CharacterManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: characters = [] } = useQuery<Character[]>({
    queryKey: ['/api/projects', projectId, 'characters'],
  });

  const filteredCharacters = characters.filter(character =>
    character.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    character.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-6 w-6 text-accent" />
          <h1 className="text-2xl font-bold">Characters</h1>
        </div>
        <Button className="interactive-warm">
          <Plus className="h-4 w-4 mr-2" />
          Create Character
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search characters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCharacters.map((character) => (
              <Card key={character.id} className="creative-card hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{character.name || 'Unnamed Character'}</h3>
                  {character.role && (
                    <p className="text-sm text-muted-foreground mb-2">{character.role}</p>
                  )}
                  {character.physicalDescription && (
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {character.physicalDescription}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredCharacters.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No characters found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
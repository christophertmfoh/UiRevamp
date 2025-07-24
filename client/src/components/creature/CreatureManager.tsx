import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Sparkles, Bug } from 'lucide-react';
import type { Project } from '../../lib/types';

interface Creature {
  id: string;
  projectId: string;
  name: string;
  species: string;
  classification: string;
  description: string;
  habitat: string;
  behavior: string;
  abilities: string[];
  threat: string;
  displayImageId: number | null;
  tags: string[];
}

interface CreatureManagerProps {
  project: Project;
}

export function CreatureManager({ project }: CreatureManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: creatures = [], isLoading } = useQuery({
    queryKey: ['/api/projects', project.id, 'creatures'],
    enabled: !!project?.id,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading creatures...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-title text-2xl">Creatures</h2>
          <p className="text-muted-foreground">
            {creatures.length} {creatures.length === 1 ? 'creature' : 'creatures'} in your world
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="interactive-warm">
            <Plus className="h-4 w-4 mr-2" />
            Add Creature
          </Button>
          <Button variant="outline">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Creature
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search creatures..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {creatures.length === 0 ? (
        <div className="text-center py-12">
          <Bug className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">No creatures found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creatures.map((creature: Creature) => (
            <div key={creature.id} className="p-4 border rounded-lg">
              <h3 className="font-semibold">{creature.name}</h3>
              <p className="text-sm text-muted-foreground">{creature.species} - {creature.classification}</p>
              <p className="text-sm mt-2">{creature.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}